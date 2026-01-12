// src/features/vibes/offers/hooks/useCreateOffer.js
import { useState, useCallback } from "react";
import { apiFetch } from "@/api/apiFetch";

const num = (v) => (v === "" || v == null ? null : Number(v));

export default function useCreateOffer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOffer = useCallback(async (form, subscriberVibeId) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        vibeId: subscriberVibeId,
        title: form.title,
        description: form.description,
        discountType: form.discountType,
        initialDiscount: num(form.initialDiscount),
        currentDiscount: num(form.currentDiscount),
        decreaseStep: num(form.decreaseStep),
        decreaseIntervalMinutes: num(form.decreaseIntervalMinutes),
        active: !!form.active,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      };

      const res = await apiFetch("/api/v3/offers", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw Object.assign(new Error(text || "Create offer failed"), {
          status: res.status,
        });
      }

      return true;
    } catch (e) {
      setError(e);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createOffer, loading, error };
}
