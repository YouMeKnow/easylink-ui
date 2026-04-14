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

function toStr(val) {
  if (typeof val === "string") return val;
  if (val && typeof val === "object" && "value" in val) return String(val.value ?? "");
  return String(val ?? "");
}

function formatPhoneForDisplay(value) {
  const raw = String(value || "").trim();
  const digits = raw.replace(/\D/g, "");

  if (!digits) return "";

  if (digits.length === 11 && digits.startsWith("1")) {
    const d = digits.slice(1);
    return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  }

  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

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
  const displayValue = getDisplayValue(type, value);
  const isEmpty = !displayValue.trim();
  const meta = CONTACT_INPUT_META[type] || {};
  const placeholder = meta.placeholder || "Enter contact";

  // Class names for styling
  const containerClass = [
    "contact-btn",
    `contact-btn--${type}`,
    editMode ? "contact-btn--edit-mode" : "contact-btn--view-mode",
    isEditing ? "contact-btn--is-editing" : "",
    isEmpty ? "contact-btn--empty" : "",
  ].filter(Boolean).join(" ");

  // EDIT MODE (active input)
  if (editMode && isEditing) {
    const skipCommitRef = React.useRef(false);

    return (
      <div
        className={containerClass}
        onMouseDown={() => (skipCommitRef.current = false)}
      >
        <span className="contact-btn__icon" aria-hidden="true">
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
          className="contact-btn__input"
        />

        {onChangeType && (
          <button
            type="button"
            className="contact-btn__type-toggle"
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
        className={containerClass}
        onClick={() => onStartEdit?.()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onStartEdit?.();
        }}
      >
        <span className="contact-btn__icon" aria-hidden="true">
          {icon}
        </span>

        <span className="contact-btn__text" title={isEmpty ? placeholder : displayValue}>
          {isEmpty ? placeholder : displayValue}
        </span>

        {onChangeType && (
          <button
            type="button"
            className="contact-btn__type-toggle"
            title="Change contact type"
            aria-label="Change contact type"
            onClick={(e) => {
              e.stopPropagation();
              onChangeType();
            }}
            onMouseDown={(e) => e.stopPropagation()}
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
      <div className={`${containerClass} contact-btn--disabled`} title={placeholder}>
        <span className="contact-btn__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="contact-btn__text">
          {placeholder}
        </span>
      </div>
    );
  }

  return (
    <a
      className={containerClass}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={displayValue}
    >
      <span className="contact-btn__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="contact-btn__text">
        {displayValue}
      </span>
    </a>
  );
}