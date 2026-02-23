import React from "react";
import ExtraBlockView from "@/components/InfoBlocks/ExtraBlock";
import HoursBlock from "@/components/InfoBlocks/HoursBlock";
import ConfirmModal from "@/features/vibes/components/modals/ConfirmModal";
import { FiX, FiPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./ExtraBlocksList.css";

function isHours(block) {
  return String(block?.type || "").toLowerCase() === "hours";
}
function isBirthday(block) {
  return String(block?.type || "").toLowerCase() === "birthday";
}

const BlockCard = React.memo(function BlockCard({
  block,
  editMode,
  value,
  inputType,
  onChange,
  onRemove,
}) {
  const typeKey = String(block?.type || "").toLowerCase();

  return (
    <div className={`extra-chip extra-chip--${typeKey}`}>
      <div className="extra-chip__inner">
        <div className="extra-chip__head">
          <div className="extra-chip__title">{block?.label || "Field"}</div>

          {editMode && (
            <button
              type="button"
              className="extra-remove"
              onClick={onRemove}
              aria-label="Remove"
              title="Remove"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <input
          type={inputType}
          maxLength={120}
          className="form-control extra-chip__input"
          placeholder={block?.placeholder || ""}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
});

export default function ExtraBlocksList({
  extraBlocks = [],
  editMode = false,
  onBlockChange,
  onBlockRemove,
  onOpenBlockPicker,
}) {
  const { t } = useTranslation("extra_block");
  const [confirmIdx, setConfirmIdx] = React.useState(null);

  if (!extraBlocks?.length && !editMode) return null;

  return (
    <>
      {!!extraBlocks?.length && (
        <div className="extra-grid">
          {extraBlocks.map((block, i) => {
            const key = block.id || `${block.type || "extra"}-${i}`;

            // VIEW MODE
            if (!editMode) {
              return (
                <div key={key} className="extra-view-wrap">
                  <ExtraBlockView block={block} />
                </div>
              );
            }

            // EDIT MODE: hours special
            if (isHours(block)) {
              return (
                <div key={key} className="extra-chip extra-chip--hours">
                  <div className="extra-chip__inner">
                    <div className="extra-chip__head">
                      <div className="extra-chip__title">
                        {block?.label || t("hours", { defaultValue: "Hours" })}
                      </div>

                      <button
                        type="button"
                        className="extra-remove"
                        onClick={() => setConfirmIdx(i)}
                        aria-label="Remove"
                        title="Remove"
                      >
                        <FiX size={14} />
                      </button>
                    </div>

                    <HoursBlock
                      value={block.value || {}}
                      onChange={(val) => onBlockChange?.(i, val)}
                      onRemove={() => setConfirmIdx(i)}
                    />
                  </div>
                </div>
              );
            }

            // EDIT MODE: birthday/text
            const inputType = isBirthday(block) ? "date" : "text";
            const value = block.value ?? "";

            return (
              <BlockCard
                key={key}
                block={block}
                editMode={editMode}
                inputType={inputType}
                value={value}
                onChange={(v) => onBlockChange?.(i, v)}
                onRemove={() => setConfirmIdx(i)}
              />
            );
          })}
        </div>
      )}

      {editMode && (
        <div className="extra-add-wrapper">
          <button
            type="button"
            onClick={() => onOpenBlockPicker?.(null)}
            className="extra-add-tile"
          >
            <FiPlus size={14} />
            <span>{t("add", { defaultValue: "Add info" })}</span>
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmIdx != null}
        title={t("remove_title", { defaultValue: "Remove info" })}
        message={t("remove_msg", { defaultValue: "Are you sure you want to remove this block?" })}
        cancelText={t("cancel", { defaultValue: "Cancel" })}
        confirmText={t("remove", { defaultValue: "Remove" })}
        danger
        onClose={() => setConfirmIdx(null)}
        onConfirm={() => {
          onBlockRemove?.(confirmIdx);
          setConfirmIdx(null);
        }}
      />
    </>
  );
}