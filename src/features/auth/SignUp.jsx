import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSignUpForm } from "./hooks/useSignUpForm";
import "./SignUp.css";
import SidebarSteps from "./components/SidebarSteps";
import StepEmail from "./components/steps/StepEmail";
import StepChooseQuestionsCount from "./components/steps/StepChooseQuestionsCount";
import StepAddQuestion from "./components/steps/StepAddQuestion";
import StepPreview from "./components/steps/StepPreview";

function SignUp() {
  const navigate = useNavigate();

  const { t: tNs } = useTranslation("signup");

  const t = (key, opts) => tNs(key.startsWith("signup.") ? key.slice("signup.".length) : key, opts);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || params.get("next");
  const subscribe = params.get("subscribe");

  const form = useSignUpForm(navigate, t, redirectTo, subscribe);

  const renderStep = () => {
    if (form.step === 1) return <StepEmail form={form} />;
    if (form.step === 2) return <StepChooseQuestionsCount form={form} />;
    if (form.step >= 3 && form.step < form.totalQuestions + 3) return <StepAddQuestion form={form} />;
    return <StepPreview form={form} />;
  };

  const totalSteps = form.totalQuestions + 2; // 1: email, 2: count, 3..N: questions, last: preview
  const progress = Math.min((form.step / (totalSteps + 1)) * 100, 100);

  return (
    <section className="container mt-5 mb-5">
      <div className="mx-auto" style={{ maxWidth: 1500, padding: "24px 0" }}>
        <div className="d-flex flex-column flex-lg-row justify-content-center align-items-start gap-5">
          <SidebarSteps
            step={form.step}
            totalQuestions={form.totalQuestions}
          />

          <div className="flex-grow-1 d-flex flex-column align-items-center px-3 px-md-4 px-lg-5 w-100">
            {/* progress */}
            <div className="mb-4" style={{ width: "100%", maxWidth: 720 }}>
              <div className="progress" style={{ height: 20 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progress}%`, backgroundColor: "#5cb85c" }}
                >
                  {form.step < form.totalQuestions + 3
                    ? t("progress_step", { step: form.step, total: totalSteps })
                    : t("progress_done")}
                </div>
              </div>
            </div>

            {/* title */}
            <h2 className="mb-4 text-center fw-bold fs-4 fs-md-3 fs-lg-2 w-100">
              {t("title")} <span role="img" aria-label="lock">🔒</span>
            </h2>

            <div className="signup-main-column w-100">{renderStep()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
