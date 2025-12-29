import React from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import "./LanguageSwitcher.css";

const LANGUAGES = [
  { code: "en", label: "English", countryCode: "GB" },
  { code: "ru", label: "Русский", countryCode: "RU" },
  { code: "fr", label: "Français", countryCode: "FR" },
];

function Chevron({ open }) {
  return (
    <svg
      className={`ls__chev ${open ? "is-open" : ""}`}
      width="16"
      height="16"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        d="M5 7.5l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LanguageSwitcher({ dropUp = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  const current =
    LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  // close on outside click + Esc
  React.useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e) => {
      if (!open) return;
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const menuStyle = dropUp
    ? { bottom: "calc(100% + 10px)", top: "auto" }
    : { top: "calc(100% + 10px)", bottom: "auto" };

  return (
    <div className="ls" ref={ref}>
      <button
        type="button"
        className="ls__btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ReactCountryFlag
          countryCode={current.countryCode}
          svg
          className="ls__flag"
        />
        <span className="ls__label">{current.label}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className="ls__menu" role="menu" style={menuStyle}>
          {LANGUAGES.map((lang) => {
            const active = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                className={`ls__item ${active ? "is-active" : ""}`}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setOpen(false);
                }}
                role="menuitem"
              >
                <ReactCountryFlag
                  countryCode={lang.countryCode}
                  svg
                  className="ls__flag"
                />
                <span className="ls__itemLabel">{lang.label}</span>
                {active && <span className="ls__check" aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
