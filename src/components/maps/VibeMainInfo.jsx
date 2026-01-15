// src/components/vibes/VibeMainInfo.jsx
export default function VibeMainInfo({ vibe }) {
  if (!vibe) return null;
  return (
    <div className="card mt-3 p-3" style={{ borderRadius: 12 }}>
      <h5 style={{ fontWeight: 700 }}>{vibe.name}</h5>
      <div style={{ color: "#789" }}>{vibe.type}</div>
      <div style={{ marginTop: 6 }}>
        {vibe.contacts?.map((c, i) =>
          <div key={i}><strong>{c.type}:</strong> {c.value}</div>
        )}
      </div>
    </div>
  );
}
