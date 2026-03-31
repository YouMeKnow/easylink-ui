// src/features/vibes/print/mapVibeToPrintCardModel.js
function normalizeType(value) {
  return String(value || "").trim().toLowerCase();
}

function pickFirstContact(contacts, allowedTypes) {
  return contacts.find((item) => {
    const type = normalizeType(item?.type);
    const value = String(item?.value || "").trim();
    return allowedTypes.includes(type) && value;
  });
}

export default function mapVibeToPrintCardModel({ vibe, name, contacts }) {
  const safeContacts = Array.isArray(contacts) ? contacts : [];

  const phone = pickFirstContact(safeContacts, ["phone", "mobile", "telephone"]);
  const email = pickFirstContact(safeContacts, ["email"]);
  const website = pickFirstContact(safeContacts, ["website", "site", "web"]);
  const address = pickFirstContact(safeContacts, ["address", "location"]);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const qrUrl = vibe?.id ? `${origin}/view/${vibe.id}` : "";

  return {
    id: vibe?.id || "",
    name: name || vibe?.name || "",
    title: "Digital Card",
    brandName: "YouMeKnow",
    phone: phone?.value || "",
    email: email?.value || "",
    website: website?.value || "",
    address: address?.value || "",
    qrUrl,
    qrValue: qrUrl,
    logoUrl: "/clearviewblue.png",
  };
}