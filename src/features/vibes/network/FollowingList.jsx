import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFollowing } from "@/features/vibes/interactions/hooks/useFollowing";
import VibeCircleGrid from "@/features/vibes/interactions/VibeCircleGrid";

export default function FollowingList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("interactions");

  const { items, loading, error } = useFollowing({ vibeId: id });

  return (
    <div className="container py-5" style={{ maxWidth: 980 }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          {t("back", { defaultValue: "Back" })}
        </button>

        <div className="text-center">
          <h2 className="fw-bold mb-0">
            {t("Following", { defaultValue: "Following" })}
          </h2>
          <div className="text-muted" style={{ fontSize: 13 }}>
            {items.length}
          </div>
        </div>

        <div style={{ width: 88 }} />
      </div>

      {loading && <div className="text-center py-5">Loading...</div>}
      {error && <div className="text-danger text-center">{error}</div>}

      {!loading && !error && (
        <VibeCircleGrid vibes={items} t={t} />
      )}
    </div>
  );
}