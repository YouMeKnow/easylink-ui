import React from "react";
import VibeCircleTile from "./VibeCircleTile";
import "./VibeCircleGrid.css";

function normalizeVibe(item) {
  const id =
    item?.id ||
    item?.vibeId ||
    item?.targetVibeId ||
    item?.targetVibe?.id ||
    item?.vibe?.id;

  const name = item?.name || item?.targetVibe?.name || item?.vibe?.name || "";
  const type = item?.type || item?.targetVibe?.type || item?.vibe?.type || "";
  const photo = item?.photo || item?.targetVibe?.photo || item?.vibe?.photo || null;
  const description =
    item?.description || item?.targetVibe?.description || item?.vibe?.description || "";

  return { id, name, type, photo, description };
}

function normType(type) {
  const s = String(type || "").trim().toLowerCase();
  if (!s) return "other";
  if (s === "business") return "business";
  if (s === "personal") return "personal";
  return "other";
}

function groupByType(list) {
  const groups = { business: [], personal: [], other: [] };
  for (const v of list) groups[normType(v.type)].push(v);
  return groups;
}

function Section({ title, count, children }) {
  return (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="fw-semibold" style={{ fontSize: 14, letterSpacing: ".02em" }}>
          {title}
        </div>
        <div className="text-muted" style={{ fontSize: 13 }}>
          {count}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function VibeCircleGrid({ vibes = [], t }) {
  const list = React.useMemo(() => {
    return Array.isArray(vibes)
      ? vibes.map(normalizeVibe).filter((v) => !!v.id)
      : [];
  }, [vibes]);

  const [q, setQ] = React.useState("");
  const inputRef = React.useRef(null);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter((v) => (v.name || "").toLowerCase().includes(s));
  }, [q, list]);

  const grouped = React.useMemo(() => groupByType(filtered), [filtered]);

  const total = list.length;
  const shown = filtered.length;

  const emptyTitle = t("empty.circle", { defaultValue: "No vibes yet." });
  const emptyHint = t("empty.circle_hint", { defaultValue: "" });

  const unnamed = t("labels.unnamed", { defaultValue: "Unnamed" });

  if (total === 0) {
    return (
      <div className="text-center py-5">
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: "50%",
            margin: "0 auto 10px",
            background:
              "linear-gradient(135deg, rgba(71,109,254,.18), rgba(160,115,255,.16))",
            display: "grid",
            placeItems: "center",
            color: "#476dfe",
            fontWeight: 800,
            fontSize: 22,
          }}
          aria-hidden="true"
        >
          ✦
        </div>

        <div className="fw-semibold" style={{ fontSize: 16 }}>
          {emptyTitle}
        </div>

        {emptyHint ? (
          <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
            {emptyHint}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      {/* toolbar */}
      <div className="vc-toolbar">
        <div className="vc-toolbar__left">
          <div className="vc-count">
            {q.trim()
              ? t("count_filtered", {
                  shown,
                  total,
                  defaultValue: `${shown} / ${total}`,
                })
              : t("count", { count: total, defaultValue: `${total} vibes` })}
          </div>
        </div>

        <div className="vc-toolbar__right">
          <div className="vc-search" role="search">
            <span className="vc-searchIcon" aria-hidden="true" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="vc-searchInput"
              placeholder={t("search_placeholder", {
                defaultValue: "Search by name...",
              })}
            />
            {q ? (
              <button
                type="button"
                className="vc-iconBtn"
                onClick={() => setQ("")}
                aria-label={t("clear", { defaultValue: "Clear" })}
                title={t("clear", { defaultValue: "Clear" })}
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* sections */}
      {grouped.business.length > 0 && (
        <Section
          title={t("sections.business", { defaultValue: "Business" })}
          count={grouped.business.length}
        >
          {grouped.business.map((v) => (
            <VibeCircleTile
              key={v.id}
              vibe={{ ...v, name: v.name || unnamed }}
              t={t}
            />
          ))}
        </Section>
      )}

      {grouped.personal.length > 0 && (
        <Section
          title={t("sections.personal", { defaultValue: "Personal" })}
          count={grouped.personal.length}
        >
          {grouped.personal.map((v) => (
            <VibeCircleTile
              key={v.id}
              vibe={{ ...v, name: v.name || unnamed }}
              t={t}
            />
          ))}
        </Section>
      )}

      {grouped.other.length > 0 && (
        <Section
          title={t("sections.other", { defaultValue: "Others" })}
          count={grouped.other.length}
        >
          {grouped.other.map((v) => (
            <VibeCircleTile
              key={v.id}
              vibe={{ ...v, name: v.name || unnamed }}
              t={t}
            />
          ))}
        </Section>
      )}

      {/* empty after search */}
      {shown === 0 && (
        <div className="text-center text-muted py-4">
          {t("no_results", { defaultValue: "No results." })}
        </div>
      )}
    </div>
  );
}