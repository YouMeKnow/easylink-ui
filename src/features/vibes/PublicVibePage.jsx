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

import { Instagram, Youtube, MessageCircle, Globe, Lock } from "lucide-react";

import "@/features/vibes/styles/PublicVibePage.css";

function FakeContactsRow({ style = {} }) {
  const iconStyle = { opacity: 0.85 };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 14,
        flexWrap: "wrap",
        maxWidth: 240,
        margin: "0 auto",
        ...style,
      }}
      aria-hidden="true"
    >
      <Instagram size={22} style={iconStyle} />
      <MessageCircle size={22} style={iconStyle} />
      <Youtube size={22} style={iconStyle} />
      <Globe size={22} style={iconStyle} />
      <Instagram size={22} style={{ ...iconStyle, opacity: 0.55 }} />
    </div>
  );
}

function PrivateVibeCard({ t, vibeId, vibe, name, description, visible, publicCode }) {
  return (
    <div style={{ position: "relative" }}>
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
        shareEnabled={false}
      />

      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 14,
          height: 190,              
          borderRadius: 18,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        {/* fake contacts behind blur */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 92,
            opacity: 0.7,
            display: "grid",
            placeItems: "center",
          }}
          aria-hidden="true"
        >
          <FakeContactsRow />
        </div>

        {/* blur layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.68)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        />

        {/* text layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: 18,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              marginBottom: 10,
              background: "rgba(71,109,254,0.10)",
              border: "1px solid rgba(71,109,254,0.14)",
              color: "#476dfe",
              boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
            }}
            aria-hidden="true"
          >
            <Lock size={20} />
          </div>

          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
            {t("private_vibe", { defaultValue: "Private Vibe" })}
          </div>

          <div style={{ fontSize: 13, color: "#6c757d", maxWidth: 320, lineHeight: 1.35 }}>
            {t("private_hint", {
              defaultValue: "Request access to view contacts and other details.",
            })}
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#6c757d", opacity: 0.9 }}>
            {t("private_hint_sub", { defaultValue: "Once approved, you’ll see full profile info." })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicVibePage() {
  const { t } = useTranslation("vibe");
  const { id } = useParams();
  const navigate = useNavigate();

  const { accessToken } = useAuth();
  const token =
    accessToken ?? (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);

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
              <PrivateVibeCard
                t={t}
                vibeId={vibeId}
                vibe={vibe}
                name={name}
                description={description}
                visible={visible}
                publicCode={publicCode}
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
            subscriptionStatus={vibe?.mySubscriptionStatus || null} // "APPROVED" | "PENDING" | null
          />
        </aside>
      </div>
    </PageLayout>
  );
}