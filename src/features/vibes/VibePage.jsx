// src/features/vibes/VibePage.jsx
import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import VibeFormRenderer from "@/features/vibes/components/VibeFormRenderer";
import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

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
  
  const openCustomerView = useCallback(() => {
    navigate(`/view/${id}`);
  }, [navigate, id]);


  const isBusiness = vibe?.type === "BUSINESS";

  const goToInteractions = useCallback(() => {
    const base = `/vibes/${id}`;
    navigate(
      isBusiness ? `${base}/interactions` : `${base}/interactions-basic`
    );
  }, [navigate, id, isBusiness]);

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="spinner-border text-primary" role="status"></div>
        <div className="mt-2">{t("loading")}</div>
      </div>
    );
  }

  if (!vibe) {
    return (
      <div className="alert alert-danger my-5 text-center">{t("not_found")}</div>
    );
  }

  return (
    <div className="route-shell">
      <div className="container py-5 vibe-container">
        <header className="vibe-header">
          <div className="vibe-header__left">
            <BackButton
              to="/my-vibes"
              className="btn-secondary"
              label={
                <>
                  <span className="btn-text-full">{t("back")}</span>
                  <span className="btn-text-short">{t("back_short")}</span>
                </>
              }
            />
          </div>

          <h2
            className={`vibe-header__title fw-bold ${
              editing ? "vibe-title--editing" : "vibe-title--view"
            }`}
          >
            {t("title")}
          </h2>


          <div className="vibe-header__right">
              <a
                href={`/view/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-light-outline btn-compact btn-no-hover d-flex align-items-center gap-2"
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
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <circle cx="10" cy="10" r="6" />
                <path d="M14 10h-4" />
                <path d="M10 6v8" />
              </svg>
              {t("interactions")}
            </button>

            {!editing ? (
              <button
                type="button"
                className="btn-white btn-compact d-flex align-items-center gap-2"
                onClick={() => setEditing(true)}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M4 13.5V16h2.5l7.6-7.6-2.5-2.5L4 13.5z" />
                  <path d="M13.7 5.3l1.1-1.1a1 1 0 0 1 1.4 1.4l-1.1 1.1" />
                </svg>
                {t("edit")}
              </button>
            ) : null}
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
