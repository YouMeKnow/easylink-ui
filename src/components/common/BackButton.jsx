import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./BackButton.css";

export default function BackButton({
  to = "/",
  labelKey = "vibe.back",
  label,
  ns,
  className = "",
  style = {},
}) {
  const navigate = useNavigate();

  let nsName = ns;
  let tKey = labelKey;

  if (!nsName) {
    if (labelKey.includes(":")) {
      const [fromKeyNs, ...rest] = labelKey.split(":");
      nsName = fromKeyNs;
      tKey = rest.join(":") || "back";
    } else if (labelKey.includes(".")) {
      const [fromKeyNs, ...rest] = labelKey.split(".");
      nsName = fromKeyNs;
      tKey = rest.join(".") || "back";
    }
  }

  const { t } = useTranslation(nsName);
  const text = label ?? t(tKey);

  return (
    <button
      type="button"
      className={`backbtn ${className}`}
      style={style}
      onClick={() => navigate(to)}
      aria-label={typeof text === "string" ? text : undefined}
    >
      <svg
        className="backbtn__icon"
        viewBox="0 0 20 20"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M12.5 4.5L7 10l5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="backbtn__text">{text}</span>
    </button>
  );
}
