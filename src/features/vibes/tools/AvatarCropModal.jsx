import React from "react";
import Cropper from "react-easy-crop";
import { getCroppedAvatarBlob } from "@/shared/utils/cropImage";
import "./AvatarCropModal.css";

export default function AvatarCropModal({ file, onCancel, onSave }) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState(null);

  const objectUrl = React.useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  React.useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  if (!file) return null;

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedAvatarBlob(file, croppedAreaPixels, 512);
    const croppedFile = new File([blob], file.name || "avatar.jpg", {
      type: blob.type,
    });
    onSave(croppedFile);
  };

  return (
    <div className="acm-backdrop" onMouseDown={onCancel}>
      <div className="acm-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="acm-header">
          <div className="acm-title">Crop photo</div>
          <button className="acm-x" type="button" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="acm-cropArea">
          <Cropper
            image={objectUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          />
        </div>

        <div className="acm-controls">
          <label className="acm-zoom">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>

          <div className="acm-actions">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
