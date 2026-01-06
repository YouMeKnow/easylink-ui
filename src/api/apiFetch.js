// src/api/apiFetch.js
import { getAuthSidecar } from "@/context/AuthContext";

export async function apiFetch(input, init = {}) {
  const { auth = "auto", token = null, stream = false, ...restInit } = init;

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

  const res = await fetch(input, {
    ...restInit,
    headers,
    credentials: "include",
    cache: "no-store", // полезно, особенно для SSE/проблемных кэшей
  });

  if (!res.ok) {
    const data = await readBodySafe(res);
    throw makeHttpError(res, data);
  }

  return res;
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
