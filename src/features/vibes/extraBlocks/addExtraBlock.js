const normalizeKey = (k) => String(k || "").trim().toLowerCase();

export function makeNewExtraBlock(block, existingBlocks) {
  const key = normalizeKey(block?.key);
  const isHours = key === "hours";

  const initHours = {
    monday:"", tuesday:"", wednesday:"",
    thursday:"", friday:"", saturday:"", sunday:""
  };

  // hours single
  if (isHours) {
    const hasHours = (existingBlocks || []).some(
      (b) => normalizeKey(b?.type) === "hours"
    );
    if (hasHours) return null;
  }

  const type =
    isHours ? "hours" :
    key === "birthday" || key === "date" ? "birthday" :
    key || "custom";

  return {
    type,
    label: block?.label || (isHours ? "Hours" : "Custom"),
    value: isHours ? initHours : "",
    placeholder: isHours ? undefined : block?.placeholder,
  };
}