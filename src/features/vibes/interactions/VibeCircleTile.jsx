import React from "react";
import { useNavigate } from "react-router-dom";
import SmartImage from "@/shared/ui/SmartImage";
import "./VibeCircleTile.css";

export default function VibeCircleTile({ vibe, t, actions = null }) {
  const navigate = useNavigate();
  const letter = (vibe?.name?.[0] || "?").toUpperCase();
  const hasActions = !!actions;

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
      className="vc-tile"
      aria-label={vibe?.name || "Vibe"}
    >
      <div className="vc-tile__top">
        <div className="vc-tile__main">
          <div className="vc-avatar">
            <SmartImage
              src={vibe?.photo}
              alt={t?.("avatar_alt", { name: vibe?.name }) || "Vibe"}
              className="vc-avatar__img"
              fallback={
                <div className="vc-avatar__fallback" aria-hidden="true">
                  {letter}
                </div>
              }
            />
          </div>

          <div className="vc-tile__content">
            <div className="vc-tile__name">
              {vibe?.name || "Vibe"}
            </div>

            <div className="vc-tile__meta">
              {vibe?.type ? (
                <span className="vc-typePill">{String(vibe.type).toLowerCase()}</span>
              ) : null}
            </div>
          </div>
        </div>

        {!hasActions && (
          <div className="vc-chevron" aria-hidden="true">
            →
          </div>
        )}
      </div>

      {vibe?.description ? (
        <div className="vc-desc">{vibe.description}</div>
      ) : (
        <div className="vc-desc vc-desc--empty" />
      )}

      {hasActions && (
        <div
          className="vc-tileActions vc-tileActions--footer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
}