import React from "react";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import "./BusinessCardPreview.css";

function Row({ icon: Icon, value }) {
  if (!value) return null;

  return (
    <div className="bcp-row">
      <div className="bcp-row-icon">
        <Icon size={12} strokeWidth={2} />
      </div>

      <div className="bcp-row-value">{value}</div>
    </div>
  );
}

export default function BusinessCardPreview({ card }) {
  if (!card) return null;

  const name = card.name || "John Smith";
  const title = card.title || "Digital Identity Card";
  const brandName = card.company || card.brandName || "YouMeKnow";

  const qrValue =
    card.qrValue ||
    card.vibeUrl ||
    card.shareUrl ||
    "https://youmeknow.com";

  return (
    <div className={`bcp-wrap ${card?.compact ? "bcp-wrap--compact" : ""}`}>
      <div className={`bcp-card ${card?.compact ? "bcp-card--compact" : ""}`}>
        <div className="bcp-left">
          <div className="bcp-left-content">
            <div className="bcp-top-accent" />

            <div className="bcp-name-block">
              <div className="bcp-name">{name}</div>
              <div className="bcp-title">{title}</div>
            </div>

            <div className="bcp-rows">
              <Row icon={Phone} value={card.phone} />
              <Row icon={Mail} value={card.email} />
              <Row icon={Globe} value={card.website} />
              <Row icon={MapPin} value={card.address} />
            </div>
          </div>
        </div>

        <div className="bcp-divider" />

        <div className="bcp-right">
          <div className="bcp-right-content">
            <div className="bcp-brand-top">
              <img
                src={card.logoUrl || "/clearviewblue.png"}
                alt="logo"
                className="bcp-logo"
              />

              <div className="bcp-brand-texts">
                <div className="bcp-brand-label">powered by</div>
                <div className="bcp-brand">{brandName}</div>
              </div>
            </div>

            <div className="bcp-qr-shell">
              <div className="bcp-qr-box">
                <QRCodeSVG
                  value={qrValue}
                  size={card?.compact ? 78 : 88}
                  bgColor="#ffffff"
                  fgColor="#111111"
                  level="M"
                  includeMargin={false}
                />
              </div>

              <div className="bcp-qr-caption">
                scan to open vibe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}