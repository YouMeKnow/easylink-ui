import React from "react";
import { useTranslation } from "react-i18next";
import "./styles/InfoBlockTypeModal.css";

const normalizeKey = (k) => String(k || "").trim().toLowerCase();

export default function InfoBlockTypeModal({
  titleKey = "picker_title",     
  title,                         
  types = [],
  extraBlocks = [],
  onSelect,
  onClose,
  singletons = ["hours"],
}) {
  const { t } = useTranslation("extra_block");

  const existing = React.useMemo(() => {
    const set = new Set();
    (extraBlocks || []).forEach((b) => set.add(normalizeKey(b?.type)));
    return set;
  }, [extraBlocks]);

  const titleText = title ?? t(titleKey, { defaultValue: "Choose info block" });

  return (
    <div className="ib-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ib-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ib-modal__header">
          <h4 className="ib-title">{titleText}</h4>

          <button className="ib-close" onClick={onClose} aria-label={t("close", { defaultValue: "Close" })} type="button">
            <svg className="ib-close__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="ib-grid">
          {(types || []).map((block) => {
            const key = normalizeKey(block.key);
            const disabled = singletons.includes(key) && existing.has(key);

            const label =
              block.labelKey
                ? t(block.labelKey, { defaultValue: block.label || key })
                : (block.label || key);

            const hint =
              block.hintKey
                ? t(block.hintKey, { defaultValue: block.hint || "" })
                : (block.hint || "");

            return (
              <button
                key={key}
                className={`ib-card ${disabled ? "is-disabled" : ""}`}
                onClick={() => !disabled && onSelect?.(block)}
                disabled={disabled}
                type="button"
              >
                <span className="ib-label">{label}</span>
                {!!hint && <span className="ib-hint">{hint}</span>}
              </button>
            );
          })}
        </div>

        <button className="ib-cancel" onClick={onClose} type="button">
          {t("cancel", { defaultValue: "Cancel" })}
        </button>
      </div>
    </div>
  );
}