// src/features/.../VibeSearch.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/services/amplitude";
import "./VibeSearch.css";

export default function VibeSearch({ autoFocus = false }) {
  const { t } = useTranslation("vibe_search");
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);
  const isValid = /^\d{4,5}$/.test(code);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [autoFocus]);

  const onChange = (e) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, 5);
    setCode(next);
    if (error) setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isValid) {
      setError(t("invalid_code"));
      trackEvent("Vibe Search Failed", { reason: "invalid_format", code });
      return;
    }

    try {
      setLoading(true);
      trackEvent("Vibe Search Submit", { code_length: code.length });

      const res = await axios.get(`/api/v3/vibes/visibility/${code}`);

      trackEvent("Vibe Search Success", { code, id: res?.data?.id });
      navigate(`/view/${res.data.id}`);
    } catch (err) {
      setError(t("not_found"));
      trackEvent("Vibe Search Failed", { reason: "not_found", code });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="vibe-search"
      noValidate
      aria-label={t("label", "Vibe code search")}
    >
      <div className="vibe-search__panel">
        <div className="vibe-search__row">
          <input
            id="vibeCode"
            ref={inputRef}
            className="vibe-search__input" 
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder={t("placeholder")}
            value={code}
            onChange={onChange}
            aria-describedby="vibeSearchHint"
            aria-invalid={!!error}
            autoComplete="off"
          />

          <button
            type="submit"
            className="vibe-search__btn"     
            disabled={loading || !isValid}
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? (
              <>
                <span className="vibe-search__spinner" aria-hidden="true" />
                {t("searching", "Searching…")}
              </>
            ) : (
              t("button", "Search")
            )}
          </button>
        </div>

        <div
          id="vibeSearchHint"
          className={`vibe-search__hint ${error ? "is-error" : ""}`}
          aria-live="polite"
        >
          {error}
        </div>
      </div>
    </form>
  );
}
