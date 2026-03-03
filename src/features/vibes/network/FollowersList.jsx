import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSubscribers } from "@/features/vibes/interactions/hooks/useSubscribers";
import VibeCircleGrid from "@/features/vibes/interactions/VibeCircleGrid";

export default function FollowersList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("interactions");

  const { items, loading, error } = useSubscribers({ vibeId: id });

  return (
    <div className="container py-5" style={{ maxWidth: 980 }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="text-center">
          <h2 className="fw-bold mb-0">
            {t("followers", { defaultValue: "Followers" })}
          </h2>
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