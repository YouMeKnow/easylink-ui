import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ReviewCard from "./ReviewCard";
import "./Review.css";

function decodeJwtPayload(token) {
  try {
    const p = token.split(".")[1];
    const json = atob(p.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function displayName(user, token, t) {
  const u = user?.username?.trim();
  if (u) return u;

  const em = user?.email?.trim();
  if (em) return em;

  const payload = token ? decodeJwtPayload(token) : null;
  const fromToken =
    payload?.username ||
    payload?.preferred_username ||
    payload?.email ||
    payload?.sub;

  return (fromToken && String(fromToken).trim()) || t("anonymous");
}

function Review() {
  const [text, setText] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [reviews, setReviews] = React.useState([]);
  const [rating, setRating] = React.useState(5);
  const [loadingReviews, setLoadingReviews] = React.useState(false);
  const [posting, setPosting] = React.useState(false);

  const { user, isAuthenticated } = useAuth();
  const reviewsEndRef = React.useRef(null);

  const { t, i18n } = useTranslation("review");

  const token = localStorage.getItem("jwt");
  const API_URL = "/api/v3/reviews";
  const [errorMessage, setErrorMessage] = React.useState("");

  const formatDate = (iso) =>
    new Intl.DateTimeFormat(i18n.language || undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));

  const scrollToBottom = (smooth = false) => {
    reviewsEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  React.useEffect(() => {
    loadReviews();
  }, []);

  React.useEffect(() => {
    scrollToBottom(false);
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert(t("must_login"));
      return;
    }
    const message = text.trim();
    if (!message) return;

    const newReview = {
      username: displayName(user, token, t),
      content: message,
      createdAt: new Date().toISOString(),
      rating,
      location: user?.location || "",
      avatarUrl: user?.avatarUrl || "https://via.placeholder.com/64",
    };

    try {
      setPosting(true);
      setErrorMessage("");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;

        try {
          const data = await res.json();        
          msg = data?.message || data?.error || msg;
        } catch {
          msg = await res.text();               
        }

        throw new Error(msg);
      }

      await res.json();
      await loadReviews();

      setSubmitted(true);
      setText("");
      setRating(5);

      setTimeout(() => setSubmitted(false), 3000);
      scrollToBottom(true);
    } catch (err) {
      console.error("Error posting review:", err);
      setErrorMessage(err.message);
    } finally {
      setPosting(false);
    }
  };

  const isSubmitDisabled = posting || !text.trim();

  return (
    <div className="reviewPage container py-5">
      <div className="reviewWrap">
        <h2 className="reviewTitle">{t("title")}</h2>

        <div className="reviewList glass">
          {loadingReviews ? (
            <div className="reviewHint">{t("loading")}</div>
          ) : reviews.length === 0 ? (
            <div className="reviewHint">{t("empty")}</div>
          ) : (
            reviews.map((review, index) => (
              <div key={index}>
                <ReviewCard
                  avatarUrl={review.avatarUrl || "https://via.placeholder.com/64"}
                  text={review.content}
                  rating={review.rating || 5}
                  author={review.username || t("anonymous")}
                  date={
                    review.createdAt
                      ? formatDate(review.createdAt)
                      : formatDate(new Date().toISOString())
                  }
                  location={review.location || ""}
                />
                <div ref={index === reviews.length - 1 ? reviewsEndRef : null} />
              </div>
            ))
          )}
        </div>

        <h4 className="reviewSubtitle">{t("leave")}</h4>

        <form onSubmit={handleSubmit} className="reviewForm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("placeholder")}
            className="reviewTextarea"
            disabled={posting}
          />

          <div className="reviewRating" role="group" aria-label={t("rating_label")}>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`reviewStar ${active ? "isActive" : ""}`}
                  aria-label={t("rating_star", { count: star })}
                  aria-pressed={active}
                  disabled={posting}
                >
                  ★
                </button>
              );
            })}
          </div>

          <button type="submit" className="reviewSubmitBtn" disabled={isSubmitDisabled}>
            {posting ? t("submitting") : t("submit")}
          </button>
        </form>

        {submitted && <p className="reviewOk">{t("thank_you")}</p>}
        {errorMessage && <p className="reviewErr">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Review;
