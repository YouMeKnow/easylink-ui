// src/features/vibes/components/BusinessCustomerCard.jsx
import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

import BusinessTabsInCard from "@/features/vibes/forms/business/BusinessTabsInCard";
import MenuTab from "@/features/vibes/forms/business/tabs/MenuTab";

import useItemsByVibeId from "@/features/vibes/catalog/useItemsByVibeId";
import useGetOffersByVibeId from "@/features/vibes/offers/useGetOffersByVibeId";
import OfferCard from "@/features/vibes/offers/OfferCard";

import useQueryTab from "@/shared/router/useQueryTab";

import SelectVibeModal from "@/features/vibes/interactions/SelectVibeModal";
import { trackEvent } from "@/services/amplitude";
import { QRCodeCanvas } from "qrcode.react";

export default function BusinessCustomerCard({
  t,
  vibe,
  name,
  description,
  contacts,
  extraBlocks,
  visible,
  publicCode,
  subscriberVibeId,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const vibeId = vibe?.id;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  const [showModal, setShowModal] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const [activeTab, setActiveTab] = useQueryTab({
    key: "tab",
    allowed: ["main", "offers", "menu"],
    fallback: "main",
  });

  // subscribe state
  useEffect(() => {
    const normalized =
      subscriberVibeId === "null" || subscriberVibeId === ""
        ? null
        : subscriberVibeId;
    setSubscribed(Boolean(normalized));
  }, [subscriberVibeId]);

  // open modal after redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("subscribe") === "true" && token) {
      setShowModal(true);
      params.delete("subscribe");
      params.delete("redirectTo");
      const next = params.toString();
      navigate(`${location.pathname}${next ? `?${next}` : ""}`, {
        replace: true,
      });
    }
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
    setSubscribed(true);
    setShowModal(false);
  };

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return vibeId
      ? `${window.location.origin}/view/${vibeId}`
      : window.location.href;
  }, [vibeId]);

  // load data (customer)
  const { items, loading: loadingItems } = useItemsByVibeId(vibeId, {
    enabled: Boolean(vibeId),
  });

  const offers = useGetOffersByVibeId(vibeId, { enabled: Boolean(vibeId) });

  const itemIds = useMemo(
    () => (Array.isArray(items) ? items.map((x) => x.id) : []),
    [items]
  );

  const setTab = useCallback(
    (tab) => {
      setActiveTab(tab);
    },
    [setActiveTab]
  );

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

  // Actions row (customer): QR + Subscribe (share button is in VibeCard)
  const actions = (
    <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mt-3">
      <div className="text-center">
        <QRCodeCanvas value={shareUrl} size={60} />
        <div style={{ fontSize: 12, color: "#aaa" }}>
          {t("Share QR code", { defaultValue: "Share QR code" })}
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleOpenModal}
        disabled={subscribed}
      >
        {subscribed
          ? t("Subscribed", { defaultValue: "Subscribed" })
          : t("Subscribe", { defaultValue: "Subscribe" })}
      </button>
    </div>
  );

  return (
    <VibeCard
      {...baseProps}
      shareEnabled={true}
      onShare={({ vibeId: vid, shareUrl: url }) => {
        trackEvent("Vibe Share Button Clicked", {
          vibeId: vid,
          name,
          publicCode,
          location: "BusinessCustomerCard",
          shareUrl: url,
        });
      }}
      cardBody={
        <>
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
                  <SelectVibeModal
                    t={t}
                    availableVibes={availableVibes}
                    selectedMyVibeId={selectedMyVibeId}
                    setSelectedMyVibeId={setSelectedMyVibeId}
                    onConfirm={handleConfirm}
                    onCancel={onCancel}
                    loading={submitting}
                    error={error}
                    onSubscribed={handleSubscribed}
                  />
                )}
              </>
            )}
            renderOffers={() => (
              <>
                {offers?.filter((o) => o.active)?.length ? (
                  <div className="d-grid gap-3">
                    {offers
                      .filter((o) => o.active)
                      .map((offer) => (
                        <OfferCard
                          key={offer.id}
                          offer={offer}
                          onDoubleClick={() => {
                            trackEvent("Offer Clicked", {
                              offerId: offer.id,
                              origin: "vibe_view_offers",
                              ownerVibeId: vibeId,
                              viewerVibeId: subscriberVibeId || null,
                              path: window.location.pathname,
                              ts: Date.now(),
                            });

                            navigate(`/view-offer-form/${offer.id}`, {
                              state: {
                                origin: "vibe_view_offers",
                                ownerVibeId: vibeId,
                                viewerVibeId: subscriberVibeId || null,
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
                )}
              </>
            )}
            renderMenu={() => (
              <MenuTab
                t={t}
                loadingItems={loadingItems}
                items={items}
                itemIds={itemIds}
                vibeId={vibeId}
                // customer view: no add/edit
                onAddItem={null}
                onEditItem={null}
              />
            )}
          />
        </>
      }
    />
  );
}
