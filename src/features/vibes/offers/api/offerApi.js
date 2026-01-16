// src/features/vibes/offers/api/offerApi.js
import { apiFetch } from "@/api/apiFetch";

async function throwIfNotOk(res, fallback) {
  if (res.ok) return;
  const text = await res.text().catch(() => "");
  throw Object.assign(new Error(text || fallback), { status: res.status });
}

export async function deleteOffer({ offerId, vibeId }) {
  const res = await apiFetch(
    `/api/v3/offers/${offerId}?vibeId=${encodeURIComponent(vibeId)}`,
    { method: "DELETE" }
  );
  await throwIfNotOk(res, "Delete offer failed");
  return true;
}
