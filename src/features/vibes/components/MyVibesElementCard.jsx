// VibeCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/services/amplitude";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.23, type: "tween" }}
      className="vibe-card position-relative myvibe-card"
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleCardKeyDown}
      aria-label={vibe?.name || t("untitled")}
    >
      {/* Delete */}
      <div style={{ position: "absolute", top: 58, right: 12, zIndex: 12 }}>
        <button
          type="button"
          className="d-flex align-items-center delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(vibe.id);
          }}
          title={t("delete")}
          aria-label={t("delete")}
          style={{
            background: "rgba(248, 65, 65, 0.09)",
            border: "none",
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            padding: 8,
            cursor: "pointer",
            transition: "box-shadow .18s, background .18s, transform .13s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,70,70,0.18)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255, 70, 70, 0.09)")}
          onFocus={(e) => (e.currentTarget.style.background = "rgba(255,70,70,0.18)")}
          onBlur={(e) => (e.currentTarget.style.background = "rgba(255, 70, 70, 0.09)")}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
            <g>
              <rect x="6" y="8" width="1.3" height="5" rx="0.5" fill="#ff4747" />
              <rect x="9.35" y="8" width="1.3" height="5" rx="0.5" fill="#ff4747" />
              <rect x="12.7" y="8" width="1.3" height="5" rx="0.5" fill="#ff4747" />
              <path d="M4.5 6.5h11M8 6.5V5.5C8 4.67 8.67 4 9.5 4h1c.83 0 1.5.67 1.5 1.5v1" stroke="#ff4747" strokeWidth="1" />
              <rect x="5.5" y="6.5" width="9" height="10" rx="2" stroke="#ff4747" strokeWidth="1" />
            </g>
          </svg>
        </button>
      </div>

      {/* Share */}
      <div style={{ position: "absolute", top: 8, right: 12, zIndex: 12 }}>
        <button
          type="button"
          className="btn btn-light btn-sm d-flex align-items-center"
          style={{
            borderRadius: 20,
            boxShadow: "0 1px 4px #d6d7fc",
            fontWeight: 500,
            fontSize: 15,
            gap: 6,
            transition: "all .14s",
          }}
          onClick={(e) => {
            e.stopPropagation();
            trackEvent("Share Button Clicked", { location: "UserVibes", vibeId: vibe.id });
            onShare?.(vibe);
          }}
          title={t("share")}
          aria-label={t("share")}
        >
          <svg width="18" height="18" fill="none" stroke="#4154ff" strokeWidth="2" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="5" cy="10" r="2.1" />
            <circle cx="15" cy="5" r="2.1" />
            <circle cx="15" cy="15" r="2.1" />
            <path d="M6.7 9l5.6-3.2M6.7 11l5.6 3.2" />
          </svg>
          {t("share")}
        </button>
      </div>

      {/* Avatar */}
      <div className="d-flex justify-content-center mb-2 mt-1">
        {vibe?.photo && !imgErr ? (
          <img
            src={vibe.photo}
            alt={t("avatar_alt", { name: vibe?.name || t("untitled") })}
            loading="lazy"
            onError={() => setImgErr(true)}
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#f7f8fa",
              boxShadow: "0 1px 7px rgba(0,0,0,0.07)",
            }}
          />
        ) : (
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: "#eaf2ff",
              color: "#748cb3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 27,
              fontWeight: 700,
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
            aria-hidden="true"
          >
            {vibe?.name ? vibe.name[0].toUpperCase() : "?"}
          </div>
        )}
      </div>

      {/* Name + Type + Description */}
      <h5
        className="fw-semibold text-center mb-1"
        style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {vibe?.name || t("untitled")}
      </h5>

      <div
        style={{
          textAlign: "center",
          color: "#6574fd",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 8,
          letterSpacing: ".01em",
        }}
      >
        {typeLabel}
      </div>

      <p
        className="text-muted text-center mb-0"
        style={{
          fontSize: 14,
          lineHeight: "1.4",
          minHeight: 20,
          maxHeight: 46,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {vibe?.description || <span style={{ color: "#adb5bd" }}>{t("no_description")}</span>}
      </p>
    </motion.div>
  );
}
