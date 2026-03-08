// src/api/apiFetch.js
import { getAuthSidecar } from "@/context/AuthContext";

let refreshInFlight = null;

export async function apiFetch(input, init = {}) {
  const { auth = "auto", token = null, stream = false, ...restInit } = init;

  const res = await doFetchOnce(input, { auth, token, stream, ...restInit });

  if (res.ok) return res;

  if (auth === "off" || res.status !== 401) {
    const data = await readBodySafe(res);
    throw makeHttpError(res, data);
  }

  const refreshed = await tryRefreshAccessToken();
  if (!refreshed) {
    const data = await readBodySafe(res);
    throw makeHttpError(res, data);
  }

  const res2 = await doFetchOnce(input, { auth, token, stream, ...restInit });

  if (!res2.ok) {
    const data = await readBodySafe(res2);
    throw makeHttpError(res2, data);
  }

  return res2;
}

async function doFetchOnce(input, init) {
  const { auth, token, stream, ...restInit } = init;

  const sc = getAuthSidecar();

  const access =
    auth === "force"
      ? token
      : auth === "off"
      ? null
      : sc.getAccess?.() ||
        (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);

  const headers = new Headers(restInit.headers || {});
  const isFormData =
    typeof FormData !== "undefined" && restInit.body instanceof FormData;

  const hasBody = restInit.body != null;
  if (!stream && hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (stream && !headers.has("Accept")) {
    headers.set("Accept", "text/event-stream");
  }

  if (access && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  if (auth === "off" && headers.has("Authorization")) {
    headers.delete("Authorization");
  }

  return fetch(input, {
    ...restInit,
    headers,
    credentials: "include",
    cache: "no-store",
  });
}

async function tryRefreshAccessToken() {
  const refresh =
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
  if (!refresh) return false;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch("/api/v3/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ refreshToken: refresh }),
        });

        if (!res.ok) {
          // refresh 
          localStorage.removeItem("refresh");
          localStorage.removeItem("jwt");
          return false;
        }

        const data = await res.json().catch(() => ({}));
        const accessToken = data?.accessToken || data?.token || null;

        if (!accessToken) {
          localStorage.removeItem("refresh");
          localStorage.removeItem("jwt");
          return false;
        }

        localStorage.setItem("jwt", accessToken);
        return true;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return await refreshInFlight;
}

/** read response body safely (text or json) */
async function readBodySafe(res) {
  try {
    const ct = res.headers?.get?.("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      if (typeof data === "string") return data;
      return data?.message || data?.error || JSON.stringify(data);
    }
    return await res.text();
  } catch {
    return "";
  }
}

/** build useful Error object */
function makeHttpError(res, body) {
  const message =
    (typeof body === "string" && body.trim()) ||
    `HTTP ${res.status} ${res.statusText}`;

  const err = new Error(message);
  err.status = res.status;
  err.statusText = res.statusText;
  err.url = res.url;
  err.body = body;
  return err;
}
