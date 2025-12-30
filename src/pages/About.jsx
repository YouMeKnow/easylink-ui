import React from "react";
import { FaKey, FaLock, FaBolt, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./styles/About.css";

const iconList = [
  <FaKey size={30} className="about__icon about__icon--gold" aria-hidden="true" />,
  <FaLock size={30} className="about__icon about__icon--pink" aria-hidden="true" />,
  <FaBolt size={30} className="about__icon about__icon--violet" aria-hidden="true" />,
  <FaUserCircle size={30} className="about__icon about__icon--amber" aria-hidden="true" />,
];

export default function About() {
  const { t } = useTranslation("about");
  const steps = t("steps", { returnObjects: true }) || [];

  return (
    <div className="container py-5 about" style={{ minHeight: 600 }}>
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold about__title">{t("title")}</h1>
        <p className="lead text-muted mb-0 about__subtitle">
          {t("subtitle")}
        </p>
      </div>

      {/* Steps */}
      <div className="row g-4 justify-content-center mb-4">
        {Array.isArray(steps) &&
          steps.map((step, index) => (
            <div className="col-md-3 col-12" key={index}>
              <div
                className={`p-4 h-100 rounded-4 about__step about__step--${(index % 4) + 1}`}
                tabIndex={0}
              >
                <div className="mb-2 text-center">{iconList[index % iconList.length]}</div>
                <h5 className="mb-2 text-center about__stepTitle">{step.title}</h5>
                <p className="text-muted mb-0 text-center about__stepText">{step.text}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Call to action */}
      <div className="text-center mt-5 mb-4">
        <Link
          to="/signup"
          className="btn btn-lg rounded-pill px-4 fw-semibold about__cta"
          aria-label={t("cta")}
        >
          {t("cta")}
        </Link>
      </div>

      {/* Mission */}
      <div className="rounded-4 shadow p-4 mt-3 mx-auto about__mission">
        <div className="mb-2 text-center about__spark" aria-hidden="true">🌟</div>
        <h4 className="mb-2 text-center fw-bold">{t("mission_title")}</h4>
        <p className="text-muted text-center mb-0 about__missionText">{t("mission")}</p>
      </div>
    </div>
  );
}
