// src/features/vibes/offers/useGetOffersByVibeId.js
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/api/apiFetch";

const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s || "");

export default function useGetOffersByVibeId(vibeId, opts = {}) {
  const { enabled = true } = opts;
  const can = useMemo(() => enabled && isUUID(vibeId), [enabled, vibeId]);

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!can) {
      setOffers([]);
      setLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await apiFetch(`/api/v3/offers/vibe/${vibeId}`, {
          method: "GET",
          signal: ac.signal,
        });
        const data = await res.json();

        setOffers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.status === 401 || e?.status === 403) {
          setOffers([]);
          return;
        }
        setOffers([]);
        setError(e);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [vibeId, can]);

  return { offers, loading, error };
}
