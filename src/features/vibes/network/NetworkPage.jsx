import React from "react";
import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import NetworkTabs from "./NetworkTabs";
import "./network.css";

export default function NetworkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // If user opened /view/:id/network without subroute — redirect to followers
  const isRoot = location.pathname.endsWith(`/view/${id}/network`) || location.pathname.endsWith(`/network`);
  if (isRoot) {
    return <Navigate to="followers" replace />;
  }

  const active =
    location.pathname.includes("/following") ? "following" : "followers";

  return (
    <div className="network-page">
      <div className="network-page__top">
        <button
          type="button"
          className="network-page__back"
          onClick={() => navigate(-1)}
          aria-label="Back"
          title="Back"
        >
          ←
        </button>

        <div className="network-page__titleWrap">
          <div className="network-page__title">Network</div>
          <div className="network-page__subtitle">Vibe</div>
        </div>
      </div>

      <NetworkTabs
        active={active}
        onFollowers={() => navigate("followers")}
        onFollowing={() => navigate("following")}
      />

      <div className="network-page__content">
        <Outlet />
      </div>
    </div>
  );
}