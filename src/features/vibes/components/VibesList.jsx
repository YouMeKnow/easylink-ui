import React from "react";
import MyVibesElementCard from "./MyVibesElementCard";

export default function VibesList({ vibes, onDelete, onShare }) {
  return (
    <div className="position-relative" style={{ minHeight: 340 }}>
      <div
        className="d-flex flex-wrap justify-content-center"
        style={{
          maxWidth: 980,
          margin: "0 auto",
          gap: "24px 20px",
        }}
      >
        {vibes.map((vibe) => (
          <div key={vibe.id} style={{ flex: "0 1 260px" }}>
            <MyVibesElementCard
              vibe={vibe}
              onDelete={() => onDelete(vibe.id)}
              onShare={() => onShare(vibe)}
            />
          </div>
        ))}    
      </div>
    </div>
  );
}
