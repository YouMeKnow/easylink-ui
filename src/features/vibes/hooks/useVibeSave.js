import { useCallback } from "react";
import { updateVibe, getVibe } from "@/api/vibeApi";
import { useTranslation } from "react-i18next";

export default function useVibeSave({ vibe, setVibe, setEditing }) {
  const { t } = useTranslation();

  const handleSave = useCallback(
    async (updated) => {
      const currentId = vibe?.id;
      if (!currentId) {
        alert(t("vibe.error_no_id"));
        return;
      }

      const cleanFields = (updated.fieldsDTO ?? []).map((field) => {
        const isNew = !field.id || String(field.id).startsWith("temp-");
        return isNew ? { ...field, id: undefined } : field;
      });

      try {
        await updateVibe(currentId, {
          id: currentId,
          name: updated.name,
          description: updated.description,
          photo: updated.photo,
          fieldsDTO: cleanFields,
        });

        const fresh = await getVibe(currentId);
        setVibe(fresh);
        setEditing(false);
      } catch (e) {
        console.error("Error while saving vibe:", e);

        let message =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          t("vibe.error_save");

        if (typeof message !== "string") {
          try {
            message = JSON.stringify(message);
          } catch {
            message = t("vibe.error_save");
          }
        }

        alert(message);
      }
    },
    [vibe, setVibe, setEditing, t]
  );

  return handleSave;
}
