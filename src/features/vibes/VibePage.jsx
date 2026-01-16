// src/features/vibes/VibePage.jsx
import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import VibeFormRenderer from "@/features/vibes/components/VibeFormRenderer";
import VibeCard from "@/features/vibes/card/components/VibeCard";
import BusinessOwnerCard from "@/features/vibes/components/BusinessOwnerCard";

import useVibeLoader from "@/features/vibes/hooks/useVibeLoader";
import useVibeSave from "@/features/vibes/hooks/useVibeSave";

import BackButton from "@/components/common/BackButton";
import { useAuth } from "@/context/AuthContext";

import "./styles/VibePage.css";

export default function VibePage() {
  const { t } = useTranslation("vibe");
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const token = accessToken;

  const [editing, setEditing] = useState(false);

  const {
    vibe,
    setVibe,
    loading,
    name,
    description,
    contacts,
    extraBlocks,
    visible,
    publicCode,
  } = useVibeLoader(id, token);

  const handleSave = useVibeSave({ token, vibe, setVibe, setEditing });

  const isBusiness = vibe?.type === "BUSINESS";

  const goToInteractions = useCallback(() => {
    const base = `/vibes/${id}`;
    navigate(isBusiness ? `${base}/interactions` : `${base}/interactions-basic`);
  }, [navigate, id, isBusiness]);

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="spinner-border text-primary" role="status" />
        <div className="mt-2">{t("loading")}</div>
      </div>
    );
  }

  if (!vibe) {
    return (
      <div className="alert alert-danger my-5 text-center">
        {t("not_found")}
      </div>
    );
  }

  return (
    <div className={`route-shell ${editing ? "is-editing" : ""}`}>
      <div className="container py-4 vibe-container">
        {/* ✅ one header system */}
        <header className="vibe-topbar">
          <div className="vibe-topbar__left">
            <BackButton
              to="/my-vibes"
              className="btn-secondary btn-compact"
              label={
                <>
                  <span className="btn-text-full">{t("back")}</span>
                  <span className="btn-text-short">{t("back_short")}</span>
                </>
              }
            />
          </div>

          <h2 className="vibe-topbar__title fw-bold">{t("title")}</h2>

          <div className="vibe-topbar__right">
            {/* desktop/tablet */}
            <div className="vibe-actions vibe-actions--desktop">
              <a
                href={`/view/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-light-outline btn-compact d-flex align-items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14 3h7v7" />
                  <path d="M10 14L21 3" />
                  <path d="M21 14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                </svg>
                {t("view")}
              </a>

              <button
                type="button"
                className="btn-main btn-compact d-flex align-items-center gap-2"
                onClick={goToInteractions}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {t("interactions")}
              </button>

              {!editing && (
                <button
                  type="button"
                  className="btn-white btn-compact d-flex align-items-center gap-2"
                  onClick={() => setEditing(true)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 21l3-1 12.6-12.6a2.1 2.1 0 0 0 0-3L17.6 3.4a2.1 2.1 0 0 0-3 0L2 16l1 5z" />
                    <path d="M14 4l6 6" />
                  </svg>
                  {t("edit")}
                </button>
              )}
            </div>

            {/* mobile */}
            <div className="vibe-actions vibe-actions--mobile">
              <a
                href={`/view/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-light-outline btn-compact btn-icon"
                aria-label={t("view")}
                title={t("view")}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14 3h7v7" />
                  <path d="M10 14L21 3" />
                  <path d="M21 14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                </svg>
              </a>

              <button
                type="button"
                className="btn-main btn-compact btn-icon"
                onClick={goToInteractions}
                aria-label={t("interactions")}
                title={t("interactions")}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </button>

              {!editing && (
                <button
                  type="button"
                  className="btn-white btn-compact btn-icon"
                  onClick={() => setEditing(true)}
                  aria-label={t("edit")}
                  title={t("edit")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 21l3-1 12.6-12.6a2.1 2.1 0 0 0 0-3L17.6 3.4a2.1 2.1 0 0 0-3 0L2 16l1 5z" />
                    <path d="M14 4l6 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="vibe-main">
          {editing ? (
            <VibeFormRenderer
              key={`${vibe.type}:${vibe.id}`}
              type={vibe.type}
              initialData={{
                id: vibe.id,
                name,
                description,
                contacts,
                extraBlocks,
                photo: vibe.photo,
              }}
              onCancel={() => setEditing(false)}
              onSave={handleSave}
            />
          ) : isBusiness ? (
            <BusinessOwnerCard
              t={t}
              vibe={vibe}
              name={name}
              description={description}
              contacts={contacts}
              extraBlocks={extraBlocks}
              visible={visible}
              publicCode={publicCode}
            />
          ) : (
            <VibeCard
              id={vibe.id}
              name={name}
              description={description}
              photo={vibe.photo}
              contacts={contacts}
              extraBlocks={extraBlocks}
              type={vibe.type}
              visible={visible}
              publicCode={publicCode}
              editMode={false}
              ownerActionsEnabled={true}
              shareEnabled={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
