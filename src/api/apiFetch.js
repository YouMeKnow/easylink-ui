// src/api/apiFetch.js
import { getAuthSidecar } from "@/context/AuthContext";
export async function apiFetch(input, init = {}) {
  const {
    auth = "auto",
    token = null,
    stream = false,         
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

  const hasBody = restInit.body != null;
  if (!stream && hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // ✅ можно помочь явным Accept
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
  });

  if (!res.ok) {
    const data = await readBodySafe(res);
    throw makeHttpError(res, data);
  }

  return res;
}