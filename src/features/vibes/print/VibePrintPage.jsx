import React, { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import useVibeLoader from "@/features/vibes/hooks/useVibeLoader";
import { useAuth } from "@/context/AuthContext";
import mapVibeToPrintCardModel from "./mapVibeToPrintCardModel";
import BusinessCardPreview from "./BusinessCardPreview";

import "./VibePrintPage.css";

export default function VibePrintPage() {
  const { t } = useTranslation("vibe");
  const { id } = useParams();
  const { accessToken } = useAuth();
  const token = accessToken;

  const { vibe, loading, name, contacts } = useVibeLoader(id, token);

  const [downloading, setDownloading] = useState(false);
  const exportRef = useRef(null);

  const cardModel = useMemo(() => {
    if (!vibe) return null;

    return mapVibeToPrintCardModel({
      vibe,
      name,
      contacts,
    });
  }, [vibe, name, contacts]);

  const cardsForPage = useMemo(() => {
    if (!cardModel) return [];

    return Array.from({ length: 10 }, () => ({
      ...cardModel,
      compact: true,
      logoUrl: "/clearviewblue.png",
    }));
  }, [cardModel]);

  const infoItems = useMemo(() => {
    if (!cardModel) return [];

    const items = [];

    if (cardModel.name) {
      items.push({
        label: t("print_card_labels.name", { defaultValue: "Name" }),
        value: cardModel.name,
      });
    }

    if (cardModel.title) {
      items.push({
        label: t("print_card_labels.title", { defaultValue: "Title" }),
        value: cardModel.title,
      });
    }

    if (cardModel.phone) {
      items.push({
        label: t("print_card_labels.phone", { defaultValue: "Phone" }),
        value: cardModel.phone,
      });
    }

    if (cardModel.email) {
      items.push({
        label: t("print_card_labels.email", { defaultValue: "Email" }),
        value: cardModel.email,
      });
    }

    if (cardModel.website) {
      items.push({
        label: t("print_card_labels.website", { defaultValue: "Website" }),
        value: cardModel.website,
      });
    }

    if (cardModel.address) {
      items.push({
        label: t("print_card_labels.address", { defaultValue: "Address" }),
        value: cardModel.address,
      });
    }

    return items;
  }, [cardModel, t]);

  const handleDownloadPdf = async () => {
    if (!exportRef.current || !cardModel || downloading) return;

    try {
      setDownloading(true);

      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
        fontEmbedCSS: "",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "a4",
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, 8.27, 11.69);
      pdf.save(`${cardModel.name || "business-cards"}-a4.pdf`);
    } catch (error) {
      console.error("Failed to generate business card PDF:", error);
      alert(`Failed to generate PDF: ${error?.message || error}`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="vp-page">
        <div className="vp-shell">
          <div className="vp-state glass vp-animate-in">
            <div className="spinner-border" role="status" />
            <div className="vp-state-title">
              {t("loading", { defaultValue: "Loading..." })}
            </div>
            <div className="vp-state-text">
              {t("loading_print_card_text", {
                defaultValue: "Preparing your print card preview.",
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vibe || !cardModel) {
    return (
      <div className="vp-page">
        <div className="vp-shell">
          <div className="vp-state glass vp-animate-in">
            <div className="vp-state-icon">!</div>
            <div className="vp-state-title">
              {t("not_found", { defaultValue: "Vibe not found" })}
            </div>
            <div className="vp-state-text">
              {t("not_found_print_card_text", {
                defaultValue: "We could not prepare this card for printing.",
              })}
            </div>

            <Link to={`/vibes/${id}`} className="vp-btn vp-btn-secondary">
              {t("back", { defaultValue: "Back" })}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vp-page">
      <div className="vp-shell">
        <section className="vp-hero glass vp-animate-in">
          <div className="vp-hero-orb vp-hero-orb--1" />
          <div className="vp-hero-orb vp-hero-orb--2" />
          <div className="vp-hero-orb vp-hero-orb--3" />

          <div className="vp-hero__content">
            <div className="vp-badge">
              {t("print_card", { defaultValue: "Print Card" })}
            </div>

            <h1 className="vp-title">
              {t("print_card_title", {
                defaultValue: "Export a clean printable card",
              })}
            </h1>

            <p className="vp-subtitle">
              {t("print_card_subtitle", {
                defaultValue:
                  "Preview how the card looks before downloading it as a PDF.",
              })}
            </p>
          </div>

          <div className="vp-hero__actions">
            <Link to={`/vibes/${id}`} className="vp-btn vp-btn-secondary">
              {t("back", { defaultValue: "Back" })}
            </Link>

            <button
              type="button"
              className="vp-btn vp-btn-primary"
              onClick={handleDownloadPdf}
              disabled={downloading}
            >
              {downloading
                ? t("generating_pdf", { defaultValue: "Generating PDF..." })
                : t("download_pdf", { defaultValue: "Download PDF" })}
            </button>
          </div>
        </section>

        <section className="vp-grid">
          <div className="vp-preview glass vp-animate-in vp-delay-1">
            <div className="vp-section-head">
              <div>
                <h2 className="vp-section-title">
                  {t("preview", { defaultValue: "Preview" })}
                </h2>
                <p className="vp-section-text">
                  {t("preview_description", {
                    defaultValue: "This is how your printable card will look.",
                  })}
                </p>
              </div>
            </div>

            <div className="vp-preview-frame">
              <div className="vp-preview-glow" />

              <div className="vp-preview-scale">
                <BusinessCardPreview
                  card={{
                    ...cardModel,
                    compact: true,
                    logoUrl: "/clearviewblue.png",
                  }}
                />
              </div>
            </div>
          </div>

          <aside className="vp-sidebar">
            <div className="vp-panel glass vp-animate-in vp-delay-2">
              <h3 className="vp-panel-title">
                {t("card_details", { defaultValue: "Card details" })}
              </h3>

              <div className="vp-meta">
                {infoItems.length > 0 ? (
                  infoItems.map((item) => (
                    <div
                      className="vp-meta-row"
                      key={`${item.label}-${item.value}`}
                    >
                      <span className="vp-meta-label">{item.label}</span>
                      <span className="vp-meta-value">{item.value}</span>
                    </div>
                  ))
                ) : (
                  <div className="vp-empty">
                    {t("no_card_details", {
                      defaultValue: "No details available for preview.",
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="vp-panel glass vp-animate-in vp-delay-3">
              <h3 className="vp-panel-title">
                {t("tips", { defaultValue: "Tips" })}
              </h3>

              <ul className="vp-tips">
                <li>
                  {t("print_tip_1", {
                    defaultValue: "Check spacing and content before export.",
                  })}
                </li>
                <li>
                  {t("print_tip_2", {
                    defaultValue:
                      "The PDF is generated as an A4 sheet with multiple cards.",
                  })}
                </li>
                <li>
                  {t("print_tip_3", {
                    defaultValue:
                      "Website, phone and email make the card more useful.",
                  })}
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>

      <div className="vp-export-hidden">
        <div
          ref={exportRef}
          className="vp-export-sheet"
          style={{
            width: "8.27in",
            height: "11.69in",
            background: "#ffffff",
            fontFamily: "Arial, sans-serif",
            boxSizing: "border-box",
            padding: "0.345in",
            display: "grid",
            gridTemplateColumns: "repeat(2, 3.5in)",
            gridAutoRows: "2in",
            gap: "0.2in",
            justifyContent: "center",
            alignContent: "start",
          }}
        >
          {cardsForPage.map((card, index) => (
            <div
              key={index}
              style={{
                width: "3.5in",
                height: "2in",
                overflow: "hidden",
                background: "#ffffff",
                boxSizing: "border-box",
              }}
            >
              <BusinessCardPreview card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}