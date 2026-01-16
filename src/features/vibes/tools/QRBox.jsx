import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRBox({ id, shareUrl, t, size = 60 }) {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";

  const value = shareUrl || (id ? `${origin}/view/${id}` : "");

  if (value) {
    return (
      <>
        <QRCodeCanvas
          value={value}
          size={size}
          includeMargin={false}
          aria-label={t("qr_aria", { defaultValue: "QR code for sharing" })}
        />
        <div style={{ fontSize: 12, color: "#aaa" }}>
          {t("share_qr", { defaultValue: "Share QR code" })}
        </div>
      </>
    );
  }

  return (
    <div
      className="qr-preview"
      style={{
        width: size,
        height: size,
        background: "#fafafa",
        border: "1.5px dashed #ddd",
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: "#aaa",
      }}
      title={t("qr_hint", { defaultValue: "Generate a shareable QR" })}
    >
      QR
    </div>
  );
}
