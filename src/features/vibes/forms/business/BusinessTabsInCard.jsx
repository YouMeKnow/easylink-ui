import React from "react";
import "./styles/BusinessTabsInCard.css";

function LockIcon() {
  return (
    <svg
      className="business-tab__lockIcon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="business-tabs__closeIcon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function BusinessTabsInCard({
  t,
  activeTab,
  onTabChange,
  renderMain,
  renderOffers,
  renderMenu,
  offersDisabled = false,
  menuDisabled = false,
  lockedHint = "",
}) {
  const [isHintVisible, setIsHintVisible] = React.useState(false);

  React.useEffect(() => {
    if (lockedHint) {
      setIsHintVisible(true);
    } else {
      setIsHintVisible(false);
    }
  }, [lockedHint]);

  return (
    <div className="w-100">
      <ul
        className="nav nav-tabs mb-3 justify-content-center tabs-narrow business-tabs"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "main" ? "active" : ""}`}
            onClick={() => onTabChange?.("main")}
            type="button"
            role="tab"
            aria-selected={activeTab === "main"}
          >
            {t("Main")}
          </button>
        </li>

        <li className="nav-item" role="presentation">
          <button
            className={`nav-link business-tab ${activeTab === "offers" ? "active" : ""} ${
              offersDisabled ? "is-locked" : ""
            }`}
            onClick={() => onTabChange?.("offers")}
            type="button"
            role="tab"
            aria-selected={activeTab === "offers"}
            aria-disabled={offersDisabled}
          >
            <span className="business-tab__label">{t("Offers")}</span>
            {offersDisabled && <LockIcon />}
          </button>
        </li>

        <li className="nav-item" role="presentation">
          <button
            className={`nav-link business-tab ${activeTab === "menu" ? "active" : ""} ${
              menuDisabled ? "is-locked" : ""
            }`}
            onClick={() => onTabChange?.("menu")}
            type="button"
            role="tab"
            aria-selected={activeTab === "menu"}
            aria-disabled={menuDisabled}
          >
            <span className="business-tab__label">{t("Menu")}</span>
            {menuDisabled && <LockIcon />}
          </button>
        </li>
      </ul>

      {isHintVisible && !!lockedHint && (
        <div className="business-tabs__hint" role="status" aria-live="polite">
          <button
            type="button"
            className="business-tabs__close"
            onClick={() => setIsHintVisible(false)}
            aria-label={t("Close", { defaultValue: "Close" })}
          >
            <CloseIcon />
          </button>

          <div className="business-tabs__hintText">{lockedHint}</div>
        </div>
      )}

      <div className="tab-content w-100">
        {activeTab === "main" && (
          <div className="tab-pane fade show active">
            {renderMain?.()}
          </div>
        )}

        {activeTab === "offers" && (
          <div className="tab-pane fade show active w-100">
            {renderOffers?.()}
          </div>
        )}

        {activeTab === "menu" && (
          <div className="tab-pane fade show active">
            {renderMenu?.()}
          </div>
        )}
      </div>
    </div>
  );
}
