// src/features/vibes/contacts/hooks/useContactTypePicker.js
import React from "react";

export default function useContactTypePicker({ contacts, setContacts, onRefocus }) {
  const [open, setOpen] = React.useState(false);

  // "toggle" = add/remove contacts
  // "pick"   = change type for specific contact (arrow keys)
  const [mode, setMode] = React.useState("toggle");
  const [typeIndex, setTypeIndex] = React.useState(null);

  // prevents immediate re-open caused by refocus/focus handlers
  const suppressOpenUntilRef = React.useRef(0);
  const suppressOpenFor = (ms = 350) => {
    suppressOpenUntilRef.current = Date.now() + ms;
  };
  const canOpen = () => Date.now() > suppressOpenUntilRef.current;

  // open for specific contact (change type)
  const openPickForIndex = React.useCallback(
    (idx, opts = {}) => {
      const i = Number.isInteger(idx) ? idx : null;
      if (opts.fromFocus && !canOpen()) return;

      setMode("pick");
      setTypeIndex(i);
      setOpen(true);
    },
    []
  );

  // open for add/remove contacts
  const openToggle = React.useCallback((opts = {}) => {
    if (opts.fromFocus && !canOpen()) return;

    setMode("toggle");
    setTypeIndex(null);
    setOpen(true);
  }, []);

  // BACKWARD-COMPAT: old API openPicker(idx)
  // - idx is integer => pick mode
  // - else => toggle mode
  const openPicker = React.useCallback(
    (idx, opts = {}) => {
      if (Number.isInteger(idx)) openPickForIndex(idx, opts);
      else openToggle(opts);
    },
    [openPickForIndex, openToggle]
  );

  const closePicker = React.useCallback(() => {
    setOpen(false);
    setTypeIndex(null);
    setMode("toggle");
  }, []);

  // mode="pick": set type for one contact and close
  const pickType = React.useCallback(
    (typeKey) => {
      if (typeIndex == null) return;

      setContacts((prev) => {
        const next = [...(prev || [])];
        const current = next[typeIndex] || { type: "", value: "" };
        next[typeIndex] = { ...current, type: typeKey };
        return next;
      });

      // prevent re-open from focus handlers
      suppressOpenFor(450);

      // close first, then refocus same contact input
      closePicker();
      onRefocus?.(typeIndex);
    },
    [typeIndex, setContacts, closePicker, onRefocus]
  );

  // mode="toggle": add/remove types (multi)
  const toggleTypeOnly = React.useCallback(
    (typeKey) => {
      setContacts((prev) => {
        const next = [...(prev || [])];

        const idx = next.findIndex((c) => c?.type === typeKey);
        if (idx !== -1) {
          next.splice(idx, 1);
          return next;
        }

        const newIndex = next.length;
        next.push({ type: typeKey, value: "" });

        // refocus AFTER state update + suppress to avoid focus-triggered re-open
        Promise.resolve().then(() => {
          suppressOpenFor(450);
          onRefocus?.(newIndex);
        });

        return next;
      });
    },
    [setContacts, onRefocus]
  );

  // single entry for panel clicks
  const onSelectType = React.useCallback(
    (typeKey) => {
      if (mode === "pick") pickType(typeKey);
      else toggleTypeOnly(typeKey);
    },
    [mode, pickType, toggleTypeOnly]
  );

  return {
    open,
    mode,
    typeIndex,

    // openers
    openPicker, // old API used by VibeCard/ContactsSection
    openPickForIndex,
    openToggle,

    closePicker,

    // pass to ContactTypePicker as onToggleType
    toggleType: onSelectType,

    // optional if you prefer naming
    onSelectType,
  };
}