import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { openNotificationsStream } from "@/features/notifications/realtime/notificationsStream";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/features/notifications/api/notificationsApi";

export function useNotifications({ enabled, limit = 6 } = {}) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const unreadCount = useMemo(
    () => items.reduce((acc, n) => acc + (n?.read ? 0 : 1), 0),
    [items]
  );

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({ limit });
      const normalized = Array.isArray(data)
        ? data.map((n) => ({ ...n, read: !!n.read }))
        : [];
      setItems(normalized);
    } catch (e) {
      console.error("NOTIFICATIONS LOAD ERROR:", e);
      setError(e?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [enabled, limit]);

  // keep latest load in ref (so SSE doesn't depend on load)
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  // initial load when enabled changes
  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setOpen(false);
      return;
    }
    load().catch(() => {});
  }, [enabled, load]);

  // SSE refresh (simple)
  useEffect(() => {
    if (!enabled) return;

    const unsub = openNotificationsStream({
      onEvent: ({ type }) => {
        if (type === "connected" || type === "ping") return;
        loadRef.current?.().catch(() => {});
      },
    });

    return () => unsub?.();
  }, [enabled]);

  // close on outside click / esc (only when open)
  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = useCallback(async () => {
    if (!open) loadRef.current?.().catch(() => {});
    setOpen((v) => !v);
  }, [open]);

  const markRead = useCallback(async (id) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, read: true } : x))
    );
    try {
      await markNotificationRead(id);
    } catch {}
  }, []);

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    try {
      await markAllNotificationsRead();
    } catch {}
  }, []);

  return {
    items,
    setItems,
    open,
    setOpen,
    toggle,
    wrapRef,
    unreadCount,
    loading,
    error,
    load,
    markRead,
    markAllRead,
  };
}
