const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

const alias = {
  mon: "monday", monday: "monday",
  tue: "tuesday", tues: "tuesday", tuesday: "tuesday",
  wed: "wednesday", weds: "wednesday", wednesday: "wednesday",
  thu: "thursday", thur: "thursday", thurs: "thursday", thursday: "thursday",
  fri: "friday", friday: "friday",
  sat: "saturday", saturday: "saturday",
  sun: "sunday", sunday: "sunday",
};

function isPlainObject(v){ return v && typeof v==="object" && !Array.isArray(v); }

function parseMaybeJSON(v){
  if (typeof v !== "string") return v;
  try { return JSON.parse(v); } catch { return v; }
}

function toISODateValue(val){
  if (!val) return "";
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toHoursObject(input){
  const v = parseMaybeJSON(input);
  if (!isPlainObject(v)) return null;

  const out = {};
  for (const [k, val] of Object.entries(v)) {
    const norm = String(k).trim().toLowerCase().replace(/\.$/, "");
    const day = alias[norm];
    if (day) out[day] = typeof val === "string" ? val : "";
  }

  const hasAny = DAYS.some(d => Object.prototype.hasOwnProperty.call(out, d));
  if (!hasAny) return null;

  for (const d of DAYS) if (!(d in out)) out[d] = "";
  return out;
}

export function normalizeExtraBlocks(rawBlocks = []) {
  return (rawBlocks || []).map((b, i) => {
    const typeRaw = String(b?.type || b?.kind || "").trim();
    const type = typeRaw.toLowerCase();
    const label = b?.label || "Field";
    const raw = parseMaybeJSON(b?.value);

    // HOURS
    if (type === "hours") {
      const hours = toHoursObject(raw) || DAYS.reduce((acc, d) => (acc[d] = "", acc), {});
      return {
        id: b?.id ?? `extra-${i}`,
        type: "hours",
        label,
        value: hours,
        placeholder: b?.placeholder,
      };
    }

    // DATE/BIRTHDAY
    if (type === "birthday" || type === "date") {
      return {
        id: b?.id ?? `extra-${i}`,
        type: "birthday",
        label,
        value: toISODateValue(raw ?? ""),
        placeholder: b?.placeholder,
      };
    }

    // DEFAULT TEXT
    return {
      id: b?.id ?? `extra-${i}`,
      type: typeRaw || "text",
      label,
      value: (typeof raw === "string" || typeof raw === "number") ? String(raw) : "",
      placeholder: b?.placeholder,
    };
  });
}