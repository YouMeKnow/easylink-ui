import React, { useEffect, useMemo, useCallback } from "react";

function resolvePhotoUrl(photo) {
  if (!photo) return "/default-avatar.png";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/uploads/")) return photo;
  return `/uploads/${photo}`;
}

export default function SelectVibeModal({
  t,
  availableVibes = [],
  selectedMyVibeId,
  setSelectedMyVibeId,
  onConfirm,
  onCancel,
  loading = false,
  error = null,
}) {
  const canConfirm = Boolean(selectedMyVibeId) && !loading;

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onCancel?.();
    },
    [onCancel]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    // (по желанию) lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onKeyDown]);

  const title = useMemo(
    () => t?.("Select your Vibe to subscribe with", { defaultValue: "Select your Vibe to subscribe with" })
      ?? "Select your Vibe to subscribe with",
    [t]
  );

  return (
    <div
      className="modal-backdrop d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1050,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // клик по фону закрывает, клик внутри — нет
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div
        className="modal-content p-4 shadow rounded bg-white"
        style={{ maxWidth: 520, width: "92%" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h5 className="mb-3">{title}</h5>

        {error ? (
          <div className="alert alert-danger py-2">{String(error)}</div>
        ) : null}

        <ul className="list-group mb-3" style={{ maxHeight: 360, overflowY: "auto" }}>
          {availableVibes.length ? (
            availableVibes.map((vibe) => (
              <li
                key={vibe.id}
                className={`list-group-item d-flex align-items-center gap-2 ${
                  selectedMyVibeId === vibe.id ? "active" : ""
                }`}
                onClick={() => setSelectedMyVibeId?.(vibe.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={resolvePhotoUrl(vibe.photo)}
                  alt="avatar"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flex: "0 0 auto",
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {vibe.name || t?.("Unnamed Vibe", { defaultValue: "Unnamed Vibe" }) || "Unnamed Vibe"}
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {vibe.description
                      ? vibe.description.slice(0, 60) + (vibe.description.length > 60 ? "…" : "")
                      : t?.("No description", { defaultValue: "No description" }) || "No description"}
                  </div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", color: "#999" }}>
                    {vibe.type || "Vibe"}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">
              {t?.("No vibes available", { defaultValue: "No vibes available" }) || "No vibes available"}
            </li>
          )}
        </ul>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            {t?.("Cancel", { defaultValue: "Cancel" }) || "Cancel"}
          </button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={!canConfirm}>
            {loading
              ? t?.("Confirming…", { defaultValue: "Confirming…" }) || "Confirming…"
              : t?.("Confirm", { defaultValue: "Confirm" }) || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
