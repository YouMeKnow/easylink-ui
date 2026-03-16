// src/features/vibes/offers/hooks/useUpdateOffer.js
import { useState, useCallback } from "react";
import { apiFetch } from "@/api/apiFetch";

export default function useUpdateOffer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOffer = useCallback(async (id, updatedFields) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...updatedFields,
        startTime: updatedFields.startTime
          ? new Date(updatedFields.startTime).toISOString()
          : updatedFields.startTime,
        endTime: updatedFields.endTime
          ? new Date(updatedFields.endTime).toISOString()
          : updatedFields.endTime,
      };

      const res = await apiFetch(`/api/v3/offers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw Object.assign(new Error(text || "Update offer failed"), {
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

  return { updateOffer, loading, error };
}
