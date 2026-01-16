import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../../../../components/common/PageLayout";
import { useTranslation } from "react-i18next";
import { useGetOffer, OfferViewCard } from "@/features/vibes/offers";

export default function OfferDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const params = new URLSearchParams(location.search);
  const vibeIdFromQuery = params.get("vibeId");

  const { offer } = useGetOffer(id);

  if (!offer) {
    return (
      <PageLayout title={t("Offer Details")}>
        <div className="offer-view__loading">
          <div className="spinner-border text-primary" role="status" />
          <div className="offer-view__loading-text">{t("Loading...")}</div>
        </div>
      </PageLayout>
    );
  }

  const canManage = offer.canManage === true; 

  return (
    <PageLayout title={t("Offer Details")}>
      <OfferViewCard
        offer={offer}
        onBack={() => navigate(-1)}
        onAllOffers={() => navigate(`/offers?vibeId=${vibeIdFromQuery || ""}`)}
        isOwner={canManage}
        onAnalytics={
          canManage ? () => navigate(`/offers/${offer.id}/analytics`) : undefined
        }
      />
    </PageLayout>
  );
}
