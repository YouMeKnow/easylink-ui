import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetOffersByVibeId
} from "@/features/vibes/offers";

export default function MyOffers() {
  const { t } = useTranslation("interactions");
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  const offers = useGetOffersByVibeId(id, token);

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>
        <h2 className="fw-bold mx-auto mb-0" style={{ letterSpacing: ".02em" }}>
          My Offers
        </h2>
      </div>

      {/* Content */}
      <div className="card p-4 shadow" style={{ borderRadius: 18 }}>
        <h5 className="mb-3" style={{ color: "#476dfe" }}>
          Active Offers
        </h5>

        {offers && offers.length > 0 ? (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="card mb-3 border-0 shadow-sm"
              style={{ borderRadius: 14 }}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-1">{offer.title}</h5>
                  <p className="text-muted mb-1">{offer.description}</p>
                  <small className="text-secondary">
                    {offer.discountType}: {offer.currentDiscount}%
                  </small>
                </div>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate(`/offers/${offer.id}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No active offers yet.</p>
        )}
      </div>
    </div>
  );
}
