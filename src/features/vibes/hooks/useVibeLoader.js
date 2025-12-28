// src/features/vibes/hooks/useVibeLoader.js
import { useEffect, useRef, useState } from "react";
import { getVibe } from "@/api/vibeApi";
import parseFields from "@/data/parseFields";

const VIBE_CACHE = new Map(); // id -> { data, ts }
const TTL_MS = 2 * 60 * 1000;

function getCached(id) {
  const entry = VIBE_CACHE.get(id);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL_MS) {
    VIBE_CACHE.delete(id);
    return null;
  }
  return entry.data;
}

function setCached(id, data) {
  VIBE_CACHE.set(id, { data, ts: Date.now() });
}

// optional prefetch helper (keep if you use it somewhere)
export function prefetchVibe(id, signal) {
  return getVibe(id, { signal })
    .then((data) => {
      setCached(id, data);
      return data;
    })
    .catch(() => {});
}

/**
 * Loads a Vibe by id.
 * IMPORTANT: This hook does NOT do auth redirects.
 * Protect the route with <AuthGuard> instead.
 */
export default function useVibeLoader(id) {
  const cached = id ? getCached(id) : null;

  const [vibe, setVibe] = useState(cached || null);
  const [loading, setLoading] = useState(!cached);
  const [refreshing, setRefreshing] = useState(false);

  const [name, setName] = useState(cached?.name || "");
  const [description, setDescription] = useState(cached?.description || "");
  const [contacts, setContacts] = useState([]);
  const [extraBlocks, setExtraBlocks] = useState([]);
  const [visible, setVisible] = useState(Boolean(cached?.visible));
  const [publicCode, setPublicCode] = useState(cached?.publicCode || "");

  const prevIdRef = useRef(id);

  useEffect(() => {
    if (!id) {
      setVibe(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const ac = new AbortController();

    const hasCache = Boolean(getCached(id));
    if (hasCache) {
      setLoading(false);
      setRefreshing(true);
    } else {
      setLoading(true);
      setRefreshing(false);
    }

    prevIdRef.current = id;

    (async () => {
      try {
        const data = await getVibe(id, { signal: ac.signal });
        if (ac.signal.aborted) return;

        setCached(id, data);
        setVibe(data);
      } catch (err) {
        if (ac.signal.aborted) return;

        // No redirects here — just fail gracefully.
        // Optionally you can clear vibe:
        setVibe(null);

        // If you want to debug:
        // console.error("[useVibeLoader] failed to load vibe", err);
      } finally {
        if (!ac.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    })();

    return () => ac.abort();
  }, [id]);

  // derive editable fields from vibe
  useEffect(() => {
    if (!vibe) return;

    setName(vibe.name || "");
    setDescription(vibe.description || "");
    setVisible(Boolean(vibe.visible));
    setPublicCode(vibe.publicCode || "");

    const parsed = parseFields(vibe.fieldsDTO || []);
    setContacts(parsed?.contacts || []);
    setExtraBlocks(parsed?.extraBlocks || []);
  }, [vibe]);

  return {
    vibe,
    setVibe,
    loading,
    refreshing,
    name,
    description,
    contacts,
    extraBlocks,
    visible,
    publicCode,
  };
}
