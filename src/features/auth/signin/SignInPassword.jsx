import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { apiFetch } from "@/api/apiFetch";
import { useAuth } from "@/context/AuthContext";

import signinImg from "@/assets/signin-illustration.png";
import "@/features/auth/styles/AuthSplitCard.css";

export default function SignInPassword({ query = "" }) {
  const { t } = useTranslation("auth");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // allow both: query prop or location.search
  const qs = useMemo(() => {
    const src = query && typeof query === "string" ? query : location.search;
    return new URLSearchParams(src);
  }, [query, location.search]);

  const redirectTo = qs.get("redirectTo") || qs.get("next") || "/profile";
  const subscribe = qs.get("subscribe");

  const [step, setStep] = useState("password"); // "password" | "code"
  const [challengeId, setChallengeId] = useState(null);

  const [email, setEmail] = useState(qs.get("email") || "");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const SLOW_AUTH_MS = 4500;

  const start2fa = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const t0 = performance.now();

    try {
      const res = await apiFetch("/api/v3/auth/signin-password", {
        method: "POST",
        auth: "off",
        body: JSON.stringify({ email, password, subscribe, redirectTo }),
      });

      const data = await res.json().catch(() => ({}));

      // ожидаем: { requires2fa: true, challengeId: "..." }
      const ch = data?.challengeId ?? data?.challengeID ?? data?.challenge ?? null;

      if (!ch) {
        // fallback: если вдруг сервер всё ещё вернул token (на будущее)
        const token = data?.accessToken ?? data?.token ?? data?.jwt ?? null;
        if (token) {
          login({ email }, token, { cookieBased: false });
          toast.success(t("toast.welcome_back"));
          navigate(redirectTo, { replace: true });
          return;
        }
        throw new Error("signin.errors.no_challenge");
      }

      setChallengeId(ch);
      setStep("code");
      setCode("");

      toast.info(t("signin.code_sent", { defaultValue: "We sent a login code to your email." }));
    } catch (err) {
      const dt = performance.now() - t0;
      const raw = err?.message || "";

      const rawLc = raw.toLowerCase();
      const looksAuthFail =
        rawLc.includes("invalid") || rawLc.includes("unauthorized") || rawLc.includes("401");

      if (looksAuthFail && dt >= SLOW_AUTH_MS) {
        toast.error(
          t("signin.too_many_attempts", {
            defaultValue: "Too many attempts. Please wait a bit and try again.",
          })
        );
        return;
      }

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

  const verify2fa = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!challengeId) {
      toast.error(t("signin.errors.no_challenge", { defaultValue: "Please sign in again." }));
      setStep("password");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("/api/v3/auth/signin-password/verify-2fa", {
        method: "POST",
        auth: "off",
        body: JSON.stringify({
          challengeId,
          code: String(code || "").trim(),
          rememberMe,
        }),
      });

      const data = await res.json().catch(() => ({}));

      const accessToken = data?.accessToken ?? data?.token ?? null;
      const refreshToken = data?.refreshToken ?? null;

      if (!accessToken || !refreshToken) {
        throw new Error("signin.errors.no_token");
      }

      // store refresh token
      localStorage.setItem("refresh", refreshToken);

      // store access token (your existing flow)
      login({ email }, accessToken, { cookieBased: false });

      toast.success(t("toast.welcome_back"));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const raw = err?.message || "";
      const key = raw.replace(/^[a-z0-9_-]+\./i, "");

      toast.error(
        t(key, {
          defaultValue: raw || t("signin.invalid_code", { defaultValue: "Invalid code." }),
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const backToPassword = () => {
    setStep("password");
    setChallengeId(null);
    setCode("");
    // пароль лучше стереть, чтобы не хранить в памяти
    setPassword("");
  };

  return (
    <div className="auth-split-card">
      {/* LEFT */}
      <div className="auth-left">
        <h2 className="auth-title">
          {step === "password" ? t("title") : t("signin.code_title", { defaultValue: "Enter code" })}
        </h2>

        <p className="auth-subtitle">
          {step === "password"
            ? t("subtitle")
            : t("signin.code_subtitle", {
                defaultValue: "Check your email and enter the 6-digit code to finish signing in.",
              })}
        </p>

        {step === "password" ? (
          <form onSubmit={start2fa} className="auth-form">
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
        ) : (
          <form onSubmit={verify2fa} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">
                {t("signin.code_label", { defaultValue: "Login code" })}
              </label>
              <input
                className="auth-input"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t("signin.code_placeholder", { defaultValue: "6-digit code" })}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                autoComplete="one-time-code"
                required
              />
              <div className="auth-hint">
                {t("signin.code_hint", {
                  defaultValue: "Didn’t receive it? Check spam or try again.",
                })}
              </div>
            </div>

            <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span style={{ fontSize: 14, color: "var(--text-weak)" }}>
                {t("signin.remember_me", { defaultValue: "Remember me" })}
              </span>
            </label>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading
                ? t("signin.verify_loading", { defaultValue: "Verifying..." })
                : t("signin.verify_cta", { defaultValue: "Verify & sign in" })}
            </button>

            <div className="auth-footer" style={{ marginTop: 12 }}>
              <span className="auth-link" onClick={backToPassword}>
                {t("signin.back", { defaultValue: "Back" })}
              </span>
            </div>
          </form>
        )}

        {step === "password" && (
          <div className="auth-footer">
            {t("footer_no_account")}{" "}
            <span className="auth-link" onClick={() => navigate("/signup")}>
              {t("footer_create")}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        {signinImg ? (
          <img className="auth-hero-img" src={signinImg} alt={t("hero_alt")} />
        ) : (
          <div className="auth-right-placeholder" />
        )}
      </div>
    </div>
  );
}
