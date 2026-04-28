import React, { useMemo } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { usePendingRequests } from "@/features/vibes/network/hooks/usePendingRequests";
import VibeCircleGrid from "@/features/vibes/interactions/VibeCircleGrid";

import "@/features/vibes/network/RequestsList.css";

export default function RequestsList() {
  const { id } = useParams();
  const { t } = useTranslation("interactions");
  const { isOwner } = useOutletContext();

  const { items, loading, error, approve, reject } = usePendingRequests({ vibeId: id });

  const vibesForGrid = useMemo(() => {
    const arr = Array.isArray(items) ? items : [];
    return arr.map((r) => ({
      id: r?.subscriberVibeId || r?.subscriberVibe?.id || r?.targetVibeId || r?.id,
      interactionId: r?.interactionId,
      targetVibe: {
        id: r?.subscriberVibeId || r?.subscriberVibe?.id,
        name: r?.subscriberName || r?.subscriberVibe?.name || "",
        type: r?.subscriberType || r?.subscriberVibe?.type || "",
        photo: r?.subscriberPhoto || r?.subscriberVibe?.photo || null,
        description: r?.subscriberDescription || r?.subscriberVibe?.description || "",
      },
    }));
  }, [items]);

  if (!isOwner) {
    return (
      <div className="py-5 text-center text-muted">
        {t("requests_owner_only", { defaultValue: "Only the owner can view requests." })}
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold mb-1">{t("requests", { defaultValue: "Requests" })}</h2>
          <div className="requests-hint">
            {t("requests_hint", {
              defaultValue: "People requesting access to your private vibe."
            })}
          </div>
      </div>

      {loading && <div className="text-center py-5">Loading...</div>}
      {error && <div className="text-danger text-center">{error}</div>}

      {!loading && !error && (
        <VibeCircleGrid
          vibes={vibesForGrid}
          t={t}
          renderActions={(v) => (
          <div
            className="request-actions"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              className="request-btn request-btn--reject"
              onClick={() => reject(v.interactionId)}
            >
              {t("reject", { defaultValue: "Reject" })}
            </button>

            <button
              type="button"
              className="request-btn request-btn--approve"
              onClick={() => approve(v.interactionId)}
            >
              {t("approve", { defaultValue: "Approve" })}
            </button>
          </div>
        )}
        />
      )}
    </div>
  );
}