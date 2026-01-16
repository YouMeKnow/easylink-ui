import React from "react";
import { useTranslation } from "react-i18next";

export default function StepEmail({ form }) {
  const { t } = useTranslation("signup");

  const invalid = !form.isEmailValid && form.email.trim() && form.emailTouched;

  const goNext = () => {
    form.setEmailTouched(true);
    if (form.email.trim() && form.isEmailValid) form.setStep(2);
  };

  return (
    <div className="signup-step animate-fadein">
      <div className="signup-step-lead">{t("step1_info")}</div>

      <div className="signup-field">
        <label className="signup-label" htmlFor="signup-email">
          {t("step1_label")}
        </label>

        <div className={`signup-input ${invalid ? "is-invalid" : ""}`}>
          <input
            id="signup-email"
            type="email"
            value={form.email}
            onChange={form.handleEmailChange}
            onBlur={() => form.setEmailTouched(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goNext();
            }}
            placeholder={t("step1_placeholder", { defaultValue: "you@example.com" })}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? "signup-email-error" : undefined}
            className="signup-input-el"
          />

          {invalid && (
            <span className="signup-input-icon" aria-hidden="true">
              {/* без bootstrap icons, чтобы не зависеть от них */}
              !
            </span>
          )}
        </div>

        {invalid && (
          <div id="signup-email-error" className="signup-error">
            {t("step1_invalid")}
          </div>
        )}
      </div>

      <div className="signup-actions">
        <button
          type="button"
          className="signup-btn signup-btn-primary"
          onClick={goNext}
          disabled={!form.email.trim()}
        >
          {t("step1_next")}
        </button>
      </div>
    </div>
  );
}
