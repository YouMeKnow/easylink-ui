import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageLayout from "../../../components/common/PageLayout";
import useOffers from "./useGetOffersByVibeId";

import "@/features/vibes/styles/OffersTableForUsers.css";

function formatDate(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString; // fallback if backend sends weird format
  return d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function getStatus(offer) {
  const now = Date.now();
  const start = new Date(offer.startTime).getTime();
  const end = new Date(offer.endTime).getTime();

  if (!offer.active) return { label: "Disabled", tone: "neutral" };
  if (!Number.isNaN(end) && end < now) return { label: "Expired", tone: "muted" };
  if (!Number.isNaN(start) && start > now) return { label: "Scheduled", tone: "info" };
  return { label: "Active", tone: "success" };
}

function clampText(text, max = 120) {
  if (!text) return "—";
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}

export default function OffersTableForUsers() {
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vibeId = params.get("vibeId");

  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  const offers = useOffers(vibeId, token) || [];

  const sorted = useMemo(() => {
    // upcoming first, then active, then expired (optional logic)
    const now = Date.now();
    return [...offers].sort((a, b) => {
      const aStart = new Date(a.startTime).getTime();
      const bStart = new Date(b.startTime).getTime();
      const aEnd = new Date(a.endTime).getTime();
      const bEnd = new Date(b.endTime).getTime();

      const aExpired = aEnd < now;
      const bExpired = bEnd < now;

      if (aExpired !== bExpired) return aExpired ? 1 : -1; // expired last
      return (aStart || 0) - (bStart || 0);
    });
  }, [offers]);

  const openOffer = (id) => navigate(`/view-offer-form/${id}`);

  const empty = vibeId && sorted.length === 0;

  return (
    <PageLayout title={t("Offers")}>
      <div className="offers-users">
        <div className="offers-users__header">
          <div className="offers-users__subtitle">
            {vibeId ? (
              <span>
                {t("Showing offers for vibe")}: <strong>{vibeId}</strong>
              </span>
            ) : (
              <span className="text-muted">{t("No vibeId provided")}</span>
            )}
          </div>
        </div>

        {empty && (
          <div className="offers-empty">
            <div className="offers-empty__icon">🏷️</div>
            <div className="offers-empty__title">{t("No offers yet")}</div>
            <div className="offers-empty__text">
              {t("This vibe has no active offers right now. Check back later.")}
            </div>
          </div>
        )}

        {!empty && (
          <div className="offers-list">
            {sorted.map((offer) => {
              const status = getStatus(offer);
              const start = formatDate(offer.startTime);
              const end = formatDate(offer.endTime);

              return (
                <div
                  key={offer.id}
                  className="offer-row"
                  role="button"
                  tabIndex={0}
                  onClick={() => openOffer(offer.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openOffer(offer.id);
                    }
                  }}
                  title={t("Open offer")}
                >
                  <div className={`offer-row__bar tone-${status.tone}`} />

                  <div className="offer-row__main">
                    <div className="offer-row__top">
                      <div className="offer-row__title">{offer.title}</div>

                      <div className="offer-row__badges">
                        <span className={`offer-badge tone-${status.tone}`}>
                          {t(status.label)}
                        </span>
                      </div>
                    </div>

                    <div className="offer-row__desc text-muted">
                      {clampText(offer.description, 140)}
                    </div>

                    <div className="offer-row__meta">
                      <div className="offer-meta">
                        <span className="offer-meta__label">{t("Start")}</span>
                        <span className="offer-meta__value">{start}</span>
                      </div>
                      <div className="offer-meta">
                        <span className="offer-meta__label">{t("End")}</span>
                        <span className="offer-meta__value">{end}</span>
                      </div>
                    </div>
                  </div>

                  <div className="offer-row__chev" aria-hidden="true">
                    →
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="offers-users__footer">
          <span>© 2025 EasyLink. All rights reserved.</span>
        </div>
      </div>
    </PageLayout>
  );
}
