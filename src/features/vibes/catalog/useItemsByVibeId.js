// src/features/vibes/catalog/useItemsByVibeId.js 
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/api/apiFetch";

export default function useItemsByVibeId(vibeId, opts = {}) {
  const { enabled = true } = opts;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (signal) => {
      if (!enabled || !vibeId) return;

      setLoading(true);
      setError(null);

      try {
        const qs = new URLSearchParams({ vibeId: String(vibeId) }).toString();
        const res = await apiFetch(`/api/v3/catalog?${qs}`, { method: "GET", signal });
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
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

  return { items, loading, error, reload: () => load() };
}
