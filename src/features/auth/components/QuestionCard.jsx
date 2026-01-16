import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./QuestionCard.css";

export default function QuestionCard({
  keyProp,
  question,
  inputRef,
  inputAnswer,
  setInputAnswer,
  showPassword,
  setShowPassword,
  handleKeyDown,
  currentStep,
  totalQuestions,
}) {
  const { t } = useTranslation("auth");
  const inputId = `auth-answer-${currentStep}`;

  // автофокус на каждом шаге
  useEffect(() => {
    inputRef?.current?.focus?.();
  }, [currentStep, inputRef]);

  return (
    <motion.div
      key={keyProp}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
      className="auth-qcard"
    >
      {totalQuestions > 1 && (
        <div className="auth-qcard-meta">
          {t("progress", { current: currentStep + 1, total: totalQuestions })}
        </div>
      )}

      <label htmlFor={inputId} className="auth-qcard-title">
        {question}
      </label>

      <div className="auth-qcard-hint">{t("case_insensitive")}</div>

      <div className="auth-qcard-inputrow">
        <input
          id={inputId}
          ref={inputRef}
          type={showPassword ? "text" : "password"}
          className="auth-qcard-input"
          value={inputAnswer}
          onChange={(e) => setInputAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("answer_placeholder")}
          spellCheck={false}
          autoComplete="off"
        />

        <button
          className="auth-qcard-eye"
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={showPassword ? "Hide answer" : "Show answer"}
          aria-pressed={showPassword}
          title={showPassword ? "Hide" : "Show"}
        >
          <i className={`bi bi-eye${showPassword ? "-slash" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}
