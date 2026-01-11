// src/features/vibes/offers/hooks/useGetOffer.js
import { useEffect, useState } from "react";
import { apiFetch } from "@/api/apiFetch";

export default function useGetOffer(id, opts = {}) {
  const { enabled = true } = opts;

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !id) {
      setOffer(null);
      setLoading(false);
      setError(null);
      return;
    }

    const ac = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch(`/api/v3/offers/${id}`, { signal: ac.signal });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw Object.assign(new Error(text || "Failed to fetch offer"), {
            status: res.status,
          });
        }
        const data = await res.json();
        setOffer(data);
      } catch (e) {
        if (ac.signal.aborted) return;
        setOffer(null);
        setError(e);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [enabled, id]);

  return { offer, loading, error };
}
