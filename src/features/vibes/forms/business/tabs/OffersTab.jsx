import React from "react";
import OfferCard from "@/features/vibes/offers/components/OfferCard/OfferCard";
import "./OffersTab.css";

export default function OffersTab({
  t,
  offers = [],
  loading = false,
  canManage = false,
  onAddOffer,
  onOpenOffer,
  onEditOffer,
  onDeleteOffer,
}) {
  return (
    <div className="offers-tab w-100">
      <div className="offers-tab__toolbar">
        <div className="offers-tab__toolbarLeft">
          <p className="offers-tab__subtitle">
            {t("Manage promotions, limited-time deals, and special offers for your audience.", {
              defaultValue:
                "Manage promotions, limited-time deals, and special offers for your audience.",
            })}
          </p>
        </div>

        <div className="offers-tab__toolbarRight">
          <button
            type="button"
            className="offers-tab__addBtn"
            onClick={onAddOffer}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>{t("Add offer", { defaultValue: "Add offer" })}</span>
          </button>
        </div>
      </div>

      <div className="offers-tab__divider" />

      {loading ? (
        <div className="offers-tab__loading">
          <div className="spinner-border" role="status" />
        </div>
      ) : offers.length > 0 ? (
        <div className="offers-tab__list d-grid gap-3">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              canManage={canManage}
              onOpen={onOpenOffer ? () => onOpenOffer(offer) : undefined}
              onEdit={onEditOffer ? () => onEditOffer(offer) : undefined}
              onDelete={onDeleteOffer ? () => onDeleteOffer(offer) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="offers-tab__empty">
          <div className="offers-tab__emptyIconWrap">
            <div className="offers-tab__emptyIcon">%</div>
          </div>

          <h4 className="offers-tab__emptyTitle">
            {t("No offers yet", { defaultValue: "No offers yet" })}
          </h4>

          <p className="offers-tab__emptyText">
            {t("Create your first offer to highlight something valuable and give people a reason to engage.", {
              defaultValue:
                "Create your first offer to highlight something valuable and give people a reason to engage.",
            })}
          </p>

          <button
            type="button"
            className="btn btn-primary offers-tab__emptyBtn"
            onClick={onAddOffer}
          >
            {t("Create first offer", {
              defaultValue: "Create first offer",
            })}
          </button>
        </div>
      )}
    </div>
  );
}
