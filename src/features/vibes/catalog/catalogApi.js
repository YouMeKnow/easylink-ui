// src/features/vibes/catalog/catalogApi.js
import { apiFetch } from "@/api/apiFetch";

/**
 * Catalog API (v3)
 * Assumes backend routes:
 *  - GET    /api/v3/catalog?vibeId=...
 *  - DELETE /api/v3/catalog/{itemId}?vibeId=...
 *  - (Optional bulk) DELETE /api/v3/catalog?vibeId=...  body: { ids: [] }
 *
 * If your backend differs, we’ll adjust the endpoints here — UI won't change.
 */

export async function getItemsByVibeId({ vibeId, signal }) {
  const qs = new URLSearchParams({ vibeId: String(vibeId) }).toString();
  const res = await apiFetch(`/api/v3/catalog?${qs}`, { method: "GET", signal });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Delete one item.
 * Common REST pattern: DELETE /api/v3/catalog/{id}?vibeId=...
 */
export async function deleteCatalogItem({ vibeId, itemId }) {
  const qs = vibeId ? `?${new URLSearchParams({ vibeId: String(vibeId) })}` : "";
  const res = await apiFetch(`/api/v3/catalog/${encodeURIComponent(itemId)}${qs}`, {
    method: "DELETE",
  });

  // some backends return 204 no content
  if (res.status === 204) return true;

  // if returns json
  try {
    await res.json();
  } catch (_) {}
  return true;
}

/**
 * Bulk delete with safe fallback:
 *  1) Try bulk endpoint: DELETE /api/v3/catalog?vibeId=... with body { ids }
 *  2) If backend doesn't support it, fallback to per-item deletes
 */
export async function deleteCatalogItems({ vibeId, ids }) {
  const clean = (ids || []).filter(Boolean);
  if (!clean.length) return true;

  // attempt bulk delete
  try {
    const qs = vibeId ? `?${new URLSearchParams({ vibeId: String(vibeId) })}` : "";
    const res = await apiFetch(`/api/v3/catalog${qs}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: clean }),
    });

    if (res.status === 204) return true;

    // if it returns something
    try {
      await res.json();
    } catch (_) {}
    return true;
  } catch (e) {
    // if backend rejects DELETE with body / no route -> fallback
    await Promise.all(clean.map((itemId) => deleteCatalogItem({ vibeId, itemId })));
    return true;
  }
}
