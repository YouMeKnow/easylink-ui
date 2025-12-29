import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/ui/LanguageSwitcher";
import { useEarlyAccess } from "@/components/common/hooks/useEarlyAccess";
import { useEarlyAccessCheckable } from "@/components/common/hooks/useEarlyAccessCheckable";
import { trackEvent } from "@/services/amplitude";
import "./Header.css";
import HeaderMobileMenu from "./HeaderMobileMenu";
import AccessCTA from "./AccessCTA"; 
import { ThemeProvider, useTheme } from "@/context/ThemeContext";



function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const { t } = useTranslation("header");
  const { t: tc } = useTranslation("common"); 

  const [menuOpen, setMenuOpen] = useState(false);
  const { mode, setMode, resolved } = useTheme();

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
    logout();
    setSubscribedAfterRequest(false);
    setSubscribedStatus(false);
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__top">
            <Link to="/" className="logo" aria-label="YMK home">
              <img src="/clearviewblue.png" alt="YMK logo" />
              <span>YMK</span>
            </Link>

            <AccessCTA
              className="header__access"
              subscribed={subscribed}
              loading={loadingSubscribe}
              onClick={() => (isAuthenticated ? requestEarlyAccess() : navigate("/signin"))}
            />

            <div className="header__right">
              <nav className="nav">
                <Link to="/" onClick={() => trackEvent("Header Home Clicked")}>{t("home")}</Link>
                {!isAuthenticated && <Link to="/signup" onClick={() => trackEvent("Header Sign Up Clicked")}>{t("sign_up")}</Link>}
                {!isAuthenticated && <Link to="/signin" onClick={() => trackEvent("Header Sign In Clicked")}>{t("log_in")}</Link>}
                {isAuthenticated && <Link to="/profile" onClick={() => trackEvent("Header Profile Clicked")}>{t("profile")}</Link>}
                <Link to="/about" onClick={() => trackEvent("Header About Clicked")}>{t("about")}</Link>
                <Link to="/review" onClick={() => trackEvent("Header Review Clicked")}>{t("review")}</Link>                
                {isAuthenticated && (
                  <Link
                    to="/"
                    onClick={(e) => { e.preventDefault(); handleLogout(); }}
                  >
                    {t("log_out")}
                  </Link>
                )}
              </nav>

              <div className="language-switcher">
                <LanguageSwitcher />

                {/* Theme toggle */}
                <button
                  className="theme-toggle"
                  onClick={() =>
                    setMode(resolved === "dark" ? "light" : "dark")
                  }
                  aria-label="Toggle theme"
                  title="Toggle theme"
                >
                  {resolved === "dark" ? "🌙" : "☀️"}
                </button>
              </div>

            </div>

            <button
              className="burger-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

          </div>
        </div>
      </header>

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
