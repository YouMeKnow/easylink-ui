// src/App.jsx
import React, { useState } from "react";
import "./App.css";
import ScrollToTop from "@/components/common/ScrollToTop.jsx";
import Header from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/shared/ui/buttons/CvButtons.css";

import "@/i18n";

import AppRoutes from "@/AppRoutes";

export default function App() {
  const [questions, setQuestions] = useState([]);

  return (
    <>
      <Header />
      <ToastContainer />
      <ScrollToTop />
      <AppRoutes questions={questions} setQuestions={setQuestions} />
      <Footer />
    </>
  );
}
