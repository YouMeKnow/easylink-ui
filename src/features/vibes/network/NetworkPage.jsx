import React, { useMemo } from "react";
import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NetworkTabs from "./NetworkTabs";
import "./network.css";

export default function NetworkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("interactions");

  const isRoot = useMemo(() => {
    const p = location.pathname;
    return p === `/view/${id}/network` || p.endsWith(`/view/${id}/network`);
  }, [location.pathname, id]);

  if (isRoot) return <Navigate to="followers" replace />;

  const active = location.pathname.includes("/following") ? "following" : "followers";

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
        <div className="network-title">{t("network.title", { defaultValue: "Network" })}</div>

        <NetworkTabs
          active={active}
          followersLabel={t("network.tabs.followers", { defaultValue: "Followers" })}
          followingLabel={t("network.tabs.following", { defaultValue: "Following" })}
          onFollowers={() => navigate("followers", { replace: true })}
          onFollowing={() => navigate("following", { replace: true })}
        />
      </header>

      <main className="network-content">
        <Outlet />
      </main>
    </div>
  );
}