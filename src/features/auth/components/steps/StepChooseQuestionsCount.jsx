import React from "react";
import { useTranslation } from "react-i18next";

export default function StepChooseQuestionsCount({ form }) {
  const { t } = useTranslation("signup");

  const pick = (num) => {
    form.setTotalQuestions(num);
    form.setStep(3);
  };

  return (
    <div className="signup-step signup-step--center animate-fadein">
      <div className="signup-step-lead">{t("step2_info")}</div>

      <div className="signup-field">
        <div className="signup-label">{t("step2_label")}</div>

        <div className="signup-pills" role="group" aria-label={t("step2_label")}>
          {[1, 2, 3, 4, 5].map((num) => {
            const active = form.totalQuestions === num;
            return (
              <button
                key={num}
                type="button"
                className={`signup-pill ${active ? "is-active" : ""}`}
                aria-pressed={active}
                onClick={() => pick(num)}
              >
                {num}
              </button>
            );
          })}
        </div>

        <div className="signup-hint">
        </div>
      </div>
    </div>
  );
}
