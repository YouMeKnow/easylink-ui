import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { signUpAPI } from "../../../api/authService";

export function useSignUpForm(navigate, t, redirectTo, subscribe) {
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionTemplates, setQuestionTemplates] = useState([]);
  const [step, setStep] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(3);

  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [customQuestionVisible, setCustomQuestionVisible] = useState(false);
  const [realQuestion, setRealQuestion] = useState("");
  const [associativeQuestion, setAssociativeQuestion] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [entriesList, setEntriesList] = useState([]);
  const [emailTouched, setEmailTouched] = useState(false);
  const [subStep, setSubStep] = useState(0);

  const isEmailValid =
    email.trim().length === 0 ? true : /^\S+@\S+\.\S+$/.test(email.trim());

  useEffect(() => {
    fetch("/api/v3/auth/question-templates")
      .then((res) => res.json())
      .then((data) => setQuestionTemplates(data))
      .catch(() => setQuestionTemplates([]));
  }, []);

  const handleSelectQuestion = (e) => {
    const value = e.target.value;
    setSelectedQuestion(value);
    setCustomQuestionVisible(value === "custom");
    setRealQuestion(value === "custom" ? "" : value);
  };

  const handleAdd = () => {
    if (
      (!customQuestionVisible && !selectedQuestion) ||
      (customQuestionVisible && !realQuestion.trim()) ||
      !associativeQuestion.trim() ||
      !answerText.trim()
    ) {
      toast.error(t("signup.toast_fill_all"), { position: "top-right" });
      return;
    }

    const questionTemplate =
      selectedQuestion === "custom"
        ? {
            text: realQuestion.trim(),
            predefined: false,
            createdAt: new Date().toISOString(),
          }
        : {
            text: selectedQuestion,
            predefined: true,
            createdAt: new Date().toISOString(),
          };

    const newEntry = {
      realQuestion: questionTemplate,
      associativeQuestion: associativeQuestion.trim(),
      answer: answerText.trim(),
    };

    const updatedList = [...entriesList, newEntry];
    setEntriesList(updatedList);

    if (updatedList.length >= totalQuestions) {
      setStep(totalQuestions + 3);
    } else {
      setStep((prev) => prev + 1);
    }

    setSelectedQuestion("");
    setCustomQuestionVisible(false);
    setRealQuestion("");
    setAssociativeQuestion("");
    setAnswerText("");
    setShowAnswer(false);
    setSubStep(0);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailTouched) setEmailTouched(false);
  };

  const handleSignup = async () => {
    if (!email.trim()) {
      toast.error(t("signup.toast_email_required"), { position: "top-right" });
      return;
    }

    try {
      const message = await signUpAPI(email, entriesList);
      toast.success(message, { position: "top-right" });

      const u = new URL("/email-verification-sent", window.location.origin);
      u.searchParams.set("email", email);

      if (redirectTo) u.searchParams.set("next", redirectTo); 
      if (subscribe === "true") u.searchParams.set("subscribe", "true");

      navigate(u.pathname + u.search, { replace: true });
    } catch (error) {
      const messageKey = error.response?.data?.message || error.message;

      if (messageKey?.startsWith("signup.")) {
        toast.error(t(messageKey), { position: "top-right" });
      } else {
        toast.error(messageKey || t("auth.general_error"), { position: "top-right" });
      }
    }
  };


  return {
    email,
    setEmail,
    questions,
    setQuestions,
    questionTemplates,
    step,
    setStep,
    totalQuestions,
    setTotalQuestions,
    selectedQuestion,
    setSelectedQuestion,
    customQuestionVisible,
    setCustomQuestionVisible,
    realQuestion,
    setRealQuestion,
    associativeQuestion,
    setAssociativeQuestion,
    answerText,
    setAnswerText,
    showAnswer,
    setShowAnswer,
    entriesList,
    setEntriesList,
    emailTouched,
    setEmailTouched,
    subStep,
    setSubStep,
    isEmailValid,

    handleSelectQuestion,
    handleAdd,
    handleEmailChange,
    handleSignup,
  };
}
