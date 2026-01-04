import React, { useEffect } from "react";
import { BsClipboard } from "react-icons/bs";
import { FaTelegramPlane, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/services/amplitude";
import "./ShareModal.css";

export default function ShareModal({ show, onClose, shareUrl, copied, onCopy }) {
  const { t } = useTranslation("share_modal");

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  if (!show) return null;

  const handleCopy = (method) => {
    onCopy?.(shareUrl);
    trackEvent("Link Copied", { method });
  };

  const handleSharedClick = (method) => {
    trackEvent("Share Clicked", { method });
  };

  return createPortal(
    <div
      className="shareModal__backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={onClose}
    >
      <div className="shareModal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="shareModal__close"
          onClick={onClose}
          aria-label={t("close")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M5 5l10 10M15 5l-10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h3 id="share-modal-title" className="shareModal__title">
          {t("title")}
        </h3>
        <div className="shareModal__subtitle">{t("subtitle")}</div>

        <div className="shareModal__row">
          <input
            className="shareModal__input"
            value={shareUrl}
            readOnly
            onClick={(e) => {
              e.target.select();
              handleCopy("input_click");
            }}
          />
          <button
            type="button"
            className={`shareModal__copy ${copied ? "is-copied" : ""}`}
            onClick={() => handleCopy("button")}
          >
            {copied ? (
              <>
                <span className="shareModal__check" aria-hidden="true">✓</span>
                {t("copied_button")}
              </>
            ) : (
              <>
                <BsClipboard />
                {t("copy_button")}
              </>
            )}
          </button>
        </div>

        <div className="shareModal__actions">
          <a
            className="shareModal__action is-telegram"
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSharedClick("telegram")}
          >
            <FaTelegramPlane /> {t("telegram")}
          </a>

          <a
            className="shareModal__action is-whatsapp"
            href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSharedClick("whatsapp")}
          >
            <FaWhatsapp /> {t("whatsapp")}
          </a>

          <a
            className="shareModal__action is-instagram"
            href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleSharedClick("instagram")}
          >
            <FaInstagram /> {t("instagram")}
          </a>
        </div>

        <div className="shareModal__qr">
          <div className="shareModal__qrFrame">
            <QRCodeCanvas value={shareUrl} size={116} />
          </div>
          <div className="shareModal__qrNote">{t("qr_note")}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
