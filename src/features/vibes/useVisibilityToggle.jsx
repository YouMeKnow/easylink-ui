import { useEffect, useMemo, useState, useCallback } from "react";
import isUuid from "@/shared/lib/isUuid";

export default function useVisibilityToggle(
  vibeId,
  initialVisible = false,
  initialCode = null,
  options = {}
) {
  const {
    enabled = true,
    labels = {},
    tokenKey = "jwt",
    fetchCodeOnMount = true,
    getVibeUrl = (id) => `/api/v3/vibes/${id}`,
  } = options;

  const token =
    typeof window !== "undefined" ? localStorage.getItem(tokenKey) : null;

  const canUseId = isUuid(vibeId);
  const canCallApi = enabled && canUseId && !!token;

  const [visible, setVisible] = useState(!!initialVisible);
  const [code, setCode] = useState(initialCode ?? null);

  // sync when props arrive later
  useEffect(() => {
    setVisible(!!initialVisible);
  }, [initialVisible]);

  useEffect(() => {
    setCode(initialCode ?? null);
  }, [initialCode]);

  // fetch code on mount if visible=true but code missing
  useEffect(() => {
    if (!fetchCodeOnMount) return;
    if (!canCallApi) return;
    if (!visible) return;
    if (code) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(getVibeUrl(vibeId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data = await res.json().catch(() => null);
        const fetchedCode = data?.publicCode ?? data?.code ?? null;

        if (!cancelled && fetchedCode) setCode(fetchedCode);
      } catch (e) {
        console.warn("Could not fetch vibe code on mount:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchCodeOnMount, canCallApi, visible, code, vibeId, token, getVibeUrl]);

  const toggle = useCallback(async () => {
    if (!canCallApi) return;

    const next = !visible;
    setVisible(next);

    try {
      const res = await fetch(
        `/api/v3/vibes/visibility/${vibeId}?visible=${next}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error(`Visibility update failed: ${res.status}`);

      const data = await res.json().catch(() => ({}));

      if (next) {
        const newCode = data?.publicCode ?? data?.code ?? code ?? null;
        setCode(newCode);
      } else {
        setCode(null);
      }
    } catch (err) {
      console.error("Failed to update visibility:", err);
      setVisible(!next);
    }
  }, [canCallApi, token, vibeId, visible, code]);

  const ui = useMemo(() => {
    return (
      <label className="form-check form-switch m-0 d-flex align-items-center gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={visible}
          onChange={toggle}
          disabled={!canCallApi}
        />
        <span className="form-check-label">
          {visible ? labels.visible ?? "Visible" : labels.hidden ?? "Hidden"}
        </span>
      </label>
    );
  }, [visible, toggle, canCallApi, labels.visible, labels.hidden]);

  return [visible, code, ui];
}
