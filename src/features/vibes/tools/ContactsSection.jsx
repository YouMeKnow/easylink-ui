import React from "react";
import ContactButton from "./ContactButton";
import { valueToString } from "./valueToString";
import "./ContactsSection.css";
import ConfirmModal from "@/features/vibes/components/modals/ConfirmModal";
import { FiX, FiPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";


export default function ContactsSection({
  contacts,
  editMode,
  onOpenContactPicker,
  onRemoveContact,
  onChangeContactValue,
  resumeEditAt,
}) {
  const { t } = useTranslation(["contacts", "common"]);
  const [editingIdx, setEditingIdx] = React.useState(-1);
  const [tempValue, setTempValue] = React.useState("");
  const lastNonceRef = React.useRef(null);

  const [confirmIdx, setConfirmIdx] = React.useState(null);
  // refs for scrollIntoView
  const itemRefs = React.useRef({});

  // auto-focus edit when resumeEditAt comes
  React.useEffect(() => {
    if (!editMode || !resumeEditAt || resumeEditAt.index == null) return;

    const { index, nonce } = resumeEditAt;
    if (nonce && nonce === lastNonceRef.current) return;
    lastNonceRef.current = nonce || null;

    const raw = contacts?.[index]?.value;
    setEditingIdx(index);
    setTempValue(valueToString(raw));
  }, [resumeEditAt, editMode, contacts]);

  // auto-open edit when a new contact is added
  const prevLenRef = React.useRef(contacts?.length || 0);
  React.useEffect(() => {
    const curr = contacts?.length || 0;
    const prev = prevLenRef.current;

    if (editMode && curr > prev) {
      const i = curr - 1;
      setEditingIdx(i);

      const raw = contacts[i]?.value;
      setTempValue(valueToString(raw));
    }

    prevLenRef.current = curr;
  }, [contacts, editMode]);

  // scroll to the chip when editing starts
  React.useEffect(() => {
    if (editingIdx < 0) return;
    const el = itemRefs.current[editingIdx];
    if (el?.scrollIntoView) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [editingIdx]);

  const handleStartEdit = (i, value) => {
    setEditingIdx(i);
    setTempValue(valueToString(value));
  };

  const handleCommit = (i, e) => {
    if (e?.preventDefault) e.preventDefault();
    onChangeContactValue?.(i, tempValue);
    setEditingIdx(-1);
  };

  const handleCancel = () => setEditingIdx(-1);

  const handleRemove = (i) => {
    setConfirmIdx(i);
  };

  const hasContacts = !!(contacts && contacts.length > 0);

  return (
    <>
      <div
        className="d-flex flex-column align-items-center w-100"
        style={{ gap: 8 }}
      >
        <div className="d-flex flex-wrap gap-2 justify-content-center w-100">
          {hasContacts ? (
            contacts.map((c, i) => {
              const isEditing = editMode && editingIdx === i;

              return (
                <div
                  key={c.id ?? `${c.type}-${i}`}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={["contact-chip", isEditing ? "is-editing" : ""].join(
                    " "
                  )}
                  style={{ position: "relative", minHeight: 44 }}
                >
                  <ContactButton
                    type={c.type}
                    value={c.value}
                    editMode={editMode}
                    isEditing={isEditing}
                    editValue={isEditing ? tempValue : ""}
                    inputKey={
                      isEditing && resumeEditAt ? resumeEditAt.nonce : undefined
                    }
                    onStartEdit={() => handleStartEdit(i, c?.value)}
                    onEditChange={(v) => setTempValue(v)}
                    onCommitEdit={(e) => handleCommit(i, e)}
                    onCancelEdit={handleCancel}
                    onChangeType={() => onOpenContactPicker?.(i)}
                  />

                  {editMode && (
                    <button
                      type="button"
                      title={t("remove", "Remove")}
                      aria-label={t("remove", "Remove")}
                      onClick={() => handleRemove(i)}
                      className="contact-remove"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="contacts-empty w-100">
              <div className="contacts-empty__title">
                {t("empty.title", "No contacts yet")}
              </div>
              <div className="contacts-empty__hint">
                {t(
                  "empty.hint",
                  "Add your first contact so people can reach you."
                )}
              </div>

              {editMode && (
                <button
                  type="button"
                  onClick={() => onOpenContactPicker?.(null)}
                  className="contacts-empty__cta"
                >
                  + {t("add", "Add contact")}
                </button>
              )}
            </div>
          )}

          {/* Add contact tile (in the same grid) */}
          {editMode && hasContacts && (
            <button
              type="button"
            onClick={() => onOpenContactPicker?.()}
              className="contact-add-tile"
            >
              <span className="plus" aria-hidden="true">
                <FiPlus size={14} />
              </span>
              <span>{t("add", "Add contact")}</span>
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmIdx != null}
        title={t("remove_contact_title", "Remove contact")}
        message={t(
          "remove_contact_confirm",
          "Are you sure you want to remove this contact?"
        )}
        cancelText={t("cancel", "Cancel")}
        confirmText={t("remove", "Remove")}
        danger
        onClose={() => setConfirmIdx(null)}
        onConfirm={() => {
          if (confirmIdx == null) return;

          // keep editingIdx consistent after removing
          if (editingIdx === confirmIdx) setEditingIdx(-1);
          else if (editingIdx > confirmIdx) setEditingIdx((x) => x - 1);

          onRemoveContact?.(confirmIdx);
          setConfirmIdx(null);
        }}
      />
    </>
  );
}
