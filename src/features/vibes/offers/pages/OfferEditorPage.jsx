import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  useGetOffer,
  useCreateOffer,
  useUpdateOffer,
  OfferViewCard,
} from "@/features/vibes/offers";
import PageLayout from "@/components/common/PageLayout";

export default function OfferEditorPage() {
  const location = useLocation();
  const subscriberVibeId = location.state?.vibeId;

  const { t } = useTranslation();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const { createOffer, loading: creating } = useCreateOffer(token);
  const { offer, loading: fetching } = useGetOffer(id, token); // если у тебя нет loading — просто убери
  const { updateOffer, loading: updating } = useUpdateOffer(token); // если у тебя нет loading — просто убери

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "DYNAMIC",
    initialDiscount: 0,
    currentDiscount: 0,
    decreaseStep: 0,
    decreaseIntervalMinutes: 0,
    active: true,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
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
        startTime: offer.startTime || new Date().toISOString(),
        endTime: offer.endTime || new Date().toISOString(),
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

  const disabled = Boolean(creating || updating);

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
      success = await updateOffer(id, changedFields, token);
    } else {
      success = await createOffer(form, subscriberVibeId);
    }

    if (success) {
      alert(t("Offer saved successfully"));
      navigate(-1);
    } else {
      alert(t("Error saving offer"));
    }
  };

  const offerLike = form;

  return (
    <PageLayout title={t("Offer Details")}>
      <div className="container py-4" style={{ maxWidth: 900 }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h3 className="mb-0">{isEditMode ? t("Edit Offer") : t("Create Offer")}</h3>
              {hasChanges && <span className="badge text-bg-warning">{t("Unsaved changes")}</span>}
              {timeInvalid && <span className="badge text-bg-danger">{t("Invalid time range")}</span>}
            </div>
            <div className="text-muted small mt-1">
              {t("You are editing the real offer card. This is exactly how users will see it.")}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={disabled}>
              {t("Cancel")}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSave}
              disabled={disabled || timeInvalid || (isEditMode && !hasChanges)}
              title={timeInvalid ? t("End time must be after start time") : ""}
            >
              {disabled ? t("Saving...") : isEditMode ? t("Save Changes") : t("Create Offer")}
            </button>
          </div>
        </div>

        {/* skeleton / loading */}
        {isEditMode && !offer && fetching ? (
          <div className="offer-view__loading">
            <div className="spinner-border text-primary" role="status" />
            <div className="offer-view__loading-text">{t("Loading...")}</div>
          </div>
        ) : (
          <OfferViewCard
            offer={offerLike}
            mode="edit"
            onChange={onChange}
            showActions={false}
            disabled={disabled}
          />
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={disabled}>
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onSave}
            disabled={disabled || timeInvalid || (isEditMode && !hasChanges)}
          >
            {disabled ? t("Saving...") : isEditMode ? t("Save Changes") : t("Create Offer")}
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
