// src/features/profile/utils/getProfileCards.js
export default function getProfileCards(t, navigate) {
  return [
    {
      icon: "plus",
      variant: "blue",
      title: t("cards.create.title", { defaultValue: "Create new vibe" }),
      text: t("cards.create.text", {
        defaultValue: "Start a new vibe and customize it the way you want.",
      }),
      buttonText: t("cards.create.button", { defaultValue: "Create" }),
      onClick: () => navigate("/create-vibe"),
    },
    {
      icon: "settings",
      variant: "gray",
      title: t("cards.settings.title", { defaultValue: "Account settings" }),
      text: t("cards.settings.text", {
        defaultValue: "Manage your account, preferences, and security settings.",
      }),
      buttonText: t("cards.settings.button", { defaultValue: "Coming soon" }),
      onClick: () => {}, 
      disabled: true,
    }
  ];
}