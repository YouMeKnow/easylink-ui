import React from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

export default function StepAddQuestion({ form }) {
  const { t } = useTranslation("signup");
  const isLastQuestion = form.entriesList.length + 1 === form.totalQuestions;

  const canGoFrom0 =
    (!form.customQuestionVisible && !!form.selectedQuestion) ||
    (form.customQuestionVisible && !!form.realQuestion.trim());

  const canGoFrom1 = !!form.associativeQuestion.trim();
  const canFinish = !!form.answerText.trim();

  return (
    <div className="signup-step animate-fadein">
      <div className="signup-step-lead">{t("step3_info")}</div>

      <div className="signup-step-head">
        <div className="signup-step-title">
          {t("step3_question")} {form.step - 2}{" "}
          {t("step3_of", { total: form.totalQuestions })}
        </div>

        <div className="signup-substeps" aria-hidden="true">
          <span
            className={`signup-dot ${
              form.subStep === 0
                ? "is-active"
                : form.subStep > 0
                ? "is-done"
                : ""
            }`}
          />
          <span
            className={`signup-dot ${
              form.subStep === 1
                ? "is-active"
                : form.subStep > 1
                ? "is-done"
                : ""
            }`}
          />
          <span
            className={`signup-dot ${
              form.subStep === 2 ? "is-active" : ""
            }`}
          />
        </div>
      </div>

      {/* STEP 0 — choose question */}
      {form.subStep === 0 && (
        <div className="signup-panel">
          <div className="signup-field">
            <label className="signup-label" htmlFor="signup-question">
              {t("step3_question")}
            </label>

            <select
              id="signup-question"
              className="signup-select"
              onChange={form.handleSelectQuestion}
              value={form.selectedQuestion}
            >
              <option value="">{`— ${t("step3_select")} —`}</option>
              <option value="custom">{t("step3_custom")}</option>
              {form.questionTemplates.map((q, i) => (
                <option key={i} value={q.text}>
                  {q.text}
                </option>
              ))}
            </select>
          </div>

          {form.customQuestionVisible && (
            <div className="signup-field">
              <label
                className="signup-label"
                htmlFor="signup-custom-question"
              >
                {t("step3_custom_label")}
              </label>

              <input
                id="signup-custom-question"
                className="signup-input-el signup-input-plain"
                value={form.realQuestion}
                onChange={(e) => form.setRealQuestion(e.target.value)}
                placeholder={t("step3_custom_label")}
                autoFocus
              />
            </div>
          )}

          <div className="signup-actions">
            <button
              type="button"
              className="signup-btn signup-btn-primary"
              disabled={!canGoFrom0}
              onClick={() => form.setSubStep(1)}
            >
              {t("step3_next")}
            </button>
          </div>
        </div>
      )}

      {/* STEP 1 — hint */}
      {form.subStep === 1 && (
        <div className="signup-panel">
          <div className="signup-field">
            <label className="signup-label" htmlFor="signup-hint">
              {t("step3_hint")}
            </label>

            <input
              id="signup-hint"
              className="signup-input-el signup-input-plain"
              value={form.associativeQuestion}
              onChange={(e) =>
                form.setAssociativeQuestion(e.target.value)
              }
              placeholder={t("step3_hint_placeholder")}
              autoFocus
            />
          </div>

          <div className="signup-actions signup-actions-split">
            <button
              type="button"
              className="signup-btn signup-btn-ghost"
              onClick={() => form.setSubStep(0)}
            >
              {t("step3_back")}
            </button>

            <button
              type="button"
              className="signup-btn signup-btn-primary"
              disabled={!canGoFrom1}
              onClick={() => form.setSubStep(2)}
            >
              {t("step3_next")}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — answer */}
      {form.subStep === 2 && (
        <div className="signup-panel">
          <div className="signup-field">
            <label className="signup-label" htmlFor="signup-answer">
              {t("step3_answer")}
            </label>

            <div className="signup-input">
              <input
                id="signup-answer"
                type={form.showAnswer ? "text" : "password"}
                className="signup-input-el"
                placeholder={t("step3_answer")}
                value={form.answerText}
                onChange={(e) => form.setAnswerText(e.target.value)}
                autoFocus
                autoComplete="off"
              />

              <button
                type="button"
                className="signup-icon-btn"
                onClick={() => form.setShowAnswer(!form.showAnswer)}
                onMouseDown={(e) => e.preventDefault()}
                aria-label={
                  form.showAnswer ? t("hide") : t("show")
                }
              >
                {form.showAnswer ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="signup-actions signup-actions-split">
            <button
              type="button"
              className="signup-btn signup-btn-ghost"
              onClick={() => form.setSubStep(1)}
            >
              {t("step3_back")}
            </button>

            <button
              type="button"
              className="signup-btn signup-btn-primary"
              disabled={!canFinish}
              onClick={() => {
                form.handleAdd();
                form.setSubStep(0);
              }}
            >
              {isLastQuestion
                ? t("step3_create")
                : t("step3_next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
