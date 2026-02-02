import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

import LanguageSwitcher from "@/shared/ui/LanguageSwitcher";
import NotificationBell from "@/features/notifications/NotificationBell";

import { useEarlyAccess } from "@/components/common/hooks/useEarlyAccess";
import { useEarlyAccessCheckable } from "@/components/common/hooks/useEarlyAccessCheckable";
import { trackEvent } from "@/services/amplitude";

import HeaderMobileMenu from "./HeaderMobileMenu";
import AccessCTA from "./AccessCTA";
import "./Header.css";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("header");
  const { setMode, resolved } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  // Early Access
  const {
    requestEarlyAccess,
    loading: loadingSubscribe,
    subscribed: subscribedAfterRequest,
    setSubscribed: setSubscribedAfterRequest,
  } = useEarlyAccess();

  const {
    checkEarlyAccess,
    subscribed: subscribedStatus,
    setSubscribed: setSubscribedStatus,
  } = useEarlyAccessCheckable();

  useEffect(() => {
    if (isAuthenticated) checkEarlyAccess();
  }, [isAuthenticated, checkEarlyAccess]);

  const subscribed = subscribedAfterRequest || subscribedStatus;

  const handleLogout = () => {
    trackEvent("Logout Clicked", { page: "header" });
    logout("manual");
    setSubscribedAfterRequest(false);
    setSubscribedStatus(false);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar__inner">
          {/* LEFT */}
          <div className="topbar__left">
            <Link to="/" className="topbar__logo" aria-label="YMK home">
              <img src="/clearviewblue.png" alt="YMK logo" />
              <span>YMK</span>
            </Link>

            <div className="topbar__cta">
              <AccessCTA
                subscribed={subscribed}
                loading={loadingSubscribe}
                onClick={() =>
                  isAuthenticated ? requestEarlyAccess() : navigate("/signin")
                }
              />
            </div>
          </div>

          {/* CENTER */}
          <nav className="topbar__nav">
            <Link to="/" onClick={() => trackEvent("Header Home Clicked")}>
              {t("home")}
            </Link>

            {!isAuthenticated && (
              <Link to="/signup" onClick={() => trackEvent("Header Sign Up Clicked")}>
                {t("sign_up")}
              </Link>
            )}

            {!isAuthenticated && (
              <Link to="/signin" onClick={() => trackEvent("Header Sign In Clicked")}>
                {t("log_in")}
              </Link>
            )}

            {isAuthenticated && (
              <Link to="/profile" onClick={() => trackEvent("Header Profile Clicked")}>
                {t("profile")}
              </Link>
            )}

            <Link to="/about" onClick={() => trackEvent("Header About Clicked")}>
              {t("about")}
            </Link>

            <Link to="/review" onClick={() => trackEvent("Header Review Clicked")}>
              {t("review")}
            </Link>

            {isAuthenticated && (
              <button
                type="button"
                className="topbar__linkBtn"
                onClick={handleLogout}
              >
                {t("log_out")}
              </button>
            )}
          </nav>

          {/* RIGHT */}
          <div className="topbar__right">
            <div className="topbar__lang">
              <LanguageSwitcher />
            </div>

            <NotificationBell />

            <button
              className="topbar__iconBtn"
              onClick={() => setMode(resolved === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              type="button"
            >
              {resolved === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              className="topbar__burger"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              type="button"
            >
              <span className="topbar__burgerIcon" aria-hidden>
                ☰
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <HeaderMobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        trackEvent={trackEvent}
      />
    </>
  );
}

export default Header;
