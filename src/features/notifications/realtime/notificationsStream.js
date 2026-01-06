import { apiFetch } from "@/api/apiFetch";

export async function openNotificationsStream({ onEvent, onError, signal } = {}) {
  try {
    const res = await apiFetch("/api/notifications/stream", {
      method: "GET",
      stream: true,     
      signal,
      headers: {
        Accept: "text/event-stream",
      },
    });
    if (!res.ok) {
      throw new Error(`SSE failed: ${res.status}`);
    }
    if (!res.body) {
      throw new Error("SSE: response body is empty");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    const emit = (evtName, dataStr) => {
      if (!onEvent) return;
      let data = dataStr;
      try { data = JSON.parse(dataStr); } catch {}
      onEvent({ event: evtName || "message", data });
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        let eventName = "";
        const dataLines = [];

        raw.split("\n").forEach((line) => {
          const l = line.replace(/\r$/, "");
          if (l.startsWith("event:")) eventName = l.slice(6).trim();
          else if (l.startsWith("data:")) dataLines.push(l.slice(5).trim());
        });        
        if (dataLines.length) emit(eventName, dataLines.join("\n"));
        else if (eventName) emit(eventName, "");
      }
    }
  } catch (e) {
    if (signal?.aborted) return;
    onError?.(e);
  }
}
