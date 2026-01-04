import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useEventVibeForm } from "./useEventVibeForm";
import VibeCard from "@/features/vibes/card/components/VibeCard";
import ContactTypeModal from "@/features/vibes/components/Modals/ContactTypeModal";

// helper: UUID v1-5
const isUUID = (s) =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s
  );

function EventInfoBlockModal({ t, extraBlocks, onClose, onSelect }) {
  const OPTIONS = React.useMemo(
    () => [
      { key: "date",      label: t("date"),      placeholder: t("modal_info_title") },
      { key: "location",  label: t("location"),  placeholder: t("info.location_ph") },
      { key: "organizer", label: t("organizer"), placeholder: t("info.organizer_ph") },
    ],
    [t]
  );

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.22)", position: "fixed", inset: 0, zIndex: 1010 }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("modal_info_title")}</h5>
          </div>
          <div className="modal-body d-flex flex-wrap gap-2">
            {OPTIONS.map((b) => {
              const disabled = extraBlocks.some((x) => x.type === b.key);
              return (
                <button
                  key={b.key}
                  className="btn btn-light"
                  style={{ minWidth: 110, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => onSelect(b)}
                  disabled={disabled}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventVibeForm({
  mode = "create",
  initialData = {},
  onCancel,
  onSave,
}) {
  const navigate = useNavigate();
  const { t } = useTranslation("event_form");

  const [typeIndex, setTypeIndex] = React.useState(null);
  const [refocusIndex, setRefocusIndex] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [showBlockModal, setShowBlockModal] = React.useState(false);

  const {
    name, setName,
    description, setDescription,
    photo, setPhoto,
    contacts, setContacts,
    extraBlocks, setExtraBlocks,
    loading,
    handleContactChange, removeContact,
    handleBlockChange, removeBlock,
    handleSubmit,
  } = useEventVibeForm({ navigate, initialData, mode, onSave });

  const safeId = mode === "edit" && isUUID(initialData?.id) ? initialData.id : undefined;

  return (
    <div
      className="d-flex flex-column gap-3 align-items-center justify-content-start w-100"
      style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "0 20px" }}
    >
      <div className="d-flex gap-2 w-100" style={{ maxWidth: 420 }}>
        {mode === "edit" && (
          <button
            type="button"
            className="btn btn-outline-secondary w-50"
            onClick={onCancel}
            disabled={loading}
          >
            {t("cancel")}
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? (mode === "edit" ? t("saving") : t("creating"))
            : (mode === "edit" ? t("save_button") : t("create_button"))}
        </button>
      </div>

      <VibeCard
        id={safeId}
        name={name}
        description={description}
        photo={photo}
        contacts={contacts}
        extraBlocks={extraBlocks}
        type="OTHER"
        editMode={true}
        ownerActionsEnabled={Boolean(safeId)}
        onChangeName={setName}
        onChangeDescription={setDescription}
        onChangePhoto={setPhoto}
        resumeEditAt={refocusIndex}
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

      {showModal && (
        <ContactTypeModal
          contacts={contacts}
          onClose={() => { setShowModal(false); setTypeIndex(null); }}
          onSelect={(typeKey) => {
            if (typeIndex != null) {
              setContacts(prev => {
                const updated = [...prev];
                updated[typeIndex] = { ...updated[typeIndex], type: typeKey };
                return updated;
              });
              setRefocusIndex({ index: typeIndex, nonce: Date.now() });
              Promise.resolve().then(() => setRefocusIndex(null));
            } else {
              const newIndex = contacts.length;
              setContacts(prev => [...prev, { type: typeKey, value: "" }]);
              setRefocusIndex({ index: newIndex, nonce: Date.now() });
              Promise.resolve().then(() => setRefocusIndex(null));
            }
            setShowModal(false);
            setTypeIndex(null);
          }}
        />
      )}

      {showBlockModal && (
        <EventInfoBlockModal
          t={t}
          extraBlocks={extraBlocks}
          onClose={() => setShowBlockModal(false)}
          onSelect={(block) => {
            setExtraBlocks(prev => [
              ...prev,
              { type: block.key, label: block.label, value: "", placeholder: block.placeholder }
            ]);
            setShowBlockModal(false);
          }}
        />
      )}
    </div>
  );
}
