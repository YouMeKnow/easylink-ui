import React, { useEffect, useMemo, useState } from "react";
import { fetchSubscribers } from "@/features/vibes/interactions/api/subscribersApi";
import PublicVibeElementCard from "@/features/vibes/interactions/components/PublicVibeElementCard";

import "@/features/vibes/styles/SubscribersModal.css";
function SearchIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M9 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M14.5 14.5 18 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SubscribersModal({ t, vibeId, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSubscribers(vibeId);
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load");
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [vibeId]);

  const title = t?.("Subscribers", { defaultValue: "Subscribers" }) || "Subscribers";

  const filtered = useMemo(() => {
    const query = (q || "").trim().toLowerCase();
    if (!query) return items;
    return items.filter((v) => {
      const name = (v?.name || "").toLowerCase();
      const desc = (v?.description || "").toLowerCase();
      const type = (v?.type || "").toLowerCase();
      return name.includes(query) || desc.includes(query) || type.includes(query);
    });
  }, [items, q]);

  return (
    <div
      className="modal fade show subs-modal__overlay"
      style={{ display: "block" }}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content rounded-4 subs-modal__content">
          <div className="modal-header subs-modal__header">
            <div className="d-flex align-items-center gap-3 w-100">
              <div className="d-flex flex-column">
                <h5 className="modal-title mb-0">
                  {title}{" "}
                  {!loading && !error && <span className="subs-modal__count">({items.length})</span>}
                </h5>
                <div className="subs-modal__sub">
                  {t?.("Tap a card to open vibe", { defaultValue: "Tap a card to open vibe" }) ||
                    "Tap a card to open vibe"}
                </div>
              </div>

              <div className="ms-auto d-flex align-items-center gap-2">
                <div className="subs-modal__search input-group input-group-sm">
                  <span className="input-group-text subs-modal__searchIcon">
                    <SearchIcon />
                  </span>

                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="form-control subs-modal__searchInput"
                    placeholder={t?.("Search", { defaultValue: "Search" }) || "Search"}
                    aria-label="Search subscribers"
                  />

                  {q && (
                    <button
                      className="btn subs-modal__clearBtn"
                      type="button"
                      onClick={() => setQ("")}
                      title={t?.("Clear", { defaultValue: "Clear" }) || "Clear"}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <button type="button" className="btn-close" onClick={onClose} />
              </div>
            </div>
          </div>

          <div className="modal-body subs-modal__body">
            {loading && (
              <div className="d-flex justify-content-center py-4">
                <div className="spinner-border text-primary" role="status" />
              </div>
            )}

            {!loading && error && <div className="alert alert-danger mb-0">{error}</div>}

            {!loading && !error && items.length === 0 && (
              <div className="alert alert-info mb-0">
                {t?.("No subscribers yet", { defaultValue: "No subscribers yet" }) ||
                  "No subscribers yet"}
              </div>
            )}

            {!loading && !error && items.length > 0 && filtered.length === 0 && (
              <div className="alert alert-secondary mb-0">
                {t?.("No matches", { defaultValue: "No matches" }) || "No matches"}
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="position-relative" style={{ minHeight: 220 }}>
                <div className="subs-modal__grid">
                  {filtered.map((vibe, idx) => (
                    <div key={`${vibe.id ?? "noid"}-${idx}`} className="subs-modal__cell">
                      <PublicVibeElementCard vibe={vibe} to={`/view/${vibe.id}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer subs-modal__footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              {t?.("Close", { defaultValue: "Close" }) || "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}