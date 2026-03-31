// src/components/.../useEventVibeForm.js
import { useEffect, useState } from "react";
import { createVibe } from "@/api/vibeApi";
import { useAuth } from "@/context/AuthContext";

export function useEventVibeForm({
  navigate,
  initialData = {},
  mode = "create",
  onSave,
}) {
  const { isAuthenticated } = useAuth();

  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [photo, setPhoto] = useState(initialData.photo || null); 
  const [contacts, setContacts] = useState(initialData.contacts || []);
  const [extraBlocks, setExtraBlocks] = useState(initialData.extraBlocks || []);
  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const addContact = (type) => {
    if (contacts.some((c) => c.type === type)) return setShowModal(false);
    setContacts([...contacts, { type, value: "" }]);
    setShowModal(false);
  };

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
    const updated = [...contacts];
    updated.splice(i, 1);
    setContacts(updated);
  };

  const handleBlockChange = (i, val) => {
    const updated = [...extraBlocks];
    if (!updated[i]) return;
    updated[i].value = typeof val === "string" ? val : String(val ?? "");
    setExtraBlocks(updated);
  };

  const removeBlock = (i) => {
    const updated = [...extraBlocks];
    updated.splice(i, 1);
    setExtraBlocks(updated);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (!isAuthenticated) {
      navigate("/signin?next=/my-vibes");
      return;
    }

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
    } else if (typeof photo === "string") {
      photoUrl = photo; 
    } else if (photo == null) {
      photoUrl = null;
    }

    const base = {
      name,
      description,
      type: "OTHER",
      photo: photoUrl,
      fieldsDTO,
    };
    const dto = mode === "edit" ? { ...base, id: initialData.id } : base;

    try {
      setLoading(true);
      if (mode === "edit" && onSave) {
        await onSave(dto);
      } else {
        const created = await createVibe(dto);
        const newId = created?.id || created?.vibeId || created?.vibe?.id;

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
    name, setName,
    description, setDescription,
    photo, setPhoto,                 
    contacts, setContacts,
    extraBlocks, setExtraBlocks,
    showModal, setShowModal,
    showBlockModal, setShowBlockModal,
    loading,
    addContact,
    handleContactChange,
    removeContact,
    handleBlockChange,
    removeBlock,
    handleSubmit,
  };
}
