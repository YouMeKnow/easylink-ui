import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/api/apiFetch";

const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s || ""
  );

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

export default function useMyFollowingEdges(opts = {}) {
  const { enabled = true, concurrency = 5, token = null } = opts;

  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);

  const acRef = useRef(null);

  const load = useCallback(async () => {
    if (!enabled) {
      setEdges([]);
      setError(null);
      setLoading(false);
      return;
    }

    if (acRef.current) acRef.current.abort();
    const ac = new AbortController();
    acRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      if (!token) {
        // неавторизован — подписок нет
        setEdges([]);
        setLoading(false);
        return;
      }

      // 1) мои вайбы
      const myRes = await apiFetch("/api/v3/vibes", {
        headers: { Authorization: `Bearer ${token}` },
        signal: ac.signal,
      });

      if (!myRes.ok) {
        const text = await myRes.text().catch(() => "");
        throw Object.assign(new Error(text || "Failed to load my vibes"), {
          status: myRes.status,
        });
      }

      const myData = await myRes.json();
      const myVibes = Array.isArray(myData) ? myData : [];
      const myVibeIds = myVibes.map((v) => v?.id).filter((id) => isUUID(id));

      if (ac.signal.aborted) return;

      if (!myVibeIds.length) {
        setEdges([]);
        setLoading(false);
        return;
      }

      // 2) для каждого моего вайба — following
      const results = await mapLimit(myVibeIds, concurrency, async (myVibeId) => {
        const res = await apiFetch(`/api/v3/interactions/${myVibeId}/following`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ac.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw Object.assign(new Error(text || "Failed to load following"), {
            status: res.status,
            myVibeId,
          });
        }

        const targets = await res.json();
        const list = Array.isArray(targets) ? targets : [];

        const sourceVibe = myVibes.find((v) => String(v?.id) === String(myVibeId));
        return list.map((targetVibe) => ({
          sourceVibe,
          targetVibe,
        }));
      });

      if (ac.signal.aborted) return;

      const flat = results
        .flat()
        .filter((e) => e?.sourceVibe?.id && e?.targetVibe?.id);

      // дедуп: source|target
      const uniq = new Map();
      for (const e of flat) {
        uniq.set(`${e.sourceVibe.id}|${e.targetVibe.id}`, e);
      }

      setEdges(Array.from(uniq.values()));
    } catch (e) {
      const aborted =
        ac.signal.aborted ||
        e?.name === "AbortError" ||
        /aborted/i.test(e?.message || "");

      if (aborted) {
        // abort не должен показываться как ошибка
        setError(null);
        setLoading(false);
        return;
      }

      if (e?.status === 401 || e?.status === 403) {
        setEdges([]);
        setError(null);
        setLoading(false);
        return;
      }

      setEdges([]);
      setError(e);
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }, [enabled, concurrency, token]);

  useEffect(() => {
    load();
    return () => {
      if (acRef.current) acRef.current.abort();
    };
  }, [load]);

  return { edges, loading, error, reload: load };
}
