import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFollowing from "./useFollowing";
import VibeCircleGrid from "./VibeCircleGrid";

export default function MyCircle() {
  const { t } = useTranslation("interactions");
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");
  const following = useFollowing(id, token);

  return (
    <div className="container py-5" style={{ maxWidth: 980 }}>
      {/* header */}
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          {t("back")}
        </button>

        <div className="text-center grow">
          <h2 className="fw-bold mb-0">{t("myCircle")}</h2>
          <div className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>
            {t("sections.following")} · {Array.isArray(following) ? following.length : 0}
          </div>
        </div>
        <div style={{ width: 88 }} />
      </div>

      {/* content */}
      <div
        className="p-4 shadow-sm"
        style={{
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
        <VibeCircleGrid vibes={following} t={t} />
      </div>
    </div>
  );
}
