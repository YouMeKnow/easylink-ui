import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OffersTable from "../offers/OffersTable";
import useGetOfferByVibeId from "../offers/useGetOfferByVibeId";
import useFollowing from "../interactions/useFollowing";
import VibeCircleList from "../interactions/VibeCircleList";

export default function InteractionsPage() {
  const { t } = useTranslation("interactions");
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");

  const following = useFollowing(id, token);
  const offers = useGetOfferByVibeId(id, token);

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      {/* header */}
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>
        <h2 className="fw-bold mx-auto mb-0" style={{ letterSpacing: ".02em" }}>
          {t("title")}
        </h2>
      </div>

      {/* unified content */}
      <div className="card p-4 shadow" style={{ borderRadius: 18 }}>
        {/* Section 1: Circle */}
        <h5 className="mb-3" style={{ color: "#476dfe" }}>
          {t("sections.following")}
        </h5>
        <VibeCircleList vibes={following} t={t} />

        <hr className="my-4" />

        {/* Section 2: Offers */}
        <h5 className="mb-3" style={{ color: "#476dfe" }}>
          {t("sections.offers")}
        </h5>
        <OffersTable offers={offers} subscriberVibeId={id} t={t} />
      </div>
    </div>
  );
}
