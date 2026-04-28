import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

export default function EmailVerified() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/signin");
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", padding: "2rem" }}>
      <div
        className="container"
        style={{
          maxWidth: "500px",
          marginTop: "60px",
          marginBottom: "auto",
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: "#fefefe",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
          textAlign: "center",
          borderTop: "4px solid #198754", // Bootstrap success green
        }}
      >
        <div className="mb-3">
          <i
            className="bi bi-check-circle-fill text-success"
            style={{ fontSize: "3rem" }}
          ></i>
        </div>

        <h2 className="text-success mb-3">Email Verified!</h2>

        <p className="text-secondary">
          Your email has been successfully verified.
        </p>
        <p className="text-muted small mb-3">
          Redirecting to sign-in in <strong>{countdown}</strong> seconds...
        </p>

        <div className="d-grid">
          <button
            className="btn btn-success"
            onClick={() => navigate("/signin")}
          >
            Go to Sign In Now
          </button>
        </div>

        <div className="progress mt-4" style={{ height: "6px" }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${(4 - countdown) * 25}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
