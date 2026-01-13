// src/features/vibes/components/BusinessOwnerCard.jsx
import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

import BusinessTabsInCard from "@/features/vibes/forms/business/BusinessTabsInCard";
import MenuTab from "@/features/vibes/forms/business/tabs/MenuTab";

import useItemsByVibeId from "@/features/vibes/catalog/useItemsByVibeId";
import useGetOffersByVibeId from "@/features/vibes/offers/hooks/useGetOffersByVibeId";
import OfferCard from "@/features/vibes/offers/components/OfferCard/OfferCard";;

import useQueryTab from "@/shared/router/useQueryTab";
import { deleteOffer } from "@/features/vibes/offers";

export default function BusinessOwnerCard({
  t,
  vibe, // { id, type, photo }
  name,
  description,
  contacts,
  extraBlocks,
  visible,
  publicCode,
}) {
  const navigate = useNavigate();
  const vibeId = vibe?.id;

  const [activeTab, setActiveTab] = useQueryTab({
    key: "tab",
    allowed: ["main", "offers", "menu"],
    fallback: "main",
  });

  const ownerActionsEnabled = Boolean(vibeId);

  // ---------------------------
  // Catalog items (menu)
  // ---------------------------
  const {
    items,
    loading: loadingItems,
    mutating: mutatingItems,
    reload: reloadItems,
    removeMany: deleteItems,
  } = useItemsByVibeId(vibeId, { enabled: ownerActionsEnabled });

  // selected ids for delete
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // keep selection consistent after reload
  useEffect(() => {
    const existing = new Set((items || []).map((x) => x.id));
    setSelectedItemIds((prev) => prev.filter((id) => existing.has(id)));
  }, [items]);

  // ---------------------------
  // Offers
  // ---------------------------
  const { offers = [], loading: loadingOffers, reload: reloadOffers } =
    useGetOffersByVibeId(vibeId, { enabled: ownerActionsEnabled });

  // for navigation back
  const returnState = useMemo(() => {
    if (!vibeId) return null;
    return { vibeId, returnTo: `/vibes/${vibeId}` };
  }, [vibeId]);

  const setTab = useCallback(
    (tab) => {
      setActiveTab(tab);
      if (tab === "menu") reloadItems?.();
    },
    [setActiveTab, reloadItems]
  );

  const baseProps = {
    id: vibeId,
    name,
    description,
    photo: vibe?.photo,
    contacts,
    extraBlocks,
    type: vibe?.type || "BUSINESS",
    visible,
    publicCode,
    editMode: false,
    ownerActionsEnabled,
    shareEnabled: true,
  };

  return (
    <VibeCard
      {...baseProps}
      cardBody={
        <BusinessTabsInCard
          t={t}
          activeTab={activeTab}
          onTabChange={setTab}
          renderMain={() => (
            <VibeContent
              id={vibeId}
              name={name}
              description={description}
              photo={vibe?.photo}
              contacts={contacts}
              extraBlocks={extraBlocks}
              type={vibe?.type || "BUSINESS"}
              editMode={false}
              shareEnabled={true}
            />
          )}
          renderOffers={() => (
            <>
              {loadingOffers ? (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border" role="status" />
                </div>
              ) : offers.length ? (
                <div className="d-grid gap-3">
                  {offers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      canManage={true}
                      onOpen={() => {
                        // public view
                        navigate(`/offers/${offer.id}`);
                      }}
                      onEdit={() => {
                        if (!returnState) return;
                        navigate(`/offers/${offer.id}/edit`, {
                          state: { ...returnState, returnTab: "offers" },
                        });
                      }}
                      onDelete={async () => {
                        if (!window.confirm("Delete this offer?")) return;
                        try {
                          await deleteOffer({ offerId: offer.id, vibeId });
                          await reloadOffers?.();
                        } catch (e) {
                          console.error(e);
                          alert("Failed to delete offer");
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="alert alert-info text-center">
                  {t("No offers yet", { defaultValue: "No offers yet" })}
                </div>
              )}

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  disabled={!returnState}
                  onClick={() => {
                    if (!returnState) return;
                    navigate("/offers/new", {
                      state: { ...returnState, returnTab: "offers" },
                    });
                  }}
                >
                  + {t("Add Offer", { defaultValue: "Add Offer" })}
                </button>
              </div>
            </>
          )}
          renderMenu={() => (
            <MenuTab
              t={t}
              loadingItems={loadingItems}
              items={items}
              itemIds={selectedItemIds}
              vibeId={vibeId}
              isOwner={true}
              onAddItem={() => {
                if (!returnState) return;
                navigate("/catalog/new", {
                  state: { ...returnState, returnTab: "menu" },
                });
              }}
              onEditItem={(it) => {
                if (!returnState) return;

                // index for your catalog editor navigation (selected ids)
                const idx = selectedItemIds.indexOf(it.id);

                navigate(`/catalog/${it.id}/edit`, {
                  state: {
                    ...returnState,
                    returnTab: "menu",
                    itemIds: selectedItemIds,
                    currentIndex: idx,
                  },
                });
              }}
              onToggleItem={(id) => {
                setSelectedItemIds((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                );
              }}
              onDeleteItems={async (ids) => {
                if (!ids?.length) return;
                if (mutatingItems) return;
                if (!window.confirm(`Delete ${ids.length} item(s)?`)) return;

                try {
                  await deleteItems(ids);
                  setSelectedItemIds([]);
                } catch (e) {
                  console.error(e);
                  alert("Failed to delete items");
                }
              }}
            />
          )}
        />
      }
    />
  );
}
