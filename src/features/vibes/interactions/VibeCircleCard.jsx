// src/features/vibes/components/VibeCircleCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import SmartImage from "@/shared/ui/SmartImage";

export default function VibeCircleCard({ vibe }) {
  const navigate = useNavigate();

  const handleOpen = () => navigate(`/view/${vibe.id}`);
  const letter = (vibe?.name?.[0] || "?").toUpperCase();

  return (
    <div
      className="card mb-3 shadow-sm"
      style={{ borderRadius: "1rem", cursor: "pointer" }}
      onClick={handleOpen}
    >
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {/* Avatar */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              overflow: "hidden",
              flex: "0 0 auto",
              marginRight: 12,
            }}
          >
            <SmartImage
              src={vibe?.photo}
              alt="Vibe"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              fallback={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #e6f0fc 70%, #f6eaff 100%)",
                    color: "#748cb3",
                    fontWeight: 700,
                    fontSize: 22,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </div>
              }
            />
          </div>

          <div>
            <h6 className="mb-0 fw-semibold">{vibe?.name || "Vibe"}</h6>
            <small className="text-muted">{vibe?.type || "Vibe"}</small>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
        >
          Open
        </button>
      </div>
    </div>
  );
}
