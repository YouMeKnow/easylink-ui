import React from "react";
import Avatar from "./Avatar";
import usePhotoPreview from "./usePhotoPreview";
import AvatarCropModal from "./AvatarCropModal";
import "./AvatarPicker.css";

export default function AvatarPicker({ name, photo, editMode, onChangePhoto }) {
  const fileRef = React.useRef(null);
  const previewUrl = usePhotoPreview(photo);

  const [cropFile, setCropFile] = React.useState(null);

  const handlePickPhoto = () => {
    if (!editMode) return;
    fileRef.current?.click();
  };

  const handlePhotoSelected = (e) => {
    const file = e.target.files?.[0];
    if (file) setCropFile(file);      
    e.target.value = "";
  };

  const handleCropCancel = () => setCropFile(null);

  const handleCropSave = (croppedFile) => {
    setCropFile(null);
    onChangePhoto?.(croppedFile);     
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handlePhotoSelected}
      />

      <div
        className={`vibe-avatar-wrap ${editMode ? "is-editable" : ""}`}
        role={editMode ? "button" : undefined}
        tabIndex={editMode ? 0 : -1}
        aria-label={editMode ? "Change photo" : undefined}
        onClick={handlePickPhoto}
        onKeyDown={(e) => {
          if (!editMode) return;
          if (e.key === "Enter" || e.key === " ") handlePickPhoto();
        }}
      >
        <Avatar name={name} photo={photo} photoUrl={previewUrl} />

        {editMode && (
          <button
            type="button"
            className="vibe-avatar-edit"
            onClick={(e) => {
              e.stopPropagation();
              handlePickPhoto();
            }}
            aria-label="Change photo"
          >
            <span className="vibe-avatar-edit-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M9 3a1 1 0 0 0-.8.4L7.25 4.5H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-10a3 3 0 0 0-3-3h-2.25L15.8 3.4A1 1 0 0 0 15 3H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2.2a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z"
                />
              </svg>
            </span>
          </button>
        )}
      </div>

      {/* ✅ Crop modal */}
      {cropFile && (
        <AvatarCropModal
          file={cropFile}
          onCancel={handleCropCancel}
          onSave={handleCropSave}
        />
      )}
    </>
  );
}
