//it's just a placeholder avatar component
import React from "react";
import "./UserAvatar.css";

export default function UserAvatar({ size = 46 }) {
  return (
    <div
      className="userAvatar"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="12" className="userAvatar__bg" />
        <path
          d="M12 12.5c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
          className="userAvatar__icon"
        />
        <path
          d="M6.5 18.2c.9-2.3 3-3.7 5.5-3.7s4.6 1.4 5.5 3.7"
          className="userAvatar__icon"
        />
      </svg>
    </div>
  );
}