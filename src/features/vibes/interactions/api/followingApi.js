import { apiFetch } from "@/api/apiFetch";

export async function fetchFollowing(vibeId) {
  const res = await apiFetch(`/api/v3/vibes/${vibeId}/following`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to load following");

  return res.json();
}