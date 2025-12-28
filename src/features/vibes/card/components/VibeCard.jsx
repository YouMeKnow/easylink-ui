import React from "react";
import { BsShareFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

import ShareModal from "@/features/vibes/components/ShareModal";
import useShareModal from "@/components/common/hooks/useShareModal";
import useVisibilityToggle from "@/features/vibes/useVisibilityToggle.jsx";

import VibeContent from "@/features/vibes/tools/VibeContent";

import { trackEvent } from "@/services/amplitude";
import isUuid from "@/shared/lib/isUuid"; 
import "./VibeCard.css";

export default function VibeCard({
  id,
  name,
  description,
  photo,
  contacts,
  type,
  extraBlocks,
  visible,
  publicCode,

  editMode = false,
  ownerActionsEnabled = false,
  onShare = null, 
  cardBody = null,
  maxCardWidth = 420,

  onChangeName,
  onChangeDescription,
  onChangePhoto,
  onOpenContactPicker,
  onRemoveContact,
  onChangeContactValue,
  resumeEditAt,

  onBlockChange,
  onBlockRemove,
  onOpenBlockPicker,
}) {
  const { t } = useTranslation();

  const hasId = isUuid(id);
  const canOwnerActions = ownerActionsEnabled && hasId;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = hasId ? `${origin}/view/${id}` : "";

  // visibility (owner only)
  const [vibeVisible, code, visibilityToggleUI] = useVisibilityToggle(
    id,
    visible,
    publicCode,
    {
      enabled: canOwnerActions,
      labels: {
        visible: t("vibe.visible", "Visible"),
        hidden: t("vibe.hidden", "Hidden"),
      },
    }
  );

  // "Copied!" for share code (local UI only)
  const [codeCopied, setCodeCopied] = React.useState(false);

  const handleCopyCode = async (text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(String(text));
    } catch {
      const ta = document.createElement("textarea");
      ta.value = String(text);
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  };

  // share modal
  const {
    showShare,
    copied,
    handleCopy,
    handleOpen,
    handleClose,
    ShareModalProps,
    canShare = true,
  } = useShareModal(shareUrl, id, "VibeCard");

  const onShareClick = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    onShare?.({ vibeId: id, shareUrl });

    trackEvent("Vibe Share Clicked", { vibeId: id, location: "VibeCard" });

    handleOpen();
  };

  return (
    <div
      className="vibe-card"
      style={{
        width: "100%",
        maxWidth: maxCardWidth,
        margin: "0 auto",
      }}
    >
      {/* Share button */}
      {canShare && (
        <button
          type="button"
          className="btn btn-light shadow-sm vibe-card__share-btn"
          style={{ borderRadius: 999 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onShareClick(e);
          }}
          title={t("vibe.share", "Share")}
          aria-label={t("vibe.share", "Share")}
        >
          <BsShareFill size={20} style={{ color: "#627bf7" }} />
        </button>
      )}

      {/* Visibility + Share code */}
      {canOwnerActions && (
        <div className="vibe-card__visibility">
          <div className="vibe-card__visibility-label">
            {t("vibe.visibility", "Visibility")}
          </div>

          <div className="vibe-card__visibility-controls">
            {/* toggle UI returned by hook */}
            {visibilityToggleUI}

            {/* share code */}
            {vibeVisible && code && (
              <>
                <button
                  type="button"
                  className="vibe-card__code"
                  onClick={() => handleCopyCode(code)}
                  title={t("Click to copy", { defaultValue: "Click to copy" })}
                  aria-label={t("Click to copy", { defaultValue: "Click to copy" })}
                >
                  <span>{t("vibe.share_code", "Share code")}</span>
                  <strong>{code}</strong>
                </button>

                {codeCopied && (
                  <span
                    className="vibe-card__copied"
                    role="status"
                    aria-live="polite"
                  >
                    {t("Copied!", { defaultValue: "Copied!" })}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="vibe-card__body">
        {cardBody ? (
          cardBody
        ) : (
          <VibeContent
            id={id}
            name={name}
            description={description}
            photo={photo}
            contacts={contacts}
            type={type}
            extraBlocks={extraBlocks}
            visible={visible}
            publicCode={publicCode}
            editMode={editMode}
            onChangeName={onChangeName}
            onChangeDescription={onChangeDescription}
            onChangePhoto={onChangePhoto}
            onOpenContactPicker={onOpenContactPicker}
            onRemoveContact={onRemoveContact}
            onChangeContactValue={onChangeContactValue}
            resumeEditAt={resumeEditAt}
            onBlockChange={onBlockChange}
            onBlockRemove={onBlockRemove}
            onOpenBlockPicker={onOpenBlockPicker}
          />
        )}
      </div>

      {/* Share modal */}
      <ShareModal
        {...ShareModalProps}
        show={showShare}
        onClose={handleClose}
        shareUrl={shareUrl}
        copied={copied}
        onCopy={handleCopy}
      />
    </div>
  );
}
