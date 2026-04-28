import React from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/services/amplitude";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SmartImage from "@/shared/ui/SmartImage";
import "../styles/UserVibes.css";

export default function MyVibesElementCard({ vibe, onDelete, onShare }) {
  const navigate = useNavigate();
  const { t } = useTranslation("myvibes"); // scoped ns
  const [imgErr, setImgErr] = React.useState(false);

  const handleOpen = () => {
    trackEvent("Open Vibe", { location: "UserVibes", vibeId: vibe.id });
    navigate(`/vibes/${vibe.id}`);
  };

  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  const typeLabel =
    (vibe?.type && t(`types.${vibe.type}`, vibe.type)) ||
    (vibe?.type ? vibe.type.charAt(0).toUpperCase() + vibe.type.slice(1) : "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="myvibe-card"
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleCardKeyDown}
      aria-label={vibe?.name || t("untitled")}
    >
      <div className="myvibe-card__top">
        <div className="myvibe-card__avatar-box">
          {vibe?.photo && !imgErr ? (
            <SmartImage
              src={vibe.photo}
              alt={vibe.name}
              className="myvibe-card__avatar"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="myvibe-card__avatar-placeholder">
              {vibe?.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div className="myvibe-card__quick-actions">
          <button
            type="button"
            className="myvibe-card__icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              trackEvent("Share Button Clicked", { location: "UserVibes", vibeId: vibe.id });
              onShare?.(vibe);
            }}
            title={t("share")}
            aria-label={t("share")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, display: 'block' }}>
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          <button
            type="button"
            className="myvibe-card__icon-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(vibe.id);
            }}
            title={t("delete")}
            aria-label={t("delete")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, display: 'block' }}>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <div className="myvibe-card__info">
        <h5 className="myvibe-card__name">
          {vibe?.name || t("untitled")}
        </h5>
        <p className="myvibe-card__description">
          {vibe?.description || t("no_description")}
        </p>
        <div className="myvibe-card__badge">
          {typeLabel}
        </div>
      </div>
    </motion.div>
  );
}
