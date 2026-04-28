// src/features/profile/Profile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

import ProfileCards from "./components/ProfileCards";
import getProfileCards from "./utils/profileCardsConfig";
import VibeSearch from "@/components/common/VibeSearch";

import useUserVibes from "@/features/vibes/hooks/useUserVibes";
import VibesList from "@/features/vibes/components/VibesList";
import Loader from "@/features/vibes/components/Loader";
import ShareModal from "@/features/vibes/components/ShareModal";
import "@/features/vibes/styles/UserVibes.css";

import "./styles/Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation("profile");
  const { t: tMyVibes } = useTranslation("myvibes");

  const profileCards = getProfileCards(t, navigate);

  const { vibes, loading, remove, setLoading } = useUserVibes({
    enabled: isAuthenticated,
  });

  const [shareVibe, setShareVibe] = useState(null);
  const [copied, setCopied] = useState(false);

  const hasVibes = vibes.length > 0;
  const isInitialLoading = loading;

  const handleDelete = async (vibeId) => {
    if (!window.confirm(tMyVibes("delete_confirm"))) return;

    setLoading(true);
    try {
      await remove(vibeId);
    } catch (err) {
      console.error(err);
      alert(tMyVibes("toast_error") ?? "Error: " + (err?.message || "unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (vibe) => {
    setShareVibe(vibe);
    setCopied(false);
  };

  const handleCloseShare = () => {
    setShareVibe(null);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!shareVibe) return;
    const link = `${window.location.origin}/view/${shareVibe.id}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="profile">
      <div className="profile__ambient" aria-hidden="true"></div>

      <div className="profile__container">
        {/* Dashboard Header - Always Visible */}
        <header className="profile__header animate-fadeIn">
          <div className="profile__header-content">
            <h1 className="profile__title">{t("title", "Dashboard")}</h1>
            <p className="profile__subtitle">
              {t("vibes_subtitle", { defaultValue: "Manage your digital identity." })}
            </p>
          </div>

          {user?.email && (
            <div className="profile__user-chip" title={user.email}>
              <div className="profile__user-status"></div>
              <span className="profile__user-email">{user.email}</span>
            </div>
          )}
        </header>

        {(loading && vibes.length === 0) ? (
          <section className="profile__section animate-fadeIn">
            <div className="profile__vibes-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="profile-vibe-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text-lg"></div>
                  <div className="skeleton-text-sm"></div>
                </div>
              ))}
            </div>
          </section>
        ) : vibes.length === 0 ? (
          <section
            className="profile__hero profile-hero glass animate-slideUp"
            role="region"
            aria-label={t("welcome")}
          >
            <div className="profile-hero__content">
              <div className="profile-hero__text">
                <h1 className="profile-hero__title">
                  {t("hero_title", {
                    defaultValue: "Build and share your digital vibe",
                  })}
                </h1>

                <p className="profile-hero__subtitle">
                  {t("hero_subtitle", {
                    defaultValue:
                      "Create a vibe, customize your profile, and share it with people through a link or QR code.",
                  })}
                </p>
              </div>

              <div className="profile-hero__panel">
                <div className="profile-hero__panel-header">
                  <h2 className="profile-hero__panel-title">
                    {t("how_it_works", { defaultValue: "How it works" })}
                  </h2>
                </div>

                <div className="profile-hero__steps">
                  {[
                    { n: 1, t: "step_create_title", d: "Choose a type and add your info." },
                    { n: 2, t: "step_customize_title", d: "Add contacts and customize design." },
                    { n: 3, t: "step_share_title", d: "Send your vibe by link or QR code." }
                  ].map((step) => (
                    <div key={step.n} className="profile-hero__step">
                      <div className="profile-hero__step-number">{step.n}</div>
                      <div className="profile-hero__step-body">
                        <div className="profile-hero__step-title">{t(step.t)}</div>
                        <div className="profile-hero__step-text">{step.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="profile__section animate-slideUp">
            <div
              className="profile__vibes-grid"
              role="list"
              aria-label={tMyVibes("list_aria", "Your vibes")}
            >
              <VibesList
                vibes={vibes}
                onDelete={handleDelete}
                onShare={handleShare}
              />

              {vibes.length < 5 && (
                <button
                  type="button"
                  className="profile-create-card-btn"
                  onClick={() => navigate("/create-vibe")}
                  title={t("create_new", "Create new Vibe")}
                >
                  <span className="profile-create-card-btn__plus">+</span>
                  <span className="profile-create-card-btn__text">{t("add_vibe", "Add Vibe")}</span>
                </button>
              )}
            </div>
          </section>
        )}

        <section className="profile__search-section animate-slideUp">
          <h3 className="profile__search-title">{t("search_vibe_title", { defaultValue: "Find a Vibe by Code" })}</h3>
          <VibeSearch />
        </section>

        <section className="profile__extra animate-stagger">
          <ProfileCards cards={profileCards} />
        </section>

        <ShareModal
          show={!!shareVibe}
          onClose={handleCloseShare}
          shareUrl={shareVibe ? `${window.location.origin}/view/${shareVibe.id}` : ""}
          copied={copied}
          onCopy={handleCopy}
        />
      </div>
    </main>
  );
}