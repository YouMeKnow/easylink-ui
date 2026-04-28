import React from "react";
import { useTranslation } from "react-i18next";
import QuestionsPreview from "../QuestionsPreview";

export default function StepPreview({ form }) {
  const { t } = useTranslation("signup");
  const entriesList = form.entriesList ?? form.questions ?? [];

  return (
    <div className="signup-step animate-fadein">
      <div className="signup-step-head">
        <div className="signup-step-title">{t("finish_title") ?? t("finish_create")}</div>
        <div className="signup-step-lead">{t("finish_info") ?? ""}</div>
      </div>

      <div className="signup-panel signup-panel-preview">
        <QuestionsPreview entriesList={entriesList} />
      </div>

      <div className="signup-actions">
        <button
          type="button"
          className="signup-btn signup-btn-primary signup-btn-wide"
          onClick={form.handleSignup}
        >
          {t("finish_create")}
        </button>
      </div>
    </div>
  );
}
