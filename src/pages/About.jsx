import React from "react";
import { FaKey, FaLock, FaBolt, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./styles/About.css";

const iconList = [
  <FaKey size={28} className="about__icon" />,
  <FaLock size={28} className="about__icon" />,
  <FaBolt size={28} className="about__icon" />,
  <FaUserCircle size={28} className="about__icon" />,
];

export default function About() {
  const { t } = useTranslation("about");
  const steps = t("steps", { returnObjects: true }) || [];

  return (
    <div className="about-page">
      <div className="container py-5">

        {/* Hero Section */}
        <section className="about__hero mb-6">
          <span className="about__badge">Secure & Fast</span>

          <h1 className="about__title display-4 fw-bold mb-3">
            {t("title")}
          </h1>

          <p className="about__subtitle lead mx-auto">
            {t("subtitle")}
          </p>
        </section>

        {/* Features / Steps Grid */}
        <section className="about__grid-section mb-6">
          <div className="about__grid">
            {Array.isArray(steps) &&
              steps.map((step, index) => (
                <div
                  key={index}
                  className="about__card glass"
                  tabIndex={0}
                >
                  <div
                    className={`about__icon-wrapper about__icon-wrapper--${(index % 4) + 1}`}
                  >
                    {iconList[index % iconList.length]}
                  </div>

                  <h3 className="about__card-title h5 mt-3 mb-2">
                    {step.title}
                  </h3>

                  <p className="about__card-text mb-0">
                    {step.text}
                  </p>
                </div>
              ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="about__mission-section mx-auto p-5 glass rounded-4">
          <div className="about__spark mb-3">✨</div>

          <h2 className="h3 fw-bold mb-3">
            {t("mission_title")}
          </h2>

          <p className="about__mission-text mb-4">
            {t("mission")}
          </p>

          <Link
            to="/signup"
            className="btn btn-lg rounded-pill px-5 fw-semibold about__cta"
          >
            {t("cta")}
          </Link>
        </section>

      </div>
    </div>
  );
}
