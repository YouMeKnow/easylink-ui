// src/features/vibes/pages/PublicVibePage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/context/AuthContext";
import useVibeLoader from "@/features/vibes/hooks/useVibeLoader";

import BusinessCustomerCard from "@/features/vibes/components/BusinessCustomerCard";
import VibeCard from "@/features/vibes/card/components/VibeCard";
import PublicSubscribePanel from "@/features/profile/components/PublicSubscribePanel";
import PrivateVibeContent from "@/features/vibes/tools/PrivateVibeContent";
import BackButton from "@/components/common/BackButton";

import "@/features/vibes/styles/PublicVibePage.css";
import "@/features/vibes/styles/VibePage.css";

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
      <div className="route-shell">
        <div className="container py-4 vibe-container">
          <header className="vibe-topbar">
            <div className="vibe-topbar__left">
              <BackButton
                className="btn-secondary btn-compact"
                onClick={() => {
                  if (window.history.length > 1) navigate(-1);
                  else navigate("/");
                }}
                label={
                  <>
                    <span className="btn-text-full">
                      {t("back", { defaultValue: "Back" })}
                    </span>
                    <span className="btn-text-short">
                      {t("back_short", { defaultValue: "Back" })}
                    </span>
                  </>
                }
              />
            </div>

            <div className="vibe-topbar__right" />
          </header>

          <div className="public-loading">
            <div
              className="spinner-border public-spinner"
              role="status"
              aria-label={t("loading", { defaultValue: "Loading" })}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!vibe) {
    return (
      <div className="route-shell">
        <div className="container py-4 vibe-container">
          <header className="vibe-topbar">
            <div className="vibe-topbar__left">
              <BackButton
                className="btn-secondary btn-compact"
                onClick={() => {
                  if (window.history.length > 1) navigate(-1);
                  else navigate("/");
                }}
                label={
                  <>
                    <span className="btn-text-full">
                      {t("back", { defaultValue: "Back" })}
                    </span>
                    <span className="btn-text-short">
                      {t("back_short", { defaultValue: "Back" })}
                    </span>
                  </>
                }
              />
            </div>

            <div className="vibe-topbar__right" />
          </header>

          <div className="alert alert-danger text-center my-4">
            {t("not_found", { defaultValue: "Not found" })}
          </div>
        </div>
      </div>
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
    <div className="route-shell">
      <div className="container py-4 vibe-container">
        <header className="vibe-topbar">
          <div className="vibe-topbar__left">
            <BackButton
              to={-1}
              className="btn-secondary btn-compact"
              label={
                <>
                  <span className="btn-text-full">{t("back_short")}</span>
                  <span className="btn-text-short">{t("back_short")}</span>
                </>
              }
            />
          </div>

          <div className="vibe-topbar__right" />
        </header>

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
      </div>
    </div>
  );
}