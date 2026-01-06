// src/features/vibes/components/BusinessOwnerCard.jsx
import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

import BusinessTabsInCard from "@/features/vibes/forms/business/BusinessTabsInCard";
import MenuTab from "@/features/vibes/forms/business/tabs/MenuTab";

import useItemsByVibeId from "@/features/vibes/catalog/useItemsByVibeId";
import useGetOffersByVibeId from "@/features/vibes/offers/useGetOffersByVibeId";
import OfferCard from "@/features/vibes/offers/OfferCard";

import useQueryTab from "@/shared/router/useQueryTab";

import { useDeleteOffer } from "@/features/vibes/offers/useDeleteOffer";

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

  // Load only when we have a real vibeId (owner view)
  const { items, loading: loadingItems, reload: reloadItems } = useItemsByVibeId(
    vibeId,
    { enabled: ownerActionsEnabled }
  );

  const { offers = [], loading: loadingOffers, reload: reloadOffers } =
    useGetOffersByVibeId(vibeId, { enabled: ownerActionsEnabled });

  const itemIds = useMemo(
    () => (Array.isArray(items) ? items.map((x) => x.id) : []),
    [items]
  );

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
                    canManage={true} // owner view

                    onSelect={() => {
                      // если тебе не нужен select — можешь убрать
                    }}

                    onEdit={() => {
                      if (!returnState) return;
                      navigate(`/offers/${offer.id}`, {
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

                    onDoubleClick={() => {
                      if (!returnState) return;
                      navigate(`/offers/${offer.id}`, {
                        state: { ...returnState, returnTab: "offers" },
                      });
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
                  navigate("/offers/new", { state: { ...returnState, returnTab: "offers" } });
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
              itemIds={itemIds}
              vibeId={vibeId}
              onAddItem={() => {
                if (!returnState) return;
                navigate("/catalog/new", {
                  state: { ...returnState, returnTab: "menu" },
                });
              }}
              onEditItem={(it) => {
                if (!returnState) return;
                navigate(`/catalog/${it.id}/edit`, {
                  state: {
                    ...returnState,
                    returnTab: "menu",
                    itemIds,
                    currentIndex: itemIds.indexOf(it.id),
                  },
                });
              }}
            />
          )}
        />
      }
    />
  );
}
