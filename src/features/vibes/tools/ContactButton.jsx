import React from "react";
import { FaGlobe } from "react-icons/fa";
import iconMap from "../../../data/contactIcons";
import { getContactLink } from "../../../data/contactLinks";
const CONTACT_INPUT_META = {
  phone: {
    placeholder: "+1 647 123 4567",
    hint: "Enter a phone number with country code",
  },
  email: {
    placeholder: "name@example.com",
    hint: "Enter your email address",
  },
  website: {
    placeholder: "https://yourwebsite.com",
    hint: "Paste a full website link",
  },
  instagram: {
    placeholder: "@username",
    hint: "Paste your Instagram username or link",
  },
  telegram: {
    placeholder: "@username",
    hint: "Paste your Telegram username or link",
  },
  whatsapp: {
    placeholder: "+1 555 123 4567",
    hint: "Enter phone number for WhatsApp",
  },
  linkedin: {
    placeholder: "linkedin.com/in/username",
    hint: "Paste your LinkedIn profile link",
  },
  github: {
    placeholder: "github.com/username",
    hint: "Paste your GitHub profile",
  },
};

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
        bg: "rgba(236, 72, 153, .14)",
        border: "rgba(236, 72, 153, .28)",
        accent: "rgba(236, 72, 153, .36)",
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

function formatPhoneForDisplay(value) {
  const raw = String(value || "").trim();
  const digits = raw.replace(/\D/g, "");

  if (!digits) return "";

  // Canada / US
  if (digits.length === 11 && digits.startsWith("1")) {
    const d = digits.slice(1);
    return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  }

  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  // fallback if number is incomplete or different
  if (digits.length < 10) return raw;

  return raw;
}

function formatUsername(value) {
  const v = String(value || "").trim();

  if (!v) return "";
  return v.replace(/^@+/, ""); 
}

function getDisplayValue(type, value) {
  const raw = toStr(value);

  if (type === "phone") {
    return formatPhoneForDisplay(raw);
  }

  if (type === "website") {
    return formatWebsiteForDisplay(raw);
  }

  if (
    type === "instagram" ||
    type === "telegram" ||
    type === "twitter" ||
    type === "x"
  ) {
    return formatUsername(raw);
  }

  return raw;
}

function formatWebsiteForDisplay(value) {
  let v = String(value || "").trim();

  if (!v) return "";
  v = v.replace(/^https?:\/\//i, "");
  v = v.replace(/^www\./i, "");
  v = v.split("/")[0];

  return v;
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

  const displayValue = getDisplayValue(type, value);
  const isEmpty = !displayValue.trim();
  const meta = CONTACT_INPUT_META[type] || {};
  const placeholder = meta.placeholder || "Enter contact";
  const hint = meta.hint || "";

  const baseStyle = {
    minWidth: 0,
    width: "auto",
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