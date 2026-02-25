import React from "react";

export default function NetworkTabs({ active, onFollowers, onFollowing }) {
  return (
    <div className="network-tabs" role="tablist" aria-label="Network tabs">
      <button
        type="button"
        role="tab"
        aria-selected={active === "followers"}
        className={`network-tabs__tab ${active === "followers" ? "is-active" : ""}`}
        onClick={onFollowers}
      >
        Followers
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={active === "following"}
        className={`network-tabs__tab ${active === "following" ? "is-active" : ""}`}
        onClick={onFollowing}
      >
        Following
      </button>
    </div>
  );
}