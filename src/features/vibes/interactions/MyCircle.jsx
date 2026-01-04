import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFollowing from "./useFollowing";
import VibeCircleList from "./VibeCircleList";

export default function MyCircle() {
  const { t } = useTranslation("interactions");
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  const following = useFollowing(id, token);

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>
       <h2 className="fw-bold mx-auto mb-0">
        {t("myCircle")}
      </h2>
      </div>

      {/* Content */}
      <div className="card p-4 shadow" style={{ borderRadius: 18 }}>
        <h5 className="mb-3" style={{ color: "#476dfe" }}>
          {t("sections.following")}
        </h5>
        <VibeCircleList vibes={following} t={t} />
      </div>
    </div>
  );
}
