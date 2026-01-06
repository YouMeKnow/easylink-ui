// src/features/vibes/offers/deleteOffer.js
import { apiFetch } from "@/api/apiFetch";

export async function useDeleteOffer({ offerId, vibeId }) {
  const res = await apiFetch(
    `/api/v3/offers/${offerId}?vibeId=${encodeURIComponent(vibeId)}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw Object.assign(new Error(text || "Delete offer failed"), {
      status: res.status,
    });
  }

  // сервер возвращает 204 No Content — ничего не парсим
}
