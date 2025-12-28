import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function EmailVerificationSentPage() {
  const [params] = useSearchParams();
  const email = params.get("email");

  const next = params.get("next") || params.get("redirectTo") || "";

  const subscribe = params.get("subscribe"); 

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/auth/resend-verification", { email });
      setMessage("✅ Verification email resent!");
    } catch (err) {
      setMessage("❌ Failed to resend. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", padding: "2rem" }}>
      <div
        className="container"
        style={{
          maxWidth: "500px",
          margin: "60px auto 0 auto",
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: "#fefefe",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
          textAlign: "center",
          borderTop: "4px solid #0d6efd",
        }}
      >
        <div className="mb-3">
          <i className="bi bi-envelope-paper-fill text-primary" style={{ fontSize: "3rem" }} />
        </div>

        <h2 className="text-primary mb-3">Verification Email Sent</h2>

        <p className="text-muted">We sent a verification link to:</p>
        <p className="fw-semibold text-dark mb-3">{email || "your email"}</p>

        <p className="text-secondary">
          Please check your inbox and click the link to activate your account.
        </p>

        <div className="d-grid mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={handleResend}
            disabled={loading || !email}
          >
            {loading ? "Sending..." : "Resend Email"}
          </button>
        </div>

        {message && <div className="mt-3 text-info small">{message}</div>}

        <div className="mt-4 text-muted small" style={{ opacity: 0.7 }}>
          {next ? <>After verification you’ll continue to: <strong>{next}</strong></> : null}
          {subscribe === "true" ? <> · subscribe</> : null}
        </div>
      </div>
    </div>
  );
}
