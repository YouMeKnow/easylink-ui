import React from "react";
import ContactButton from "./ContactButton";
import { valueToString } from "./valueToString";
import "./ContactsSection.css";
import ConfirmModal from "@/features/vibes/components/modals/ConfirmModal";
import { FiX, FiPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const MAIN_TYPES = ["phone", "email", "website"];
const SOCIAL_TYPES = [
  "instagram",
  "whatsapp",
  "telegram",
  "linkedin",
  "twitter",
  "x",
  "facebook",
  "discord",
  "github",
  "youtube",
  "tiktok",
  "snapchat",
];

const Section = React.memo(function Section({ title, items, t, renderItem }) {
  if (!items.length) return null;

  return (
    <div className="contacts-section">
      <div className="contacts-section__title">{t(title, title)}</div>
      <div className="contacts-grid">{items.map(renderItem)}</div>
    </div>
  );
});

export default function ContactsSection({
  contacts = [],
  editMode,
  onOpenContactPicker,
  onRemoveContact,
  onChangeContactValue,
}) {
  const { t } = useTranslation(["contacts", "common"]);

  const [editingIdx, setEditingIdx] = React.useState(-1);
  const [tempByIdx, setTempByIdx] = React.useState({});
  const [confirmIdx, setConfirmIdx] = React.useState(null);

  // ---- GROUP CONTACTS (memo, no object spread) ----
  const grouped = React.useMemo(() => {
    const g = { main: [], social: [], other: [] };

    (contacts || []).forEach((c, i) => {
      const item = { c, index: i };

      if (MAIN_TYPES.includes(c?.type)) g.main.push(item);
      else if (SOCIAL_TYPES.includes(c?.type)) g.social.push(item);
      else g.other.push(item);
    });

    return g;
  }, [contacts]);

  const startEdit = React.useCallback((index, value) => {
    setEditingIdx(index);
    setTempByIdx((p) => ({
      ...p,
      [index]: valueToString(value),
    }));
  }, []);

  const changeEdit = React.useCallback((index, v) => {
    setTempByIdx((p) => ({ ...p, [index]: v }));
  }, []);

  const commitEdit = React.useCallback(() => {
    if (editingIdx < 0) return;
    const v = tempByIdx[editingIdx] ?? "";
    onChangeContactValue?.(editingIdx, v);
    setEditingIdx(-1);
  }, [editingIdx, tempByIdx, onChangeContactValue]);

  const cancelEdit = React.useCallback(() => setEditingIdx(-1), []);

  // ---- RENDER ONE CHIP ----
  const renderItem = React.useCallback(
    ({ c, index }) => {
      const isEditing = !!editMode && editingIdx === index;

      return (
        <div key={c.id ?? `${c.type}-${index}`} className="contact-chip">
          <ContactButton
            type={c.type}
            value={c.value}
            editMode={editMode}
            isEditing={isEditing}
            editValue={isEditing ? (tempByIdx[index] ?? "") : ""}
            onStartEdit={() => startEdit(index, c.value)}
            onEditChange={(v) => changeEdit(index, v)}
            onCommitEdit={commitEdit}
            onCancelEdit={cancelEdit}
            onChangeType={() => onOpenContactPicker?.(index)}
          />

          {editMode && (
            <button
              type="button"
              onClick={() => setConfirmIdx(index)}
              className="contact-remove"
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      );
    },
    [
      editMode,
      editingIdx,
      tempByIdx,
      startEdit,
      changeEdit,
      commitEdit,
      cancelEdit,
      onOpenContactPicker,
    ]
  );

  return (
    <>
      <Section title="Main" items={grouped.main} t={t} renderItem={renderItem} />
      <Section title="Social" items={grouped.social} t={t} renderItem={renderItem} />
      <Section title="Other" items={grouped.other} t={t} renderItem={renderItem} />

      {/* ---- SINGLE ADD BUTTON AT BOTTOM ---- */}
      {editMode && (
        <div className="contacts-add-wrapper">
          <button
            type="button"
            onClick={() => onOpenContactPicker?.(null)}
            className="contact-add-tile"
          >
            <FiPlus size={14} />
            <span>{t("add", "Add contact")}</span>
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmIdx != null}
        title="Remove contact"
        message="Are you sure you want to remove this contact?"
        cancelText="Cancel"
        confirmText="Remove"
        danger
        onClose={() => setConfirmIdx(null)}
        onConfirm={() => {
          onRemoveContact?.(confirmIdx);
          setConfirmIdx(null);
        }}
      />
    </>
  );
}