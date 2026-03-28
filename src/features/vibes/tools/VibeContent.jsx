import React from "react";
import { useTranslation } from "react-i18next";

import AvatarPicker from "./AvatarPicker.jsx";
import ContactsSection from "./ContactsSection.jsx";
import QRBox from "./QRBox.jsx";
import ExtraBlocksList from "./ExtraBlocksList.jsx";
import "./VibeContent.css";
export default function VibeContent({
  id,
  shareUrl,
  name,
  description,
  photo,
  contacts,
  type,
  extraBlocks = [],
  editMode = false,

  onChangeName,
  onChangeDescription,
  onChangePhoto,

  onOpenContactPicker,
  onRemoveContact,
  onChangeContactValue,
  resumeEditAt,

  onBlockChange,
  onBlockRemove,
  onOpenBlockPicker,
}) {
  const { t } = useTranslation("vibe_content");

  const slug = (type || "").toString().toLowerCase();
  const pretty = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : t("default_type");
  const typeLabel = slug ? t(`types.${slug}`, { defaultValue: pretty }) : t("default_type");

  return (
    <div className="vibe-content">
      {/* LEFT */}
      <div className="vibe-content__avatar">
        <AvatarPicker
          name={name}
          photo={photo}
          editMode={editMode}
          onChangePhoto={onChangePhoto}
        />
      </div>

      {/* RIGHT */}
      <div className="vibe-content__main">
        <div className="vibe-content__head">
          <div className="vibe-content__title">
            {editMode ? (
              <input
                type="text"
                value={name}
                placeholder={t("your_name")}
                onChange={(e) => onChangeName?.(e.target.value)}
                className="form-control fw-bold vibe-content__name-input"
              />
            ) : (
              <h3 className="mb-0 vibe-content__name">
                {name || t("your_name")}
              </h3>
            )}
          </div>

          <div className="vibe-content__type text-primary">{typeLabel}</div>
        </div>

        <div className="vibe-content__desc">
          {editMode ? (
            <textarea
              value={description}
              placeholder={t("default_description")}
              onChange={(e) => onChangeDescription?.(e.target.value)}
              rows={2}
              className="form-control vibe-content__desc-input"
            />
          ) : (
            <p className={`vibe-content__desc-text ${description ? "" : "is-empty"}`}>
              {description || t("default_description")}
            </p>
          )}
        </div>

        {(contacts?.length > 0 || editMode) && (
          <div className="vibe-content__section vibe-content__section--contacts">
            <div className="vibe-content__section-head">
              <h4 className="vibe-content__section-title">
                {t("sections.contacts", "Contacts")}
              </h4>
              <div className="vibe-content__section-line" />
            </div>

            <ContactsSection
              t={t}
              contacts={contacts}
              editMode={editMode}
              onOpenContactPicker={onOpenContactPicker}
              onRemoveContact={onRemoveContact}
              onChangeContactValue={onChangeContactValue}
              resumeEditAt={resumeEditAt}
            />
          </div>
        )}

        {(extraBlocks?.length > 0 || editMode) && (
          <div className="vibe-content__section vibe-content__section--blocks">
            <div className="vibe-content__section-head">
              <h4 className="vibe-content__section-title">
                {t("sections.blocks", "Info blocks")}
              </h4>
              <div className="vibe-content__section-line" />
            </div>

            <ExtraBlocksList
              extraBlocks={extraBlocks}
              editMode={editMode}
              onBlockChange={onBlockChange}
              onBlockRemove={onBlockRemove}
              onOpenBlockPicker={onOpenBlockPicker}
            />
          </div>
        )}

        <div className="vibe-content__qr">
          <QRBox id={id} shareUrl={shareUrl} t={t} />
        </div>
      </div>
    </div>
  );
}