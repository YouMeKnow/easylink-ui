import { apiFetch } from "@/api/apiFetch";

export async function fetchNotifications({ limit = 6 } = {}) {
  const res = await apiFetch(`/api/notifications?limit=${limit}`);
  return await res.json();
}

export async function markNotificationRead(id) {
  await apiFetch(`/api/notifications/${id}/read`, { method: "POST" });
}

export async function markAllNotificationsRead() {
  await apiFetch(`/api/notifications/read-all`, { method: "POST" });
}
