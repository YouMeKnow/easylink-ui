import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

export default function BusinessVibeDemo() {
  const { t } = useTranslation("home");

  const demo = useMemo(
    () => ({
      id: "demo-business",
      type: "BUSINESS",
      name: t("demo.business.name", { defaultValue: "YouMeKnow" }),
      description: t("demo.business.description", {
        defaultValue:
          "A next-gen platform for digital identities and smart Vibes — connect, share, and grow your presence effortlessly.",
      }),
      photo: "/demo/business.jpg",
      contacts: [
        { type: "website", value: t("demo.business.website", { defaultValue: "youmeknow.com" }) },
        { type: "github", value: t("demo.business.github", { defaultValue: "youmeknow" }) },
        { type: "email", value: t("demo.business.email", { defaultValue: "help.youmeknow@gmail.com" }) },
      ],
      extraBlocks: [
        {
          label: t("demo.business.mission_label", { defaultValue: "Our Mission" }),
          value: t("demo.business.mission_value", {
            defaultValue:
              "Empowering individuals and businesses to express identity beyond platforms — through one smart link.",
          }),
        },
        {
          label: t("demo.business.hq_label", { defaultValue: "Headquarters" }),
          value: t("demo.business.hq_value", { defaultValue: "Toronto, Canada" }),
        },
      ],
    }),
    [t]
  );

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
