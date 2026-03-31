import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mockVibes from "../../data/mockVibes";
import VibeMainInfo from "./VibeMainInfo";

mapboxgl.accessToken = "pk.eyJ1IjoiYXJzY2hoIiwiYSI6ImNtYzg0ZmY3YTFqaWcybXB2OWFvOTlza3kifQ.rvZoV7fy9VMTlmrS8R5QlQ";

export default function UserMap({ onVibeSelect }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [popupVibe, setPopupVibe] = useState(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [mockVibes[0].lng, mockVibes[0].lat],
        zoom: 13,
        attributionControl: false
      });

      mockVibes.forEach(vibe => {
        const el = document.createElement("div");
        el.className = "vibe-marker";
        el.style.width = "44px";
        el.style.height = "44px";
        el.style.borderRadius = "50%";
        el.style.background = "linear-gradient(135deg, #8dc6ff, #bfe9ff 85%)";
        el.style.boxShadow = "0 2px 12px #99b6f7";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.cursor = "pointer";
        el.innerHTML = vibe.photo
          ? `<img src="${vibe.photo}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />`
          : `<span style="color:#355b99;font-weight:700;font-size:20px;">${vibe.name[0] || "?"}</span>`;

        el.onclick = () => {
          setPopupVibe(vibe);         
          onVibeSelect && onVibeSelect(vibe); 
        };

        new mapboxgl.Marker(el)
          .setLngLat([vibe.lng, vibe.lat])
          .addTo(mapRef.current);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onVibeSelect]);


  const popupCoords = popupVibe ? [popupVibe.lng, popupVibe.lat] : null;

  return (
    <div style={{position: "relative", width: "100%", height: 420, borderRadius: 18, overflow: "hidden"}}>
      <div ref={mapContainer} style={{ width: 660, height: 420, borderRadius: 18, overflow: "hidden" }} />
      {popupVibe && popupCoords && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, calc(-50% - 60px))`,
            zIndex: 2,
            minWidth: 320,
            maxWidth: 400
          }}
        >
          <div style={{ position: "relative" }}>
            <VibeMainInfo vibe={popupVibe} />
            <button
              onClick={() => setPopupVibe(null)}
              style={{
                position: "absolute",
                right: 8,
                top: 8,
                background: "rgba(255,255,255,0.85)",
                border: "none",
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 20,
                color: "#666",
                cursor: "pointer"
              }}
              aria-label="Close"
            >×</button>
          </div>
        </div>
      )}
      <style>{`
        .vibe-marker:hover {
          background: linear-gradient(135deg, #637bfd, #bfe9ff 90%);
          box-shadow: 0 4px 20px #637bfd44;
        }
      `}</style>
    </div>
  );
}
