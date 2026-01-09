import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { apiFetch } from "@/api/apiFetch";
import signupImg from "@/assets/signup-illustration.png";
import "@/features/auth/styles/AuthSplitCard.css";

export default function SignUpPassword() {
  const { t } = useTranslation("signup");

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || params.get("next");
  const subscribe = params.get("subscribe");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch("/api/v3/auth/signup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, redirectTo, subscribe }),
      });

      const text = await res.text().catch(() => "");
      if (!res.ok) throw new Error(text || t("password_signup.errors.signup_failed_status", { status: res.status }));

      toast.success(text || t("password_signup.toast.verify_email"));

      const u = new URL("/email-verification-sent", window.location.origin);
      u.searchParams.set("email", email);

      if (redirectTo) u.searchParams.set("next", redirectTo);
      if (subscribe === "true") u.searchParams.set("subscribe", "true");

      navigate(u.pathname + u.search, { replace: true });
    } catch (err) {
      const raw = err?.message;
      const key = raw?.replace(/^[a-z0-9_-]+\./i, "");
      toast.error(
        t(key, {
          defaultValue: raw || t("toast.signup_failed"),
        })
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-card">
      {/* LEFT */}
      <div className="auth-left">
        <h2 className="auth-title">{t("password_signup.title")}</h2>
        <p className="auth-subtitle">{t("password_signup.subtitle")}</p>

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">{t("password_signup.email_label")}</label>
            <input
              className="auth-input"
              type="email"
              placeholder={t("password_signup.email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">{t("password_signup.password_label")}</label>
            <input
              className="auth-input"
              type="password"
              placeholder={t("password_signup.password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <div className="auth-hint">{t("password_signup.password_hint")}</div>
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? t("password_signup.cta_loading") : t("password_signup.cta")}
          </button>
        </form>

        <div className="auth-footer">
          {t("password_signup.footer_have_account")}{" "}
          <span className="auth-link" onClick={() => navigate("/signin")}>
            {t("password_signup.footer_login")}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        {signupImg ? (
          <img className="auth-hero-img" src={signupImg} alt={t("password_signup.hero_alt")} />
        ) : (
          <div className="auth-right-placeholder" />
        )}
      </div>
    </div>
  );
}
