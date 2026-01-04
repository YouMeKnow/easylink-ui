import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { verifyEmailAPI, checkAnswersAPI } from "../../../api/authService";

export function useStartAuthForm({
  questions,
  setQuestions,
  login,
  navigate,
  t,
  subscribe,
  redirectTo,
  user,
}) {
  const [email, setEmail] = useState("");
  const [inputAnswer, setInputAnswer] = useState("");
  const [answersList, setAnswersList] = useState([]);
  const [authResult, setAuthResult] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    setInputAnswer(answersList[currentStep] || "");
    inputRef.current?.focus();
  }, [currentStep, answersList]);

  const verifyEmail = async (inputEmail) => {
    const normalized = (inputEmail || "").trim();
    if (!normalized) return;

    try {
      const data = await verifyEmailAPI(normalized);
      setEmail(normalized);
      setQuestions(data);
      setAnswersList(new Array(data.length).fill(""));
      setCurrentStep(0);
    } catch (error) {
      const msg = typeof error.message === "string" ? error.message : t("auth.error_verifying_email");
      toast.error(msg, { position: "top-right" });
    }
  };

  const handleNext = () => {
    const trimmed = (inputAnswer || "").trim();
    if (!trimmed) return;

    const updated = [...answersList];
    updated[currentStep] = trimmed;
    setAnswersList(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setInputAnswer("");
      checkAnswers(updated);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  // ---- FIXED ----
  const checkAnswers = async (finalAnswers = []) => {
    // console.debug("[checkAnswers] email=%s, answers=%o", email, finalAnswers);

    if (!Array.isArray(finalAnswers)) {
      console.error("[checkAnswers] invalid finalAnswers", finalAnswers);
      return;
    }

    if (finalAnswers.length !== questions.length) {
      toast.warn(t("auth.answer_exactly", { count: questions.length }), { position: "top-right" });
      return;
    }

    try {
      const answers = questions.map((q, i) => ({
        entryId: q.entryId,
        answer: finalAnswers[i] || "",
      }));

      const timezone = user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await checkAnswersAPI(email, answers, timezone);
      window.__authlog?.("check result", result);

      const accessToken = result.accessToken || null;
      const cookieBased = result.cookieBased === true;

      toast.success(t("auth.success"), { position: "top-right" });
      setAuthResult(t("auth.success"));
      login({ email, timezone }, accessToken, { cookieBased });
      let target = redirectTo || "/profile";

      if (subscribe === "true") {
        try {
          const u = new URL(target, window.location.origin);
          u.searchParams.set("subscribe", "true");
          target = u.pathname + u.search + u.hash;
        } catch {
          target = target.includes("?") ? `${target}&subscribe=true` : `${target}?subscribe=true`;
        }
      }

      navigate(target, { replace: true });
    } catch (err) {
      console.error("[checkAnswers] status=%s, message=%s", err?.status, err?.message, err);
      if (err?.status === 423) {
        toast.error(t("auth.blocked", { reason: err.message }), { position: "top-right" });
      } else if (err?.status === 401) {
        toast.warn(t("auth.wrong_answers", { reason: err.message }), { position: "top-right" });
      } else {
        toast.error(t("auth.general_error", { status: err?.status }), { position: "top-right" });
      }
    }
  };

  const resetForm = () => {
    setEmail("");
    setInputAnswer("");
    setAnswersList([]);
    setAuthResult("");
    setCurrentStep(0);
    setShowPassword(false);
    setQuestions([]);
  };

  return {
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
  };
}
