import React from "react";
import { useTranslation } from "react-i18next";
import "./StepsNav.css";

export default function StepsNav({
  questions = [],
  currentStep = 0,
  setCurrentStep,
  answersList = [],
}) {
  const { t } = useTranslation("auth");

  const onKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCurrentStep?.(idx);
    }
  };

  return (
    <>
      <style>{`
      [data-steps-clean] .pill {
        display: flex;
        align-items: center;
        gap: .5rem;
        width: 100%;
        border: 0;
        border-radius: .5rem;
        padding: .5rem .75rem;
        background: var(--bs-light, #f8f9fa);
        color: inherit;
        cursor: pointer;
        transition: background-color .25s ease, box-shadow .25s ease;
        font-size: 15px;
      }
      [data-steps-clean] .pill.is-active {
        background-color: rgba(25,135,84,.10);
        font-weight: 600;
      }

      /* hover */
      [data-steps-clean] .pill:hover {
        background-color: rgba(25,135,84,.08);
      }

      [data-steps-clean] .pill:focus-visible {
        outline: none;
        box-shadow: 0 0 0 .15rem rgba(25,135,84,.28);
      }

      /* сетка: xs — 2 в ряд, md+ — колонкой */
      [data-steps-clean] .grid {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
      }
      [data-steps-clean] .cell {
        flex: 1 1 45%;
      }

      @media (max-width: 400px) {
        [data-steps-clean] .pill {
          padding: .25rem .5rem;
          font-size: 13px;
        }
        [data-steps-clean] .cell {
          flex: 1 1 100%;
        }
      }

      @media (min-width: 768px) {
        [data-steps-clean] .grid {
          display: block;
        }
        [data-steps-clean] .cell {
          margin-bottom: .5rem;
          flex: none;
        }
      }
    `}</style>

      <div data-steps-clean>
        <div className="grid">
          {questions.map((q, idx) => {
            const isActive = idx === currentStep;
            const answered = Boolean(answersList[idx]?.trim());

            return (
              <div key={q.entryId ?? idx} className="cell">
                <button
                  type="button"
                  className={`pill ${isActive ? "is-active" : ""}`}
                  onClick={() => setCurrentStep?.(idx)}
                  onKeyDown={(e) => onKeyDown(e, idx)}
                  aria-selected={isActive}
                >
                  <i
                    className={`bi bi-${
                      answered ? "check-circle-fill text-success" : "circle"
                    }`}
                    aria-hidden="true"
                  />
                  <span style={{ fontSize: 15 }}>
                    {t("q_number", { num: idx + 1 })}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
