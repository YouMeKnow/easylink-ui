import React, { useMemo } from "react";
import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import NetworkTabs from "./NetworkTabs";
import "./network.css";

import { useAuth } from "@/context/AuthContext";
import useVibeLoader from "@/features/vibes/hooks/useVibeLoader";

export default function NetworkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("interactions");

  const { accessToken } = useAuth();
  const token =
    accessToken ??
    (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);

  const { vibe, loading } = useVibeLoader(id, token);

  const isRoot = useMemo(() => {
    const p = location.pathname;
    return p === `/view/${id}/network` || p.endsWith(`/view/${id}/network`);
  }, [location.pathname, id]);

  const active = useMemo(() => {
    const p = location.pathname;
    if (p.includes("/requests")) return "requests";
    if (p.includes("/following")) return "following";
    return "followers";
  }, [location.pathname]);

  const isOwner = useMemo(() => vibe?.owner === true, [vibe]);

  const showRequestsTab = useMemo(() => {
    if (!vibe) return false;

    const isPrivate = String(vibe?.privacy || "PUBLIC") === "PRIVATE";
    const approval = String(vibe?.subscribeMode || "OPEN") === "APPROVAL";

    return isOwner && isPrivate && approval;
  }, [vibe, isOwner]);

  if (isRoot) return <Navigate to="followers" replace />;

  return (
    <div className="network-page">
      <header className="network-header">
        <button
          type="button"
          className="back-btn"
          aria-label={t("network.back", { defaultValue: "Back" })}
          title={t("network.back", { defaultValue: "Back" })}
          onClick={() => {
            if (window.history.length > 1) navigate(-1);
            else navigate(`/view/${id}`);
          }}
        />

        <div className="network-title">
          {t("network.title", { defaultValue: "Network" })}
        </div>

        <div className="network-header-spacer" aria-hidden="true" />
      </header>

      <section className="network-switcher-section">
        <NetworkTabs
          active={active}
          followersLabel={t("network.tabs.followers", { defaultValue: "Followers" })}
          followingLabel={t("network.tabs.following", { defaultValue: "Following" })}
          requestsLabel={t("network.tabs.requests", { defaultValue: "Requests" })}
          showRequests={showRequestsTab}
          onFollowers={() => navigate("followers", { replace: true })}
          onFollowing={() => navigate("following", { replace: true })}
          onRequests={() => navigate("requests", { replace: true })}
          loading={loading}
        />
      </section>

      <main className="network-content">
        <Outlet context={{ vibe, showRequestsTab, isOwner }} />
      </main>
    </div>
  );
}