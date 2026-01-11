// src/features/vibes/offers/OfferCard.jsx
import React, { useMemo } from "react";
import "./OfferCard.css";

export default function OfferCard({
  offer,
  onOpen,
  onEdit,
  onDelete,
  selected,
  onSelect,
  canManage = false,
}) {
  const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const now = Date.now();
  const start = new Date(offer.startTime).getTime();
  const end = new Date(offer.endTime).getTime();

  const isExpired = end < now;
  const isUpcoming = start > now;

  const status = useMemo(() => {
    if (!offer.active) return { label: "Disabled", tone: "neutral" };
    if (isExpired) return { label: "Expired", tone: "muted" };
    if (isUpcoming) return { label: "Scheduled", tone: "info" };
    return { label: "Active", tone: "success" };
  }, [offer.active, isExpired, isUpcoming]);

  const discountText =
    offer.discountType === "PERCENTAGE"
      ? `${offer.currentDiscount}%`
      : `$${offer.currentDiscount}`;

  const onCardClick = () => {
    if (onOpen) return onOpen(offer);
    if (canManage) return onEdit?.(offer);
    return onSelect?.(offer);
  };

  // 🔒 блокируем всплытие, но НЕ ломаем onClick кнопок
  const stopAll = (e) => {
    e.stopPropagation();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCardClick();
    }
    if (canManage && (e.key === "e" || e.key === "E")) onEdit?.(offer);
    if (canManage && (e.key === "Delete" || e.key === "Backspace"))
      onDelete?.(offer);
  };

  return (
    <div
      className={[
        "offer-card",
        selected ? "is-selected" : "",
        !offer.active ? "is-disabled" : "",
        isExpired ? "is-expired" : "",
      ].join(" ")}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onCardClick}
      onKeyDown={onKeyDown}
      title={canManage ? "Click to open • Press E to edit" : "Click to open"}
    >
      <div className="offer-card__bar" />

      <div className="offer-card__body">
        <div className="offer-card__top">
          <div className="offer-card__title-wrap">
            <div className="offer-card__title">{offer.title}</div>
            <div className="offer-card__subtitle">
              {formatDate(offer.startTime)} → {formatDate(offer.endTime)}
            </div>
          </div>

          <div className="offer-card__badges">
            <span className={`offer-badge tone-${status.tone}`}>
              {status.label}
            </span>
            {offer.discountType === "DYNAMIC" && (
              <span className="offer-badge tone-warning">Dynamic</span>
            )}
          </div>
        </div>

        <div className="offer-card__bottom">
          <div className="offer-card__meta">
            <span className="offer-card__label">Discount</span>
            <span className="offer-card__value">{discountText}</span>
            {isUpcoming && (
              <span className="offer-card__hint">Starts later</span>
            )}
          </div>

          {canManage && (
            <div className="offer-card__actions">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onMouseDown={stopAll}
                onClick={(e) => {
                  stopAll(e);
                  onEdit?.(offer);
                }}
              >
                Edit
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onMouseDown={stopAll}
                onClick={(e) => {
                  stopAll(e);
                  onDelete?.(offer);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
