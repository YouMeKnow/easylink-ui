import React from "react";
import VibeCard from "@/features/vibes/card/components/VibeCard";
import VibeContent from "@/features/vibes/tools/VibeContent";

export default function ExploreVibeDemo({ demo }) {
  return (
    <div style={{ width: "100%", margin: "0 auto", pointerEvents: "none" }}>
      <VibeCard
        id={demo.id}
        name={demo.name}
        description={demo.description}
        photo={demo.photo}
        contacts={demo.contacts}
        type={demo.type}
        visible={true}
        editMode={false}
        ownerActionsEnabled={false}
        cardBody={
          <VibeContent
            id={demo.id}
            name={demo.name}
            description={demo.description}
            photo={demo.photo}
            contacts={demo.contacts}
            type={demo.type}
            editMode={false}
          />
        }
      />
    </div>
  );
}
