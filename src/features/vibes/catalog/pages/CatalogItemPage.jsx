import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SmartImage from "@/shared/ui/SmartImage";
import { apiFetch } from "@/api/apiFetch";
import "./CatalogItemPage.css";

export default function CatalogItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || window.location.origin;

  const normalizeSrc = useMemo(() => {
    return (p) => {
      if (!p) return null;
      const s = String(p).trim();
      if (/^https?:\/\//i.test(s)) return s;
      if (s.startsWith("/uploads/")) return `${API_BASE}${s}`;
      if (s.startsWith("uploads/")) return `${API_BASE}/${s}`;
      if (s.startsWith("/")) return `${API_BASE}${s}`;
      return `${API_BASE}/${s}`;
    };
  }, [API_BASE]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setErr("");
        setLoading(true);

        // ✅ правильный endpoint
        const res = await apiFetch(`/api/v3/catalog/${id}`, { auth: "auto" });

        // ✅ ВАЖНО: apiFetch возвращает Response
        const data = await res.json();

        setItem(data);
      } catch (e) {
        console.error(e);
        setErr(e?.message || "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const title = item?.title || "Untitled";
  const desc = item?.description || "";
  const img = normalizeSrc(item?.imageUrl);
  const price = item?.price;

  return (
    <div className="catalogItemPage">
      <div className="catalogItemTop">
        <button className="catalogBackBtn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="catalogCard">
        {loading ? (
          <div className="catalogLoading">Loading…</div>
        ) : err ? (
          <div className="catalogError">
            <div className="catalogErrorTitle">Couldn’t load item</div>
            <div className="catalogErrorText">{err}</div>

            <details className="catalogDebug">
              <summary>Debug</summary>
              <pre>{JSON.stringify({ id }, null, 2)}</pre>
            </details>
          </div>
        ) : !item ? (
          <div className="catalogEmpty">Item not found</div>
        ) : (
          <>
            <div className="catalogHero">
              <div className="catalogHeroImg">
                {img ? (
                  <SmartImage
                    src={img}
                    alt={title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    fallback={<div className="catalogNoImg">No image</div>}
                  />
                ) : (
                  <div className="catalogNoImg">No image</div>
                )}
              </div>

              {price != null && String(price).trim() !== "" && (
                <div className="catalogPricePill">{String(price)}</div>
              )}
            </div>

            <div className="catalogBody">
              <div className="catalogTitle">{title}</div>
              {!!desc && <div className="catalogDesc">{desc}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
