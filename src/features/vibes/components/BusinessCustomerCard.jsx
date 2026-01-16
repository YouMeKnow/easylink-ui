// src/features/vibes/components/BusinessCustomerCard.jsx
import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

import BusinessTabsInCard from "@/features/vibes/forms/business/BusinessTabsInCard";
import MenuTab from "@/features/vibes/forms/business/tabs/MenuTab";

import useItemsByVibeId from "@/features/vibes/catalog/useItemsByVibeId";
import useGetOffersByVibeId from "@/features/vibes/offers/hooks/useGetOffersByVibeId";
import OfferCard from "@/features/vibes/offers/components/OfferCard/OfferCard";

import useQueryTab from "@/shared/router/useQueryTab";

import SelectVibeModalWithLogic from "@/features/VibeViewForCustomers/SelectVibeModalWithLogic";
import { trackEvent } from "@/services/amplitude";

export default function BusinessCustomerCard({
  t,
  vibe,
  name,
  description,
  contacts,
  extraBlocks,
  visible,
  publicCode,

  // from parent (PublicVibePage via useVibeLoader)
  subscriberVibes = [],
  onRefresh,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const vibeId = vibe?.id;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const [showModal, setShowModal] = useState(false);

  const [activeTab, setActiveTab] = useQueryTab({
    key: "tab",
    allowed: ["main", "offers", "menu"],
    fallback: "main",
  });

  // same logic as PublicSubscribePanel
  const alreadySubscribedVibeIds = useMemo(() => {
    if (!Array.isArray(subscriberVibes)) return [];
    return subscriberVibes.map((v) => v?.id).filter(Boolean);
  }, [subscriberVibes]);

  const isSubscribed = alreadySubscribedVibeIds.length > 0;

  // auto-open modal after sign-in redirect (?subscribe=true)
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("subscribe") !== "true") return;

    // wait until token appears (auth finishes)
    if (!token) return;

    setShowModal(true);

    // clean URL
    params.delete("subscribe");
    params.delete("redirectTo");
    const next = params.toString();
    navigate(`${location.pathname}${next ? `?${next}` : ""}`, { replace: true });
  }, [location.search, token, navigate, location.pathname]);

  const handleOpenModal = () => {
    if (!vibeId) return;

    if (!token) {
      navigate(`/signin?redirectTo=/view/${vibeId}&subscribe=true`);
      return;
    }

    setShowModal(true);
  };

  const handleSubscribed = () => {
    setShowModal(false);
    onRefresh?.(); // refetch real subscriberVibes from server
  };

  // load data (customer)
  const { items, loading: loadingItems } = useItemsByVibeId(vibeId, {
    enabled: Boolean(vibeId),
  });

  const { offers = [] } = useGetOffersByVibeId(vibeId, {
    enabled: Boolean(vibeId),
  });

  const activeOffers = useMemo(() => offers.filter((o) => o?.active), [offers]);

  const itemIds = useMemo(
    () => (Array.isArray(items) ? items.map((x) => x.id) : []),
    [items]
  );

  const setTab = useCallback((tab) => setActiveTab(tab), [setActiveTab]);

  const baseProps = {
    id: vibeId,
    name,
    description,
    photo: vibe?.photo,
    contacts,
    extraBlocks,
    type: "BUSINESS",
    visible,
    publicCode,
    editMode: false,
    ownerActionsEnabled: false,
  };

  const actions = (
    <div className="d-flex justify-content-center mt-3">
      <button
        type="button"
        className={isSubscribed ? "btn btn-outline-primary" : "btn btn-primary"}
        onClick={handleOpenModal}
      >
        {isSubscribed
          ? t("Manage", { defaultValue: "Manage" })
          : t("Subscribe", { defaultValue: "Subscribe" })}
      </button>
    </div>
  );

  return (
    <VibeCard
      {...baseProps}
      shareEnabled={true}
      onShare={({ vibeId: vid, shareUrl }) => {
        trackEvent("Vibe Share Button Clicked", {
          vibeId: vid,
          name,
          publicCode,
          location: "BusinessCustomerCard",
          shareUrl,
        });
      }}
      cardBody={
        <BusinessTabsInCard
          t={t}
          activeTab={activeTab}
          onTabChange={setTab}
          renderMain={() => (
            <>
              <VibeContent
                id={vibeId}
                name={name}
                description={description}
                photo={vibe?.photo}
                contacts={contacts}
                extraBlocks={extraBlocks}
                type="BUSINESS"
                editMode={false}
              />

              {actions}

              {showModal && (
                <SelectVibeModalWithLogic
                  t={t}
                  targetVibeId={vibeId}
                  alreadySubscribedVibeIds={alreadySubscribedVibeIds}
                  onSubscribed={handleSubscribed}
                  onCancel={() => setShowModal(false)}
                />
              )}
            </>
          )}
          renderOffers={() =>
            activeOffers.length ? (
              <div className="d-grid gap-3">
                {activeOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onOpen={(o) => {
                      navigate(`/offers/${o.id}`, {
                        state: {
                          origin: "vibe_view_offers",
                          ownerVibeId: vibeId,
                        },
                      });
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="alert alert-info text-center">
                {t("No offers yet", { defaultValue: "No offers yet" })}
              </div>
            )
          }
          renderMenu={() => (
            <MenuTab
              t={t}
              loadingItems={loadingItems}
              items={items}
              itemIds={itemIds}        
              vibeId={vibeId}
              isOwner={false}
              onAddItem={null}
              onOpenItem={(it) => {    
                navigate(`/catalog/${it.id}`, { state: { vibeId } });
              }}
            />

          )}
        />
      }
    />
  );
}
