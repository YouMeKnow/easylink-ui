import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X } from "lucide-react";
import "./QRBox.css";

export default function QRBox({ id, shareUrl, t, size = 116 }) {
  const [open, setOpen] = useState(false);

  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";

  const value = shareUrl || (id ? `${origin}/view/${id}` : "");

  if (value) {
    return (
      <>
        <div className="qr-box qr-box--ready">
          <button
            type="button"
            className="qr-box__trigger"
            onClick={() => setOpen(true)}
            aria-label={t("qr_open_large", { defaultValue: "Open QR code" })}
            title={t("qr_open_large", { defaultValue: "Open QR code" })}
          >
            <div className="qr-box__frame">
              <QRCodeCanvas
                value={value}
                size={size}
                bgColor="#ffffff"
                fgColor="#111111"
                includeMargin={false}
                className="vibe-qr-canvas"
                aria-label={t("qr_aria", { defaultValue: "QR code for sharing" })}
              />
            </div>
          </button>

          <div className="qr-box__note">
            {t("share_qr", { defaultValue: "Tap to enlarge QR" })}
          </div>
        </div>

        {open && (
          <div
            className="qr-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("qr_modal_title", { defaultValue: "QR code" })}
            onClick={() => setOpen(false)}
          >
            <div
              className="qr-modal__card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="qr-modal__close"
                onClick={() => setOpen(false)}
                aria-label={t("close", { defaultValue: "Close" })}
                title={t("close", { defaultValue: "Close" })}
              >
                <X size={18} />
              </button>

              <div className="qr-box__frame qr-box__frame--modal">
                <QRCodeCanvas
                  value={value}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#111111"
                  includeMargin={false}
                  className="qr-modal__canvas"
                  aria-label={t("qr_aria", { defaultValue: "QR code for sharing" })}
                />
              </div>

              <div className="qr-box__note">
                {t("share_qr", { defaultValue: "Share QR code" })}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="qr-box qr-box--placeholder">
      <div className="qr-preview" style={{ width: size, height: size }} aria-hidden="true">
        <div className="qr-preview__grid" />
        <div className="qr-preview__label">QR</div>
      </div>

      <div className="qr-box__note qr-box__note--title">
        {t("qr_after_create_title", {
          defaultValue: "QR will appear after creation",
        })}
      </div>

      <div className="qr-box__hint">
        {t("qr_after_create_hint", {
          defaultValue: "Save your Vibe to generate a shareable QR code.",
        })}
      </div>
    </div>
  );
}