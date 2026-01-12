import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../../../../components/common/PageLayout";
import { useTranslation } from "react-i18next";
import {
  useGetOffer,
  OfferViewCard,
} from "@/features/vibes/offers";


export default function ViewOfferForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const params = new URLSearchParams(location.search);
  const vibeIdFromQuery = params.get("vibeId");

  const { offer, loading, error } = useGetOffer(id);

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

  return (
    <PageLayout title={t("Offer Details")}>
      <OfferViewCard
        offer={offer}
        onBack={() => navigate(-1)}
        onAllOffers={() => navigate(`/offers?vibeId=${vibeIdFromQuery || ""}`)}
        isOwner={true} 
        onAnalytics={() => navigate(`/offers/${offer.id}/analytics`)}
      />
    </PageLayout>
  );
}
