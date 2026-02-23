import React from "react";
import PERSONAL_INFO_BLOCKS from "@/data/personalInfoBlocks";

export default function PersonalInfoBlockModal({ extraBlocks = [], onSelect, onClose }) {
  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{
        background: "rgba(0, 0, 0, 0.25)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1010,
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Choose Info Block</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body d-flex flex-wrap gap-2">
            {PERSONAL_INFO_BLOCKS.map((block) => (
              <button
                key={block.key}
                className="btn btn-light"
                style={{
                  minWidth: 110,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
                onClick={() => onSelect(block)}
                disabled={extraBlocks.some((b) => b.type === block.key)}
              >
                {block.label}
              </button>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary w-100" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
