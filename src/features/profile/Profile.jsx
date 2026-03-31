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
      <div className="profile__bg" aria-hidden="true" />

      <div className="profile__container">
        {isInitialLoading ? null : !hasVibes ? (
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

                {user?.email && (
                  <div className="profile-hero__userchip" title={user.email}>
                    <span className="profile-hero__userdot" />
                    <span className="profile-hero__usertext">{user.email}</span>
                  </div>
                )}
              </div>

              <div className="profile-hero__panel">
                <div className="profile-hero__panel-header">
                  <h2 className="profile-hero__panel-title">
                    {t("how_it_works", { defaultValue: "How it works" })}
                  </h2>
                  <p className="profile-hero__panel-subtitle">
                    {t("start_here", { defaultValue: "Start here" })}
                  </p>
                </div>

                <div className="profile-hero__steps">
                  <div className="profile-hero__step">
                    <div className="profile-hero__step-number">1</div>
                    <div className="profile-hero__step-body">
                      <div className="profile-hero__step-title">
                        {t("step_create_title", {
                          defaultValue: "Create your first vibe",
                        })}
                      </div>
                      <div className="profile-hero__step-text">
                        {t("step_create_text", {
                          defaultValue: "Choose a type and add your basic info.",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="profile-hero__step">
                    <div className="profile-hero__step-number">2</div>
                    <div className="profile-hero__step-body">
                      <div className="profile-hero__step-title">
                        {t("step_customize_title", {
                          defaultValue: "Customize your page",
                        })}
                      </div>
                      <div className="profile-hero__step-text">
                        {t("step_customize_text", {
                          defaultValue:
                            "Add contacts, details, and make it look like you.",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="profile-hero__step">
                    <div className="profile-hero__step-number">3</div>
                    <div className="profile-hero__step-body">
                      <div className="profile-hero__step-title">
                        {t("step_share_title", {
                          defaultValue: "Share it anywhere",
                        })}
                      </div>
                      <div className="profile-hero__step-text">
                        {t("step_share_text", {
                          defaultValue:
                            "Send your vibe by link, QR code, or in person.",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="profile__vibes-section animate-slideUp" aria-labelledby="profile-vibes-title">
            <div className="profile__vibes-top">
              <div className="profile__vibes-copy">
                <h2 id="profile-vibes-title" className="profile__vibes-title">
                  {t("title", "Profile")}
                </h2>
                <p className="profile__vibes-subtitle">
                  {t("vibes_subtitle", {
                    defaultValue: "Your vibes, all in one place.",
                  })}
                </p>
              </div>

              {user?.email && (
                <div className="profile__vibes-userchip" title={user.email}>
                  <span className="profile__vibes-userdot" />
                  <span className="profile__vibes-usertext">{user.email}</span>
                </div>
              )}
            </div>

            {loading ? (
              <Loader />
            ) : (
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

                <button
                  type="button"
                  className="profile-create-vibe-card"
                  onClick={() => navigate("/create-vibe")}
                >
                  <span className="profile-create-vibe-card__plus">+</span>
                </button>
              </div>
            )}
          </section>
        )}

        <section className="profile__search animate-fadeIn" role="search">
          <VibeSearch />
        </section>

        <section className="profile__cards animate-stagger">
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