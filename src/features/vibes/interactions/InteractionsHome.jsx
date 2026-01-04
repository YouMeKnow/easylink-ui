import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function InteractionsHome() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation("interactions");

  return (
    <div className="container py-5 text-center" style={{ maxWidth: 900 }}>
      <h2>{t("title")}</h2>
      <p>{t("subtitle")}</p>

      <div className="row justify-content-center g-4">
        {/* My Circle */}
        <div className="col-md-5">
          <div className="p-4 rounded-4 shadow-sm bg-light h-100">
            <div className="fs-1 mb-3">🧑‍🤝‍🧑</div>
            <h4>{t("circle.title")}</h4>
            <p>{t("circle.description")}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate(`/vibes/${id}/interactions/circle`)}
            >
              {t("circle.button")}
            </button>
          </div>
        </div>

        {/* My Offers */}
        <div className="col-md-5">
          <div className="p-4 rounded-4 shadow-sm bg-light h-100">
            <div className="fs-1 mb-3">🎁</div>
            <h4>{t("offers.title")}</h4>
            <p>{t("offers.description")}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate(`/vibes/${id}/interactions/offers`)}
            >
              {t("offers.button")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
