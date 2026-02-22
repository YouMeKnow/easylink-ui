import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { usePersonalVibeForm } from "./usePersonalVibeForm";
import VibeCard from "@/features/vibes/card/components/VibeCard";

import PersonalInfoBlockModal from "@/features/vibes/components/modals/PersonalInfoBlockModal";

import useContactTypePicker from "@/features/vibes/contacts/hooks/useContactTypePicker";
import ContactTypePicker from "@/features/vibes/contacts/components/ContactTypePicker/ContactTypePicker";
import CenterModal from "@/components/ui/CenterModal/CenterModal";

import VibeFormLayout from "@/features/vibes/components/layouts/VibeFormLayout/VibeFormLayout";

// helper: UUID v1-5
const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s
  );

export default function PersonalVibeForm({
  initialData = {},
  mode = "create",
  onSave,
  onCancel,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation(["personal_form", "common"]);

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
    handleBlockChange,
    removeBlock,
    handleSubmit,
  } = usePersonalVibeForm({ navigate, initialData, mode, onSave, onCancel });

  const safeId =
    mode === "edit" && isUUID(initialData?.id) ? initialData.id : undefined;
  const ownerActionsEnabled = Boolean(safeId);

  // ----- refocus helper -----
  const refocusAt = React.useCallback((index) => {
    setRefocusIndex({ index, nonce: Date.now() });
    Promise.resolve().then(() => setRefocusIndex(null));
  }, []);

  // ----- shared contact picker (open/close/toggle/pick) -----
  const contactPicker = useContactTypePicker({
    contacts,
    setContacts,
    onRefocus: refocusAt,
  });

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
        /* DESKTOP ONLY */
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
      {/* CARD */}
      <div style={{ minWidth: 0 }}>
        <VibeCard
          id={safeId}
          name={name}
          description={description}
          photo={photo}
          contacts={contacts}
          extraBlocks={extraBlocks}
          type="PERSONAL"
          editMode={true}
          ownerActionsEnabled={ownerActionsEnabled}
          resumeEditAt={refocusIndex}
          onChangeName={setName}
          onChangeDescription={setDescription}
          onChangePhoto={setPhoto}
          onOpenContactPicker={contactPicker.openPicker}
          onRemoveContact={(idx) => removeContact(idx)}
          onChangeContactValue={(idx, val) => handleContactChange(idx, val)}
          onBlockChange={(i, v) => handleBlockChange(i, v)}
          onBlockRemove={(i) => removeBlock(i)}
          onOpenBlockPicker={() => setShowBlockModal(true)}
        />
      </div>

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
      
      {/* EXTRA BLOCK MODAL */}
      {showBlockModal && (
        <PersonalInfoBlockModal
          extraBlocks={extraBlocks}
          onClose={() => setShowBlockModal(false)}
          onSelect={(block) => {
            setExtraBlocks((prev) => [
              ...prev,
              {
                type: block.key,
                label: block.label,
                value: "",
                placeholder: block.placeholder,
              },
            ]);
            setShowBlockModal(false);
          }}
        />
      )}
    </VibeFormLayout>
  );
}
