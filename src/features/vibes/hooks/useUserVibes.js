import { useEffect, useState } from "react";
import { getUserVibes, deleteVibe } from "@/api/vibeApi";

export default function useUserVibes({ enabled }) {
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setVibes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const data = await getUserVibes();
        if (!cancelled) setVibes(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setVibes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const remove = async (id) => {
    await deleteVibe(id);
    setVibes((prev) => prev.filter((v) => v.id !== id));
  };

  return { vibes, loading, setVibes, remove, setLoading };
}
