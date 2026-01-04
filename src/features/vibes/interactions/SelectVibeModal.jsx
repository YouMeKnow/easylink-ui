// src/features/vibes/interactions/SelectVibeModal.jsx
import React, { useCallback, useEffect, useMemo } from "react";
import "@/features/vibes/styles/SelectVibeModal.css";
import SmartImage from "@/shared/ui/SmartImage";

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

  // keep prop name for compatibility, treat as "subscribed ids"
  disabledVibeIds = [],
}) {
  const canConfirm = Boolean(selectedMyVibeId) && !loading;

  const isSubscribedId = useCallback(
    (id) => (disabledVibeIds || []).some((x) => String(x) === String(id)),
    [disabledVibeIds]
  );

  const selectedIsSubscribed = useMemo(() => {
    if (!selectedMyVibeId) return false;
    return isSubscribedId(selectedMyVibeId);
  }, [selectedMyVibeId, isSubscribedId]);

  const title = useMemo(
    () =>
      t?.("Select your Vibe", { defaultValue: "Select your Vibe" }) ??
      "Select your Vibe",
    [t]
  );

  const subtitle = useMemo(
    () =>
      t?.("Choose a vibe to subscribe / unsubscribe", {
        defaultValue: "Choose a vibe to subscribe / unsubscribe",
      }) ?? "Choose a vibe to subscribe / unsubscribe",
    [t]
  );

  const hint = useMemo(() => {
    if (!selectedMyVibeId) {
      return (
        t?.("Select a vibe to continue.", { defaultValue: "Select a vibe to continue." }) ||
        "Select a vibe to continue."
      );
    }
    return selectedIsSubscribed
      ? t?.("This will unsubscribe the selected vibe.", {
          defaultValue: "This will unsubscribe the selected vibe.",
        }) || "This will unsubscribe the selected vibe."
      : t?.("This will subscribe the selected vibe.", {
          defaultValue: "This will subscribe the selected vibe.",
        }) || "This will subscribe the selected vibe.";
  }, [t, selectedMyVibeId, selectedIsSubscribed]);

  const confirmLabel = useMemo(() => {
    if (loading) {
      return t?.("Working…", { defaultValue: "Working…" }) || "Working…";
    }
    return selectedIsSubscribed
      ? t?.("Unsubscribe", { defaultValue: "Unsubscribe" }) || "Unsubscribe"
      : t?.("Subscribe", { defaultValue: "Subscribe" }) || "Subscribe";
  }, [t, loading, selectedIsSubscribed]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onCancel?.();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canConfirm) onConfirm?.();
    },
    [onCancel, onConfirm, canConfirm]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onKeyDown]);

  return (
    <div
      className="svm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div className="svm__modal" onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="svm__header">
          <div className="svm__headText">
            <div className="svm__title">{title}</div>
            <div className="svm__subtitle">{subtitle}</div>
          </div>

          <button
            type="button"
            className="svm__closeBtn"
            onClick={onCancel}
            disabled={loading}
            aria-label={t?.("Close", { defaultValue: "Close" }) || "Close"}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="svm__body">
          {error ? <div className="svm__error">{String(error)}</div> : null}

          <div className="svm__listWrap">
            {availableVibes.length ? (
              <div className="svm__grid">
                {availableVibes.map((v) => {
                  const active = String(selectedMyVibeId) === String(v.id);
                  const subscribed = isSubscribedId(v.id);

                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`svm__card ${active ? "is-active" : ""}`}
                      onClick={() => setSelectedMyVibeId?.(v.id)}
                    >
                      <div className="svm__avatarWrap">
                        <SmartImage
                          src={v.photo}
                          alt="avatar"
                          className="svm__avatarImg"
                          fallback={
                            <div className="avatar-fallback">
                              {(v?.name?.[0] || "?").toUpperCase()}
                            </div>
                          }
                        />
                      </div>
                      <div className="svm__cardBody">
                        <div className="svm__row">
                          <div className="svm__name">
                            {v.name ||
                              t?.("Unnamed Vibe", { defaultValue: "Unnamed Vibe" }) ||
                              "Unnamed Vibe"}
                          </div>

                          <span className={`svm__badge ${subscribed ? "is-on" : "is-off"}`}>
                            {subscribed
                              ? t?.("Subscribed", { defaultValue: "Subscribed" }) || "Subscribed"
                              : t?.("Available", { defaultValue: "Available" }) || "Available"}
                          </span>
                        </div>

                        <div className="svm__desc">
                          {v.description
                            ? v.description.slice(0, 72) +
                              (v.description.length > 72 ? "…" : "")
                            : t?.("No description", { defaultValue: "No description" }) ||
                              "No description"}
                        </div>

                        <div className="svm__meta">{v.type || "Vibe"}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="svm__empty">
                {t?.("No vibes available", { defaultValue: "No vibes available" }) ||
                  "No vibes available"}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="svm__footer">
          <div className="svm__hint">{hint}</div>

          <div className="svm__actions">
            <button
              type="button"
              className="svm__btn svm__btn--ghost"
              onClick={onCancel}
              disabled={loading}
            >
              {t?.("Cancel", { defaultValue: "Cancel" }) || "Cancel"}
            </button>

            <button
              type="button"
              className={`svm__btn ${
                selectedIsSubscribed ? "svm__btn--danger" : "svm__btn--primary"
              }`}
              onClick={onConfirm}
              disabled={!canConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
