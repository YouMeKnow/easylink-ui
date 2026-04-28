import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";
import "./BusinessVibeDemo.css";

export default function BusinessVibeDemo() {
  const { t } = useTranslation("home");

  const demo = useMemo(
    () => ({
      id: "demo-pizzeria",
      type: "BUSINESS",

      name: t("demo.pizza.name", {
        defaultValue: "Napoli Slice",
      }),

      description: t("demo.pizza.description", {
        defaultValue:
          "Authentic Neapolitan pizza made with fresh ingredients. Fast, cozy, and unforgettable taste.",
      }),

      photo: "/demo/pizza.png",
      contacts: [
        {
          type: "website",
          value: "napolislice.ca",
        },
        {
          type: "instagram",
          value: "napolislice",
        },
        {
          type: "email",
          value: "help@napolislice.ca",
        },
        // {
        //   type: "phone",
        //   value: "+1 (647) 555-1234",
        // },
        {
          type: "twitter",
          value: "napolislice",
        },
      ],
    }),
    [t]
  );

  return (
    <div className="vibe-scale" style={{ maxWidth: 420, margin: "0 auto" }}>
      <VibeCard
        id={demo.id}
        name={demo.name}
        shareUrl="https://youmeknow.com"
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
            shareUrl="https://youmeknow.com"
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