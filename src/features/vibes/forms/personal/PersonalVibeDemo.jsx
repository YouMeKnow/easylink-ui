import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

export default function PersonalVibeDemo() {
  const { t } = useTranslation("home");

  const demo = useMemo(() => ({
    id: "demo-personal",
    type: "PERSONAL",
    name: t("demo.personal.name", { defaultValue: "Alex Johnson" }),
    description: t("demo.personal.description", {
      defaultValue:
        "Curious builder, music lover, and weekend hooper. Sharing moments, projects, and ways to connect.",
    }),
    photo: "/demo/personal-demo.png",
    contacts: [
      { type: "telegram", value: t("demo.personal.telegram", { defaultValue: "@demo.ymk" }) },
      { type: "instagram", value: t("demo.personal.instagram", { defaultValue: "@demo.ymk" }) },
      { type: "email", value: t("demo.personal.email", { defaultValue: "hello@example.me" }) },
    ],
    extraBlocks: [
      { label: t("demo.personal.city_label", { defaultValue: "City" }), value: t("demo.personal.city_value", { defaultValue: "New York, USA" }) },
      { label: t("demo.personal.interests_label", { defaultValue: "Interests" }), value: t("demo.personal.interests_value", { defaultValue: "Startups, basketball, photography" }) },
      { label: t("demo.personal.website_label", { defaultValue: "Website" }), value: t("demo.personal.website_value", { defaultValue: "example.me" }) },
    ],
  }), [t]);

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <VibeCard
        id={demo.id}
        name={demo.name}
        description={demo.description}
        photo={demo.photo}
        contacts={demo.contacts}
        extraBlocks={demo.extraBlocks}
        type={demo.type}
        visible={true}
        publicCode={null}
        editMode={false}
        ownerActionsEnabled={false}
        cardBody={
          <VibeContent
            id={demo.id}
            name={demo.name}
            description={demo.description}
            photo={demo.photo}
            contacts={demo.contacts}
            extraBlocks={demo.extraBlocks}
            type={demo.type}
            editMode={false}
          />
        }
      />
    </div>
  );
}
