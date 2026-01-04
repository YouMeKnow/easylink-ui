import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SelectVibeModal from "@/features/vibes/interactions/SelectVibeModal";
import { apiFetch } from "@/api/apiFetch";

export default function SelectVibeModalWithLogic({
  targetVibeId,
  alreadySubscribedVibeIds = [],
  onCancel,
  onSubscribed,
  t,
}) {
  const navigate = useNavigate();

  const [availableVibes, setAvailableVibes] = useState([]);
  const [selectedMyVibeId, setSelectedMyVibeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const isAlreadySubscribed = useCallback(
    (id) => (alreadySubscribedVibeIds || []).some((x) => String(x) === String(id)),
    [alreadySubscribedVibeIds]
  );

  const subscribe = useCallback(
    async (myVibeId) => {
      if (!token) {
        navigate(`/signin?redirectTo=/view/${targetVibeId}&subscribe=true`);
        return;
      }

      const res = await apiFetch("/api/v3/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetVibeId,
          myVibeId,
          userEmail: null,
          anonymous: false,
          active: true,
          interactionType: "SUBSCRIBE",
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Subscribe failed (${res.status})`);
      }
    },
    [token, navigate, targetVibeId]
  );

  const unsubscribe = useCallback(
    async (myVibeId) => {
      if (!token) {
        navigate(`/signin?redirectTo=/view/${targetVibeId}&subscribe=true`);
        return;
      }

      const res = await apiFetch("/api/v3/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetVibeId,
          myVibeId,
          userEmail: null,
          anonymous: false,
          active: false,
          interactionType: "UNSUBSCRIBE",
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Unsubscribe failed (${res.status})`);
      }
    },
    [token, navigate, targetVibeId]
  );

  // ----- load my vibes -----
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setAvailableVibes([]);
          return;
        }

        const res = await apiFetch("/api/v3/vibes", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to load vibes (${res.status})`);
        }

        const data = await res.json();
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        const filtered = list.filter(
          (v) => String(v?.id) !== String(targetVibeId)
        );

        setAvailableVibes(filtered);
      } catch (e) {
        if (!cancelled && e?.name !== "AbortError") {
          setError(e?.message || "Failed to load vibes");
          setAvailableVibes([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [token, targetVibeId]);

  const handleConfirm = useCallback(async () => {
    if (!selectedMyVibeId || submitting) return;

    const already = isAlreadySubscribed(selectedMyVibeId);

    try {
      setSubmitting(true);
      setError(null);

      if (already) {
        await unsubscribe(selectedMyVibeId);
        onSubscribed?.(selectedMyVibeId, { action: "unsubscribed" });
      } else {
        await subscribe(selectedMyVibeId);
        onSubscribed?.(selectedMyVibeId, { action: "subscribed" });
      }
    } catch (e) {
      setError(
        e?.message || (already ? "Unsubscribe failed" : "Subscription failed")
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    selectedMyVibeId,
    submitting,
    subscribe,
    unsubscribe,
    onSubscribed,
    isAlreadySubscribed,
  ]);

  return (
    <SelectVibeModal
      t={t}
      availableVibes={availableVibes}
      selectedMyVibeId={selectedMyVibeId}
      setSelectedMyVibeId={setSelectedMyVibeId}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      loading={loading || submitting}
      error={error}
      disabledVibeIds={alreadySubscribedVibeIds}
    />
  );
}
