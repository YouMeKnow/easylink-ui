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

  // ✅ viewer-aware (multi)
  const [subscriberCount, setSubscriberCount] = useState(
    typeof cached?.subscriberCount === "number" ? cached.subscriberCount : 0
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
    setExtraBlocks(parsed?.extraBlocks || []);

    setSubscriberCount(typeof vibe.subscriberCount === "number" ? vibe.subscriberCount : 0);
    setSubscriberVibes(Array.isArray(vibe.subscriberVibes) ? vibe.subscriberVibes : []);
  }, [vibe]);

  return {
    vibe,
    setVibe,
    loading,
    refreshing,
    reload,

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
