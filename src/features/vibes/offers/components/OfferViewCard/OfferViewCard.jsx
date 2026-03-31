import React from "react";
import { useTranslation } from "react-i18next";
import "./OfferViewCard.css";

function formatDate(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const toInputLocal = (v) => {
  if (!v) return "";

  if (
    typeof v === "string" &&
    v.length >= 16 &&
    v.includes("T") &&
    !v.includes("Z")
  ) {
    return v.slice(0, 16);
  }

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const fromInputLocalToLocal = (dtLocal) => {
  return dtLocal || null;
};

export default function OfferViewCard({
  offer,
  mode = "view",
  onChange,
  disabled = false,
}) {
  const { t } = useTranslation();

  if (!offer) return null;

  const isEdit = mode === "edit";

  const patch = (p) => {
    if (!isEdit) return;
    onChange?.(p);
  };

  const isFixed = offer.discountType === "FIXED";
  const isDynamic = offer.discountType === "DYNAMIC";
  const isPercentLike =
    offer.discountType === "PERCENTAGE" || offer.discountType === "DYNAMIC";
  const suffix = isFixed ? "$" : "%";

  const numberStep = isFixed ? 0.5 : 1;
  const percentMax = isPercentLike ? 100 : undefined;

  if (!isEdit) {
    const discountTypeText =
      offer.discountType === "FIXED"
        ? t("Fixed amount")
        : offer.discountType === "PERCENTAGE"
          ? t("Percentage")
          : t("Dynamic");

    return (
      <div className="offer-simple">
        <div className="offer-simple__card offer-simple__card--view">
          <div className="offer-simple__hero">
            <div className="offer-simple__heroMain">
              <h3 className="offer-simple__title">{offer.title || "—"}</h3>

              <div className="offer-simple__heroMeta">
                <span className="offer-simple__typePill">{discountTypeText}</span>
              </div>

              <div className="offer-simple__descBox">
                <div className="offer-simple__label">{t("Description")}</div>
                <div className="offer-simple__value">
                  {offer.description?.trim() || "—"}
                </div>
              </div>
            </div>

            <div className="offer-simple__discountCard">
              <div className="offer-simple__discountLabel">{t("Discount")}</div>
              <div className="offer-simple__discountValue">
                {isFixed
                  ? `$${offer.currentDiscount ?? "—"}`
                  : `${offer.currentDiscount ?? "—"}%`}
              </div>
            </div>
          </div>

          <div className="offer-simple__grid">
            <div className="offer-simple__field offer-simple__field--soft">
              <span className="offer-simple__label">{t("Start time")}</span>
              <div className="offer-simple__value">{formatDate(offer.startTime)}</div>
            </div>

            <div className="offer-simple__field offer-simple__field--soft">
              <span className="offer-simple__label">{t("End time")}</span>
              <div className="offer-simple__value">{formatDate(offer.endTime)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="offer-simple">
      <div className="offer-simple__card">
        <div className="offer-simple__section">
          <h3 className="offer-simple__section-title">{t("Offer details")}</h3>

          <label className="offer-simple__fieldBlock">
            <span className="offer-simple__label">{t("Offer title")}</span>
            <input
              className="offer-simple__input"
              value={offer.title ?? ""}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder={t("Example: 20% off lunch")}
              disabled={disabled}
            />
          </label>

          <label className="offer-simple__fieldBlock">
            <span className="offer-simple__label">{t("Description")}</span>
            <textarea
              className="offer-simple__textarea"
              rows={4}
              value={offer.description ?? ""}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder={t("Explain what users get and any conditions")}
              disabled={disabled}
            />
          </label>
        </div>

        <div className="offer-simple__section">
          <h3 className="offer-simple__section-title">{t("Discount")}</h3>

          <div className="offer-simple__grid">
            <label className="offer-simple__fieldBlock">
              <span className="offer-simple__label">{t("Discount type")}</span>
              <select
                className="offer-simple__input"
                value={offer.discountType ?? "DYNAMIC"}
                onChange={(e) => patch({ discountType: e.target.value })}
                disabled={disabled}
              >
                <option value="DYNAMIC">{t("Dynamic")}</option>
                <option value="PERCENTAGE">{t("Percentage")}</option>
                <option value="FIXED">{t("Fixed amount")}</option>
              </select>
            </label>

            <label className="offer-simple__fieldBlock">
              <span className="offer-simple__label">
                {isDynamic ? t("Current discount") : t("Discount value")}
              </span>
              <div className="offer-simple__inputWrap">
                <input
                  className="offer-simple__input"
                  type="number"
                  min={0}
                  max={percentMax}
                  step={numberStep}
                  value={offer.currentDiscount ?? 0}
                  onChange={(e) =>
                    patch({ currentDiscount: Number(e.target.value) || 0 })
                  }
                  disabled={disabled}
                />
                <span className="offer-simple__suffix">{suffix}</span>
              </div>
            </label>
          </div>

          {isDynamic && (
            <div className="offer-simple__subsection">
              <h4 className="offer-simple__subsection-title">
                {t("Automatic decrease")}
              </h4>

              <div className="offer-simple__grid">
                <label className="offer-simple__fieldBlock">
                  <span className="offer-simple__label">{t("Starting discount")}</span>
                  <div className="offer-simple__inputWrap">
                    <input
                      className="offer-simple__input"
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={offer.initialDiscount ?? 0}
                      onChange={(e) =>
                        patch({ initialDiscount: Number(e.target.value) || 0 })
                      }
                      disabled={disabled}
                    />
                    <span className="offer-simple__suffix">%</span>
                  </div>
                </label>

                <label className="offer-simple__fieldBlock">
                  <span className="offer-simple__label">{t("Decrease by")}</span>
                  <div className="offer-simple__inputWrap">
                    <input
                      className="offer-simple__input"
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={offer.decreaseStep ?? 0}
                      onChange={(e) =>
                        patch({ decreaseStep: Number(e.target.value) || 0 })
                      }
                      disabled={disabled}
                    />
                    <span className="offer-simple__suffix">%</span>
                  </div>
                </label>

                <label className="offer-simple__fieldBlock">
                  <span className="offer-simple__label">{t("Every X minutes")}</span>
                  <input
                    className="offer-simple__input"
                    type="number"
                    min={1}
                    step={1}
                    value={offer.decreaseIntervalMinutes ?? 0}
                    onChange={(e) =>
                      patch({
                        decreaseIntervalMinutes: Number(e.target.value) || 0,
                      })
                    }
                    placeholder={t("Example: 30")}
                    disabled={disabled}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="offer-simple__section">
          <h3 className="offer-simple__section-title">{t("Schedule")}</h3>

          <div className="offer-simple__grid">
            <label className="offer-simple__fieldBlock">
              <span className="offer-simple__label">{t("Start time")}</span>
              <input
                className="offer-simple__input"
                type="datetime-local"
                value={toInputLocal(offer.startTime)}
                onChange={(e) =>
                  patch({ startTime: fromInputLocalToLocal(e.target.value) })
                }
                disabled={disabled}
              />
            </label>

            <label className="offer-simple__fieldBlock">
              <span className="offer-simple__label">{t("End time")}</span>
              <input
                className="offer-simple__input"
                type="datetime-local"
                value={toInputLocal(offer.endTime)}
                onChange={(e) =>
                  patch({ endTime: fromInputLocalToLocal(e.target.value) })
                }
                disabled={disabled}
              />
            </label>
          </div>

          <label className="offer-simple__toggle offer-simple__toggle--switch">
            <input
              type="checkbox"
              checked={!!offer.active}
              onChange={(e) => patch({ active: e.target.checked })}
              disabled={disabled}
            />
            <span className="offer-simple__switchUi" />
            <span>{t("Offer is active and visible to users")}</span>
          </label>
        </div>
      </div>
    </div>
  );
}