import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./OfferViewCard.css";


function formatDate(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function getStatus(offer) {
  const now = Date.now();
  const start = new Date(offer.startTime).getTime();
  const end = new Date(offer.endTime).getTime();

  if (!offer.active) return { key: "disabled", label: "Disabled" };
  if (!Number.isNaN(end) && end < now) return { key: "expired", label: "Expired" };
  if (!Number.isNaN(start) && start > now) return { key: "scheduled", label: "Scheduled" };
  return { key: "active", label: "Active" };
}

function discountValue(offer) {
  if (!offer) return "—";
  if (offer.discountType === "PERCENTAGE") return `${offer.currentDiscount}%`;
  if (offer.discountType === "FIXED") return `$${offer.currentDiscount}`;
  return String(offer.currentDiscount ?? "—");
}

function discountTypeLabel(t, offer) {
  if (!offer) return "—";
  if (offer.discountType === "PERCENTAGE") return t("Percentage");
  if (offer.discountType === "FIXED") return t("Fixed amount");
  if (offer.discountType === "DYNAMIC") return t("Dynamic");
  return offer.discountType;
}

// datetime-local helpers
const toInputLocal = (v) => {
  if (!v) return "";
  // если это уже datetime-local
  if (typeof v === "string" && v.length >= 16 && v.includes("T") && !v.includes("Z")) {
    return v.slice(0, 16);
  }
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  // datetime-local должен быть без timezone, поэтому берём локальные компоненты
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
};

const fromInputLocalToIso = (dtLocal) => {
  if (!dtLocal) return null;
  const d = new Date(dtLocal);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

export default function OfferViewCard({
  offer,
  mode = "view",
  onChange,
  showActions = true,
  onBack,
  onAllOffers,
  onAnalytics,
  isOwner = false,
  disabled = false,
}) {
  const { t } = useTranslation();

  if (!offer) return null;

  const status = useMemo(() => getStatus(offer), [offer]);

  const validRange = useMemo(() => {
    return `${formatDate(offer.startTime)} → ${formatDate(offer.endTime)}`;
  }, [offer.startTime, offer.endTime]);

  const hint = useMemo(() => {
    const now = Date.now();
    const start = new Date(offer.startTime).getTime();
    const end = new Date(offer.endTime).getTime();

    if (!offer.active) {
      return {
        title: t("This offer is currently disabled"),
        text: t("You can’t use it right now. Check again later or ask the owner."),
      };
    }
    if (!Number.isNaN(end) && end < now) {
      return { title: t("This offer has ended"), text: t("It’s no longer available.") };
    }
    if (!Number.isNaN(start) && start > now) {
      return { title: t("This offer starts later"), text: `${t("Starts on")} ${formatDate(offer.startTime)}.` };
    }
    return { title: t("This offer is available now"), text: `${t("Valid until")} ${formatDate(offer.endTime)}.` };
  }, [offer.active, offer.startTime, offer.endTime, t]);

  const isEdit = mode === "edit";

  const patch = (p) => {
    if (!isEdit) return;
    onChange?.(p);
  };

  const discountSuffix = offer.discountType === "FIXED" ? "$" : "%";

  return (
    <div className="offer-view">
      <div className={`offer-view__card ${isEdit ? "offer-edit" : ""}`}>
        {/* HEADER */}
        <div className="offer-view__header">
          <div style={{ minWidth: 0 }}>
            {isEdit ? (
              <input
                className="offer-view__title-input"
                value={offer.title ?? ""}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder={t("Offer title")}
                disabled={disabled}
              />
            ) : (
              <div className="offer-view__title">{offer.title}</div>
            )}

            <div className="offer-view__sub">
              <span className="offer-view__sub-label">{t("Valid")}</span>
              <span className="offer-view__mono">{validRange}</span>
            </div>
          </div>

          <div className="offer-view__badges">
            {/* toggle active прямо в карточке */}
            {isEdit ? (
              <label className="offer-switch" title={t("Show to users")}>
                <input
                  type="checkbox"
                  checked={!!offer.active}
                  onChange={(e) => patch({ active: e.target.checked })}
                  disabled={disabled}
                />
                <span className="offer-switch__ui" />
              </label>
            ) : null}

            <span className={`offer-badge is-${status.key}`}>{t(status.label)}</span>

            {offer.discountType === "DYNAMIC" && (
              <span className="offer-badge is-warning">{t("Dynamic")}</span>
            )}
          </div>
        </div>

        {/* HERO */}
        <div className="offer-view__hero">
          <div className="offer-view__hero-left">
            <div className="offer-view__hero-k">{t("Current discount")}</div>

            {isEdit ? (
              <div className="offer-view__hero-v offer-view__hero-v--edit">
                <input
                  className="offer-view__hero-v-input"
                  type="number"
                  value={offer.currentDiscount ?? 0}
                  onChange={(e) => patch({ currentDiscount: Number(e.target.value) })}
                  disabled={disabled}
                  min={0}
                />
                <span className="offer-view__hero-v-suf">{discountSuffix}</span>
              </div>
            ) : (
              <div className="offer-view__hero-v">{discountValue(offer)}</div>
            )}

            <div className="offer-view__hero-hint">
              {t("Discount type")}:{" "}
              {isEdit ? (
                <select
                  className="offer-select"
                  value={offer.discountType ?? "DYNAMIC"}
                  onChange={(e) => patch({ discountType: e.target.value })}
                  disabled={disabled}
                >
                  <option value="DYNAMIC">{t("Dynamic")}</option>
                  <option value="PERCENTAGE">{t("Percentage")}</option>
                  <option value="FIXED">{t("Fixed amount")}</option>
                </select>
              ) : (
                <strong>{discountTypeLabel(t, offer)}</strong>
              )}
            </div>
          </div>

          <div className="offer-view__hero-right">
            <div className="kv">
              <div className="kv__k">{t("Initial discount")}</div>
              <div className="kv__v">
                {isEdit ? (
                  <div className="offer-inline-num">
                    <input
                      className="offer-inline-num__input"
                      type="number"
                      value={offer.initialDiscount ?? 0}
                      onChange={(e) => patch({ initialDiscount: Number(e.target.value) })}
                      disabled={disabled}
                      min={0}
                    />
                    <span className="offer-inline-num__suf">{discountSuffix}</span>
                  </div>
                ) : (
                  offer.initialDiscount ?? "—"
                )}
              </div>
            </div>

            {/* dynamic fields inline */}
            {offer.discountType === "DYNAMIC" && (
              <>
                <div className="kv">
                  <div className="kv__k">{t("Decrease step")}</div>
                  <div className="kv__v">
                    {isEdit ? (
                      <div className="offer-inline-num">
                        <input
                          className="offer-inline-num__input"
                          type="number"
                          value={offer.decreaseStep ?? 0}
                          onChange={(e) => patch({ decreaseStep: Number(e.target.value) })}
                          disabled={disabled}
                          min={0}
                        />
                        <span className="offer-inline-num__suf">%</span>
                      </div>
                    ) : (
                      offer.decreaseStep ?? "—"
                    )}
                  </div>
                </div>

                <div className="kv">
                  <div className="kv__k">{t("Interval (min)")}</div>
                  <div className="kv__v">
                    {isEdit ? (
                      <input
                        className="offer-inline-text"
                        type="number"
                        value={offer.decreaseIntervalMinutes ?? 0}
                        onChange={(e) => patch({ decreaseIntervalMinutes: Number(e.target.value) })}
                        disabled={disabled}
                        min={0}
                      />
                    ) : (
                      offer.decreaseIntervalMinutes ?? "—"
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* HINT */}
        {hint && (
          <div className={`offer-hint is-${status.key}`}>
            <div className="offer-hint__icon" aria-hidden="true">
              {/* твои svg */}
              {status.key === "active" && (
                <svg viewBox="0 0 24 24" className="offer-ic">
                  <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {status.key === "scheduled" && (
                <svg viewBox="0 0 24 24" className="offer-ic">
                  <path d="M8 2v3M16 2v3M4 7h16M7 11h5M7 15h3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                </svg>
              )}
              {(status.key === "expired" || status.key === "disabled") && (
                <svg viewBox="0 0 24 24" className="offer-ic">
                  <path d="M12 8v4l3 2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" fill="none" stroke="currentColor" strokeWidth="2.2" />
                </svg>
              )}
            </div>

            <div className="offer-hint__body">
              <div className="offer-hint__title">{hint.title}</div>
              <div className="offer-hint__text">{hint.text}</div>
            </div>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="offer-view__section">
          <div className="offer-view__section-title">{t("Description")}</div>
          {isEdit ? (
            <textarea
              className="offer-view__desc-input"
              rows={4}
              value={offer.description ?? ""}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder={t("Add details: conditions, eligibility, what users get...")}
              disabled={disabled}
            />
          ) : (
            <div className="offer-view__desc">{offer.description?.trim() ? offer.description : "—"}</div>
          )}
        </div>

        {/* DETAILS */}
        <div className="offer-view__grid">
          <div className="panel">
            <div className="panel__k">{t("Start time")}</div>
            <div className="panel__v offer-view__mono">
              {isEdit ? (
                <input
                  className="offer-dt"
                  type="datetime-local"
                  value={toInputLocal(offer.startTime)}
                  onChange={(e) => patch({ startTime: fromInputLocalToIso(e.target.value) })}
                  disabled={disabled}
                />
              ) : (
                formatDate(offer.startTime)
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel__k">{t("End time")}</div>
            <div className="panel__v offer-view__mono">
              {isEdit ? (
                <input
                  className="offer-dt"
                  type="datetime-local"
                  value={toInputLocal(offer.endTime)}
                  onChange={(e) => patch({ endTime: fromInputLocalToIso(e.target.value) })}
                  disabled={disabled}
                />
              ) : (
                formatDate(offer.endTime)
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="offer-view__actions">
            <button className="offer-btn offer-btn--ghost" onClick={onBack}>
              ← {t("Back")}
            </button>

            {isOwner && (
              <button
                className="offer-btn offer-btn--secondary"
                onClick={onAnalytics}
              >
                📈 {t("Analytics")}
              </button>
            )}

            <button
              className="offer-btn offer-btn--primary"
              onClick={onAllOffers}
            >
              {t("All offers")}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
