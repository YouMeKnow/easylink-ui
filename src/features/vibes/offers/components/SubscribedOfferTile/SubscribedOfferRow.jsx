import React from "react";
import "./SubscribedOfferRow.css";

export default function SubscribedOfferRow({ offer, onOpen }) {
  const now = Date.now();
  const start = new Date(offer.startTime).getTime();
  const end = new Date(offer.endTime).getTime();

  const isExpired = end < now;
  const isUpcoming = start > now;

  const status = (() => {
    if (!offer.active) return { label: "Disabled", tone: "neutral" };
    if (isExpired) return { label: "Expired", tone: "muted" };
    if (isUpcoming) return { label: "Scheduled", tone: "info" };
    return { label: "Active", tone: "success" };
  })();

  const discountText =
    offer.discountType === "PERCENTAGE"
      ? `${offer.currentDiscount}%`
      : `$${offer.currentDiscount}`;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });

  const dateRange = `${formatDate(offer.startTime)} – ${formatDate(offer.endTime)}`;

  const subtitle =
    offer.discountType === "DYNAMIC"
      ? `Dynamic offer • ${dateRange}`
      : dateRange;

  return (
    <button
      type="button"
      className="sub-offer-row"
      onClick={() => onOpen?.(offer)}
      title={offer.title}
      aria-label={`Open offer ${offer.title}`}
    >
      <div className="sub-offer-row__left">
        <div className="sub-offer-row__discount-wrap">
          <div className="sub-offer-row__discount">{discountText}</div>
        </div>

        <div className="sub-offer-row__content">
          <div className="sub-offer-row__topline">
            <div className="sub-offer-row__title">{offer.title}</div>

            <span className={`sub-offer-row__status tone-${status.tone}`}>
              {status.label}
            </span>
          </div>

          <div className="sub-offer-row__bottomline">
            <span className="sub-offer-row__subtitle">{subtitle}</span>
          </div>
        </div>
      </div>

      <div className="sub-offer-row__right">
        <span className="sub-offer-row__arrow">›</span>
      </div>
    </button>
  );
}