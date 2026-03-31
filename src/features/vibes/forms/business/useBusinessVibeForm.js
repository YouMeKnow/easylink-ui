import { useState } from "react";
import { createVibe } from "@/api/vibeApi";
import parseFields from "@/data/parseFields";
import { apiFetch } from "@/api/apiFetch";
import { useAuth } from "@/context/AuthContext";

const EMPTY_HOURS = {
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
  sunday: "",
};

const isHoursKey = (s) => String(s || "").toLowerCase() === "hours";

export function useBusinessVibeForm({
  navigate,
  initialData = {},
  mode = "create",
  onSave,
}) {
  const { isAuthenticated } = useAuth();
  const parsed = initialData.fieldsDTO
    ? parseFields(initialData.fieldsDTO)
    : {};

  const [name, setName] = useState(initialData.name || parsed.name || "");
  const [description, setDescription] = useState(
    initialData.description || parsed.description || ""
  );
  const [photo, setPhoto] = useState(initialData.photo || null);

  const [contacts, setContacts] = useState(
    initialData.contacts || parsed.contacts || []
  );
  const [extraBlocks, setExtraBlocks] = useState(
    initialData.extraBlocks || parsed.extraBlocks || []
  );

  const [showModal, setShowModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== Contacts =====
  const addContact = (type) => {
    if (contacts.some((c) => c.type === type)) return setShowModal(false);
    setContacts((prev) => [...prev, { type, value: "" }]);
    setShowModal(false);
  };

  const handleContactChange = (i, val) => {
    setContacts((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], value: val };
      return next;
    });
  };

  const removeContact = (i) => {
    setContacts((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ===== Info blocks (incl. Hours) =====
  const hasHours = () =>
    extraBlocks.some((b) => isHoursKey(b.type) || isHoursKey(b.label));

  const addInfoBlock = (block) => {
    const key = String(block?.key || "").toLowerCase();
    const label = block?.label || "";

    const wantsHours = isHoursKey(key) || isHoursKey(label);
    if (wantsHours) {
      if (hasHours()) return;
      setExtraBlocks((prev) => [
        ...prev,
        { type: "hours", label: "Hours", value: { ...EMPTY_HOURS } },
      ]);
      return;
    }

    setExtraBlocks((prev) => [
      ...prev,
      {
        type: block?.key,
        label: block?.label || "Custom",
        value: "",
        placeholder: block?.placeholder,
      },
    ]);
  };

  const handleBlockChange = (i, val) => {
    setExtraBlocks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], value: val };
      return next;
    });
  };

  const removeBlock = (i) => {
    setExtraBlocks((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ===== Submit =====
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    const fieldsDTO = [
      ...contacts.map((c) => ({
        ...(c.id ? { id: c.id } : {}),
        type: c.type,
        value: c.value,
        label: c.type,
      })),

      ...extraBlocks.map((b) => {
        const isHours = isHoursKey(b.type) || isHoursKey(b.label);
        const rawValue = isHours ? b.value || EMPTY_HOURS : b.value;

        return {
          ...(b.id ? { id: b.id } : {}),
          type: isHours ? "hours" : b.type || "custom",
          label: b.label || (isHours ? "Hours" : "Custom"),
          value:
            typeof rawValue === "object" ? JSON.stringify(rawValue) : rawValue,
        };
      }),
    ];

    let photoUrl = initialData.photo || null;

    if (photo instanceof File) {
      const formData = new FormData();
      formData.append("file", photo);

     const uploadRes = await apiFetch("/api/v3/upload", {
       method: "POST",
       body: formData, 
     });

      if (!uploadRes.ok) throw new Error("Photo upload failed");
      photoUrl = await uploadRes.text();
    }
    const base = {
      name,
      description,
      type: "BUSINESS",
      photo: photoUrl,
      fieldsDTO,
    };

    try {
      setLoading(true);

      if (mode === "edit") {
        const dto = { ...base, id: initialData.id }; 
        if (onSave) {
          await onSave(dto); 
        }
        return;
      }

      const created = await createVibe(base);

      const newId = created?.id || created?.vibeId || created?.vibe?.id;

      if (onSave) {
        onSave(created);
      }
      alert("Vibe created!");
      navigate("/profile");
    } catch (err) {
      alert(err.message || "Error saving Vibe");
    } finally {
      setLoading(false);
    }
  };

  return {
    // state
    name,
    setName,
    description,
    setDescription,
    photo,
    setPhoto,
    contacts,
    setContacts,
    extraBlocks,
    setExtraBlocks,
    showModal,
    setShowModal,
    showBlockModal,
    setShowBlockModal,
    loading,

    // contacts api
    addContact,
    handleContactChange,
    removeContact,

    // blocks api
    addInfoBlock,
    handleBlockChange,
    removeBlock,

    // submit
    handleSubmit,
  };
}
