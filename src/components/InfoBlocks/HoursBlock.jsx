import React from "react";
import { useTranslation } from "react-i18next";
import "./HoursBlock.css";

const DAYS = [
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
];

const SCOPES = {
  MON_FRI: "monfri",
  ALL: "all",
  WEEKEND: "weekend",
  DAY: "day", // day:monday etc
};

function ensureHoursObject(v) {
  const base = {};
  for (const d of DAYS) base[d] = "";
  if (v && typeof v === "object") {
    for (const d of DAYS) if (typeof v[d] === "string") base[d] = v[d];
  }
  return base;
}

function scopeDays(scope) {
  if (scope === SCOPES.MON_FRI) return ["monday","tuesday","wednesday","thursday","friday"];
  if (scope === SCOPES.ALL) return [...DAYS];
  if (scope === SCOPES.WEEKEND) return ["saturday","sunday"];
  if (typeof scope === "string" && scope.startsWith("day:")) {
    const day = scope.slice(4);
    return DAYS.includes(day) ? [day] : [];
  }
  return [];
}

function buildRange(start, end) {
  if (!start || !end) return "";
  return `${start}-${end}`;
}

export default function HoursBlock({ value, onChange }) {
  const { t } = useTranslation("extra_block");
  const { t: tDay } = useTranslation("extra_block", { keyPrefix: "weekdays" });

  const hours = React.useMemo(() => ensureHoursObject(value), [value]);

  const [scope, setScope] = React.useState(SCOPES.MON_FRI);
  const scopeSet = React.useMemo(() => new Set(scopeDays(scope)), [scope]);

  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");

  const canApply = Boolean(start && end);

  const apply = () => {
    if (!canApply) return;
    const range = buildRange(start, end);
    const next = { ...hours };
    for (const d of scopeSet) next[d] = range;
    onChange?.(next);
  };


  const clearAll = () => {
    const next = { ...hours };
    for (const d of DAYS) next[d] = "";
    onChange?.(next);
  };

  const clearOne = (day) => {
    const next = { ...hours, [day]: "" };
    onChange?.(next);
  };

  return (
    <div className="hours-scope">
      {/* Scope buttons */}
      <div className="hours-scope__top">
        <div className="hours-scope__scopes">
          <button
            type="button"
            className={`hours-scope__scopeBtn ${scope === SCOPES.MON_FRI ? "is-active" : ""}`}
            onClick={() => setScope(SCOPES.MON_FRI)}
          >
            {t("mon_fri", { defaultValue: "Mon–Fri" })}
          </button>

          <button
            type="button"
            className={`hours-scope__scopeBtn ${scope === SCOPES.ALL ? "is-active" : ""}`}
            onClick={() => setScope(SCOPES.ALL)}
          >
            {t("all_days", { defaultValue: "All" })}
          </button>

          <button
            type="button"
            className={`hours-scope__scopeBtn ${scope === SCOPES.WEEKEND ? "is-active" : ""}`}
            onClick={() => setScope(SCOPES.WEEKEND)}
          >
            {t("weekend", { defaultValue: "Weekend" })}
          </button>

          <button
            type="button"
            className="hours-scope__scopeBtn hours-scope__scopeBtn--ghost"
            onClick={clearAll}
            title={t("clear_all", { defaultValue: "Clear all" })}
          >
            {t("clear_all", { defaultValue: "Clear all" })}
          </button>
        </div>

        {/* Start / End + Apply */}
        <div className="hours-scope__range">
          <div className="hours-scope__field">
            <label className="hours-scope__label">
              {t("start", { defaultValue: "Start" })}
            </label>
            <input
              type="time"
              className="form-control hours-scope__time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div className="hours-scope__field">
            <label className="hours-scope__label">
              {t("end", { defaultValue: "End" })}
            </label>
            <input
              type="time"
              className="form-control hours-scope__time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="hours-scope__apply"
            disabled={!canApply || scopeSet.size === 0}
            onClick={apply}
          >
            {t("apply", { defaultValue: "Apply" })}
          </button>
        </div>
      </div>

      {/* Days list */}
      <div className="hours-scope__list">
        {DAYS.map((day) => {
          const inScope = scopeSet.has(day);
          const v = hours[day] || "";

          return (
            <button
              key={day}
              type="button"
              className={`hours-scope__row ${inScope ? "is-scope" : ""}`}
              onClick={() => setScope(`day:${day}`)}
              title={t("edit_day_scope", { defaultValue: "Click to select this day" })}
            >
              <div className="hours-scope__day">
                <span className="hours-scope__dot" aria-hidden="true" />
                {tDay(day)}
              </div>

              <div className={`hours-scope__value ${v ? "" : "is-empty"}`}>
                {v || t("closed", { defaultValue: "Closed" })}
              </div>

              <span
                className="hours-scope__x"
                role="button"
                tabIndex={0}
                aria-label={t("clear_day", { defaultValue: "Clear day" })}
                title={t("clear_day", { defaultValue: "Clear day" })}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearOne(day);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    clearOne(day);
                  }
                }}
              >
                ×
              </span>
            </button>
          );
        })}
      </div>

      <div className="hours-scope__hint">
        {t("hours_scope_hint", {
          defaultValue:
            "Pick a scope, choose Start/End, then Apply. Tip: click a day to target only that day.",
        })}
      </div>
    </div>
  );
}