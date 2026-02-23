import React from "react";
import "./ExtraBlock.css";

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

export default function ExtraBlock({ block }) {
  const type = String(block?.type || "").toLowerCase();
  const label = block?.label || (type === "hours" ? "Hours" : "Info");

  // после нормализации из useVibeLoader:
  // hours -> object, birthday -> "YYYY-MM-DD", text -> string
  const raw = block?.value;

  const isHours = type === "hours" && isPlainObject(raw);

  if (isHours) {
    return (
      <div className="extra-view">
        <div className="extra-view__title">{label}</div>

        <table className="extra-view__table">
          <tbody>
            {DAYS.map(({ key, label }) => (
              <tr key={key}>
                <td className="extra-view__day">{label}</td>
                <td className="extra-view__time">
                  {raw[key] ? raw[key] : <span className="extra-view__dash">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const safeText =
    typeof raw === "string" || typeof raw === "number" ? String(raw) : "";

  return (
    <div className="extra-view">
      <div className="extra-view__title">{label}</div>
      <div className={`extra-view__value ${safeText ? "" : "is-empty"}`}>
        {safeText || <span className="extra-view__dash">not specified</span>}
      </div>
    </div>
  );
}