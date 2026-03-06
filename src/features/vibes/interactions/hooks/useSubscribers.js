// src/features/vibes/interactions/hooks/useSubscribers.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchSubscribers, removeSubscriber } from "@/features/vibes/interactions/api/subscribersApi";

export function useSubscribers({ vibeId, myVibeId = null, enabled = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const count = useMemo(() => (Array.isArray(items) ? items.length : 0), [items]);

  const load = useCallback(async () => {
    if (!enabled || !vibeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubscribers(vibeId, { myVibeId });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load subscribers");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, vibeId, myVibeId]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = useCallback(
    async (subscriberVibeId) => {
      if (!vibeId || !subscriberVibeId) return;
      try {
        await removeSubscriber(vibeId, subscriberVibeId);
        setItems((prev) =>
          prev.filter((x) => (x.id || x.vibeId || x.subscriberVibeId) !== subscriberVibeId)
        );
      } catch (e) {
        setError(e?.message || "Failed to remove subscriber");
      }
    },
    [vibeId]
  );

  return { items, count, loading, error, refetch: load, remove };
}