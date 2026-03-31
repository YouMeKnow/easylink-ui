import { apiFetch } from "@/api/apiFetch";

/**
 * Backend base: /api/v3/interactions
 * We will use:
 *  GET  /api/v3/interactions/{vibeId}/requests
 *  POST /api/v3/interactions/{vibeId}/requests/{interactionId}/approve
 *  POST /api/v3/interactions/{vibeId}/requests/{interactionId}/reject
 */

async function parseJsonOrThrow(res) {
  const ct = res.headers?.get?.("content-type") || "";
  const text = await res.text();

  if (!res.ok) {
    // try to expose useful backend message
    throw new Error(text || `HTTP ${res.status}`);
  }

  // If server returned HTML (misrouting), show preview
  if (!ct.includes("application/json")) {
    throw new Error(`Server returned non-JSON: ${text.slice(0, 160)}`);
  }

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`Invalid JSON: ${text.slice(0, 160)}`);
  }
}

export async function fetchPendingRequests(vibeId) {
  const res = await apiFetch(
    `/api/v3/vibes/${encodeURIComponent(vibeId)}/requests`,
    { method: "GET" }
  );
  return parseJsonOrThrow(res);
}

export async function approveRequest(vibeId, interactionId) {
  const res = await apiFetch(
    `/api/v3/vibes/${encodeURIComponent(vibeId)}/requests/${encodeURIComponent(interactionId)}/approve`,
    { method: "POST" }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to approve request");
  }
  return true;
}

export async function rejectRequest(vibeId, interactionId) {
  const res = await apiFetch(
    `/api/v3/vibes/${encodeURIComponent(vibeId)}/requests/${encodeURIComponent(interactionId)}/reject`,
    { method: "POST" }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to reject request");
  }
  return true;
}