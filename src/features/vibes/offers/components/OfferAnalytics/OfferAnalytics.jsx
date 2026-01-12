// src/features/vibes/offers/OfferAnalytics.jsx
import React, { useMemo, useState } from "react";
import useOfferAnalytics from "../../hooks/useOfferAnalytics";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function OfferAnalytics({ offerId, token: tokenProp }) {
  const token = tokenProp ?? localStorage.getItem("jwt") ?? "";

  const formatForInput = (date) => {
    const d = new Date(date);
    // datetime-local wants local time without seconds
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const now = new Date();

  const makeStartOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const makeEndOfDay = (d) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  };

  const defaultStart = useMemo(() => formatForInput(makeStartOfDay(now)), []); // keep initial "today"
  const defaultEnd = useMemo(() => formatForInput(makeEndOfDay(now)), []);

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);

  // ✅ compute warning BEFORE useOfferAnalytics
  const startDate = useMemo(() => new Date(start), [start]);
  const endDate = useMemo(() => new Date(end), [end]);

  const rangeWarning = useMemo(() => {
    if (!start || !end) return "";
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()))
      return "Invalid date range";
    if (startDate.getTime() > endDate.getTime()) return "Start must be before End";
    return "";
  }, [start, end, startDate, endDate]);

  const { viewsData, totalViews, loading, error } = useOfferAnalytics({
    offerId,
    start,
    end,
    enabled: Boolean(offerId) && !rangeWarning, // ✅ don't fetch if invalid or no offer selected
    token, // in case your hook supports it
  });

  const setPreset = (days) => {
    const endD = makeEndOfDay(new Date());
    const startD = makeStartOfDay(new Date());
    startD.setDate(startD.getDate() - (days - 1)); // inclusive range
    setStart(formatForInput(startD));
    setEnd(formatForInput(endD));
  };

  const resetRange = () => {
    setStart(defaultStart);
    setEnd(defaultEnd);
  };

  const subtitle = useMemo(() => {
    if (!offerId) return "Select an offer to see analytics";
    const fmt = (d) =>
      d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (rangeWarning) return rangeWarning;
    return `${fmt(startDate)} → ${fmt(endDate)}`;
  }, [offerId, startDate, endDate, rangeWarning]);

  const isEmpty = !loading && !error && offerId && viewsData.length === 0;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0">Offer Analytics</h5>
              {offerId ? (
                <span className="badge text-bg-secondary">ID: {String(offerId).slice(0, 8)}…</span>
              ) : (
                <span className="badge text-bg-secondary">No offer selected</span>
              )}
            </div>
            <div className="text-muted small mt-1">{subtitle}</div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPreset(1)}
              disabled={!offerId}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPreset(7)}
              disabled={!offerId}
            >
              7d
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPreset(30)}
              disabled={!offerId}
            >
              30d
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={resetRange}
              disabled={!offerId}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="row g-2 mt-3">
          <div className="col-12 col-md-6">
            <label className="form-label mb-1 small text-muted">Start</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="form-control"
              disabled={!offerId}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label mb-1 small text-muted">End</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="form-control"
              disabled={!offerId}
            />
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="badge text-bg-primary">Total views: {totalViews}</span>
            {loading && <span className="text-muted small">Loading…</span>}
          </div>

          {!!error && (
            <div className="alert alert-danger py-2 px-3 mb-0" role="alert">
              {error}
            </div>
          )}

          {rangeWarning && !error && (
            <div className="alert alert-warning py-2 px-3 mb-0" role="alert">
              {rangeWarning}
            </div>
          )}
        </div>

        <div className="mt-3" style={{ width: "100%", height: 320 }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-border" role="status" />
            </div>
          ) : !offerId ? (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              Choose an offer to see analytics.
            </div>
          ) : isEmpty ? (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              No views in this date range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="top" align="right" />
                <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" dot />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
