// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

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

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        setAccessToken(jwt);
        sidecar.getAccess = () => jwt;
        scheduleExpiryLogout(jwt);

        // if user already has jwt on refresh, start SSE
        restartNotificationsStream();
      }
    } catch {}
    setAuthReady(true);
  }, []);

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

    // ✅ start/restart SSE right after successful login
    if (token) {
      restartNotificationsStream();
    } else {
      stopNotificationsStream();
    }
  }

  function logout(reason = "manual") {
    // ✅ stop SSE immediately so no reconnect/401 spam after logout
    stopNotificationsStream();

    clearTimer();
    setAccessToken(null);
    setCookieBased(false);
    setUser(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
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
