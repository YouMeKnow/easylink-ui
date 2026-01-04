import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useStartAuthForm } from "./hooks/useStartAuthForm";
import { AnimatePresence } from "framer-motion";

import StepsNav from "./components/StepsNav";
import ProgressBar from "./components/ProgressBar";
import QuestionCard from "./components/QuestionCard";
import NavigationButtons from "./components/NavigationButtons";

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
    <section className="container mt-4">
      <h2 className="mb-4">{t("title")}</h2>

      <div className="mb-3">
        <div className="d-flex align-items-center">
          <input
            type="email"
            className="form-control shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") verifyEmail(email);
            }}
            placeholder={t("email_placeholder")}
            aria-label={t("email_label")}
            style={{ maxWidth: "400px" }}
          />

          <button
            type="button"
            className="btn btn-primary ms-2"
            onClick={() => verifyEmail(email)}
          >
            {t("next")}
          </button>
        </div>
      </div>

      {Array.isArray(questions) && questions.length > 0 && (
  <div
    className="d-flex flex-column flex-md-row gap-4 align-items-start w-100"
    style={{ minHeight: 380 }}
  >
    {/* слева шаги */}
    <StepsNav
      questions={questions}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      answersList={answersList}
    />

    {/* справа контент */}
    <div className="flex-grow-1 position-relative w-100" style={{ minWidth: 0 }}>
      <ProgressBar currentStep={currentStep} totalSteps={questions.length} />

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
)}



      {authResult && <div className="alert alert-info mt-3">{authResult}</div>}

      <p className="text-center mt-3">
        {t("no_account")}{" "}
        <button
          onClick={() => {
            const newParams = new URLSearchParams();
            if (redirectTo) newParams.set("redirectTo", redirectTo);
            if (subscribe === "true") newParams.set("subscribe", "true");
            const query = newParams.toString();
            navigate(query ? `/signup?${query}` : "/signup");
          }}
          className="btn btn-link p-0"
          style={{ textDecoration: "underline", fontWeight: 500 }}
        >
          {t("signup")}
        </button>
      </p>
    </section>
    
  );
}

export default StartAuth;
