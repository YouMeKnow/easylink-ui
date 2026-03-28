import React from "react";
import "./CenterModal.css";

export default function CenterModal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="cm" role="dialog" aria-modal="true">
      <button className="cm__backdrop" onClick={onClose} aria-label="Close" />
      <div className="cm__panel">
        {title ? <div className="cm__title">{title}</div> : null}
        <div className="cm__body">{children}</div>
      </div>
    </div>
  );
}