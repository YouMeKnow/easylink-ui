import React, { useMemo, useEffect, useState } from "react";
import SmartImage from "@/shared/ui/SmartImage";
import "@/features/vibes/styles/Avatar.css";

export default function Avatar({ name, photo, photoUrl }) {
  const [open, setOpen] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || window.location.origin;

  const src = useMemo(() => {
    const normalize = (p) => {
      if (!p) return null;
      const s = String(p).trim();

      if (/^https?:\/\//i.test(s)) return s;
      if (s.startsWith("/uploads/")) return `${API_BASE}${s}`;
      if (s.startsWith("uploads/")) return `${API_BASE}/${s}`;
      if (s.startsWith("/")) return `${API_BASE}${s}`;       
      return `${API_BASE}/${s}`;
    };

    // 1) explicit url wins, BUT normalized
    if (photoUrl) return normalize(photoUrl);

    // 2) file preview
    if (photo instanceof File) return URL.createObjectURL(photo);

    // 3) string photo normalized
    if (typeof photo === "string") return normalize(photo);

    return null;
  }, [photo, photoUrl, API_BASE]);


  useEffect(() => {
    if (photo instanceof File && src?.startsWith("blob:")) {
      return () => URL.revokeObjectURL(src);
    }
  }, [photo, src]);

  return (
    <>
      <div
        onDoubleClick={() => src && setOpen(true)}
        style={{
          width: 94,
          height: 94,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #e6f0fc 70%, #f6eaff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginBottom: 14,
          marginTop: -8,
          userSelect: "none",
        }}
      >
        {src ? (
          <SmartImage
            src={photoUrl || photo}
            alt={name}
            fallback={
              <span style={{ color: "#bbb", fontSize: 40 }}>
                {name ? name[0].toUpperCase() : "?"}
              </span>
            }
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ color: "#bbb", fontSize: 40 }}>
            {name ? name[0].toUpperCase() : "?"}
          </span>
        )}
      </div>

      {open && src && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={src}
            alt={name}
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 12 }}
          />
        </div>
      )}
    </>
  );
}
