import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { usePersonalVibeForm } from "./usePersonalVibeForm";

import VibeCard from "@/features/vibes/card/components/VibeCard";

import ContactTypeModal from "@/features/vibes/components/Modals/ContactTypeModal";
import PersonalInfoBlockModal from "@/features/vibes/components/Modals/PersonalInfoBlockModal";

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
  const { t } = useTranslation("personal_form");

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
  } = usePersonalVibeForm({ navigate, initialData, mode, onSave, onCancel });

  const safeId = mode === "edit" && isUUID(initialData?.id) ? initialData.id : undefined;
  const ownerActionsEnabled = Boolean(safeId);


  return (
    <div
      className="d-flex flex-column gap-3 align-items-center justify-content-start w-100"
      style={{
        maxWidth: 1200,
        width: "100%",
        margin: "0 auto",
        padding: "0 20px",
      }}
    >
      
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

      {/* editing — card in editMode */}
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

        onOpenContactPicker={(idx) => {
          setTypeIndex(Number.isInteger(idx) ? idx : null);
          setShowModal(true);
        }}
        onRemoveContact={(idx) => removeContact(idx)}
        onChangeContactValue={(idx, val) => handleContactChange(idx, val)}
        onBlockChange={(i, v) => handleBlockChange(i, v)}
        onBlockRemove={(i) => removeBlock(i)}
        onOpenBlockPicker={() => setShowBlockModal(true)}
      />

      {/* contacts */}
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

              setRefocusIndex({ index: typeIndex, nonce: Date.now() });
              Promise.resolve().then(() => setRefocusIndex(null));
            } else {
              const newIndex = contacts.length;
              setContacts((prev) => [...prev, { type: typeKey, value: "" }]);

              setRefocusIndex({ index: newIndex, nonce: Date.now() });
              Promise.resolve().then(() => setRefocusIndex(null));
            }

            setShowModal(false);
            setTypeIndex(null);
          }}
        />
      )}

      {/* extra blocks */}
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
    </div>
  );
}