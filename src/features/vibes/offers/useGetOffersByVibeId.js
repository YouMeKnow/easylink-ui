// src/features/vibes/offers/useGetOffersByVibeId.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/api/apiFetch";

const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s || ""
  );

export default function useGetOffersByVibeId(vibeId, opts = {}) {
  const { enabled = true } = opts;
  const can = useMemo(() => enabled && isUUID(vibeId), [enabled, vibeId]);

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const acRef = useRef(null);

  const load = useCallback(async () => {
    if (!can) return;

    // abort previous
    if (acRef.current) acRef.current.abort();
    const ac = new AbortController();
    acRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch(`/api/v3/offers/vibe/${vibeId}`, {
        method: "GET",
        signal: ac.signal,
      });

      if (!res.ok) {

        const text = await res.text().catch(() => "");
        throw Object.assign(new Error(text || "Failed to load offers"), {
          status: res.status,
        });
      }

      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (e) {
      if (ac.signal.aborted) return;

      if (e?.status === 401 || e?.status === 403) {
        setOffers([]);
        return;
      }
      setOffers([]);
      setError(e);
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }, [can, vibeId]);

  useEffect(() => {
    if (!can) {
      setOffers([]);
      setLoading(false);
      setError(null);
      return;
    }

    load();

    return () => {
      if (acRef.current) acRef.current.abort();
    };
  }, [can, load]);

  return { offers, loading, error, reload: load };
}
