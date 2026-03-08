import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchFollowing } from "@/features/vibes/interactions/api/followingApi";

export function useFollowing({ vibeId, enabled = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const count = useMemo(() => (Array.isArray(items) ? items.length : 0), [items]);

  const load = useCallback(async () => {
    if (!enabled || !vibeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFollowing(vibeId);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load following");
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