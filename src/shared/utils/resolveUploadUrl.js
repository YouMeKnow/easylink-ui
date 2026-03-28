export function resolveUploadUrl(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return null;

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || window.location.origin;

  const s = pathOrUrl.trim();

  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/uploads/")) return `${API_BASE}${s}`;

  return s;
}
