// src/features/vibes/catalog/useItemsByVibeId.js
import { useCallback, useEffect, useState } from "react";
import { getItemsByVibeId, deleteCatalogItems, deleteCatalogItem } from "./catalogApi";

export default function useItemsByVibeId(vibeId, opts = {}) {
  const { enabled = true } = opts;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (signal) => {
      if (!enabled || !vibeId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getItemsByVibeId({ vibeId, signal });
        setItems(data);
      } catch (e) {
        // public view: if not authorized, just show empty
        if (e?.status === 401 || e?.status === 403) {
          setItems([]);
          return;
        }
        setItems([]);
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [vibeId, enabled]
  );

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [load]);

  const reload = useCallback(() => load(), [load]);

  // delete helpers (owner)
  const removeMany = useCallback(
    async (ids) => {
      if (!enabled || !vibeId) return;
      const clean = (ids || []).filter(Boolean);
      if (!clean.length) return;

      setMutating(true);
      setError(null);

      try {
        await deleteCatalogItems({ vibeId, ids: clean });
        // optimistic UI update
        setItems((prev) => prev.filter((it) => !clean.includes(it.id)));
      } catch (e) {
        setError(e);
        // if failed, refresh to be safe
        await reload();
        throw e;
      } finally {
        setMutating(false);
      }
    },
    [enabled, vibeId, reload]
  );

  const removeOne = useCallback(
    async (itemId) => {
      if (!enabled || !vibeId || !itemId) return;

      setMutating(true);
      setError(null);

      try {
        await deleteCatalogItem({ vibeId, itemId });
        setItems((prev) => prev.filter((it) => it.id !== itemId));
      } catch (e) {
        setError(e);
        await reload();
        throw e;
      } finally {
        setMutating(false);
      }
    },
    [enabled, vibeId, reload]
  );

  return {
    items,
    loading,
    mutating,
    error,
    reload,
    removeOne,
    removeMany,
  };
}
