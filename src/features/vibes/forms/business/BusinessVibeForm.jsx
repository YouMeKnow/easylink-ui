// src/features/vibes/business/BusinessVibeForm/index.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useItemsByVibeId from "@/features/vibes/catalog/useItemsByVibeId";
import useGetOffersByVibeId from "@/features/vibes/offers/hooks/useGetOffersByVibeId";
import OfferCard from "@/features/vibes/offers/components/OfferCard/OfferCard";

import VibeFormLayout from "@/features/vibes/components/layouts/VibeFormLayout/VibeFormLayout";

import CenterModal from "@/components/ui/CenterModal/CenterModal";

import BUSINESS_BLOCK_TYPES from "@/data/infoBlockTypes/business";

import { useBusinessVibeForm } from "./useBusinessVibeForm";
import MenuTab from "./tabs/MenuTab.jsx";

import InfoBlockTypeModal from "@/features/vibes/components/modals/InfoBlockTypeModal";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

import BusinessTabsInCard from "./BusinessTabsInCard";
import useQueryTab from "@/shared/router/useQueryTab";

// NEW: shared contact picker
import useContactTypePicker from "@/features/vibes/contacts/hooks/useContactTypePicker";
import ContactTypePicker from "@/features/vibes/contacts/components/ContactTypePicker/ContactTypePicker";

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
  const { t } = useTranslation(["business_form", "common"]);

  const vibeId = initialData?.id;
  const safeVibeId = isUUID(vibeId) ? vibeId : undefined;
  const ownerActionsEnabled = Boolean(safeVibeId);

  // ----- tabs in URL -----
  const [activeTab, setActiveTab] = useQueryTab({
    key: "tab",
    allowed: ["main", "offers", "menu"],
    fallback: "main",
  });

  const { items, loading: loadingItems, reload: reloadItems } = useItemsByVibeId(
    safeVibeId,
    { enabled: ownerActionsEnabled }
  );

  const { offers = [] } = useGetOffersByVibeId(safeVibeId, {
    enabled: ownerActionsEnabled,
  });

  const itemIds = Array.isArray(items) ? items.map((x) => x.id) : [];

  // ----- local UI state -----
  const [refocusIndex, setRefocusIndex] = React.useState(null);
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
    addInfoBlock,
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

  // refocus helper
  const refocusAt = React.useCallback((index) => {
    setRefocusIndex({ index, nonce: Date.now() });
    Promise.resolve().then(() => setRefocusIndex(null));
  }, []);

  // shared contact picker
  const contactPicker = useContactTypePicker({
    contacts,
    setContacts,
    onRefocus: refocusAt,
  });

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

      onOpenContactPicker: contactPicker.openPicker,
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
      contactPicker.openPicker,
      removeContact,
      handleContactChange,
      handleBlockChange,
      removeBlock,
    ]
  );

  return (
    <VibeFormLayout
      maxWidth={1200}
      rightOpen={contactPicker.open}
      rightWidth={320}
      gap={12}
      topActions={
        <div className="cv-top-actions">
          {mode === "edit" && (
            <button
              type="button"
              className="cv-btn cv-btn--ghost"
              onClick={onCancel}
              disabled={loading}
            >
              {t("cancel")}
            </button>
          )}

          <button
            type="button"
            className="cv-btn cv-btn--primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? mode === "edit"
                ? t("saving")
                : t("creating")
              : mode === "edit"
                ? t("save_button")
                : t("create_button")}
          </button>
        </div>
      }
      right={
        <div className="only-desktop">
          <ContactTypePicker
            open={contactPicker.open}
            mode={contactPicker.mode}
            typeIndex={contactPicker.typeIndex}
            contacts={contacts}
            onToggleType={contactPicker.onSelectType}
            onClose={contactPicker.closePicker}
            titlePick={t("common:pick_type_for_contact")}
            titleToggle={t("common:toggle_contacts")}
            doneText={t("common:done")}
          />
        </div>
      }
    >
      <form className="w-100" onSubmit={(e) => e.preventDefault()}>
        <div style={{ minWidth: 0 }}>
          <VibeCard
            {...contentProps}
            ownerActionsEnabled={ownerActionsEnabled}
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
        </div>
      </form>
      
      <div className="only-mobile">
        <CenterModal
          open={contactPicker.open}
          onClose={contactPicker.closePicker}
          title={
            contactPicker.typeIndex != null
              ? t("common:pick_type_for_contact")
              : t("common:toggle_contacts")
          }
        >
          <ContactTypePicker
            open={true}
            mode={contactPicker.mode}
            typeIndex={contactPicker.typeIndex}
            contacts={contacts}
            onToggleType={contactPicker.onSelectType}
            onClose={contactPicker.closePicker}
            titlePick={t("common:pick_type_for_contact")}
            titleToggle={t("common:toggle_contacts")}
            doneText={t("common:done")}
          />
        </CenterModal>
      </div>

      {showBlockModal && (
        <InfoBlockTypeModal
          types={BUSINESS_BLOCK_TYPES}
          extraBlocks={extraBlocks}
          onClose={() => setShowBlockModal(false)}
          onSelect={(block) => {
            addInfoBlock(block);     
            setShowBlockModal(false);
          }}
        />
      )}
    </VibeFormLayout>
  );
}
