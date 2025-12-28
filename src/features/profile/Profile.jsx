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
        {/* Hero */}
        <section className="profile__hero glass animate-slideUp" role="region" aria-label={t("welcome")}>
          <div className="profile__hero-title">
            <h1 className="profile__heading">{t("welcome")}</h1>
            <p className="profile__subheading">{t("dashboard")}</p>
          </div>

          {/* Quick user chip (optional) */}
          {user?.email && (
            <div className="profile__chip" title={user.email}>
              <span className="profile__chip-dot" />
              <span className="profile__chip-text">{user.email}</span>
            </div>
          )}
        </section>

        {/* Search */}
        <section className="profile__search glass animate-fadeIn" role="search">
          <VibeSearch />
        </section>

        {/* Cards */}
        <section className="profile__cards animate-stagger">
          <ProfileCards cards={profileCards} />
        </section>
      </div>
    </main>
  );
}
