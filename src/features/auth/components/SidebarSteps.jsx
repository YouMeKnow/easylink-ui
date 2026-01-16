import React from "react";
import { useTranslation } from "react-i18next";

export default function SidebarSteps({ step, totalQuestions, totalSteps }) {
  const { t } = useTranslation("signup");

  const hasPickedCount = Number.isFinite(totalQuestions) && totalQuestions > 0;

  // safe offsets only when count chosen
  const qStart = 3;
  const qEndExclusive = hasPickedCount ? totalQuestions + 3 : 3; // preview starts at totalQuestions+3

  const isQuestionsFlow = hasPickedCount && step >= qStart && step < qEndExclusive;
  const doneQuestionsFlow = hasPickedCount && step >= qEndExclusive;

  const items = [
    {
      id: 1,
      label: t("step1_label"),
      state: step === 1 ? "active" : step > 1 ? "done" : "idle",
    },
    {
      id: 2,
      label: t("step2_label"),
      state: step === 2 ? "active" : step > 2 ? "done" : "idle",
    },
    {
      id: 3,
      label: t("step3_question"),
      state: isQuestionsFlow ? "active" : doneQuestionsFlow ? "done" : "idle",
    },
    {
      id: 4,
      label: t("step3_create"),
      state: hasPickedCount && step >= qEndExclusive ? "active" : "idle",
    },
  ];

  // Progress label:
  // before picking count -> show 1..4
  // after picking -> show real totalSteps (passed from parent)
  const uiTotal = hasPickedCount ? totalSteps : 4;

  // cap step for label, but also map internal step to wizard step when count not picked
  const uiStep = hasPickedCount ? Math.min(step, uiTotal) : Math.min(step, 2); // до выбора максимум шаг 2

  return (
    <nav className="signup-steps" aria-label={t("title")}>
      <div className="signup-steps-head">
        <div className="signup-steps-meta">
          {t("progress_step", { step: uiStep, total: uiTotal })}
        </div>
      </div>

      <ol className="signup-steps-list">
        {items.map((it) => (
          <li
            key={it.id}
            className={`signup-step signup-step--${it.state}`}
            aria-current={it.state === "active" ? "step" : undefined}
          >
            <span className="signup-step-badge" aria-hidden="true">
              {it.state === "done" ? <span className="signup-step-check" /> : it.id}
            </span>

            <span className="signup-step-label">{it.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
