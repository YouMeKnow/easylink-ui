import React from "react";
import "./ContactTypePicker.css";
import ContactTypePanel from "@/features/vibes/contacts/components/ContactTypePanel/ContactTypePanel";
import { X } from "lucide-react";

export default function ContactTypePicker({
  open,
  mode = "toggle",        // "toggle" | "pick"
  typeIndex,
  contacts = [],
  onToggleType,
  onClose,
  titlePick,
  titleToggle,
  doneText,
}) {
  if (!open) return null;

  return (
    <aside className="ctp-drawer">
      <div className="ctpwrap__top">
        <div className="ctpwrap__hint">
          {mode === "pick" ? titlePick : titleToggle}
        </div>

        <button
          type="button"
          className="ctpwrap__x"
          onClick={onClose}
          aria-label="Close contact picker"
        >
            <X size={20} strokeWidth={2.5} color="#0f172a" />
        </button>   
      </div>

      <ContactTypePanel
        mode={mode}
        contacts={contacts}
        currentTypeKey={
          mode === "pick" && typeIndex != null ? contacts?.[typeIndex]?.type : null
        }
        onToggleType={onToggleType}
      />

      <button type="button" className="ctpwrap__done" onClick={onClose}>
        {doneText}
      </button>
    </aside>
  );
}