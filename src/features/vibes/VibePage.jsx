// src/features/vibes/VibePage.jsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

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
  } = useVibeLoader(id, token, "owner");

  const handleSave = useVibeSave({ token, vibe, setVibe, setEditing });

  const isBusiness = vibe?.type === "BUSINESS";

  const goToInteractions = useCallback(() => {
    setMobileMenuOpen(false);
    navigate(`/view/${id}/network`);
  }, [navigate, id]);

  const goToPrint = useCallback(() => {
    setMobileMenuOpen(false);
    navigate(`/vibes/${id}/print`);
  }, [navigate, id]);

  const goToSettings = useCallback(() => {
    setMobileMenuOpen(false);
    navigate(`/vibes/${id}/settings`);
  }, [navigate, id]);

  const openEdit = useCallback(() => {
    setMobileMenuOpen(false);
    setEditing(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [editing, id]);

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
              <Link
                to={`/view/${id}`}
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
              </Link>

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

              <button
                type="button"
                className="btn-light-outline btn-compact d-flex align-items-center gap-2"
                onClick={goToPrint}
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
                  <path d="M6 9V2h12v7" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" rx="1" />
                </svg>
                {t("print_card", { defaultValue: "Print Card" })}
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

              <Link
                to={`/vibes/${id}/settings`}
                className="btn-light-outline btn-compact vibe-settings-link"
              >
                <SettingsIcon />
                <span>{t("settings", { defaultValue: "Settings" })}</span>
              </Link>
            </div>

            {/* mobile */}
            <div className="vibe-actions vibe-actions--mobile" ref={mobileMenuRef}>
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

              <button
                type="button"
                className="btn-light-outline btn-compact btn-icon vibe-more-trigger"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={t("more", { defaultValue: "More" })}
                title={t("more", { defaultValue: "More" })}
                aria-expanded={mobileMenuOpen}
                aria-haspopup="menu"
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
                  <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </button>

              {mobileMenuOpen && (
                <div className="vibe-mobile-menu" role="menu">
                  <Link
                    to={`/view/${id}`}
                    className="vibe-mobile-menu__item"
                    onClick={() => setMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    <MenuItemIcon type="view" />
                    <span>{t("view")}</span>
                  </Link>

                  <button
                    type="button"
                    className="vibe-mobile-menu__item"
                    onClick={goToPrint}
                    role="menuitem"
                  >
                    <MenuItemIcon type="print" />
                    <span>{t("print_card", { defaultValue: "Print Card" })}</span>
                  </button>

                  {!editing && (
                    <button
                      type="button"
                      className="vibe-mobile-menu__item"
                      onClick={openEdit}
                      role="menuitem"
                    >
                      <MenuItemIcon type="edit" />
                      <span>{t("edit")}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="vibe-mobile-menu__item"
                    onClick={goToSettings}
                    role="menuitem"
                  >
                    <MenuItemIcon type="settings" />
                    <span>{t("settings", { defaultValue: "Settings" })}</span>
                  </button>
                </div>
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

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="settings-icon" aria-hidden="true">
      <path
        d="M4 6h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 6h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="16"
        cy="6"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4 12h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 12h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="8"
        cy="12"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4 18h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 18h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="16"
        cy="18"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MenuItemIcon({ type }) {
  if (type === "view") {
    return (
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
    );
  }

  if (type === "print") {
    return (
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
        <path d="M6 9V2h12v7" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" rx="1" />
      </svg>
    );
  }

  if (type === "edit") {
    return (
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
    );
  }

  return <SettingsIcon />;
}