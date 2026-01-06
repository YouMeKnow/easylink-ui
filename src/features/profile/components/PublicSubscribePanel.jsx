import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectVibeModalWithLogic from "@/features/VibeViewForCustomers/SelectVibeModalWithLogic";
import SubscribersModal from "@/features/vibes/interactions/SubscribersModal";
import "@/features/profile/styles/PublicSubscribePanel.css";

export default function PublicSubscribePanel({
  t,
  vibeId,
  subscriberCount = 0,
  subscriberVibes = [],
  authed,
  onRefresh,
}) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSubscribers, setShowSubscribers] = useState(false);

  const alreadySubscribedVibeIds = useMemo(() => {
    if (!Array.isArray(subscriberVibes)) return [];
    return subscriberVibes.map((v) => v?.id).filter(Boolean);
  }, [subscriberVibes]);

  const isSubscribed = alreadySubscribedVibeIds.length > 0;

  const subscribedNames = useMemo(() => {
    if (!Array.isArray(subscriberVibes)) return [];
    return subscriberVibes.map((v) => v?.name || "Unnamed").filter(Boolean);
  }, [subscriberVibes]);

  const namesPreview = useMemo(() => {
    const max = 2;
    const head = subscribedNames.slice(0, max);
    const rest = subscribedNames.length - head.length;
    return { head, rest };
  }, [subscribedNames]);

  const openSubscribe = () => {
    if (!vibeId) return;

    if (!authed) {
      navigate(`/signin?redirectTo=/view/${vibeId}&subscribe=true`);
      return;
    }

    setShowModal(true);
  };

  const openSubscribers = () => {
    if (!vibeId) return;

    if (!authed) {
      navigate(`/signin?redirectTo=/view/${vibeId}&openSubscribers=true`);
      return;
    }

    setShowSubscribers(true);
  };

  const title =
    t?.("Subscriptions", { defaultValue: "Subscriptions" }) || "Subscriptions";
  const subscribeLabel =
    t?.("Subscribe", { defaultValue: "Subscribe" }) || "Subscribe";
  const manageLabel = t?.("Manage", { defaultValue: "Manage" }) || "Manage";
  const notSubscribed =
    t?.("Not subscribed", { defaultValue: "Not subscribed" }) || "Not subscribed";
  const subscribed =
    t?.("Subscribed", { defaultValue: "Subscribed" }) || "Subscribed";
  const subscribersLabel =
    t?.("subscribers", { defaultValue: "subscribers" }) || "subscribers";
  const chooseVibeHint =
    t?.("Choose a vibe to subscribe", { defaultValue: "Choose a vibe to subscribe" }) ||
    "Choose a vibe to subscribe";
  const signInHint =
    t?.("You’ll be redirected to sign in", { defaultValue: "You’ll be redirected to sign in" }) ||
    "You’ll be redirected to sign in";

  const buttonText = !authed ? subscribeLabel : isSubscribed ? manageLabel : subscribeLabel;

  const buttonClass = !authed
    ? "btn btn-outline-primary public-subscribe__btn"
    : isSubscribed
      ? "btn btn-outline-primary public-subscribe__btn"
      : "btn btn-primary public-subscribe__btn";

  return (
    <>
      <div className="card mb-3 public-subscribe">
        <div className="card-body">
          {/* HEADER */}
          <div className="public-subscribe__head">
            <div className="public-subscribe__title">{title}</div>

            <div className="public-subscribe__badge">
              {isSubscribed ? subscribed : notSubscribed}
            </div>
          </div>

          {/* META (clickable -> subscribers modal) */}
          <div
            className="public-subscribe__meta public-subscribe__meta--clickable"
            role="button"
            tabIndex={0}
            onClick={openSubscribers}
            onKeyDown={(e) => e.key === "Enter" && openSubscribers()}
            aria-label={
              t?.("View subscribers", { defaultValue: "View subscribers" }) ||
              "View subscribers"
            }
            title={
              t?.("View subscribers", { defaultValue: "View subscribers" }) ||
              "View subscribers"
            }
          >
            <div className="public-subscribe__metaLeft">
              <span className="public-subscribe__metaIcon" aria-hidden="true">👥</span>
              <div className="public-subscribe__metaText">
                <div className="public-subscribe__metaTop">
                  <strong className="public-subscribe__metaCount">{subscriberCount}</strong>
                  <span className="public-subscribe__metaLabel">{subscribersLabel}</span>

                  {isSubscribed && (
                    <>
                      <span className="public-subscribe__dot">•</span>
                      <span className="public-subscribe__metaNames">
                        {namesPreview.head.join(", ")}
                        {namesPreview.rest > 0 && ` +${namesPreview.rest}`}
                      </span>
                    </>
                  )}
                </div>

                <div className="public-subscribe__metaHint">
                  {t?.("Tap to view subscribers", { defaultValue: "Tap to view subscribers" }) ||
                    "Tap to view subscribers"}
                </div>
              </div>
            </div>

            <span className="public-subscribe__chev" aria-hidden="true">›</span>
          </div>

          {/* CTA */}
          <div className="public-subscribe__cta">
            <button type="button" className={buttonClass} onClick={openSubscribe}>
              {buttonText}
              {authed && isSubscribed && (
                <span className="public-subscribe__count">
                  {alreadySubscribedVibeIds.length}
                </span>
              )}
            </button>

            <div className="public-subscribe__hint">
              {authed ? chooseVibeHint : signInHint}
            </div>
          </div>
        </div>
      </div>

      {/* SUBSCRIBE MODAL */}
      {showModal && (
        <SelectVibeModalWithLogic
          t={t}
          targetVibeId={vibeId}
          alreadySubscribedVibeIds={alreadySubscribedVibeIds}
          onCancel={() => setShowModal(false)}
          onSubscribed={() => {
            setShowModal(false);
            onRefresh?.();
          }}
        />
      )}

      {/* SUBSCRIBERS LIST MODAL */}
      {showSubscribers && (
        <SubscribersModal
          t={t}
          vibeId={vibeId}
          onClose={() => setShowSubscribers(false)}
        />
      )}
    </>
  );
}
