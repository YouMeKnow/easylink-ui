import { useCallback, useEffect, useState } from "react";
import {
  fetchPendingRequests,
  approveRequest,
  rejectRequest,
} from "@/features/vibes/network/api/requestsApi";

export function usePendingRequests({ vibeId, enabled = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!enabled || !vibeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPendingRequests(vibeId);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load requests");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, vibeId]);

  useEffect(() => {
    load();
  }, [load]);

  const approve = useCallback(
    async (interactionId) => {
      if (!vibeId || !interactionId) return;
      try {
        await approveRequest(vibeId, interactionId);
        setItems((prev) => prev.filter((x) => x.interactionId !== interactionId));
      } catch (e) {
        setError(e?.message || "Failed to approve");
      }
    },
    [vibeId]
  );

  const reject = useCallback(
    async (interactionId) => {
      if (!vibeId || !interactionId) return;
      try {
        await rejectRequest(vibeId, interactionId);
        setItems((prev) => prev.filter((x) => x.interactionId !== interactionId));
      } catch (e) {
        setError(e?.message || "Failed to reject");
      }
    },
    [vibeId]
  );

  return { items, loading, error, refetch: load, approve, reject };
}