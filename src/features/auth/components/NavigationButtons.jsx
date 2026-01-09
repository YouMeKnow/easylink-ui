import React from "react";
import { useTranslation } from "react-i18next";

export default function NavigationButtons({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  inputAnswer = "",
}) {
  const { t } = useTranslation("auth");

  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const canNext = inputAnswer.trim().length > 0;

  return (
    <div
      className="
        d-flex
        flex-column flex-sm-row              
        align-items-stretch align-items-sm-center
        justify-content-sm-center
        gap-2                                
        mt-3
      "
      style={{ width: "100%" }}
    >
      {/* Back */}
      <button
        type="button"
        className="nav-btn nav-btn-ghost"
        onClick={handleBack}
        disabled={isFirst}
      >
        <i className="bi bi-arrow-left" />
        {t("back")}
      </button>

      {/* Next / Login */}
      <button
        type="button"
        className="nav-btn nav-btn-primary"
        onClick={handleNext}
        disabled={!canNext}
        aria-label={isLast ? t("login") : t("next")}
      >
        {isLast ? t("login") : t("next")}
        <i className="bi bi-arrow-right" />
      </button>
    </div>
  );
}
