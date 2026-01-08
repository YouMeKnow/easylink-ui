import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useStartAuthForm } from "@/features/auth/hooks/useStartAuthForm";
import { AnimatePresence } from "framer-motion";

import StepsNav from "../components/StepsNav";
import ProgressBar from "../components/ProgressBar";
import QuestionCard from "../components/QuestionCard";
import NavigationButtons from "../components/NavigationButtons";
import "./StartAuth.css";

function StartAuth({ questions, setQuestions }) {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || params.get("next");
  const subscribe = params.get("subscribe");

  const { t: tNs } = useTranslation("auth");
  const t = (key, opts) =>
    tNs(key.startsWith("auth.") ? key.slice("auth.".length) : key, opts);

  const {
    email,
    setEmail,
    inputAnswer,
    setInputAnswer,
    answersList,
    authResult,
    currentStep,
    setCurrentStep,
    showPassword,
    setShowPassword,
    inputRef,
    verifyEmail,
    handleNext,
    handleBack,
    handleKeyDown,
    resetForm,
  } = useStartAuthForm({
    questions,
    setQuestions,
    login,
    navigate,
    t,
    subscribe,
    redirectTo,
    user,
  });

  useEffect(() => {
    resetForm();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="auth-start">
      <div className="auth-start-head">
        <h2 className="auth-start-title">{t("title")}</h2>
        <p className="auth-start-subtitle">{t("email_label")}</p>

        <div className="auth-start-email">
          <input
            type="email"
            className="auth-start-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verifyEmail(email)}
            placeholder={t("email_placeholder")}
            aria-label={t("email_label")}
            autoComplete="email"
          />

          <button
            type="button"
            className="auth-start-btn"
            onClick={() => verifyEmail(email)}
          >
            {t("next")}
          </button>
        </div>
      </div>

      {Array.isArray(questions) && questions.length > 0 && (
        <div className="auth-start-grid">
          <StepsNav
            questions={questions}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            answersList={answersList}
          />

          <div className="auth-start-main">
            <div className="auth-start-narrow">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={questions.length}
              />

              <AnimatePresence mode="wait">
                <QuestionCard
                  keyProp={currentStep}
                  question={questions[currentStep]?.question}
                  inputRef={inputRef}
                  inputAnswer={inputAnswer}
                  setInputAnswer={setInputAnswer}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  handleKeyDown={handleKeyDown}
                  currentStep={currentStep}
                  totalQuestions={questions.length}
                />
              </AnimatePresence>

              <NavigationButtons
                currentStep={currentStep}
                totalSteps={questions.length}
                handleBack={handleBack}
                handleNext={handleNext}
                inputAnswer={inputAnswer}
              />
            </div>
          </div>
        </div>
      )}

      {authResult && <div className="auth-start-alert">{authResult}</div>}

      <p className="auth-start-footer">
        {t("no_account")}{" "}
        <button
          type="button"
          className="auth-start-link"
          onClick={() => {
            const newParams = new URLSearchParams();
            if (redirectTo) newParams.set("redirectTo", redirectTo);
            if (subscribe === "true") newParams.set("subscribe", "true");
            const query = newParams.toString();
            navigate(query ? `/signup?${query}` : "/signup");
          }}
        >
          {t("signup")}
        </button>
      </p>
    </section>
  );
}

export default StartAuth;
