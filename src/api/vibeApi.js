// src/api/vibeApi.js
import { apiFetch } from "@/api/apiFetch";

export async function getUserVibes(init = {}) {
  const res = await apiFetch("/api/v3/vibes", { method: "GET", ...init });
  if (!res.ok) throw new Error("Failed to load vibes");
  return res.json();
}

export async function getVibe(id, init = {}) {
  const res = await apiFetch(`/api/v3/vibes/${encodeURIComponent(id)}`, {
    method: "GET",
    ...init,
  });
  if (!res.ok) throw new Error("Failed to load vibe");
  return res.json();
}

export async function createVibe(data, init = {}) {
  const res = await apiFetch("/api/v3/vibes", {
    method: "POST",
    body: JSON.stringify(data),
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || text);
    } catch {
      throw new Error(text || "Failed to create vibe");
    }
  }
  return res.json();
}

export async function updateVibe(id, data, init = {}) {
  const res = await apiFetch(`/api/v3/vibes/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
    ...init,
  });
  if (!res.ok) throw new Error("Failed to update vibe");
  return res.json();
}

export async function deleteVibe(id, init = {}) {
  const res = await apiFetch(`/api/v3/vibes/${encodeURIComponent(id)}`, {
    method: "DELETE",
    ...init,
  });
  if (!res.ok) throw new Error("Failed to delete vibe");
  return true;
}
