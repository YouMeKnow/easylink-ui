import React, { useState, useEffect, useRef } from "react";
import { ImagePlus, X, ChevronLeft, Upload, Sparkles } from "lucide-react";
import { useFileUpload } from "../catalog/useFileUpload";
import "./CatalogCard.css";

export default function CatalogCard({
  data = {},
  mode = "view",
  onSave,
  onCancel,
}) {
  const [title, setTitle] = useState(data.title || "");
  const [description, setDescription] = useState(data.description || "");
  const [price, setPrice] = useState(
    typeof data.price === "number" ? String(data.price) : data.price || ""
  );
  const [image, setImage] = useState(data.image || data.imageUrl || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const { uploadFile } = useFileUpload();
  const inputRef = useRef(null);

  const readOnly = mode === "view";
  const hasTitle = title.trim().length > 0;
  const canSave = !readOnly && hasTitle && !saving;

  const API_BASE =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || window.location.origin;

  const resolveServerUrl = (path) => {
    if (!path) return "";

    const s = String(path).trim();

    if (/^https?:\/\//i.test(s)) return s;
    if (s.startsWith("/uploads/")) return `${API_BASE}${s}`;
    if (s.startsWith("uploads/")) return `${API_BASE}/${s}`;
    if (s.startsWith("/")) return `${API_BASE}${s}`;

    return `${API_BASE}/uploads/${s}`;
  };

  const [serverSrc, setServerSrc] = useState(
    resolveServerUrl(data.imageUrl || data.image || "")
  );

  useEffect(() => {
    setServerSrc(resolveServerUrl(data.imageUrl || data.image || ""));
  }, [data.imageUrl, data.image]);

  const [previewSrc, setPreviewSrc] = useState("");
  useEffect(() => {
    if (!file) {
      setPreviewSrc("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => setTitle(data.title || ""), [data.title]);

  useEffect(() => {
    setDescription(data.description || "");
    setPrice(
      typeof data.price === "number" ? String(data.price) : data.price || ""
    );
    setImage(data.image || data.imageUrl || "");
  }, [data.description, data.price, data.image, data.imageUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setFile(null);
    setImage("");
    setServerSrc("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!canSave) return;

    let imageUrl = image;

    try {
      setSaving(true);

      if (file) {
        imageUrl = await uploadFile(file);
      }

      await onSave?.({
        title: title.trim(),
        description: description.trim(),
        price: price === "" ? null : Number(price),
        image: imageUrl || null,
      });
    } catch (err) {
      alert(err.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const imgSrc = previewSrc || serverSrc;

  return (
    <div className="catalogCard">
      <div className="catalogCard__shell">
        <div className="catalogCard__header">
          <div>
            <div className="catalogCard__eyebrow">
              {mode === "edit" ? "Edit item" : readOnly ? "Item preview" : "New menu item"}
            </div>
            <h3 className="catalogCard__title">
              {mode === "edit" ? "Refine your item" : "Create something people want to open"}
            </h3>
            <p className="catalogCard__subtitle">
              Keep it simple: add a strong photo, a clear title, and a clean price.
            </p>
          </div>

          <button
            type="button"
            className="catalogIconBtn"
            onClick={onCancel}
            aria-label={readOnly ? "Back" : "Close"}
            title={readOnly ? "Back" : "Close"}
          >
            <X size={18} />
          </button>
        </div>

        <div className="catalogCard__content">
          <div className="catalogCard__preview">
            <button
              type="button"
              className={`catalogUpload ${imgSrc ? "hasImage" : ""}`}
              onClick={() => {
                if (!readOnly) inputRef.current?.click();
              }}
              disabled={readOnly}
            >
              {imgSrc ? (
                <>
                  <img
                    src={imgSrc}
                    alt={title || "Preview"}
                    className="catalogUpload__img"
                  />

                  {!readOnly && (
                    <div className="catalogUpload__overlay">
                      <div className="catalogUpload__overlayInner">
                        <Upload size={18} />
                        <span>Change photo</span>
                      </div>
                    </div>
                  )}

                  {!readOnly && (
                    <button
                      type="button"
                      className="catalogUpload__remove"
                      onClick={handleRemoveImage}
                      aria-label="Remove image"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  )}
                </>
              ) : (
                <div className="catalogUpload__empty">
                  <div className="catalogUpload__iconWrap">
                    <ImagePlus size={26} />
                  </div>
                  <div className="catalogUpload__emptyTitle">
                    {readOnly ? "No image" : "Add a photo"}
                  </div>
                  <div className="catalogUpload__emptyText">
                    {readOnly
                      ? "This item has no image yet."
                      : "Tap to upload a clean, attractive image for this item."}
                  </div>
                </div>
              )}
            </button>

            {!readOnly && (
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="catalogUpload__input"
                onChange={handleFileChange}
              />
            )}

          </div>

          <div className="catalogCard__form">
            <div className="catalogField">
              <label className="catalogLabel">Title</label>
              <input
                type="text"
                className="catalogInput"
                placeholder="e.g. Truffle Pasta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={readOnly}
                maxLength={80}
              />
              {!readOnly && !hasTitle && (
                <div className="catalogHint catalogHint--error">
                  Title is required.
                </div>
              )}
            </div>

            <div className="catalogField">
              <label className="catalogLabel">Description</label>
              <textarea
                className="catalogTextarea"
                rows={5}
                placeholder="Add a short, clear description that makes the item feel worth opening."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                readOnly={readOnly}
                maxLength={280}
              />
              <div className="catalogHint">
                Keep it short and natural.
              </div>
            </div>

            <div className="catalogField">
              <label className="catalogLabel">Price</label>
              <div className="catalogPriceWrap">
                <span className="catalogPriceWrap__prefix">$</span>
                <input
                  type="number"
                  className="catalogInput catalogInput--price"
                  placeholder="18.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  readOnly={readOnly}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="catalogActions">
              <button
                type="button"
                className="catalogBtn catalogBtn--ghost"
                onClick={onCancel}
              >
                {readOnly ? (
                  <>
                    <ChevronLeft size={16} />
                    Back
                  </>
                ) : (
                  "Cancel"
                )}
              </button>

              {!readOnly && (
                <button
                  type="button"
                  className="catalogBtn catalogBtn--primary"
                  onClick={handleSave}
                  disabled={!canSave}
                >
                  {saving ? "Saving..." : mode === "edit" ? "Save changes" : "Create item"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
