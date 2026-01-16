import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useSubscribe(targetVibeId) {
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async (myVibeId) => {
    const token = localStorage.getItem("jwt"); // ✅ брать здесь, всегда актуально

    if (!token) {
      navigate(`/signin?redirectTo=/vibes/${targetVibeId}&subscribe=true`);
      return;
    }

    const res = await fetch(`/api/v3/interactions`, {
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

    setSubscribed(true);
    return true;
  };

  return { subscribed, subscribe };
}
