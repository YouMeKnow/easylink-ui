import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/api/apiFetch";

async function mapLimit(list, limit, worker) {
  const ret = [];
  const executing = [];
  for (const item of list) {
    const p = Promise.resolve().then(() => worker(item));
    ret.push(p);
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    if (executing.length >= limit) await Promise.race(executing);
  }
  return Promise.all(ret);
}

export default function useOffersForFollowingEdges(edges, opts = {}) {
  const { enabled = true, concurrency = 5, activeOnly = true } = opts;

  const list = useMemo(() => (Array.isArray(edges) ? edges : []), [edges]);

  const targetIds = useMemo(() => {
    const ids = list.map((e) => e?.targetVibe?.id).filter(Boolean);
    return Array.from(new Set(ids));
  }, [list]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);

  const acRef = useRef(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }

    if (acRef.current) acRef.current.abort();
    const ac = new AbortController();
    acRef.current = ac;

    // ✅ если пока нет целей — это НЕ ошибка
    if (!targetIds.length) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const offersByTarget = await mapLimit(targetIds, concurrency, async (targetVibeId) => {
        const res = await apiFetch(`/api/v3/offers/vibe/${targetVibeId}`, {
          method: "GET",
          signal: ac.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw Object.assign(new Error(text || "Failed to load offers"), {
            status: res.status,
            targetVibeId,
          });
        }

        const data = await res.json();
        const offers = Array.isArray(data) ? data : [];

        return { targetVibeId, offers };
      });

      if (ac.signal.aborted) return;

      const map = new Map(
        offersByTarget.map((x) => [String(x.targetVibeId), x.offers])
      );

      const expanded = [];
      for (const e of list) {
        const targetId = String(e?.targetVibe?.id);
        const offers = map.get(targetId) || [];
        const filtered = activeOnly ? offers.filter((o) => o?.active) : offers;

        for (const offer of filtered) {
          expanded.push({
            offer,
            sourceVibe: e.sourceVibe,
            targetVibe: e.targetVibe,
          });
        }
      }

      setItems(expanded);
    } catch (e) {
      const aborted =
        ac.signal.aborted ||
        e?.name === "AbortError" ||
        /aborted/i.test(e?.message || "");

      if (aborted) {
        // ✅ abort не должен триггерить "Could not load offers"
        setError(null);
        setLoading(false);
        return;
      }

      if (e?.status === 401 || e?.status === 403) {
        setItems([]);
        setError(null);
        setLoading(false);
        return;
      }

      setItems([]);
      setError(e);
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }, [enabled, concurrency, activeOnly, targetIds, list]);

  useEffect(() => {
    load();
    return () => {
      if (acRef.current) acRef.current.abort();
    };
  }, [load]);

  return { items, loading, error, reload: load };
}
