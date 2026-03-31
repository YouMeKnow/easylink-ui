import React from "react";
import MyVibesElementCard from "./MyVibesElementCard";

export default function VibesList({ vibes, onDelete, onShare }) {
  return (
    <>
      {vibes.map((vibe, idx) => (
        <div
          key={`${vibe.id ?? "noid"}-${idx}`}
          className="profile__vibe-item"
          role="listitem"
        >
          <MyVibesElementCard
            vibe={vibe}
            onDelete={() => onDelete(vibe.id)}
            onShare={() => onShare(vibe)}
          />
        </div>
      ))}
    </>
  );
}