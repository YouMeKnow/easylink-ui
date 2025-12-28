// src/features/vibes/pages/PublicVibePage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PageLayout from "@/components/common/PageLayout";
import { useAuth } from "@/context/AuthContext";

import useVibeLoader from "@/features/vibes/hooks/useVibeLoader";

import BusinessCustomerCard from "@/features/vibes/components/BusinessCustomerCard";
import VibeCard from "@/features/vibes/card/components/VibeCard";

import { trackEvent } from "@/services/amplitude";

export default function PublicVibePage() {
  const { t } = useTranslation("vibe");
  const { id } = useParams();
  const { accessToken } = useAuth();
  const token = accessToken;

  const {
    vibe,
    loading,
    name,
    description,
    contacts,
    extraBlocks,
    visible,
    publicCode,
    subscriberVibeId,
  } = useVibeLoader(id, token);

  if (loading) {
    return (
      <PageLayout title={t("Vibe", { defaultValue: "Vibe" })}>
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </PageLayout>
    );
  }

  if (!vibe) {
    return (
      <PageLayout title={t("Vibe", { defaultValue: "Vibe" })}>
        <div className="alert alert-danger text-center my-4">
          {t("not_found", { defaultValue: "Not found" })}
        </div>
      </PageLayout>
    );
  }

  const commonProps = {
    t,
    vibe,
    name,
    description,
    contacts,
    extraBlocks,
    visible,
    publicCode,
    subscriberVibeId,
  };

  const vibeId = vibe?.id;

  return (
    <PageLayout title={t("Vibe", { defaultValue: "Vibe" })}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        {vibe.type === "BUSINESS" ? (
          <BusinessCustomerCard {...commonProps} />
        ) : (
          <VibeCard
            id={vibeId}
            name={name}
            description={description}
            photo={vibe?.photo}
            contacts={contacts}
            extraBlocks={extraBlocks}
            type={vibe?.type || "OTHER"}
            visible={visible}
            publicCode={publicCode}
            editMode={false}
            ownerActionsEnabled={false}
            shareEnabled={true}
            onShare={({ vibeId: vid, shareUrl }) => {
              trackEvent("Vibe Share Button Clicked", {
                vibeId: vid,
                location: "PublicVibePage",
                shareUrl,
                type: vibe?.type || "OTHER",
              });
            }}
          />
        )}
      </div>
    </PageLayout>
  );
}
