import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/ui/LanguageSwitcher";
import "./HeaderMobileMenu.css";

import {
  X,
  ChevronRight,
  Home,
  User,
  Info,
  MessageSquare,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";

function MenuItem({ to, onClick, icon: Icon, children }) {
  return (
    <Link to={to} className="mItem" onClick={onClick}>
      <span className="mItem__icon" aria-hidden>
        <Icon size={18} />
      </span>
      <span className="mItem__label">{children}</span>
      <span className="mItem__chev" aria-hidden>
        <ChevronRight size={18} />
      </span>
    </Link>
  );
}

function MenuButton({ onClick, icon: Icon, danger = false, children }) {
  return (
    <button
      type="button"
      className={"mItem " + (danger ? "is-danger" : "")}
      onClick={onClick}
    >
      <span className="mItem__icon" aria-hidden>
        <Icon size={18} />
      </span>
      <span className="mItem__label">{children}</span>
      <span className="mItem__chev" aria-hidden>
        <ChevronRight size={18} />
      </span>
    </button>
  );
}

function HeaderMobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  handleLogout,
  trackEvent,
}) {
  const { t } = useTranslation("header");

  if (!isOpen) return null;

  return (
    <div
      className="mobile-menu-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
    >
      <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo" onClick={onClose} aria-label="YMK home">
            <img src="/clearviewblue.png" alt="YMK logo" />
            <span>YMK</span>
          </Link>

          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-nav">
          <MenuItem
            to="/"
            icon={Home}
            onClick={() => {
              trackEvent("Mobile Home Clicked");
              onClose();
            }}
          >
            {t("home")}
          </MenuItem>

          {!isAuthenticated && (
            <MenuItem
              to="/signup"
              icon={UserPlus}
              onClick={() => {
                trackEvent("Mobile Sign Up Clicked");
                onClose();
              }}
            >
              {t("sign_up")}
            </MenuItem>
          )}

          {!isAuthenticated && (
            <MenuItem
              to="/signin"
              icon={LogIn}
              onClick={() => {
                trackEvent("Mobile Sign In Clicked");
                onClose();
              }}
            >
              {t("log_in")}
            </MenuItem>
          )}

          {isAuthenticated && (
            <MenuItem
              to="/profile"
              icon={User}
              onClick={() => {
                trackEvent("Mobile Profile Clicked");
                onClose();
              }}
            >
              {t("profile")}
            </MenuItem>
          )}

          <MenuItem
            to="/about"
            icon={Info}
            onClick={() => {
              trackEvent("Mobile About Clicked");
              onClose();
            }}
          >
            {t("about")}
          </MenuItem>

          <MenuItem
            to="/review"
            icon={MessageSquare}
            onClick={() => {
              trackEvent("Mobile Review Clicked");
              onClose();
            }}
          >
            {t("review")}
          </MenuItem>

          {isAuthenticated && (
            <MenuButton
              danger
              icon={LogOut}
              onClick={() => {
                handleLogout();
                onClose();
              }}
            >
              {t("log_out")}
            </MenuButton>
          )}
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-lang">
            <LanguageSwitcher dropUp />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderMobileMenu;
