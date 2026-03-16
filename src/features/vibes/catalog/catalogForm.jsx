import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CatalogCard from "./catalogCard";
import { useCreateItem } from "./useCreateItem";
import { useItems } from "./useItems";
import { useUpdateItem } from "./useUpdateItem";
import { buildItemDiff } from "./buildItemDiff";
import "./CatalogForm.css";

export default function CatalogForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: itemId } = useParams();

  const {
    vibeId,
    returnTo,
    tab,
    itemIds = [],
    currentIndex = 0,
  } = location.state || {};

  const [index, setIndex] = useState(currentIndex);

  const { createItem } = useCreateItem();
  const { updateItem } = useUpdateItem();

  const isEdit = Boolean(itemId);

  // нельзя вызывать хуки внутри if
  const {
    items,
    loading,
    error,
  } = useItems(isEdit ? itemId : null, { auth: "required" });

  const item = useMemo(() => {
    if (!isEdit) return null;
    return Array.isArray(items) ? items?.[0] : items;
  }, [isEdit, items]);

  const goToIndex = (i) => {
    if (!itemIds.length) return;

    const next = (i + itemIds.length) % itemIds.length;
    setIndex(next);

    const nextId = itemIds[next];
    navigate(`/catalog/${nextId}/edit`, {
      replace: true,
      state: { vibeId, returnTo, tab, itemIds, currentIndex: next },
    });
  };

  const handleCancel = () => {
    navigate(returnTo || "/my-vibes", { state: { tab } });
  };

  const handleSwipeLeft = () => goToIndex(index + 1);
  const handleSwipeRight = () => goToIndex(index - 1);

  const handleUpdate = async (payloadFromCard) => {
    if (!item) return;

    const normalized = {
      ...payloadFromCard,
      imageUrl: payloadFromCard.image ?? null,
    };

    const diff = buildItemDiff(item, normalized);

    if ("image" in diff) delete diff.image;

    if (!diff || Object.keys(diff).length === 0) {
      navigate(returnTo || "/my-vibes", { state: { tab } });
      return;
    }

    try {
      await updateItem(item.id, diff);
      navigate(returnTo || "/my-vibes", { state: { tab } });
    } catch (e) {
      alert(e.message || "Failed to update item");
    }
  };

  const handleSave = async ({ title, description, price, image }) => {
    try {
      await createItem({
        vibeId,
        title,
        description,
        price,
        imageUrl: image,
      });

      navigate(returnTo || "/my-vibes", { state: { tab } });
    } catch (err) {
      alert(err.message || "Failed to create item");
    }
  };

  if (isEdit && loading) {
    return (
      <div className="catalogFormPage">
        <div className="catalogFormState">Loading item...</div>
      </div>
    );
  }

  if (isEdit && error) {
    return (
      <div className="catalogFormPage">
        <div className="catalogFormState catalogFormState--error">
          Error: {String(error)}
        </div>
      </div>
    );
  }

  if (isEdit && !item) {
    return (
      <div className="catalogFormPage">
        <div className="catalogFormState">Item not found</div>
      </div>
    );
  }

  return (
    <div className="catalogFormPage">
      <CatalogCard
        mode={isEdit ? "edit" : "create"}
        data={item || {}}
        onSave={isEdit ? handleUpdate : handleSave}
        onCancel={handleCancel}
        onSweptLeft={handleSwipeLeft}
        onSweptRight={handleSwipeRight}
      />
    </div>
  );
}
