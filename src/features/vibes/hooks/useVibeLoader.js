// src/features/vibes/hooks/useVibeLoader.js
import { useEffect, useMemo, useState, useCallback } from "react";
import { getVibe } from "@/api/vibeApi";
import parseFields from "@/data/parseFields";

const VIBE_CACHE = new Map();
const TTL_MS = 2 * 60 * 1000;

function makeKey(id, token) {
  return `${id}|${token ? "auth" : "public"}`;
}

function getCached(key) {
  const entry = VIBE_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL_MS) {
    VIBE_CACHE.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key, data) {
  VIBE_CACHE.set(key, { data, ts: Date.now() });
}

/* -----------------------------
   ExtraBlocks normalization
------------------------------ */

const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const dayAlias = {
  mon: "monday", monday: "monday",
  tue: "tuesday", tues: "tuesday", tuesday: "tuesday",
  wed: "wednesday", weds: "wednesday", wednesday: "wednesday",
  thu: "thursday", thur: "thursday", thurs: "thursday", thursday: "thursday",
  fri: "friday", friday: "friday",
  sat: "saturday", saturday: "saturday",
  sun: "sunday", sunday: "sunday",
};

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function parseMaybeJSON(v) {
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
}

function toISODateValue(val) {
  if (!val) return "";
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;

  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toHoursObject(input) {
  const v = parseMaybeJSON(input);
  if (!isPlainObject(v)) return null;

  const out = {};
  for (const [k, val] of Object.entries(v)) {
    const norm = String(k).trim().toLowerCase().replace(/\.$/, "");
    const day = dayAlias[norm];
    if (day) out[day] = typeof val === "string" ? val : "";
  }

  const hasAny = DAYS.some((d) => Object.prototype.hasOwnProperty.call(out, d));
  if (!hasAny) return null;

  for (const d of DAYS) if (!(d in out)) out[d] = "";
  return out;
}

function normalizeExtraBlocks(rawBlocks = []) {
  return (rawBlocks || []).map((b, i) => {
    const typeRaw = String(b?.type || b?.kind || "").trim();
    const type = typeRaw.toLowerCase();
    const label = b?.label || "Field";

    const raw = parseMaybeJSON(b?.value);

    // HOURS
    if (type === "hours") {
      const hours =
        toHoursObject(raw) ||
        DAYS.reduce((acc, d) => {
          acc[d] = "";
          return acc;
        }, {});
      return {
        id: b?.id ?? `extra-${i}`,
        type: "hours",
        label,
        value: hours,
        placeholder: b?.placeholder,
        fromBackend: !!b?.fromBackend,
      };
    }

    // DATE/BIRTHDAY
    if (type === "birthday" || type === "date") {
      return {
        id: b?.id ?? `extra-${i}`,
        type: "birthday",
        label,
        value: toISODateValue(raw ?? ""),
        placeholder: b?.placeholder,
        fromBackend: !!b?.fromBackend,
      };
    }

    // DEFAULT TEXT
    return {
      id: b?.id ?? `extra-${i}`,
      type: typeRaw || "custom",
      label,
      value:
        typeof raw === "string" || typeof raw === "number"
          ? String(raw)
          : "",
      placeholder: b?.placeholder,
      fromBackend: !!b?.fromBackend,
    };
  });
}

export default function useVibeLoader(id, token) {
  const cacheKey = useMemo(() => {
    if (!id) return null;
    return makeKey(id, token);
  }, [id, token]);

  const cached = cacheKey ? getCached(cacheKey) : null;

  const [vibe, setVibe] = useState(cached || null);
  const [loading, setLoading] = useState(!cached);
  const [refreshing, setRefreshing] = useState(false);

  const [name, setName] = useState(cached?.name || "");
  const [description, setDescription] = useState(cached?.description || "");
  const [contacts, setContacts] = useState([]);
  const [extraBlocks, setExtraBlocks] = useState([]);

  const [visible, setVisible] = useState(Boolean(cached?.visible));
  const [publicCode, setPublicCode] = useState(cached?.publicCode || "");

  // viewer-aware
  const [subscriberCount, setSubscriberCount] = useState(
    typeof cached?.subscriberCount === "number" ? cached.subscriberCount : 0
  );
  
  const [followingCount, setFollowingCount] = useState(
    typeof cached?.followingCount === "number" ? cached.followingCount : 0
  );

  const [subscriberVibes, setSubscriberVibes] = useState(
    Array.isArray(cached?.subscriberVibes) ? cached.subscriberVibes : []
  );

  const reload = useCallback(async () => {
    if (!id) return;
    setRefreshing(true);
    try {
      const data = await getVibe(id, { auth: token ? "force" : "off", token });
      if (cacheKey) setCached(cacheKey, data);
      setVibe(data);
    } catch {
      setVibe(null);
    } finally {
      setRefreshing(false);
    }
  }, [id, token, cacheKey]);

  useEffect(() => {
    if (!id) {
      setVibe(null);
      setLoading(false);
      setRefreshing(false);

      setName("");
      setDescription("");
      setContacts([]);
      setExtraBlocks([]);
      setVisible(false);
      setPublicCode("");
      setFollowingCount(0);
      setSubscriberCount(0);
      setSubscriberVibes([]);
      return;
    }

    const ac = new AbortController();

    const hasCache = Boolean(cacheKey && getCached(cacheKey));
    if (hasCache) {
      setLoading(false);
      setRefreshing(true);
    } else {
      setLoading(true);
      setRefreshing(false);
    }

    (async () => {
      try {
        const data = await getVibe(id, {
          signal: ac.signal,
          auth: token ? "force" : "off",
          token,
        });
        if (ac.signal.aborted) return;

        if (cacheKey) setCached(cacheKey, data);
        setVibe(data);
      } catch {
        if (ac.signal.aborted) return;
        setVibe(null);
      } finally {
        if (!ac.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    })();

    return () => ac.abort();
  }, [id, cacheKey, token]);

  useEffect(() => {
    if (!vibe) return;

    setName(vibe.name || "");
    setDescription(vibe.description || "");
    setVisible(Boolean(vibe.visible));
    setPublicCode(vibe.publicCode || "");
    

    const parsed = parseFields(vibe.fieldsDTO || []);
    setContacts(parsed?.contacts || []);

    const rawBlocks = (parsed?.extraBlocks || []).filter(
      (b) => String(b?.type || "").trim().toUpperCase() !== "BACKGROUND"
    );

    setExtraBlocks(normalizeExtraBlocks(rawBlocks));

    setSubscriberCount(
      typeof vibe.subscriberCount === "number" ? vibe.subscriberCount : 0
    );
    setFollowingCount(
      typeof vibe.followingCount === "number" ? vibe.followingCount : 0
    );
    setSubscriberVibes(
      Array.isArray(vibe.subscriberVibes) ? vibe.subscriberVibes : []
    );
  }, [vibe]);

  return {
    vibe,
    setVibe,
    loading,
    refreshing,
    reload,
    
    followingCount,
    name,
    description,
    contacts,
    extraBlocks,
    visible,
    publicCode,

    subscriberCount,
    subscriberVibes,
  };
}