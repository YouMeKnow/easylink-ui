import React, { useState, useEffect, useCallback } from "react";
import { createVibe } from "@/api/vibeApi";
import { apiFetch } from "@/api/apiFetch";

export function usePersonalVibeForm({
  navigate,
  initialData = {},
  mode = "create",
  onSave,
  onCancel,
}) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [photo, setPhoto] = useState(initialData.photo || null);
  const [contacts, setContacts] = useState(initialData.contacts || []);
  const [extraBlocks, setExtraBlocks] = useState(initialData.extraBlocks || []);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockEditIndex, setBlockEditIndex] = useState(null);
  const [showInfo, setShowInfo] = useState(mode !== "edit");
  const [loading, setLoading] = useState(false);

  // --- CONTACTS ---
  const addContact = (type) => {
    if (contacts.some((c) => c.type === type)) return setShowModal(false);
    setContacts([...contacts, { type, value: "" }]);
    setShowModal(false);
  };

  useEffect(() => {
    setContacts((prev) =>
      (prev || []).map((c) => ({
        ...c,
        value:
          typeof c.value === "string"
            ? c.value
            : (c?.value && typeof c.value === "object" && "value" in c.value
                ? String(c.value.value ?? "")
                : String(c.value ?? "")),
      }))
    );
  }, []);

  const handleContactChange = (i, val) => {
    const str =
      typeof val === "string"
        ? val
        : (val && typeof val === "object" && "value" in val
            ? String(val.value ?? "")
            : String(val ?? ""));
    const updated = [...contacts];
    if (!updated[i]) return;
    updated[i] = { ...updated[i], value: str };
    setContacts(updated);
  };

  const removeContact = (i) => {
    setContacts((prev) => prev.filter((_, idx) => idx !== i));
  };

  // --- EXTRA BLOCKS ---
  const handleBlockChange = (i, val) => {
    const updated = [...extraBlocks];
    updated[i].value = val;
    setExtraBlocks(updated);
  };

  const removeBlock = (i) => {
    setExtraBlocks((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onOpenBlockPicker = (indexOrNull) => {
    setBlockEditIndex(indexOrNull ?? null);
    setShowBlockModal(true);
  };

  const onSelectExtraBlock = (block) => {
    setExtraBlocks((prev) => {
      if (blockEditIndex == null) return [...prev, block];
      const next = [...prev];
      next[blockEditIndex] = block;
      return next;
    });
    setShowBlockModal(false);
    setBlockEditIndex(null);
  };

  const onCloseExtraBlockPicker = () => {
    setShowBlockModal(false);
    setBlockEditIndex(null);
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldsDTO = [
      ...contacts.map((c) => ({
        ...(c.id ? { id: c.id } : {}),
        type: c.type,
        value: c.value,
        label: c.type,
      })),
      ...extraBlocks.map((b) => ({
        ...(b.id ? { id: b.id } : {}),
        type: b.type,
        value: b.value,
        label: b.label || null,
      })),
    ];

    let photoUrl = initialData.photo || null;

    if (photo instanceof File) {
      const token = localStorage.getItem("jwt");
      const formData = new FormData();
      formData.append("file", photo);

      const uploadRes = await fetch("/api/v3/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Photo upload failed");
      photoUrl = await uploadRes.text();
    }

    const dto = {
      id: initialData.id,
      name,
      description,
      type: "PERSONAL",
      photo: photoUrl,
      fieldsDTO,
    };

    try {
      setLoading(true);
      if (mode === "edit" && onSave) {
        await onSave(dto);
      } else {
        const created = await createVibe(dto);
        const newId =
          created?.id || created?.vibeId || created?.vibe?.id;
        alert("Vibe created!"); 
        navigate("/profile");
      }
    } catch (err) {
      alert(err.message || "Error saving Vibe");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    description,
    setDescription,
    photo,
    setPhoto,
    contacts,
    setContacts,
    showModal,
    setShowModal,
    extraBlocks,
    setExtraBlocks,
    showBlockModal,
    setShowBlockModal,
    blockEditIndex,
    onOpenBlockPicker,
    onSelectExtraBlock,
    onCloseExtraBlockPicker,
    showInfo,
    setShowInfo,
    loading,
    addContact,
    handleContactChange,
    removeContact,
    handleBlockChange,
    removeBlock,
    handleSubmit,
  };
}
