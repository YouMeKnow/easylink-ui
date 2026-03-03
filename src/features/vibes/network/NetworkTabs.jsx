import React from "react";

export default function NetworkTabs({
  active,
  onFollowers,
  onFollowing,
  followersLabel = "Followers",
  followingLabel = "Following",
}) {
  return (
    <div className="network-tabs" role="tablist" aria-label="Network tabs">
      <button
        type="button"
        role="tab"
        aria-selected={active === "followers"}
        className={`network-tabs__tab ${active === "followers" ? "is-active" : ""}`}
        onClick={onFollowers}
      >
        {followersLabel}
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={active === "following"}
        className={`network-tabs__tab ${active === "following" ? "is-active" : ""}`}
        onClick={onFollowing}
      >
        {followingLabel}
      </button>
    </div>
  );
}