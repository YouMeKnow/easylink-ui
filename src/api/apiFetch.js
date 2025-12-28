// src/api/apiFetch.js
import { getAuthSidecar } from "@/context/AuthContext";

async function readBodySafe(res) {
  // tries json -> text
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    const text = await res.text();
    return text || null;
  } catch {
    return null;
  }
}

function makeHttpError(res, data) {
  const message =
    (data && typeof data === "object" && (data.message || data.error)) ||
    (typeof data === "string" && data) ||
    res.statusText ||
    "Request failed";

  const err = new Error(message);
  err.status = res.status;
  err.data = data;
  err.url = res.url;
  return err;
}

export async function apiFetch(input, init = {}) {
  const sc = getAuthSidecar();
  const access =
    sc.getAccess?.() ||
    (typeof window !== "undefined" ? localStorage.getItem("jwt") : null); // <-- fallback

  const headers = new Headers(init.headers || {});
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (access && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  const res = await fetch(input, { ...init, headers, credentials: "include" });

  if (!res.ok) {
    const data = await readBodySafe(res);
    throw makeHttpError(res, data);
  }

  return res;
}
