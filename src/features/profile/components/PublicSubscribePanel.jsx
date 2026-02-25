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
}) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const alreadySubscribedVibeIds = useMemo(() => {
    if (!Array.isArray(subscriberVibes)) return [];
    return subscriberVibes.map((v) => v?.id).filter(Boolean);
  }, [subscriberVibes]);

  const isSubscribed = alreadySubscribedVibeIds.length > 0;

  const openSubscribe = () => {
    if (!vibeId) return;

    if (!authed) {
      navigate(`/signin?redirectTo=/view/${vibeId}&subscribe=true`);
      return;
    }

    setShowModal(true);
  };

  const goFollowers = () => {
    if (!vibeId) return;

    const target = `/view/${vibeId}/network/followers`;

    if (!authed) {
      navigate(`/signin?redirectTo=${target}`);
      return;
    }

    navigate(target);
  };

  const goFollowing = () => {
    if (!vibeId) return;

    const target = `/view/${vibeId}/network/following`;

    if (!authed) {
      navigate(`/signin?redirectTo=${target}`);
      return;
    }

    navigate(target);
  };

  const title = t?.("Connections", { defaultValue: "Connections" }) || "Connections";
  const followersLabel = t?.("Followers", { defaultValue: "Followers" }) || "Followers";
  const followingLabel = t?.("Following", { defaultValue: "Following" }) || "Following";

  const subscribeLabel = t?.("Subscribe", { defaultValue: "Subscribe" }) || "Subscribe";
  const manageLabel = t?.("Manage", { defaultValue: "Manage" }) || "Manage";
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

          {/* LINKS ROW */}
          <div className="public-subscribe__links" role="navigation" aria-label="Connections">
            <button type="button" className="public-subscribe__stat" onClick={goFollowers}>
              <span className="public-subscribe__statNum">{subscriberCount}</span>
              <span className="public-subscribe__statLabel">{followersLabel}</span>
            </button>

            <button type="button" className="public-subscribe__stat" onClick={goFollowing}>
              <span className="public-subscribe__statNum">{followingCount}</span>
              <span className="public-subscribe__statLabel">{followingLabel}</span>
            </button>
          </div>

          {/* CTA */}
          <div className="public-subscribe__cta">
            <button type="button" className={buttonClass} onClick={openSubscribe}>
              {buttonText}
              {authed && isSubscribed && (
                <span className="public-subscribe__count">{alreadySubscribedVibeIds.length}</span>
              )}
            </button>

            <div className="public-subscribe__hint">
              {authed
                ? (t?.("Choose a vibe to subscribe", { defaultValue: "Choose a vibe to subscribe" }) ||
                  "Choose a vibe to subscribe")
                : (t?.("You’ll be redirected to sign in", { defaultValue: "You’ll be redirected to sign in" }) ||
                  "You’ll be redirected to sign in")}
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