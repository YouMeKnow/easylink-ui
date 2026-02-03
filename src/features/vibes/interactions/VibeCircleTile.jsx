import React from "react";
import { useNavigate } from "react-router-dom";
import SmartImage from "@/shared/ui/SmartImage";

export default function VibeCircleTile({ vibe, t }) {
  const navigate = useNavigate();
  const letter = (vibe?.name?.[0] || "?").toUpperCase();

  const open = () => navigate(`/view/${vibe.id}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className="shadow-sm"
      style={{
        borderRadius: 18,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(10px)",
        padding: 14,
        cursor: "pointer",
        transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.10)";
        e.currentTarget.style.borderColor = "rgba(71,109,254,0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
      }}
      aria-label={vibe?.name || "Vibe"}
    >
      {/* top row */}
      <div className="d-flex align-items-start justify-content-between gap-2">
        <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
          {/* avatar */}
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              overflow: "hidden",
              flex: "0 0 auto",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.8)",
            }}
          >
            <SmartImage
              src={vibe?.photo}
              alt={t?.("avatar_alt", { name: vibe?.name }) || "Vibe"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              fallback={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    background:
                      "linear-gradient(135deg, rgba(71,109,254,.18), rgba(160,115,255,.18))",
                    color: "#476dfe",
                    fontWeight: 800,
                    fontSize: 20,
                    userSelect: "none",
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </div>
              }
            />
          </div>

          {/* title */}
          <div style={{ minWidth: 0 }}>
            <div
              className="fw-semibold"
              style={{
                fontSize: 16,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {vibe?.name || "Vibe"}
            </div>

            <div className="d-flex align-items-center gap-2 mt-1">
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#476dfe",
                  background: "rgba(71,109,254,0.10)",
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(71,109,254,0.14)",
                  textTransform: "capitalize",
                }}
              >
                {vibe?.type || "vibe"}
              </span>
            </div>
          </div>
        </div>

        {/* chevron */}
        <div
          aria-hidden="true"
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            color: "#476dfe",
            background: "rgba(71,109,254,0.10)",
            border: "1px solid rgba(71,109,254,0.14)",
            flex: "0 0 auto",
          }}
        >
          →
        </div>
      </div>

      {/* description (optional) */}
      {vibe?.description ? (
        <div
          className="text-muted"
          style={{
            fontSize: 13,
            marginTop: 10,
            lineHeight: 1.35,
            maxHeight: 36,
            overflow: "hidden",
          }}
        >
          {vibe.description}
        </div>
      ) : (
        <div style={{ height: 10 }} />
      )}
    </div>
  );
}
