import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import OfferCard from "@/features/vibes/offers/components/OfferCard/OfferCard";
import useMyFollowingEdges from "./hooks/useMyFollowingEdges";
import useOffersForFollowingEdges from "./hooks/useOffersForFollowingEdges";
import { useAuth } from "@/context/AuthContext";
import { getVibe } from "@/api/vibeApi";
import SmartImage from "@/shared/ui/SmartImage";

import "./styles/ProfileSubscribedOffers.css";

function safeTypeLabel(type) {
  const t = String(type || "").toUpperCase();
  if (!t) return "vibe";
  if (t === "BUSINESS") return "business";
  if (t === "PERSONAL") return "personal";
  if (t === "OTHER") return "other";
  return t.toLowerCase();
}

function pickTime(offer) {
  const raw = offer?.updatedAt || offer?.createdAt || 0;
  const ms = new Date(raw).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

function formatShortDate(ms) {
  if (!ms) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
    }).format(new Date(ms));
  } catch {
    return "";
  }
}

async function mapLimit(list, limit, worker) {
  const ret = [];
  const executing = [];
  for (const item of list) {
    const p = Promise.resolve().then(() => worker(item));
    ret.push(p);
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    if (executing.length >= limit) await Promise.race(executing);
  }
  return Promise.all(ret);
}

