import React, { useMemo } from "react";
import CONTACT_TYPES from "@/data/contactTypes";
import iconMap from "@/data/contactIcons";
import { FaGlobe } from "react-icons/fa";
import "./ContactTypePanel.css";

export default function ContactTypePanel({
  contacts = [],
  onToggleType,

  mode = "toggle",
  typeIndex = null,

  title = "Contacts",
  subtitle = "Click to add/remove",
}) {
  const activeMap = useMemo(() => {
    const m = new Map();
    (contacts || []).forEach((c, idx) => {
      if (c?.type && !m.has(c.type)) m.set(c.type, idx);
    });
    return m;
  }, [contacts]);

  const currentTypeKey =
    mode === "pick" && Number.isInteger(typeIndex)
      ? (contacts?.[typeIndex]?.type ?? null)
      : null;

  return (
    <aside className="ctp">
      <div className="ctp__head">
        <div className="ctp__title">{title}</div>
        <div className="ctp__sub">{subtitle}</div>
      </div>

      <div className="ctp__grid">
        {CONTACT_TYPES.map((type) => {
          const isActive = activeMap.has(type.key);

          const isSameAsCurrent = currentTypeKey === type.key;

          const disabled =
            mode === "pick" && (isSameAsCurrent || (isActive && !isSameAsCurrent));

          const Icon = iconMap[type.key] || <FaGlobe />;

          const metaText =
            mode === "pick"
              ? isSameAsCurrent
                ? "Current"
                : isActive
                ? "Already used"
                : "Select"
              : isActive
              ? "Added"
              : "Add";

          return (
            <button
              key={type.key}
              type="button"
              className={`ctp__tile ${isActive ? "is-active" : ""} ${
                disabled ? "is-disabled" : ""
              }`}
              onClick={() => {
                if (disabled) return;
                onToggleType?.(type.key);
              }}
              disabled={disabled}
              aria-disabled={disabled}
              aria-pressed={isActive}
              title={
                disabled
                  ? isSameAsCurrent
                    ? "Already selected"
                    : "This type is already used"
                  : mode === "pick"
                  ? "Select"
                  : isActive
                  ? "Remove"
                  : "Add"
              }
            >
              <div className="ctp__icon">{Icon}</div>
              <div className="ctp__label">{type.label}</div>
              <div className="ctp__meta">{metaText}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}