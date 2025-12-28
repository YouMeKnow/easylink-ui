import React, { useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import BusinessVibeForm from "./business/BusinessVibeForm";
import PersonalVibeForm from "./personal/PersonalVibeForm";
import EventVibeForm from "./events/EventVibeForm";
import BackButton from "@/components/common/BackButton";
import "./CreateVibe.css";

const TYPE_COMPONENTS = {
  BUSINESS: BusinessVibeForm,
  PERSONAL: PersonalVibeForm,
  EVENT: EventVibeForm,
};

const ALLOWED_TYPES = ["BUSINESS", "PERSONAL", "EVENT"];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function CreateVibe() {
  const { t } = useTranslation("create_vibe");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();

  const queryType = (searchParams.get("type") || "").toUpperCase();
  const stateType = (location.state?.prefillType || "").toUpperCase();
  const initialType = ALLOWED_TYPES.includes(queryType)
    ? queryType
    : ALLOWED_TYPES.includes(stateType)
    ? stateType
    : "BUSINESS";

  const [type, setType] = React.useState(initialType);

  useEffect(() => {
    const q = (searchParams.get("type") || "").toUpperCase();
    if (ALLOWED_TYPES.includes(q) && q !== type) {
      setType(q);
    }
  }, [searchParams, type]);

  const Form = TYPE_COMPONENTS[type] || BusinessVibeForm;

  const typeOptions = [
    { value: "BUSINESS", label: t("types.business") },
    { value: "PERSONAL", label: t("types.personal") },
    { value: "EVENT", label: t("types.event") },
  ];

  return (
    <main className="create-vibe">
      {/* sticky header */}
      <div className="cv-header">
        <div className="cv-header__left">
          <BackButton
            to="/profile"
            label={isMobile ? t("back_short") : t("back")}
            className="cv-back-btn"
          />
        </div>
        <h2 className="cv-header__title">{t("title")}</h2>
        <div className="cv-header__right" />
      </div>

      {/* type selector */}
      <section className="cv-type">
        {isMobile ? (
          <div className="cv-segments" role="tablist" aria-label={t("type_label")}>
            {typeOptions.map((opt) => {
              const active = type === opt.value;
              return (
                <button
                  key={opt.value}
                  role="tab"
                  aria-selected={active}
                  className={`cv-segment ${active ? "is-active" : ""}`}
                  onClick={() => {
                    setType(opt.value);
                    const url = new URL(window.location.href);
                    url.searchParams.set("type", opt.value);
                    window.history.replaceState({}, "", url.toString());
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="cv-select-wrap">
            <label className="form-label" htmlFor="vibe-type">
              {t("type_label")}
            </label>
            <select
              id="vibe-type"
              className="form-select"
              value={type}
              onChange={(e) => {
                const next = e.target.value;
                setType(next);
                const url = new URL(window.location.href);
                url.searchParams.set("type", next);
                window.history.replaceState({}, "", url.toString());
              }}
              aria-label={t("type_label")}
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>
      <section className="cv-form">
        <div className="cv-form__inner">
          <Form mode="create" />
        </div>
      </section>
    </main>
  );
}