function MiniAvatar({ photo, name, size = 34, className = "" }) {
  const letter = (name || "").trim().slice(0, 1).toUpperCase() || "?";

  return (
    <span
      className={`ps-ava ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <SmartImage
        src={photo}
        alt=""
        fallback={<span className="ps-ava__letter">{letter}</span>}
      />
    </span>
  );
}

export default function ProfileSubscribedOffers() {
  const { accessToken } = useAuth();
  const token =
    accessToken ??
    (typeof window !== "undefined" ? localStorage.getItem("jwt") : null);

  const navigate = useNavigate();
  const { t } = useTranslation("profile");

  const {
    edges,
    loading: loadingEdges,
    error: errorEdges,
    reload: reloadEdges,
  } = useMyFollowingEdges({ enabled: true, concurrency: 5, token });

  const hasTargets = Array.isArray(edges) && edges.length > 0;

  const {
    items,
    loading: loadingItems,
    error: errorItems,
    reload: reloadItems,
  } = useOffersForFollowingEdges(edges, {
    enabled: hasTargets && !loadingEdges,
    concurrency: 5,
    activeOnly: true,
    token,
  });

  const loading = loadingEdges || loadingItems;
  const error = errorEdges || errorItems;

  const sorted = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.slice().sort((a, b) => pickTime(b?.offer) - pickTime(a?.offer));
  }, [items]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const it of sorted) {
      const vid = it?.targetVibe?.id;
      if (!vid) continue;
      if (!map.has(vid)) map.set(vid, { targetVibe: it.targetVibe, rows: [] });
      map.get(vid).rows.push(it);
    }
    return Array.from(map.values());
  }, [sorted]);

  const [vibeById, setVibeById] = useState({});

  const neededVibeIds = useMemo(() => {
    const ids = new Set();
    for (const it of sorted) {
      if (it?.targetVibe?.id) ids.add(it.targetVibe.id);
      if (it?.sourceVibe?.id) ids.add(it.sourceVibe.id);
    }
    return Array.from(ids);
  }, [sorted]);

  useEffect(() => {
    if (!token) return;
    if (!neededVibeIds.length) return;

    let cancelled = false;
    const missing = neededVibeIds.filter((id) => !vibeById[id]);
    if (!missing.length) return;

    (async () => {
      try {
        await mapLimit(missing, 6, async (id) => {
          try {
            const v = await getVibe(id, { auth: "force", token });
            if (cancelled || !v?.id) return;

            setVibeById((prev) => {
              if (prev[v.id]) return prev;

              const description =
                v?.description ??
                v?.about ??
                v?.bio ??
                v?.tagline ??
                v?.headline ??
                "";

              return {
                ...prev,
                [v.id]: {
                  id: v.id,
                  name: v.name,
                  photo: v.photo,
                  type: v.type,
                  description,
                },
              };
            });
          } catch {
            // ignore
          }
        });
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, neededVibeIds.join("|")]);

  const resolveVibe = useCallback(
    (v) => {
      const id = v?.id;
      const cached = id ? vibeById[id] : null;

      return {
        id,
        name: cached?.name ?? v?.name ?? "",
        photo: cached?.photo ?? v?.photo ?? null,
        type: cached?.type ?? v?.type ?? null,
        description:
          cached?.description ??
          v?.description ??
          v?.about ??
          v?.bio ??
          v?.tagline ??
          v?.headline ??
          "",
      };
    },
    [vibeById]
  );

  const reload = () => {
    reloadEdges();
    reloadItems();
  };

  return (
    <section className="profile-offers glass">
      <header className="ps-head">
        <div className="ps-head__text">
          <div className="ps-kicker">
            {t("offers_kicker", { defaultValue: "subscriptions" })}
          </div>
          <h2 className="ps-title">
            {t("offers_title", { defaultValue: "Offers from vibes you follow" })}
          </h2>
          <div className="ps-sub">
            {t("offers_sub", { defaultValue: "grouped by business vibe" })}
          </div>
        </div>

        <button
          type="button"
          className="ps-refresh"
          onClick={reload}
          disabled={loading}
          title={t("refresh", { defaultValue: "refresh" })}
          aria-label={t("refresh", { defaultValue: "refresh" })}
        >
          ↻
        </button>
      </header>
      <div className="ps-head-divider" />
      {loading && (
        <div className="ps-state">{t("loading", { defaultValue: "loading..." })}</div>
      )}

      {!loading && error && (
        <div className="ps-state ps-state--error">
          {(error?.message || String(error)) ||
            t("offers_error", { defaultValue: "could not load offers." })}
        </div>
      )}

      {!loading && !error && !sorted.length && (
        <div className="ps-state">
          {t("no_offers_from_subscriptions", {
            defaultValue: "no active offers yet.",
          })}
        </div>
      )}

      {!loading && !error && grouped.length > 0 && (
        <div className="ps-groups">
          {grouped.map((g) => {
            const biz = resolveVibe(g.targetVibe);

            return (
              <article key={biz.id} className="ps-group">
                <div className="ps-group__grid">
                  {/* LEFT: vibe info */}
                  <aside className="ps-left">
                    <button
                      type="button"
                      className="ps-left__main"
                      onClick={() => navigate(`/view/${biz.id}?tab=offers`)}
                      title={t("open_business", { defaultValue: "open" })}
                    >
                      <MiniAvatar
                        photo={biz.photo}
                        name={biz.name}
                        size={64}
                        className="ps-ava--lg"
                      />

                      <div className="ps-left__text">
                        <div className="ps-left__nameRow">
                          <div className="ps-left__name">
                            {biz.name || t("business", { defaultValue: "business" })}
                          </div>
                          <span className="ps-pill">{safeTypeLabel(biz.type)}</span>
                        </div>

                        {biz.description ? (
                          <div className="ps-left__desc">{biz.description}</div>
                        ) : null}

                        <div className="ps-left__meta">
                          {t("offers_count", {
                            defaultValue: "{{count}} offers",
                            count: g.rows.length,
                          })}
                        </div>
                      </div>
                    </button>
                  </aside>

                  {/* RIGHT: offers stack */}
                  <div className="ps-right">
                    <div className="ps-offers ps-offers--stack">
                      {g.rows.map(({ offer, sourceVibe }) => {
                        const src = resolveVibe(sourceVibe);
                        const dateLabel = formatShortDate(pickTime(offer));

                        return (
                          <div key={offer.id} className="ps-offer">
                            <div className="ps-offer__byline">
                              <button
                                type="button"
                                className="ps-as"
                                onClick={() => navigate(`/view/${src.id}`)}
                                title={t("subscribed_as", {
                                  defaultValue: "subscribed as",
                                })}
                              >
                                <MiniAvatar
                                  photo={src.photo}
                                  name={src.name}
                                  size={26}
                                  className="ps-ava--sm"
                                />
                                <span className="ps-as__text">
                                  <span className="ps-as__label">
                                    {t("subscribed_as_short", {
                                      defaultValue: "as",
                                    })}
                                  </span>
                                  <span className="ps-as__name">
                                    {src.name || "my vibe"}
                                  </span>
                                </span>
                              </button>

                              {dateLabel ? <span className="ps-date">{dateLabel}</span> : null}
                            </div>

                            <OfferCard
                              offer={offer}
                              variant="compact"
                              onOpen={(o) => {
                                navigate(`/offers/${o.id}`, {
                                  state: {
                                    origin: "profile_subscribed_offers_grouped",
                                    ownerVibeId: biz.id,
                                    sourceVibeId: src.id,
                                  },
                                });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
