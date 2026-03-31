import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

export default function OtherVibeDemo() {
  const { t } = useTranslation("home");

  const demo = useMemo(
    () => ({
      id: "demo-event",
      type: "OTHER", // legacy: event
      name: t("demo.other.name", { defaultValue: "YMK Launch Meetup" }),
      description: t("demo.other.description", {
        defaultValue:
          "Join us for a cozy founder meetup: short talks, live demos, and networking with creators.",
      }),
      photo: "/demo/event-demo.png",
      contacts: [
        { type: "website", value: t("demo.other.website", { defaultValue: "youmeknow.com/meetup" }) },
        { type: "telegram", value: t("demo.other.telegram", { defaultValue: "@ymk_events" }) },
        { type: "email", value: t("demo.other.email", { defaultValue: "events@youmeknow.com" }) },
      ],
      extraBlocks: [
        { label: t("demo.other.date_label", { defaultValue: "Date" }), value: t("demo.other.date_value", { defaultValue: "Nov 15, 2025 · 6:30–9:00 PM" }) },
        { label: t("demo.other.venue_label", { defaultValue: "Venue" }), value: t("demo.other.venue_value", { defaultValue: "Communitech Hub, Kitchener" }) },
        { label: t("demo.other.details_label", { defaultValue: "Details" }), value: t("demo.other.details_value", { defaultValue: "Talks, Q&A, snacks, and live Vibe demos." }) },
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
