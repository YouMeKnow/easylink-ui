import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PageLayout from "@/components/common/PageLayout";
import BackButton from "@/components/common/BackButton";
import { useAuth } from "@/context/AuthContext";
import useVibeLoader from "@/features/vibes/hooks/useVibeLoader";
import useVibeSave from "@/features/vibes/hooks/useVibeSave";

import "./VibeSettingsPage.css";

export default function VibeSettingsPage() {
  const { t } = useTranslation("vibe");
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const token = accessToken;
  const { vibe, setVibe, loading, reload } = useVibeLoader(id, token);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isBusiness = vibe?.type === "BUSINESS";
  const recommendedMode = isBusiness ? "PUBLIC" : "PRIVATE_APPROVAL";
  

  const [accessMode, setAccessMode] = useState("PUBLIC");

  useEffect(() => {
    if (!vibe) return;

    const privacy = vibe.privacy || "PUBLIC";
    const subscribeMode = vibe.subscribeMode || "APPROVAL";

    if (privacy === "PUBLIC") {
      setAccessMode("PUBLIC");
    } else if (subscribeMode === "APPROVAL") {
      setAccessMode("PRIVATE_APPROVAL");
    } else {
      setAccessMode("PRIVATE_AUTO");
    }
  }, [vibe]);

  const hasChanges = useMemo(() => {
    if (!vibe) return false;

    const currentPrivacy = vibe.privacy || "PUBLIC";
    const currentSubscribeMode = vibe.subscribeMode || "APPROVAL";

    let nextPrivacy = "PUBLIC";
    let nextSubscribeMode = "OPEN";

    if (accessMode === "PRIVATE_AUTO") {
      nextPrivacy = "PRIVATE";
      nextSubscribeMode = "OPEN";
    }

    if (accessMode === "PRIVATE_APPROVAL") {
      nextPrivacy = "PRIVATE";
      nextSubscribeMode = "APPROVAL";
    }

    return (
      currentPrivacy !== nextPrivacy ||
      currentSubscribeMode !== nextSubscribeMode
    );
  }, [vibe, accessMode]);

  const handleSave = useVibeSave({
    token,
    vibe,
    setVibe,
    setEditing: () => {},
  });

  const accessSummary =
    accessMode === "PUBLIC"
      ? t("public_access_summary", {
          defaultValue: "Anyone can view this vibe.",
        })
      : accessMode === "PRIVATE_AUTO"
      ? t("private_auto_summary", {
          defaultValue: "People get access automatically after requesting it.",
        })
      : t("private_approval_summary", {
          defaultValue: "You approve each request before access is granted.",
        });

  const onSave = async () => {
    if (!vibe) return;

    let privacy = "PUBLIC";
    let subscribeMode = "OPEN";

    if (accessMode === "PRIVATE_AUTO") {
      privacy = "PRIVATE";
      subscribeMode = "OPEN";
    }

    if (accessMode === "PRIVATE_APPROVAL") {
      privacy = "PRIVATE";
      subscribeMode = "APPROVAL";
    }

    setSaving(true);
    setError(null);

    try {
      await handleSave({
        name: vibe.name,
        description: vibe.description,
        photo: vibe.photo,
        fieldsDTO: vibe.fieldsDTO ?? [],
        privacy,
        subscribeMode,
      });

      await reload?.();
      navigate(`/vibes/${vibe.id}`);
    } catch (e) {
      setError(e?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title={t("settings", { defaultValue: "Settings" })}>
        <div className="vibe-settings__loading">
          <div className="spinner-border" role="status" />
        </div>
      </PageLayout>
    );
  }

  if (!vibe) {
    return (
      <PageLayout title={t("settings", { defaultValue: "Settings" })}>
        <div className="vibe-settings__container">
          <div className="vibe-settings__alert vibe-settings__alert--error">
            {t("not_found", { defaultValue: "Not found" })}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <div className="route-shell vibe-settings">
      <div className="vibe-settings__container">
        <header className="vibe-settings__header">
          <BackButton
            to={`/vibes/${vibe.id}`}
            className="vibe-settings__back-btn"
            label={t("back_short", { defaultValue: "Back" })}
          />

          <div className="vibe-settings__header-center">
            <h1 className="vibe-settings__title">
              {t("settings", { defaultValue: "Access settings" })}
            </h1>
            <p className="vibe-settings__subtitle">
              {t("settings_subtitle", {
                defaultValue: "Choose who can view this vibe",
              })}
            </p>
          </div>

          <div className="vibe-settings__header-spacer" />
        </header>

        {error && (
          <div className="vibe-settings__alert vibe-settings__alert--error">
            {error}
          </div>
        )}

        <div className="vibe-settings__top-grid">
          <section className="glass vibe-settings__panel vibe-settings__summary-panel">
            <div className="vibe-settings__section-head">
              <h2 className="vibe-settings__section-title">
                {t("current_access", { defaultValue: "Current access" })}
              </h2>
              <p className="vibe-settings__section-text">
                {t("current_access_hint", {
                  defaultValue: "This is how your vibe is currently shared.",
                })}
              </p>
            </div>

            <div className="vibe-settings__summary-text">
              {accessSummary}
            </div>

            <div className="vibe-settings__summary-note">
              {accessMode === "PUBLIC"
                ? t("summary_note_public", {
                    defaultValue:
                      "Best for easy sharing, discovery, and open profile viewing.",
                  })
                : accessMode === "PRIVATE_AUTO"
                ? t("summary_note_auto", {
                    defaultValue:
                      "Good when you want a softer private mode without manual review.",
                  })
                : t("summary_note_approval", {
                    defaultValue:
                      "Best for stronger control over who gets access to your vibe.",
                  })}
            </div>
          </section>

          <section className="glass vibe-settings__panel">
            <div className="vibe-settings__section-head">
              <h2 className="vibe-settings__section-title">
                {t("access_mode", { defaultValue: "Access mode" })}
              </h2>
              <p className="vibe-settings__section-text">
                {t("access_mode_hint", {
                  defaultValue:
                    "Choose the visibility mode that fits your vibe best.",
                })}
              </p>
            </div>

            <div className="vibe-settings__options-grid vibe-settings__options-grid--single">
              <button
                type="button"
                onClick={() => setAccessMode("PUBLIC")}
                className={`vibe-settings__option vibe-settings__option--public ${
                  accessMode === "PUBLIC" ? "is-active" : ""
                }`}
              >
                <div className="vibe-settings__option-icon">
                  <PublicIcon />
                </div>

                <div className="vibe-settings__option-content">
                  <div className="vibe-settings__option-top">
                    <span className="vibe-settings__option-title">
                      {t("public", { defaultValue: "Public" })}
                    </span>

                    <div className="vibe-settings__option-badges">
                      {recommendedMode === "PUBLIC" && (
                        <span className="vibe-settings__option-recommended">
                          {t("recommended", { defaultValue: "Recommended" })}
                        </span>
                      )}

                      {accessMode === "PUBLIC" && (
                        <span className="vibe-settings__option-check">
                          {t("selected", { defaultValue: "Selected" })}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="vibe-settings__option-text">
                    {t("public_description", {
                      defaultValue:
                        "Anyone with the link or profile can view this vibe.",
                    })}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccessMode("PRIVATE_APPROVAL")}
                className={`vibe-settings__option vibe-settings__option--approval ${
                  accessMode === "PRIVATE_APPROVAL" ? "is-active" : ""
                }`}
              >
                <div className="vibe-settings__option-icon">
                  <ApprovalIcon />
                </div>

                <div className="vibe-settings__option-content">
                  <div className="vibe-settings__option-top">
                    <span className="vibe-settings__option-title">
                      {t("private_approval", {
                        defaultValue: "Private · Approval required",
                      })}
                    </span>
                    <div className="vibe-settings__option-badges">
                      {recommendedMode === "PRIVATE_APPROVAL" && (
                        <span className="vibe-settings__option-recommended">
                          {t("recommended", { defaultValue: "Recommended" })}
                        </span>
                      )}

                      {accessMode === "PRIVATE_APPROVAL" && (
                        <span className="vibe-settings__option-check">
                          {t("selected", { defaultValue: "Selected" })}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="vibe-settings__option-text">
                    {t("approval_description", {
                      defaultValue:
                        "People send requests, and you decide who gets access.",
                    })}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccessMode("PRIVATE_AUTO")}
                className={`vibe-settings__option vibe-settings__option--instant ${
                  accessMode === "PRIVATE_AUTO" ? "is-active" : ""
                }`}
              >
                <div className="vibe-settings__option-icon">
                  <InstantIcon />
                </div>

                <div className="vibe-settings__option-content">
                  <div className="vibe-settings__option-top">
                    <span className="vibe-settings__option-title">
                      {t("private_auto", {
                        defaultValue: "Private · Instant access",
                      })}
                    </span>
                    {accessMode === "PRIVATE_AUTO" && (
                      <span className="vibe-settings__option-check">
                        {t("selected", { defaultValue: "Selected" })}
                      </span>
                    )}
                  </div>

                  <p className="vibe-settings__option-text">
                    {t("open_description", {
                      defaultValue:
                        "People can request access and get it automatically.",
                    })}
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>


        <section className="glass vibe-settings__footer">
          <div className="vibe-settings__footer-text">
            {t("save_hint", {
              defaultValue: "Changes affect who can view this vibe.",
            })}
          </div>

          <div className="vibe-settings__footer-actions">
            <button
              className="vibe-settings__ghost-btn"
              type="button"
              onClick={() => navigate(`/vibes/${vibe.id}`)}
              disabled={saving}
            >
              {t("cancel", { defaultValue: "Cancel" })}
            </button>

            <button
              className="vibe-settings__primary-btn"
              type="button"
              onClick={onSave}
              disabled={saving || !hasChanges}
            >
              {saving
                ? t("saving", { defaultValue: "Saving..." })
                : t("save", { defaultValue: "Save changes" })}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function PublicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="vibe-settings__svg">
      <path
        d="M12 3C16.97 3 21 7.03 21 12M12 3C7.03 3 3 7.03 3 12M12 3C14.2 5.1 15.5 8.43 15.5 12C15.5 15.57 14.2 18.9 12 21M12 3C9.8 5.1 8.5 8.43 8.5 12C8.5 15.57 9.8 18.9 12 21M3 12H21M12 21C7.03 21 3 16.97 3 12M12 21C16.97 21 21 16.97 21 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ApprovalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="vibe-settings__svg">
      <path
        d="M12 3L19 6V11C19 15.5 16.1 19.42 12 20.5C7.9 19.42 5 15.5 5 11V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12L11.2 13.7L14.8 10.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstantIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="vibe-settings__svg">
      <path
        d="M13 2L6 13H11L10 22L18 10H13L13 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}