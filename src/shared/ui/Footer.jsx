import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation("footer");

  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearLabel =
    currentYear > startYear ? `${startYear}-${currentYear}` : startYear;

  return (
    <footer className="footer" role="contentinfo">
      <nav
        className="footer__links"
        aria-label={t("nav_label", "Footer navigation")}
      >
        <Link to="/terms">{t("terms")}</Link>
        <Link to="/privacy">{t("privacy")}</Link>
        <Link to="/ads">{t("ads")}</Link>
      </nav>

      <div className="footer__copy">
        © {yearLabel} {t("brand")}. {t("copyright")}
      </div>
    </footer>
  );
}
