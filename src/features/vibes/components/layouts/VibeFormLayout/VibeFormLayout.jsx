import React from "react";
import "./VibeFormLayout.css";

export default function VibeFormLayout({
  maxWidth = 1200,
  paddingX = 20,

  topActions = null,

  right = null,
  rightOpen = false,
  rightWidth = 320,
  gap = 12,

  children,
}) {
  return (
    <div
      className="vfl"
      style={{
        maxWidth,
        paddingLeft: paddingX,
        paddingRight: paddingX,
      }}
    >
      {topActions ? <div className="vfl__top">{topActions}</div> : null}

      <div
        className="vfl__grid"
        data-right-open={rightOpen ? "1" : "0"}
        style={{
          "--vfl-right": `${rightWidth}px`,
          "--vfl-gap": `${gap}px`,
        }}
      >
        <div className="vfl__main">{children}</div>
        <div className="vfl__right">{right}</div>
      </div>
    </div>
  );
}