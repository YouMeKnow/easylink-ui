import React from "react";
import BusinessVibeForm from "@/features/vibes/forms/business/BusinessVibeForm";
import PersonalVibeForm from "@/features/vibes/forms/personal/PersonalVibeForm";
import EventVibeForm from "@/features/vibes/forms/events/EventVibeForm";

export default function VibeFormRenderer({ type, initialData, onSave, onCancel }) {
  const props = {
    mode: "edit",
    initialData,
    onSave,
    onCancel,
  };

  switch (type) {
    case "BUSINESS":
      return <BusinessVibeForm {...props} />;P
    case "PERSONAL":
      return <PersonalVibeForm {...props} />;
    case "OTHER":
      return <EventVibeForm {...props} />;
    default:
      return null;
  }
}
