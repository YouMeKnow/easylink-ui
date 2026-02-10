// src/features/vibes/business/BusinessVibeForm/index.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useItemsByVibeId from "@/features/vibes/catalog/useItemsByVibeId";
import useGetOffersByVibeId from "@/features/vibes/offers/hooks/useGetOffersByVibeId";
import OfferCard from "@/features/vibes/offers/components/OfferCard/OfferCard";

import { useBusinessVibeForm } from "./useBusinessVibeForm";
import MenuTab from "./tabs/MenuTab.jsx";

import ContactTypeModal from "@/features/vibes/components/Modals/ContactTypeModal";
import InfoBlockTypeModal from "@/features/vibes/components/Modals/InfoBlockTypeModal";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

import BusinessTabsInCard from "./BusinessTabsInCard";
import useQueryTab from "@/shared/router/useQueryTab";

// helper: UUID v1-5
const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

export default function BusinessVibeForm({
  initialData = {},
  mode = "create",
  onSave,
  onCancel,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation("business_form");

  const vibeId = initialData?.id;
  const safeVibeId = isUUID(vibeId) ? vibeId : undefined;
  const ownerActionsEnabled = Boolean(safeVibeId);

  // ----- tabs in URL -----
  const [activeTab, setActiveTab] = useQueryTab({
    key: "tab",
    allowed: ["main", "offers", "menu"],
    fallback: "main",
  });

  const {
    items,
    loading: loadingItems,
    reload: reloadItems,
  } = useItemsByVibeId(safeVibeId, { enabled: ownerActionsEnabled });

  const { offers = [], loading: loadingOffers } = useGetOffersByVibeId(safeVibeId, {
    enabled: ownerActionsEnabled,
  });

  const itemIds = Array.isArray(items) ? items.map((x) => x.id) : [];

  // ----- local UI state for inline editors -----
  const [typeIndex, setTypeIndex] = React.useState(null);
  const [refocusIndex, setRefocusIndex] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [showBlockModal, setShowBlockModal] = React.useState(false);

  const {
    name,
    setName,
    description,
    setDescription,
    photo,
    setPhoto,
    contacts,
    setContacts,
    extraBlocks,
    setExtraBlocks,
    loading,
    handleContactChange,
    removeContact,
    handleBlockChange,
    removeBlock,
    handleSubmit,
  } = useBusinessVibeForm({ navigate, initialData, mode, onSave });

  // One standard return state for any nested flows (offers/catalog editors)
  const returnState = React.useMemo(() => {
    if (!safeVibeId) return null;
    return { vibeId: safeVibeId, returnTo: `/vibes/${safeVibeId}` };
  }, [safeVibeId]);

  const setTab = React.useCallback(
    (tab) => {
      setActiveTab(tab);
      if (tab === "menu") reloadItems?.();
    },
    [setActiveTab, reloadItems]
  );

  const openContactPicker = React.useCallback((idx) => {
    setTypeIndex(Number.isInteger(idx) ? idx : null);
    setShowModal(true);
  }, []);

  const refocusAt = React.useCallback((index) => {
    setRefocusIndex({ index, nonce: Date.now() });
    Promise.resolve().then(() => setRefocusIndex(null));
  }, []);

  // shared props for vibe content (no duplication)
  const contentProps = React.useMemo(
    () => ({
      id: safeVibeId,
      name,
      description,
      photo,
      contacts,
      extraBlocks,
      type: "BUSINESS",
      editMode: true,

      onChangeName: setName,
      onChangeDescription: setDescription,
      onChangePhoto: setPhoto,

      resumeEditAt: refocusIndex,

      onOpenContactPicker: openContactPicker,
      onRemoveContact: (idx) => removeContact(idx),
      onChangeContactValue: (idx, val) => handleContactChange(idx, val),

      onBlockChange: (i, v) => handleBlockChange(i, v),
      onBlockRemove: (i) => removeBlock(i),
      onOpenBlockPicker: () => setShowBlockModal(true),
    }),
    [
      safeVibeId,
      name,
      description,
      photo,
      contacts,
      extraBlocks,
      setName,
      setDescription,
      setPhoto,
      refocusIndex,
      openContactPicker,
      removeContact,
      handleContactChange,
      handleBlockChange,
      removeBlock,
    ]
  );

  return (

    <div
      className="d-flex flex-column gap-4 align-items-center w-100"
      style={{ maxWidth: 1200, margin: "0 auto" }}
    >
      {/* top actions */}
      <div className="cv-top-actions">
        {mode === "edit" && (
          <button type="button" className="cv-btn cv-btn--ghost" onClick={onCancel} disabled={loading}>
            {t("cancel")}
          </button>
        )}

        <button type="button" className="cv-btn cv-btn--primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (mode === "edit" ? t("saving") : t("creating")) : (mode === "edit" ? t("save_button") : t("create_button"))}
        </button>
      </div>
      <form className="w-100" onSubmit={(e) => e.preventDefault()}>
        <VibeCard
          {...contentProps}
          ownerActionsEnabled={ownerActionsEnabled}
          // cardBody => tabs only for BUSINESS
          cardBody={
            <BusinessTabsInCard
              t={t}
              activeTab={activeTab}
              onTabChange={setTab}
              renderMain={() => <VibeContent {...contentProps} />}
              renderOffers={() => (
                <>
                  {offers.length ? (
                    <div className="d-grid gap-3">
                      {offers.map((offer) => (
                        <OfferCard
                          key={offer.id}
                          offer={offer}
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
                      disabled={!ownerActionsEnabled || !returnState}
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
                  itemIds={itemIds}
                  vibeId={safeVibeId}
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
      </form>

      {/* ----- Modals ----- */}
      {showModal && (
        <ContactTypeModal
          contacts={contacts}
          onClose={() => {
            setShowModal(false);
            setTypeIndex(null);
          }}
          onSelect={(typeKey) => {
            if (typeIndex != null) {
              setContacts((prev) => {
                const updated = [...prev];
                updated[typeIndex] = { ...updated[typeIndex], type: typeKey };
                return updated;
              });
              refocusAt(typeIndex);
            } else {
              const newIndex = contacts.length;
              setContacts((prev) => [...prev, { type: typeKey, value: "" }]);
              refocusAt(newIndex);
            }
            setShowModal(false);
            setTypeIndex(null);
          }}
        />
      )}

      {showBlockModal && (
        <InfoBlockTypeModal
          extraBlocks={extraBlocks}
          onClose={() => setShowBlockModal(false)}
          onSelect={(block) => {
            const isHours =
              String(block.key).toLowerCase() === "hours" ||
              String(block.label).toLowerCase() === "hours";

            if (
              isHours &&
              extraBlocks.some(
                (b) =>
                  String(b.type).toLowerCase() === "hours" ||
                  String(b.label).toLowerCase() === "hours"
              )
            ) {
              setShowBlockModal(false);
              return;
            }

            const initHours = {
              monday: "",
              tuesday: "",
              wednesday: "",
              thursday: "",
              friday: "",
              saturday: "",
              sunday: "",
            };

            setExtraBlocks((prev) => [
              ...prev,
              {
                type: isHours ? "hours" : block.key,
                label: block.label || (isHours ? "Hours" : "Custom"),
                value: isHours ? initHours : "",
                placeholder: isHours ? undefined : block.placeholder,
              },
            ]);

            setShowBlockModal(false);
          }}
        />
      )}
    </div>
  );
}
