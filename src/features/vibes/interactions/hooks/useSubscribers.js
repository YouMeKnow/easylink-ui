import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchSubscribers } from "@/features/vibes/interactions/api/subscribersApi";

export function useSubscribers({ vibeId, enabled = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const count = useMemo(() => (Array.isArray(items) ? items.length : 0), [items]);

  const load = useCallback(async () => {
    if (!enabled || !vibeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubscribers(vibeId);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load subscribers");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, vibeId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    items,
    count,
    loading,
    error,
    refetch: load,
  };
}
