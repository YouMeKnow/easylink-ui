import React from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/services/amplitude";
import { motion } from "framer-motion";
import SmartImage from "@/shared/ui/SmartImage";


import "@/features/vibes/components/MyVibesElementCard.css";

export default function PublicVibeCard({ vibe, to }) {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = React.useState(false);

  const handleOpen = () => {
    const dest = to || `/view/${vibe?.id}`;
    trackEvent("Open Vibe", { location: "SubscribersModal", vibeId: vibe?.id });
    navigate(dest);
  };

  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  const typeLabel = vibe?.type
    ? vibe.type.charAt(0).toUpperCase() + vibe.type.slice(1)
    : "";

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
      aria-label={vibe?.name || "Vibe"}
    >
      {/* Avatar */}
      <div className="d-flex justify-content-center mb-2 mt-1">
        {vibe?.photo && !imgErr ? (
          <SmartImage
            src={vibe.photo}
            alt={vibe?.name || "Vibe"}
            fallback={
              <div className="avatar-fallback">
                {vibe?.name?.[0]?.toUpperCase() || "?"}
              </div>
            }
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              objectFit: "cover",
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
        {vibe?.name || "Untitled"}
      </h5>

      {typeLabel && (
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
      )}

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
        {vibe?.description || <span style={{ color: "#adb5bd" }}>No description</span>}
      </p>
    </motion.div>
  );
}
