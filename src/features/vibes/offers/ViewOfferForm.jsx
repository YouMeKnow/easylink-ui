import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../../../components/common/PageLayout";
import { useTranslation } from "react-i18next";
import useGetOffer from "./useGetOffer";

import "@/features/vibes/styles/ViewOfferForm.css";

function formatDate(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatus(offer) {
  const now = Date.now();
  const start = new Date(offer.startTime).getTime();
  const end = new Date(offer.endTime).getTime();

  if (!offer.active) return { key: "disabled", label: "Disabled" };
  if (!Number.isNaN(end) && end < now)
    return { key: "expired", label: "Expired" };
  if (!Number.isNaN(start) && start > now)
    return { key: "scheduled", label: "Scheduled" };
  return { key: "active", label: "Active" };
}

function discountValue(offer) {
  if (!offer) return "—";
  if (offer.discountType === "PERCENTAGE")
    return `${offer.currentDiscount}%`;
  if (offer.discountType === "FIXED")
    return `$${offer.currentDiscount}`;
  return String(offer.currentDiscount ?? "—");
}

function discountTypeLabel(t, offer) {
  if (!offer) return "—";
  if (offer.discountType === "PERCENTAGE") return t("Percentage");
  if (offer.discountType === "FIXED") return t("Fixed amount");
  if (offer.discountType === "DYNAMIC") return t("Dynamic");
  return offer.discountType;
}

export default function ViewOfferForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const token = localStorage.getItem("jwt");

  const params = new URLSearchParams(location.search);
  const vibeIdFromQuery = params.get("vibeId");

  const { offer } = useGetOffer(id, token);

  const status = useMemo(
    () => (offer ? getStatus(offer) : null),
    [offer]
  );

  const validRange = useMemo(() => {
    if (!offer) return "—";
    return `${formatDate(offer.startTime)} → ${formatDate(
      offer.endTime
    )}`;
  }, [offer]);

  const hint = useMemo(() => {
    if (!offer) return null;

    const now = Date.now();
    const start = new Date(offer.startTime).getTime();
    const end = new Date(offer.endTime).getTime();

    if (!offer.active) {
      return {
        icon: "⏸️",
        title: t("This offer is currently disabled"),
        text: t(
          "You can’t use it right now. Check again later or ask the owner."
        ),
      };
    }

    if (!Number.isNaN(end) && end < now) {
      return {
        icon: "⌛",
        title: t("This offer has ended"),
        text: t("It’s no longer available."),
      };
    }

    if (!Number.isNaN(start) && start > now) {
      return {
        icon: "🗓️",
        title: t("This offer starts later"),
        text: `${t("Starts on")} ${formatDate(offer.startTime)}.`,
      };
    }

    return {
      icon: "✅",
      title: t("This offer is available now"),
      text: `${t("Valid until")} ${formatDate(offer.endTime)}.`,
    };
  }, [offer, t]);

  if (!offer) {
    return (
      <PageLayout title={t("Offer Details")}>
        <div className="offer-view__loading">
          <div className="spinner-border text-primary" role="status" />
          <div className="offer-view__loading-text">
            {t("Loading...")}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t("Offer Details")}>
      <div className="offer-view">
        <div className="offer-view__card">
          {/* ===== HEADER ===== */}
          <div className="offer-view__header">
            <div>
              <div className="offer-view__title">{offer.title}</div>
              <div className="offer-view__sub">
                <span className="offer-view__sub-label">
                  {t("Valid")}
                </span>
                <span className="offer-view__mono">
                  {validRange}
                </span>
              </div>
            </div>

            <div className="offer-view__badges">
              <span className={`offer-badge is-${status.key}`}>
                {t(status.label)}
              </span>
              {offer.discountType === "DYNAMIC" && (
                <span className="offer-badge is-warning">
                  {t("Dynamic")}
                </span>
              )}
            </div>
          </div>

          {/* ===== HERO ===== */}
          <div className="offer-view__hero">
            <div className="offer-view__hero-left">
              <div className="offer-view__hero-k">
                {t("Current discount")}
              </div>
              <div className="offer-view__hero-v">
                {discountValue(offer)}
              </div>
              <div className="offer-view__hero-hint">
                {t("Discount type")}:{" "}
                <strong>{discountTypeLabel(t, offer)}</strong>
              </div>
            </div>

            <div className="offer-view__hero-right">
              <div className="kv">
                <div className="kv__k">
                  {t("Initial discount")}
                </div>
                <div className="kv__v">
                  {offer.initialDiscount ?? "—"}
                </div>
              </div>

              <div className="kv">
                <div className="kv__k">{t("Active")}</div>
                <div className="kv__v">
                  {offer.active ? t("Yes") : t("No")}
                </div>
              </div>
            </div>
          </div>

          {/* ===== SMART HINT ===== */}
          {hint && (
            <div className={`offer-hint is-${status.key}`}>
              <div className="offer-hint__icon" aria-hidden="true">
                {status.key === "active" && (
                  <svg viewBox="0 0 24 24" className="offer-ic">
                    <path
                      d="M20 6L9 17l-5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {status.key === "scheduled" && (
                  <svg viewBox="0 0 24 24" className="offer-ic">
                    <path
                      d="M8 2v3M16 2v3M4 7h16M7 11h5M7 15h3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {(status.key === "expired" || status.key === "disabled") && (
                  <svg viewBox="0 0 24 24" className="offer-ic">
                    <path
                      d="M12 8v4l3 2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    />
                  </svg>
                )}
              </div>

              <div className="offer-hint__body">
                <div className="offer-hint__title">{hint.title}</div>
                <div className="offer-hint__text">{hint.text}</div>
              </div>
            </div>
          )}

          {/* ===== DESCRIPTION ===== */}
          <div className="offer-view__section">
            <div className="offer-view__section-title">
              {t("Description")}
            </div>
            <div className="offer-view__desc">
              {offer.description?.trim()
                ? offer.description
                : "—"}
            </div>
          </div>

          {/* ===== DETAILS ===== */}
          <div className="offer-view__grid">
            <div className="panel">
              <div className="panel__k">{t("Start time")}</div>
              <div className="panel__v offer-view__mono">
                {formatDate(offer.startTime)}
              </div>
            </div>

            <div className="panel">
              <div className="panel__k">{t("End time")}</div>
              <div className="panel__v offer-view__mono">
                {formatDate(offer.endTime)}
              </div>
            </div>
          </div>

          {/* ===== ACTIONS ===== */}
          <div className="offer-view__actions">
            <button
              type="button"
              className="offer-btn offer-btn--ghost"
              onClick={() => navigate(-1)}
            >
              ← {t("Back")}
            </button>

            <button
              type="button"
              className="offer-btn offer-btn--primary"
              onClick={() => navigate(`/offers?vibeId=${vibeIdFromQuery ?? ""}`)}
            >
              {t("All offers")}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
