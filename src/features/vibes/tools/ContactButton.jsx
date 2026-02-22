import React from "react";
import { FaGlobe } from "react-icons/fa";
import iconMap from "../../../data/contactIcons";
import { getContactLink } from "../../../data/contactLinks";

const getButtonStyle = (type) => {
  const base = {
    bg: "var(--ct-chip-bg)",
    text: "var(--ct-text)",
    border: "var(--ct-chip-border)",
    accent: "rgba(99, 102, 241, .22)",
  };

  switch (type) {
    case "instagram":
      return {
        ...base,
        bg: "linear-gradient(45deg, #fd5, #f54394, #fc6736)",
        text: "#111",
        border: "rgba(255,255,255,.35)",
        accent: "rgba(255,255,255,.45)",
      };

    case "whatsapp":
      return {
        ...base,
        bg: "rgba(46,204,113,.16)",
        border: "rgba(46,204,113,.30)",
        accent: "rgba(46,204,113,.35)",
      };

    case "telegram":
      return {
        ...base,
        bg: "rgba(52,152,219,.16)",
        border: "rgba(52,152,219,.30)",
        accent: "rgba(52,152,219,.35)",
      };

    case "phone":
      return {
        ...base,
        bg: "rgba(99,102,241,.16)",
        border: "rgba(99,102,241,.30)",
        accent: "rgba(99,102,241,.35)",
      };

    case "email":
      return {
        ...base,
        bg: "rgba(14,165,233,.14)",
        border: "rgba(14,165,233,.28)",
        accent: "rgba(14,165,233,.36)",
      };

    case "website":
      return {
        ...base,
        bg: "rgba(148,163,184,.14)",
        border: "rgba(148,163,184,.28)",
        accent: "rgba(148,163,184,.40)",
      };

    case "linkedin":
      return {
        ...base,
        bg: "rgba(10,102,194,.16)",
        border: "rgba(10,102,194,.30)",
        accent: "rgba(10,102,194,.36)",
      };

    case "youtube":
      return {
        ...base,
        bg: "rgba(255,0,0,.12)",
        border: "rgba(255,0,0,.26)",
        accent: "rgba(255,0,0,.32)",
      };

    case "tiktok":
      return {
        ...base,
        bg: "linear-gradient(135deg, rgba(0,0,0,.06), rgba(0,0,0,.02))",
        border: "rgba(255,255,255,.14)",
        accent: "rgba(0,242,234,.35)",
      };

    case "twitter":
    case "x":
      return {
        ...base,
        bg: "rgba(56,189,248,.14)",
        border: "rgba(56,189,248,.28)",
        accent: "rgba(56,189,248,.36)",
      };

    case "facebook":
      return {
        ...base,
        bg: "rgba(24,119,242,.14)",
        border: "rgba(24,119,242,.28)",
        accent: "rgba(24,119,242,.36)",
      };

    case "discord":
      return {
        ...base,
        bg: "rgba(88,101,242,.14)",
        border: "rgba(88,101,242,.28)",
        accent: "rgba(88,101,242,.36)",
      };

    case "github":
      return {
        ...base,
        bg: "rgba(148,163,184,.12)",
        border: "rgba(148,163,184,.26)",
        accent: "rgba(148,163,184,.40)",
      };

    case "snapchat":
      return {
        ...base,
        bg: "rgba(255,252,0,.14)",
        border: "rgba(255,252,0,.26)",
        accent: "rgba(255,252,0,.35)",
        text: "#111",
      };

    case "location":
    case "address":
      return {
        ...base,
        bg: "rgba(34,197,94,.12)",
        border: "rgba(34,197,94,.26)",
        accent: "rgba(34,197,94,.34)",
      };

    default:
      return base;
  }
};

function toStr(val) {
  if (typeof val === "string") return val;
  if (val && typeof val === "object" && "value" in val) return String(val.value ?? "");
  return String(val ?? "");
}

