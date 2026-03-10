// src/features/vibes/pages/PublicVibePage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PageLayout from "@/components/common/PageLayout";
import { useAuth } from "@/context/AuthContext";

import useVibeLoader from "@/features/vibes/hooks/useVibeLoader";

import BusinessCustomerCard from "@/features/vibes/components/BusinessCustomerCard";
import VibeCard from "@/features/vibes/card/components/VibeCard";
import PublicSubscribePanel from "@/features/profile/components/PublicSubscribePanel";
import PrivateVibeContent from "@/features/vibes/tools/PrivateVibeContent";

import "@/features/vibes/styles/PublicVibePage.css";

export default function PublicVibePage() {
  const { t } = useTranslation("vibe");
  const { id } = useParams();
  const navigate = useNavigate();

  const { accessToken } = useAuth();
  const token =
    accessToken ??
    (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);

  const authed = Boolean(token);

  const {
    vibe,
    loading,
    name,
    description,
    contacts,
    extraBlocks,
    visible,
    publicCode,
    subscriberVibes,
    subscriberCount,
    followingCount,
    reload,
  } = useVibeLoader(id, token, "public");

  if (loading) {
    return (
      <PageLayout title={t("Vibe", { defaultValue: "Vibe" })}>
        <div className="public-loading">
          <div
            className="spinner-border public-spinner"
            role="status"
            aria-label={t("loading", { defaultValue: "Loading" })}
          />
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

  const vibeId = vibe?.id;
  const noAccess = vibe?.hasAccess === false;

  const commonProps = {
    t,
    vibe,
    name,
    description,
    contacts,
    extraBlocks,
    visible,
    publicCode,
  };

  return (
    <PageLayout
      title={t("Vibe", { defaultValue: "Vibe" })}
      left={
        <button
          type="button"
          className="back-btn"
          aria-label={t("back", { defaultValue: "Back" })}
          title={t("back", { defaultValue: "Back" })}
          onClick={() => {
            if (window.history.length > 1) navigate(-1);
            else navigate("/");
          }}
        />
      }
    >
      <div className="public-vibe-layout">
        <div className="public-vibe-layout__main">
          <main className="public-vibe-layout__card">
            {noAccess ? (
              <VibeCard
                id={vibeId}
                name={name}
                description={description}
                photo={vibe?.photo}
                contacts={[]}
                extraBlocks={[]}
                type={vibe?.type || "OTHER"}
                visible={visible}
                publicCode={publicCode}
                editMode={false}
                ownerActionsEnabled={false}
                shareEnabled={true}
                cardBody={
                  <PrivateVibeContent
                    name={name}
                    description={description}
                    photo={vibe?.photo}
                    type={vibe?.type || "OTHER"}
                  />
                }
              />
            ) : vibe.type === "BUSINESS" ? (
              <BusinessCustomerCard
                {...commonProps}
                subscriberVibes={subscriberVibes}
                onRefresh={reload}
              />
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
              />
            )}
          </main>
        </div>

        <aside className="public-vibe-layout__side">
          <PublicSubscribePanel
            t={t}
            vibeId={vibeId}
            subscriberCount={subscriberCount}
            subscriberVibes={subscriberVibes}
            authed={authed}
            followingCount={followingCount}
            onRefresh={reload}
            hasAccess={!noAccess}
            subscriptionStatus={vibe?.mySubscriptionStatus || null}
          />
        </aside>
      </div>
    </PageLayout>
  );
}