import { apiFetch } from "@/api/apiFetch";

export async function fetchSubscribers(vibeId) {
  if (!vibeId) return [];
  const res = await apiFetch(`/api/v3/interactions/subscribers/${vibeId}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`fetchSubscribers failed: ${res.status} ${text}`);
  }
  return await res.json(); 
}
