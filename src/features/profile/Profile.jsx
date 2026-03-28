// =======================
// src/features/profile/Profile.jsx
// Style: Glassmorphism + Modern Minimalism (Soft Gradient / Clean UI)
// =======================
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import ProfileCards from "./components/ProfileCards";
import getProfileCards from "./utils/profileCardsConfig";
import useHasVibes from "@/components/common/hooks/useHasVibes";
import VibeSearch from "@/components/common/VibeSearch";
import ProfileSubscribedOffers from "./ProfileSubscribedOffers";

import "./styles/Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { user /*, logout, isAuthenticated*/ } = useAuth();
  const { t } = useTranslation("profile");
  const profileCards = getProfileCards(t, navigate);
  const hasVibes = useHasVibes();

  return (
    <main className="profile">
      {/* Background layer */}
      <div className="profile__bg" aria-hidden="true" />

      <div className="profile__container">
        <section
          className="profile__hero profile-hero glass animate-slideUp"
          role="region"
          aria-label={t("welcome")}
        >
          <div className="profile-hero__content">
            <div className="profile-hero__text">
              <h1 className="profile-hero__title">
                {t("hero_title", { defaultValue: "Build and share your digital vibe" })}
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
                      {t("step_create_title", { defaultValue: "Create your first vibe" })}
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
                      {t("step_customize_title", { defaultValue: "Customize your page" })}
                    </div>
                    <div className="profile-hero__step-text">
                      {t("step_customize_text", {
                        defaultValue: "Add contacts, details, and make it look like you.",
                      })}
                    </div>
                  </div>
                </div>

                <div className="profile-hero__step">
                  <div className="profile-hero__step-number">3</div>
                  <div className="profile-hero__step-body">
                    <div className="profile-hero__step-title">
                      {t("step_share_title", { defaultValue: "Share it anywhere" })}
                    </div>
                    <div className="profile-hero__step-text">
                      {t("step_share_text", {
                        defaultValue: "Send your vibe by link, QR code, or in person.",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {!hasVibes && (
                <div className="profile-hero__hint">
                  {t("first_vibe_hint", {
                    defaultValue: "You don’t have any vibes yet — create one to get started.",
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="profile__search animate-fadeIn" role="search">
          <VibeSearch />
        </section>

        {/* Cards */}
        <section className="profile__cards animate-stagger">
          <ProfileCards cards={profileCards} />
        </section>

        {/* Offers from subscriptions */}
        <section className="profile__offers animate-slideUp" aria-label={t("offers_from_subscriptions", { defaultValue: "Offers from subscriptions" })}>
          <ProfileSubscribedOffers />
        </section>

      </div>
    </main>
  );
}
