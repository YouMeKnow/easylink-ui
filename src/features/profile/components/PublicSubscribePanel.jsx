// src/features/profile/components/PublicSubscribePanel.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectVibeModalWithLogic from "@/features/VibeViewForCustomers/SelectVibeModalWithLogic";
import "@/features/profile/styles/PublicSubscribePanel.css";

export default function PublicSubscribePanel({
  t,
  vibeId,
  subscriberCount = 0,
  followingCount = 0,
  subscriberVibes = [],
  authed,
  onRefresh,

  // ✅ new
  hasAccess = true,
  subscriptionStatus = null, // "APPROVED" | "PENDING" | null
}) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const alreadySubscribedVibeIds = useMemo(() => {
    if (!Array.isArray(subscriberVibes)) return [];
    return subscriberVibes.map((v) => v?.id).filter(Boolean);
  }, [subscriberVibes]);

  const isApproved = subscriptionStatus === "APPROVED";
  const isPending = subscriptionStatus === "PENDING";

  // fallback for old logic (public vibes)
  const isSubscribed = isApproved || alreadySubscribedVibeIds.length > 0;

  const openSubscribe = () => {
    if (!vibeId) return;

    if (!authed) {
      navigate(`/signin?redirectTo=/view/${vibeId}&subscribe=true`);
      return;
    }

    // pending => nothing to do
    if (isPending) return;

    setShowModal(true);
  };

  const canOpenNetwork = hasAccess !== false;

  const goFollowers = () => {
    if (!vibeId) return;
    if (!canOpenNetwork) return;

    const target = `/view/${vibeId}/network/followers`;

    if (!authed) {
      navigate(`/signin?redirectTo=${target}`);
      return;
    }

    navigate(target);
  };

  const goFollowing = () => {
    if (!vibeId) return;
    if (!canOpenNetwork) return;

    const target = `/view/${vibeId}/network/following`;

    if (!authed) {
      navigate(`/signin?redirectTo=${target}`);
      return;
    }

    navigate(target);
  };

  const title =
    t?.("Connections", { defaultValue: "Connections" }) || "Connections";
  const followersLabel =
    t?.("Followers", { defaultValue: "Followers" }) || "Followers";
  const followingLabel =
    t?.("Following", { defaultValue: "Following" }) || "Following";

  const subscribeLabel = t?.("Subscribe", { defaultValue: "Subscribe" }) || "Subscribe";
  const manageLabel = t?.("Manage", { defaultValue: "Manage" }) || "Manage";
  const requestedLabel =
    t?.("Requested", { defaultValue: "Requested" }) || "Requested";

  const buttonText = !authed
    ? subscribeLabel
    : isPending
      ? requestedLabel
      : isSubscribed
        ? manageLabel
        : subscribeLabel;

  const buttonDisabled = authed && isPending;

  const buttonClass = buttonDisabled
    ? "btn btn-outline-secondary public-subscribe__btn"
    : !authed
      ? "btn btn-outline-primary public-subscribe__btn"
      : isSubscribed
        ? "btn btn-outline-primary public-subscribe__btn"
        : "btn btn-primary public-subscribe__btn";

  return (
    <>
      <div className="card mb-3 public-subscribe">
        <div className="card-body">
          <div
            className="public-subscribe__links"
            role="navigation"
            aria-label={title}
          >
            <button
              type="button"
              className="public-subscribe__stat"
              onClick={goFollowers}
              disabled={!canOpenNetwork}
              title={
                canOpenNetwork
                  ? followersLabel
                  : t?.("private_network_locked", { defaultValue: "Private" }) ||
                    "Private"
              }
            >
              <span className="public-subscribe__statNum">{subscriberCount}</span>
              <span className="public-subscribe__statLabel">{followersLabel}</span>
            </button>

            <button
              type="button"
              className="public-subscribe__stat"
              onClick={goFollowing}
              disabled={!canOpenNetwork}
              title={
                canOpenNetwork
                  ? followingLabel
                  : t?.("private_network_locked", { defaultValue: "Private" }) ||
                    "Private"
              }
            >
              <span className="public-subscribe__statNum">{followingCount}</span>
              <span className="public-subscribe__statLabel">{followingLabel}</span>
            </button>
          </div>

          <div className="public-subscribe__cta">
            <button
              type="button"
              className={buttonClass}
              onClick={openSubscribe}
              disabled={buttonDisabled}
            >
              {buttonText}
              {authed && isSubscribed && !isPending && (
                <span className="public-subscribe__count">
                  {alreadySubscribedVibeIds.length}
                </span>
              )}
            </button>

            <div className="public-subscribe__hint">
              {!authed
                ? t?.("You’ll be redirected to sign in", {
                    defaultValue: "You’ll be redirected to sign in",
                  }) || "You’ll be redirected to sign in"
                : isPending
                  ? t?.("request_pending_hint", {
                      defaultValue: "Your request is pending approval.",
                    }) || "Your request is pending approval."
                  : t?.("Choose a vibe to subscribe", {
                      defaultValue: "Choose a vibe to subscribe",
                    }) || "Choose a vibe to subscribe"}
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}