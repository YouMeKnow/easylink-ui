import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/api/apiFetch";

export default function useOfferAnalytics({ offerId, start, end, enabled = true }) {
  const [viewsData, setViewsData] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortRef = useRef(null);

  useEffect(() => {
    if (!enabled || !offerId || !start || !end) {
      setViewsData([]);
      setTotalViews(0);
      setLoading(false);
      setError("");
      return;
    }

    const run = async () => {
      abortRef.current?.abort?.();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError("");

      try {
        const url = `/api/v3/analytics/events?type=offer&id=${offerId}&start=${start}:00Z&end=${end}:59Z`;

        const res = await apiFetch(url, { method: "GET", signal: controller.signal });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Request failed (${res.status})`);
        }

        const data = await res.json();

        const dayToViews = new Map();
        for (const ev of data) {
          const key = new Date(ev.serverUploadTime).toLocaleDateString("en-US", {
            timeZone: "UTC",
            month: "short",
            day: "numeric",
          });
          dayToViews.set(key, (dayToViews.get(key) ?? 0) + 1);
        }

        const aggregated = Array.from(dayToViews.entries())
          .map(([date, views]) => ({ date, views }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setViewsData(aggregated);
        setTotalViews(data.length);
      } catch (e) {
        if (e?.name === "AbortError") return;
        setError(e?.message || "Failed to load analytics");
        setViewsData([]);
        setTotalViews(0);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(run, 250);
    return () => {
      clearTimeout(t);
      abortRef.current?.abort?.();
    };
  }, [enabled, offerId, start, end]);

  return { viewsData, totalViews, loading, error };
}
