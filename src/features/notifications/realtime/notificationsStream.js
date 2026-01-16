// src/features/notifications/realtime/notificationsStream.js

const KEY = "__EASYLINK_NOTIF_STREAM__";
const TOKEN_KEY = "jwt";

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function getState() {
  if (!globalThis[KEY]) {
    globalThis[KEY] = {
      es: null,
      listeners: new Set(),
      reconnectTimer: null,
      stopped: false,
      connecting: false,

      // extras for stability
      lastToken: null,
      attempt: 0,
    };
  }
  return globalThis[KEY];
}

function clearReconnect(st) {
  if (st.reconnectTimer) clearTimeout(st.reconnectTimer);
  st.reconnectTimer = null;
}

function safeClose(st) {
  clearReconnect(st);

  if (st.es) {
    try {
      st.es.close();
    } catch {}
  }
  st.es = null;
  st.connecting = false;
}

function buildUrl(token) {
  const url = new URL("/api/notifications/stream", window.location.origin);
  url.searchParams.set("token", token);

  url.searchParams.set("ts", String(Date.now()));
  return url.toString();
}

function scheduleReconnect(st) {
  if (st.stopped) return;
  if (st.listeners.size === 0) return;

  clearReconnect(st);

  // backoff: 0.5s -> 1s -> 2s -> 4s -> 8s -> 15s (cap)
  const base = 500;
  const cap = 15000;
  const delay = Math.min(cap, base * Math.pow(2, Math.min(st.attempt, 5)));

  st.reconnectTimer = setTimeout(() => {
    connect(st);
  }, delay);
}

function connect(st) {
  if (st.stopped || st.connecting) return;
  if (st.listeners.size === 0) return;

  const token = getToken();

  if (!token) {
    st.lastToken = null;
    st.attempt = 0;
    safeClose(st);
    return;
  }

  if (st.es && st.lastToken && st.lastToken !== token) {
    safeClose(st);
  }


  if (st.es) return;

  st.connecting = true;
  st.lastToken = token;

  safeClose(st); 

  const url = buildUrl(token);
  const es = new EventSource(url); 
  st.es = es;

  const emit = (type, data) => {
    st.listeners.forEach((fn) => {
      try {
        fn({ type, data });
      } catch {}
    });
  };

  es.addEventListener("open", () => {
    st.connecting = false;
    st.attempt = 0;
    emit("connected", "ok");
  });

  es.addEventListener("connected", () => {
    st.connecting = false;
    st.attempt = 0;
    emit("connected", "ok");
  });

  es.addEventListener("ping", (e) => {
    emit("ping", e?.data ?? "ok");
  });

  es.addEventListener("notification.created", (e) => {
    try {
      emit("notification.created", JSON.parse(e.data));
    } catch {
      emit("notification.created", e?.data);
    }
  });

  es.addEventListener("notification.unread_changed", (e) => {
    try {
      emit("notification.unread_changed", JSON.parse(e.data));
    } catch {
      emit("notification.unread_changed", e?.data);
    }
  });

  es.addEventListener("error", () => {
    st.connecting = false;
    st.attempt += 1;

    safeClose(st);
    scheduleReconnect(st);
  });
}

export function openNotificationsStream({ onEvent } = {}) {
  const st = getState();
  st.stopped = false;

  if (onEvent) st.listeners.add(onEvent);

  if (st.listeners.size === 1) {
    connect(st);
  }

  return () => {
    if (onEvent) st.listeners.delete(onEvent);

    if (st.listeners.size === 0) {
      st.stopped = true;
      st.attempt = 0;
      safeClose(st);
    }
  };
}

export function stopNotificationsStream() {
  const st = getState();
  st.listeners.clear();
  st.stopped = true;
  st.attempt = 0;
  st.lastToken = null;
  safeClose(st);
}

export function restartNotificationsStream() {
  const st = getState();
  st.stopped = false;
  st.attempt = 0;
  safeClose(st);
  connect(st);
}