export default function ContactButton({
  type,
  value,
  editMode = false,
  isEditing = false,
  editValue = "",
  inputKey,
  onStartEdit,
  onEditChange,
  onCommitEdit,
  onCancelEdit,
  onChangeType,
}) {
  const icon = iconMap[type] || <FaGlobe />;
  const s = getButtonStyle(type);

  const displayValue = toStr(value);
  const isEmpty = !displayValue.trim();
  const placeholder = "enter a value";

  const baseStyle = {
    minWidth: 0,
    width: "100%",
    height: 46,

    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 12px",

    borderRadius: 999,
    background: s.bg,
    border: `1px solid ${s.border}`,
    color: s.text,
    textDecoration: "none",
    boxShadow: "var(--ct-shadow)",
    transition:
      "transform .12s ease, box-shadow .12s ease, border-color .12s ease, filter .12s ease",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    position: "relative",
    overflow: "hidden",
  };

  const iconStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 999,
    background: "var(--ct-icon-bg)",
    border: `1px solid ${s.accent || "var(--ct-icon-border)"}`,
    fontSize: 18,
    flex: "0 0 auto",
    color: "var(--ct-text)",
  };

  // ✅ one-line, but full value is available via title + print override
  const textStyle = {
    flex: 1,
    minWidth: 0,

    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",

    lineHeight: "1.25",
    fontSize: 14.5,
    letterSpacing: ".1px",
  };

  const typeBtnStyle = {
    flex: "0 0 auto",
    height: 26,
    padding: "0 10px",
    borderRadius: 999,
    border: "1px solid var(--ct-type-border)",
    background: "var(--ct-type-bg)",
    color: "var(--ct-type-text)",
    fontSize: 12.5,
    lineHeight: "24px",
    cursor: "pointer",
    transition: "transform .12s ease, filter .12s ease",
  };

  const interactiveHandlers = {
    onMouseEnter: (e) => {
      e.currentTarget.style.boxShadow = "var(--ct-shadow-hover)";
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.filter = "saturate(1.05)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.boxShadow = "var(--ct-shadow)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.filter = "none";
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = "translateY(0) scale(.99)";
    },
    onMouseUp: (e) => {
      e.currentTarget.style.transform = "translateY(-1px)";
    },
  };

  // EDIT MODE (active input)
  if (editMode && isEditing) {
    const skipCommitRef = React.useRef(false);

    return (
      <div
        className="contact-btn contact-btn--editing"
        style={{
          ...baseStyle,
          cursor: "text",
          border: "none",
          boxShadow: `
            0 16px 46px rgba(0,0,0,.10),
            inset 0 0 0 2px rgba(99,102,241,.35),
            inset 0 0 0 1px rgba(255,255,255,.20)
          `,
          transform: "translateY(-1px)",
        }}
        onMouseDown={() => (skipCommitRef.current = false)}
      >
        <span style={iconStyle} aria-hidden="true">
          {icon}
        </span>

        <input
          key={inputKey}
          autoFocus
          value={editValue ?? ""}
          onChange={(e) => onEditChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onCommitEdit?.(e);
            }
            if (e.key === "Escape") {
              skipCommitRef.current = true;
              onCancelEdit?.();
            }
          }}
          onBlur={() => {
            if (skipCommitRef.current) {
              skipCommitRef.current = false;
              return;
            }
            onCommitEdit?.();
          }}
          placeholder={placeholder}
          style={{
            ...textStyle,
            border: "none",
            outline: "none",
            background: "transparent",
            padding: "0 2px",
            color: "var(--ct-text)",
            boxShadow: "none",
          }}
        />

        {onChangeType && (
          <button
            type="button"
            title="Change type"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              skipCommitRef.current = true;
            }}
            onClick={(e) => {
              e.stopPropagation();
              onChangeType();
              setTimeout(() => {
                skipCommitRef.current = false;
              }, 0);
            }}
            style={typeBtnStyle}
          >
            ⇄
          </button>
        )}
      </div>
    );
  }

  // EDIT MODE (click to start)
  if (editMode) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={`contact-btn${isEditing ? " contact-btn--editing" : ""}`}
        style={{ ...baseStyle, cursor: "text" }}
        {...interactiveHandlers}
        onClick={() => onStartEdit?.()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onStartEdit?.();
        }}
      >
        <span style={iconStyle} aria-hidden="true">
          {icon}
        </span>

        <span
          data-ct-text="1"
          style={{ ...textStyle, color: isEmpty ? "var(--ct-text-muted)" : "var(--ct-text)" }}
          title={isEmpty ? placeholder : displayValue}
        >
          {isEmpty ? placeholder : displayValue}
        </span>

        {onChangeType && (
          <button
            type="button"
            title="Change contact type"
            aria-label="Change contact type"
            onClick={(e) => {
              e.stopPropagation();
              onChangeType();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              ...typeBtnStyle,
              width: 32,
              padding: 0,
              display: "grid",
              placeItems: "center",
              fontSize: 16,
            }}
          >
            ⇄
          </button>
        )}
      </div>
    );
  }

  // VIEW MODE
  const href = isEmpty ? null : getContactLink(type, displayValue);

  if (!href) {
    return (
      <div
        className="contact-btn contact-btn--disabled"
        style={{
          ...baseStyle,
          opacity: 0.55,
          cursor: "default",
          boxShadow: "var(--ct-shadow)",
        }}
        title={placeholder}
      >
        <span style={iconStyle} aria-hidden="true">
          {icon}
        </span>
        <span data-ct-text="1" style={{ ...textStyle, color: "var(--ct-text-muted)" }}>
          {placeholder}
        </span>
      </div>
    );
  }

  return (
    <a
      className="contact-btn"
      style={baseStyle}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...interactiveHandlers}
      title={displayValue}
    >
      <span style={iconStyle} aria-hidden="true">
        {icon}
      </span>
      <span data-ct-text="1" style={textStyle}>
        {displayValue}
      </span>
    </a>
  );
}