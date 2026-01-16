// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { apiFetch } from "@/api/apiFetch";

import {
  restartNotificationsStream,
  stopNotificationsStream,
} from "@/features/notifications/realtime/notificationsStream";

function decodeExp(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]))?.exp ?? null;
  } catch {
    return null;
  }
}

const AuthContext = createContext({
  user: null,
  accessToken: null,
  cookieBased: false,
  isAuthenticated: false,
  authReady: false,
  login: (_user, _access, _opts) => {},
  logout: (_reason) => {},
});

const sidecar = { getAccess: () => null, forceLogout: () => {} };
export const getAuthSidecar = () => sidecar;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [cookieBased, setCookieBased] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const timer = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("auth");
  const notifiedExpired = useRef(false);

  function clearTimer() {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  function scheduleExpiryLogout(token) {
    const exp = decodeExp(token);
    if (!exp) return;
    const msLeft = exp * 1000 - Date.now();
    clearTimer();
    timer.current = setTimeout(() => {
      logout("expired");
    }, Math.max(0, msLeft));
  }

  // ✅ bootstrap: load jwt or refresh it if only refresh exists
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const u = localStorage.getItem("user");
        if (u) setUser(JSON.parse(u));

        const jwt = localStorage.getItem("jwt");
        if (jwt) {
          if (cancelled) return;
          setAccessToken(jwt);
          sidecar.getAccess = () => jwt;
          scheduleExpiryLogout(jwt);
          restartNotificationsStream();
          return;
        }

        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          const res = await fetch("/api/v3/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            cache: "no-store",
            body: JSON.stringify({ refreshToken: refresh }),
          });

          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            const newJwt = data?.accessToken || data?.token || null;

            if (newJwt) {
              localStorage.setItem("jwt", newJwt);
              if (cancelled) return;

              setAccessToken(newJwt);
              sidecar.getAccess = () => newJwt;
              scheduleExpiryLogout(newJwt);
              restartNotificationsStream();
              return;
            }
          }

          // refresh invalid => clean up
          localStorage.removeItem("refresh");
          localStorage.removeItem("jwt");
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function login(userData, token, opts) {
    if (token) {
      try { localStorage.setItem("jwt", token); } catch {}
      sidecar.getAccess = () => token;
    } else {
      try { localStorage.removeItem("jwt"); } catch {}
      sidecar.getAccess = () => null;
    }

    setUser(userData);
    try { localStorage.setItem("user", JSON.stringify(userData)); } catch {}

    setAccessToken(token || null);
    setCookieBased(!!opts?.cookieBased);

    clearTimer();
    if (token) scheduleExpiryLogout(token);

    if (token) restartNotificationsStream();
    else stopNotificationsStream();
  }

  async function logout(reason = "manual") {
    stopNotificationsStream();

    const refresh = (() => {
      try { return localStorage.getItem("refresh"); } catch { return null; }
    })();

    try {
      if (refresh) {
        await apiFetch("/api/v3/auth/logout", {
          method: "POST",
          auth: "off",
          body: JSON.stringify({ refreshToken: refresh }),
        });
      }
    } catch {
      // ignore
    }

    clearTimer();
    setAccessToken(null);
    setCookieBased(false);
    setUser(null);

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      localStorage.removeItem("refresh");
    } catch {}

    sidecar.getAccess = () => null;

    if (reason === "expired" && !notifiedExpired.current) {
      notifiedExpired.current = true;
      toast.info(t("session_expired"), { position: "top-right" });
    }

    const next = location.pathname + location.search;
    if (!location.pathname.startsWith("/signin")) {
      navigate(`/signin?next=${encodeURIComponent(next)}`, {
        replace: true,
        state: { reason },
      });
    }
  }

  useEffect(() => {
    sidecar.getAccess = () => accessToken;
    sidecar.forceLogout = (reason = "expired") => logout(reason);
  }, [accessToken]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      cookieBased,
      isAuthenticated: !!user && (!!accessToken || cookieBased),
      authReady,
      login,
      logout,
    }),
    [user, accessToken, cookieBased, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
