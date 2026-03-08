// src/features/vibes/business/BusinessVibeForm/tabs/MenuTab.jsx
import React, { useMemo, useState } from "react";
import SmartImage from "@/shared/ui/SmartImage";
import "./MenuTab.css";

export default function MenuTab({
  t,
  loadingItems,
  items = [],
  itemIds = [],

  vibeId,
  isOwner = false,

  onAddItem,
  onEditItem,
  onOpenItem,

  onToggleItem,
  onDeleteItems,
}) {
  const [q, setQ] = useState("");

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

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return (items || []).filter((it) => {
      const title = String(it?.title || "").toLowerCase();
      const desc = String(it?.description || "").toLowerCase();
      return title.includes(query) || desc.includes(query);
    });
  }, [items, q]);

  const selectedCount = itemIds?.length || 0;

  const canManage = isOwner && Boolean(vibeId);
  const canDelete =
    canManage &&
    selectedCount > 0 &&
    typeof onDeleteItems === "function" &&
    typeof onToggleItem === "function";

  // selection mode: если есть выбранные или если юзер начал выбирать
  const selectionMode = canManage && selectedCount > 0;

  const openCard = (it) => {
    // owner: edit if provided, else fallback open
    if (canManage && typeof onEditItem === "function") return onEditItem(it);
    if (!canManage && typeof onOpenItem === "function") return onOpenItem(it);
    // если ничего не дали — не делаем ничего
  };

  const toggleOne = (id) => {
    if (!canManage || typeof onToggleItem !== "function") return;
    onToggleItem(id);
  };

  const clearSelection = () => {
    if (!canManage || typeof onToggleItem !== "function") return;
    // аккуратно: чистим через "toggle" только выбранные
    itemIds.forEach((id) => onToggleItem(id));
  };

  const selectAll = () => {
    if (!canManage || typeof onToggleItem !== "function") return;
    const allIds = filtered.map((x) => x.id).filter(Boolean);
    // выбираем только те, которые ещё не выбраны
    allIds.forEach((id) => {
      if (!itemIds.includes(id)) onToggleItem(id);
    });
  };

  return (
    <div className="menuTab2">
      {/* Topbar (sticky glass) */}
      <div className="menuTopbar2">
        <div className="menuTopRow2">
          <div className="menuTitle2">
            {t("business.menu", "Menu")}
            <span className="menuCount2">{filtered.length}</span>
          </div>

          {!selectionMode ? (
            <div className="menuRight2">
              {canManage && (
                <button
                  type="button"
                  className="menuBtn2 menuBtnPrimary2"
                  onClick={onAddItem}
                  disabled={!onAddItem}
                >
                  + {t("business.add_item", "Add item")}
                </button>
              )}
            </div>
          ) : (
            <div className="menuBulk2">
              <span className="menuBulkLabel2">
                {t("common.selected", "Selected")}: {selectedCount}
              </span>

              <button
                type="button"
                className="menuIconBtn2"
                onClick={selectAll}
                title={t("common.select_all", "Select all")}
              >
                {t("common.select_all", "Select all")}
              </button>

              <button
                type="button"
                className="menuIconBtn2"
                onClick={clearSelection}
                title={t("common.clear", "Clear")}
              >
                {t("common.clear", "Clear")}
              </button>

              <button
                type="button"
                className="menuBtn2 menuBtnDanger2"
                disabled={!canDelete}
                onClick={() => onDeleteItems(itemIds)}
                title={t("common.delete", "Delete")}
              >
                {t("common.delete", "Delete")} ({selectedCount})
              </button>
            </div>
          )}
        </div>

        <div className="menuSearchRow2">
          <div className="menuSearchWrap2">
            <span className="menuSearchIcon2">⌕</span>
            <input
              className="menuSearchInput2"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("common.search", "Search…")}
            />
            {q?.length > 0 && (
              <button
                type="button"
                className="menuSearchClear2"
                onClick={() => setQ("")}
                aria-label={t("common.clear", "Clear")}
                title={t("common.clear", "Clear")}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {loadingItems ? (
        <div className="menuGrid2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="menuSkel2" key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="menuEmpty2">
          <div className="menuEmptyText2">
            {q.trim()
              ? t("business.no_results", "No results")
              : t("business.no_items", "No items yet")}
          </div>

          {canManage && (
            <button
              type="button"
              className="menuBtn2 menuBtnGhost2"
              onClick={onAddItem}
              disabled={!onAddItem}
            >
              + {t("business.add_item", "Add item")}
            </button>
          )}
        </div>
      ) : (
        <div className="menuGrid2">
          {filtered.map((it) => {
            const title = it.title || t("business.untitled", "Untitled");
            const imgSrc = normalizeSrc(it.imageUrl);
            const checked = itemIds?.includes(it.id);

            const customerHasOpen = !canManage && typeof onOpenItem === "function";
            const ownerHasEdit = canManage && typeof onEditItem === "function";
            const isDisabled = !customerHasOpen && !ownerHasEdit;

            const onCardClick = () => {
              if (isDisabled) return;

              // если мы уже в режиме выбора — клик по карточке toggles selection
              if (selectionMode) return toggleOne(it.id);

              return openCard(it);
            };

            return (
              <div className={`menuCard2 ${checked ? "isSelected2" : ""}`} key={it.id}>
                {/* Image */}
                <button
                  type="button"
                  className="menuCardMain2"
                  onClick={onCardClick}
                  disabled={isDisabled}
                  title={
                    canManage
                      ? selectionMode
                        ? t("common.select", "Select")
                        : t("business.edit_item", "Edit item")
                      : t("business.open_item", "Open item")
                  }
                >
                  <div className="menuImg2">
                    {imgSrc ? (
                      <SmartImage
                        src={imgSrc}
                        alt={title}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        fallback={
                          <div className="menuNoImg2">
                            {t("business.no_image", "No image")}
                          </div>
                        }
                      />
                    ) : (
                      <div className="menuNoImg2">
                        {t("business.no_image", "No image")}
                      </div>
                    )}

                    {it.price != null && it.price !== "" && (
                      <div className="menuPriceBadge2">{String(it.price)}</div>
                    )}
                  </div>

                  <div className="menuMeta2">
                    <div className="menuMetaTitle2" title={title}>
                      {title}
                    </div>

                    {!!it.description && (
                      <div className="menuMetaDesc2" title={it.description}>
                        {it.description}
                      </div>
                    )}
                  </div>
                </button>

                {/* Owner selection checkbox */}
                {canManage && typeof onToggleItem === "function" && (
                  <button
                    type="button"
                    className={`menuCheck2 ${checked ? "isChecked2" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOne(it.id);
                    }}
                    aria-label={t("business.select_item", "Select item")}
                    title={t("business.select_item", "Select item")}
                  >
                    <span className="menuCheckBox2" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
