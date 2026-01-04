import React from "react";
import "../styles/ProfileCards.css";
import { IconBarChart, IconPlus, IconShield, IconZap } from "@/pages/Home/icons/Icons";

/**
 * cards: Array<{
 *   title: string;
 *   text?: string;
 *   icon?: "bar-chart" | "plus" | "shield" | "zap" | React.ReactNode;
 *   buttonText?: string;
 *   variant?: "red" | "blue" | "peach-gold";
 *   onClick: () => void;
 * }>
 */

const iconMap = {
  "bar-chart": IconBarChart,
  "plus": IconPlus,
  "shield": IconShield,
  "zap": IconZap,
};

export default function ProfileCards({ cards = [] }) {
  return (
    <div className="profile pc-grid">
      {cards.map((c, i) => {
        const IconCmp = typeof c.icon === "string" ? iconMap[c.icon] : null;

        return (
          <article
            key={i}
            className="pc-card"
            data-variant={c.variant || "peach-gold"}
            tabIndex={0}
            onClick={c.onClick}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && c.onClick()}
            aria-label={c.title}
          >
            <header className="pc-head">
              <span className="pc-icon" aria-hidden="true">
                {IconCmp
                  ? <IconCmp width={18} height={18} />
                  : (React.isValidElement(c.icon) ? c.icon : <IconBarChart width={18} height={18} />)}
              </span>
              <h3 className="pc-title">{c.title}</h3>
            </header>

            {c.text && <p className="pc-desc">{c.text}</p>}

            {c.buttonText && (
              <button
                type="button"
                className="pc-btn"
                tabIndex={-1}
                onClick={(e) => { e.stopPropagation(); c.onClick(); }}
              >
                <span className="pc-btn-label">{c.buttonText}</span>
                <span className="pc-btn-sheen" aria-hidden="true" />
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
