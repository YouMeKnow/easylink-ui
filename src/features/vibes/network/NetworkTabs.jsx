import React from "react";

export default function NetworkTabs({
  active,
  followersLabel,
  followingLabel,
  requestsLabel,
  showRequests,
  onFollowers,
  onFollowing,
  onRequests,
  loading,
}) {
  return (
    <div className={`network-tabs ${showRequests ? "network-tabs--3" : "network-tabs--2"}`}>
      <button
        type="button"
        className={`network-tabs__tab ${active === "followers" ? "is-active" : ""}`}
        onClick={onFollowers}
        disabled={loading}
      >
        {followersLabel}
      </button>

      <button
        type="button"
        className={`network-tabs__tab ${active === "following" ? "is-active" : ""}`}
        onClick={onFollowing}
        disabled={loading}
      >
        {followingLabel}
      </button>

      {showRequests && (
        <button
          type="button"
          className={`network-tabs__tab ${active === "requests" ? "is-active" : ""}`}
          onClick={onRequests}
          disabled={loading}
        >
          {requestsLabel}
        </button>
      )}
    </div>
  );
}