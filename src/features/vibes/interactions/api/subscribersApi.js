import { apiFetch } from "@/api/apiFetch";

export async function fetchSubscribers(vibeId) {
  const res = await apiFetch(
    `/api/v3/vibes/${encodeURIComponent(vibeId)}/subscribers`,
    { method: "GET" }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to load subscribers");
  }
  return res.json();
}

export async function removeSubscriber(vibeId, subscriberVibeId) {
  const res = await apiFetch(
    `/api/v3/vibes/${encodeURIComponent(vibeId)}/subscribers/${encodeURIComponent(subscriberVibeId)}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to remove subscriber");
  }
  return true;
}