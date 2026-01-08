import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { apiFetch } from "@/api/apiFetch";
import { useAuth } from "@/context/AuthContext";

import signinImg from "@/assets/signin-illustration.png";

export default function SignInPassword({ query = "" }) {
  const { t } = useTranslation("auth");

  const navigate = useNavigate();
  const { login } = useAuth();

  const params = new URLSearchParams(query);
  const redirectTo = params.get("redirectTo") || params.get("next") || "/profile";
  const subscribe = params.get("subscribe");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch("/api/v3/auth/signin-password", {
        method: "POST",
        auth: "off",
        body: JSON.stringify({ email, password, subscribe, redirectTo }),
      });

      const data = await res.json().catch(() => ({}));
      const token =
        data?.token ??
        data?.accessToken ??
        data?.jwt ??
        data?.["Authentication successful"] ??
        null;

      if (!token) throw new Error("signin.errors.no_token");

      login({ email }, token, { cookieBased: false });

      toast.success(t("toast.welcome_back"));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const raw = err?.message || "";
      const key = raw.replace(/^[a-z0-9_-]+\./i, "");

      toast.error(
        t(key, {
          defaultValue: raw || t("toast.login_failed"),
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
        <h2 className="auth-title">{t("title")}</h2>
        <p className="auth-subtitle">{t("subtitle")}</p>

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">{t("email_label")}</label>
            <input
              className="auth-input"
              type="email"
              placeholder={t("email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">{t("password_label")}</label>
            <input
              className="auth-input"
              type="password"
              placeholder={t("password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? t("cta_loading") : t("cta")}
          </button>
        </form>

        <div className="auth-footer">
          {t("footer_no_account")}{" "}
          <span className="auth-link" onClick={() => navigate("/signup")}>
            {t("footer_create")}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        {signinImg ? (
          <img
            className="auth-hero-img"
            src={signinImg}
            alt={t("hero_alt")}
          />
        ) : (
          <div className="auth-right-placeholder" />
        )}
      </div>
    </div>
  );
}
