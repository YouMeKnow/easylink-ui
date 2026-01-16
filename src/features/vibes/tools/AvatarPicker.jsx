import React from "react";
import Avatar from "./Avatar";
import usePhotoPreview from "./usePhotoPreview";

export default function AvatarPicker({ name, photo, editMode, onChangePhoto }) {
  const fileRef = React.useRef(null);
  const previewUrl = usePhotoPreview(photo);

  const handlePickPhoto = () => {
    if (!editMode) return;
    fileRef.current?.click();
  };

  const handlePhotoSelected = (e) => {
    const file = e.target.files?.[0];
    if (file && onChangePhoto) onChangePhoto(file);
    e.target.value = "";
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
        style={{ position: "relative", cursor: editMode ? "pointer" : "default" }}
        onClick={handlePickPhoto}
        onKeyDown={(e) => {
          if (!editMode) return;
          if (e.key === "Enter" || e.key === " ") handlePickPhoto();
        }}
        role={editMode ? "button" : undefined}
        tabIndex={editMode ? 0 : -1}
        aria-label={editMode ? "Change photo" : undefined}
        className="vibe-avatar-wrap"
      >
        <Avatar name={name} photo={photo} photoUrl={previewUrl} />

        {editMode && <div className="vibe-avatar-overlay">change photo</div>}
      </div>
    </>
  );
}
