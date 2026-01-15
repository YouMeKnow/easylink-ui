import React from "react";
import "./ReviewCard.css";
import UserAvatar from "@/shared/ui/UserAvatar";

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

function toDate(d) {
  if (d === null || d === undefined) return null;

  if (d instanceof Date) return isValidDate(d) ? d : null;

  if (typeof d === "number" || (typeof d === "string" && /^\d+$/.test(d))) {
    const t = new Date(Number(d));
    return isValidDate(t) ? t : null;
  }

  if (typeof d === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [y, m, day] = d.split("-").map(Number);
      const t = new Date(Date.UTC(y, m - 1, day));
      return isValidDate(t) ? t : null;
    }
    if (/^\d{4}-\d{2}-\d{2}T/.test(d)) {
      const t = new Date(d);
      return isValidDate(t) ? t : null;
    }
    return null;
  }

  return null;
}

function formatDateEnSmart(d) {
  const dt = toDate(d);
  if (!dt) return typeof d === "string" ? d : "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dt);
}

export default function ReviewCard({
  avatarUrl = "https://via.placeholder.com/64",
  text,
  rating = 5,
  author,
  location,
  date,
}) {
  const formattedDate = formatDateEnSmart(date);
  const initial = (author || "?").trim().slice(0, 1).toUpperCase();

  return (
    <div className="reviewCard glass">
      <div className="reviewCard__row">
        <UserAvatar size={46} />
        <div className="reviewCard__body">
          <p className="reviewCard__text">«{text}»</p>

          <div className="reviewCard__meta">
            <div className="reviewCard__stars" aria-label={`Rating: ${rating}/5`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`reviewCard__star ${i <= rating ? "isActive" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="reviewCard__who">
              <span className="reviewCard__author">{author}</span>
              {location ? <span className="reviewCard__dot">•</span> : null}
              {location ? <span className="reviewCard__loc">{location}</span> : null}
            </div>

            {formattedDate ? (
              <div className="reviewCard__date">{formattedDate}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
