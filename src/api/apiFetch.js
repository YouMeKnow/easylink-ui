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
  const {
    auth = "auto", 
    token = null,  
    ...restInit
  } = init;

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

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
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
  });

  if (!res.ok) {
    const data = await readBodySafe(res);
    throw makeHttpError(res, data);
  }

  return res;
}