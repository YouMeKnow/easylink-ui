import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./OfferEditorPage.css";

import {
  useGetOffer,
  useCreateOffer,
  useUpdateOffer,
  OfferViewCard,
} from "@/features/vibes/offers";
import PageLayout from "@/components/common/PageLayout";

function toLocalInputValue(dateLike) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function nowLocalInputValue() {
  return toLocalInputValue(new Date());
}

function addHoursLocalInputValue(hours) {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return toLocalInputValue(d);
}

function toServerLocalDateTime(localValue) {
  if (!localValue) return null;

  // datetime-local уже даёт "YYYY-MM-DDTHH:mm"
  // для LocalDateTime этого достаточно
  return localValue;
}

export default function OfferEditorPage() {
  const location = useLocation();
  const subscriberVibeId = location.state?.vibeId;

  const { t } = useTranslation();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const { createOffer, loading: creating } = useCreateOffer(token);
  const { offer, loading: fetching } = useGetOffer(id, token);
  const { updateOffer, loading: updating } = useUpdateOffer(token);

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "DYNAMIC",
    initialDiscount: 0,
    currentDiscount: 0,
    decreaseStep: 0,
    decreaseIntervalMinutes: 0,
    active: true,
    startTime: nowLocalInputValue(),
    endTime: addHoursLocalInputValue(1),
  });

  const [changedFields, setChangedFields] = useState({});

  useEffect(() => {
    if (isEditMode && offer) {
      setForm({
        title: offer.title || "",
        description: offer.description || "",
        discountType: offer.discountType || "DYNAMIC",
        initialDiscount: offer.initialDiscount ?? 0,
        currentDiscount: offer.currentDiscount ?? 0,
        decreaseStep: offer.decreaseStep ?? 0,
        decreaseIntervalMinutes: offer.decreaseIntervalMinutes ?? 0,
        active: offer.active ?? true,
        startTime: offer.startTime ? toLocalInputValue(offer.startTime) : nowLocalInputValue(),
        endTime: offer.endTime ? toLocalInputValue(offer.endTime) : addHoursLocalInputValue(1),
      });
      setChangedFields({});
    }
  }, [offer, isEditMode]);

  const hasChanges = useMemo(
    () => Object.keys(changedFields).length > 0,
    [changedFields]
  );

  const startTs = useMemo(() => new Date(form.startTime).getTime(), [form.startTime]);
  const endTs = useMemo(() => new Date(form.endTime).getTime(), [form.endTime]);

  const timeInvalid = useMemo(
    () => Number.isFinite(startTs) && Number.isFinite(endTs) && endTs <= startTs,
    [startTs, endTs]
  );

  const disabled = creating || updating;

  const onChange = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setChangedFields((prev) => ({ ...prev, ...patch }));
  };

  const onCancel = () => navigate(-1);

  const onSave = async () => {
    if (timeInvalid) return;

    let success = false;

    if (isEditMode) {
      if (!hasChanges) {
        navigate(-1);
        return;
      }

      const payload = {
        ...changedFields,
      };

      if ("startTime" in payload) {
        payload.startTime = toServerLocalDateTime(payload.startTime);
      }

      if ("endTime" in payload) {
        payload.endTime = toServerLocalDateTime(payload.endTime);
      }

      success = await updateOffer(id, payload, token);
    } else {
      const payload = {
        ...form,
        startTime: toServerLocalDateTime(form.startTime),
        endTime: toServerLocalDateTime(form.endTime),
      };
      success = await createOffer(payload, subscriberVibeId);
    }

    if (success) {
      alert(t("Offer saved successfully"));
      navigate(-1);
    } else {
      alert(t("Error saving offer"));
    }
  };

  return (
    <PageLayout title={isEditMode ? t("Edit offer") : t("Create offer")}>
      <div className="offer-editor-simple container py-4" style={{ maxWidth: 760 }}>
        <div className="offer-editor-simple__top mb-4">
          <button
            type="button"
            className="offer-editor-simple__btn offer-editor-simple__btn--ghost"
            onClick={onCancel}
            disabled={disabled}
          >
            {t("Back")}
          </button>

          <button
            type="button"
            className="offer-editor-simple__btn offer-editor-simple__btn--primary"
            onClick={onSave}
            disabled={disabled || timeInvalid || (isEditMode && !hasChanges)}
          >
            {disabled
              ? t("Saving...")
              : isEditMode
                ? t("Save")
                : t("Create offer")}
          </button>
        </div>

        {isEditMode && !offer && fetching ? (
          <div className="offer-view__loading">
            <div className="spinner-border text-primary" role="status" />
            <div className="offer-view__loading-text">{t("Loading...")}</div>
          </div>
        ) : (
          <div className="offer-editor-simple__card">
            <OfferViewCard
              offer={form}
              mode="edit"
              onChange={onChange}
              disabled={disabled}
            />
          </div>
        )}

        {timeInvalid && (
          <div className="offer-editor-simple__error mt-3">
            {t("End time must be later than start time.")}
          </div>
        )}
      </div>
    </PageLayout>
  );
}