import React from "react";
import VibeCircleCard from "./VibeCircleCard";

function normalizeVibe(item) {
  const id =
    item.id ||
    item.vibeId ||
    item.targetVibeId ||
    item.targetVibe?.id ||
    item.vibe?.id;

  const name = item.name || item.targetVibe?.name || item.vibe?.name || "Vibe";
  const type = item.type || item.targetVibe?.type || item.vibe?.type || "";
  const photo = item.photo || item.targetVibe?.photo || item.vibe?.photo || null;

  return { id, name, type, photo };
}

export default function VibeCircleList({ vibes = [], t }) {
  const list = Array.isArray(vibes)
    ? vibes.map(normalizeVibe).filter((v) => !!v.id)
    : [];

  if (list.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        {t("empty.circle") || "Your Vibe Circle is empty."}
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {list.map((v) => (
        <VibeCircleCard key={v.id} vibe={v} />
      ))}
    </div>
  );
}
