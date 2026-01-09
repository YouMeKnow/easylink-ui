import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSignUpForm } from "@/features/auth/hooks/useSignUpForm";
import "./SignUpMemoryLocks.css";
// import signupImg from "@/assets/signup-illustration.png";

import SidebarSteps from "../components/SidebarSteps";
import StepEmail from "../components/steps/StepEmail";
import StepChooseQuestionsCount from "../components/steps/StepChooseQuestionsCount";
import StepAddQuestion from "../components/steps/StepAddQuestion";
import StepPreview from "../components/steps/StepPreview";

function SignUpMemoryLocks({ headerRight = null, query = "" }) {
  const navigate = useNavigate();


  const { t: tNs } = useTranslation("signup");
  const t = (key, opts) =>
    tNs(key.startsWith("signup.") ? key.slice("signup.".length) : key, opts);
  
  const params = new URLSearchParams(query);
  const redirectTo = params.get("redirectTo") || params.get("next");
  const subscribe = params.get("subscribe");

  const form = useSignUpForm(navigate, t, redirectTo, subscribe);

  const renderStep = () => {
    if (form.step === 1) return <StepEmail form={form} />;
    if (form.step === 2) return <StepChooseQuestionsCount form={form} />;
    if (form.step >= 3 && form.step < form.totalQuestions + 3) return <StepAddQuestion form={form} />;
    return <StepPreview form={form} />;
  };

  const hasPickedCount = Number.isFinite(form.totalQuestions) && form.totalQuestions > 0;
  const totalSteps = hasPickedCount ? form.totalQuestions + 3 : 4;
  const uiStep = hasPickedCount ? form.step : Math.min(form.step, 2);
  const progress = Math.min((uiStep / totalSteps) * 100, 100);

  return (
    <section className="signup-shell">
      <div className="signup-wrap">
        <div className="signup-card">
          <header className="signup-header">
            <div className="signup-headline">
              <h2 className="signup-title">{t("title")}</h2>

              <p className="signup-subtitle">
                {hasPickedCount
                  ? (form.step < form.totalQuestions + 3
                      ? t("progress_step", { step: form.step, total: totalSteps })
                      : t("progress_done"))
                  : t("progress_step", { step: uiStep, total: totalSteps })}
              </p>
            </div>

            {/* right side (mode switch from SignUp.jsx) */}
            {headerRight ? <div className="signup-header-right">{headerRight}</div> : null}

            <div className="signup-progress" aria-hidden="true">
              <div className="signup-progress-bar" style={{ width: `${progress}%` }} />
            </div>
          </header>

          <div className="signup-content">
            <aside className="signup-aside">
              <SidebarSteps
                step={form.step}
                totalQuestions={form.totalQuestions}
                totalSteps={totalSteps}
              />
            </aside>

            <main className="signup-main" role="main">
              <div className="signup-step-wrap">{renderStep()}</div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUpMemoryLocks;
