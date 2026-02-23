import React, { useEffect, useMemo, useRef } from "react";
import CONTACT_TYPES from "@/data/contactTypes";
import iconMap from "@/data/contactIcons";
import { FaGlobe } from "react-icons/fa";
import "./styles/ContactTypeModal.css";

export default function ContactTypeModal({ contacts = [], onSelect, onClose }) {
  const dialogRef = useRef(null);

  const disabledSet = useMemo(() => {
    return new Set((contacts || []).map((c) => c.type));
  }, [contacts]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setTimeout(() => dialogRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const onBackdropDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="ctm-backdrop" onMouseDown={onBackdropDown}>
      <div
        className="ctm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ctm-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="ctm-card">
          <div className="ctm-header">
            <div>
              <div className="ctm-title" id="ctm-title">
                Choose Contact Type
              </div>
              <div className="ctm-subtitle">Pick one to add it to your vibe</div>
            </div>

            <button
              type="button"
              className="ctm-x"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="ctm-body">
            <div className="ctm-grid">
              {CONTACT_TYPES.map((type) => {
                const isDisabled = disabledSet.has(type.key);

                return (
                  <button
                    key={type.key}
                    type="button"
                    className={`ctm-tile ${isDisabled ? "is-disabled" : ""}`}
                    onClick={() => onSelect?.(type.key)}
                    disabled={isDisabled}
                  >
                    <div className="ctm-icon">
                      {iconMap[type.key] || <FaGlobe />}
                    </div>

                    <div className="ctm-label">{type.label}</div>

                    {isDisabled && <div className="ctm-badge">Added</div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ctm-footer">
            <button className="ctm-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
