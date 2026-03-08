// src/features/vibes/UserVibes.jsx
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useUserVibes from "@/features/vibes/hooks/useUserVibes";
import HeaderActions from "./components/HeaderActions";
import VibesList from "./components/VibesList";
import Loader from "./components/Loader";
import { useTranslation } from "react-i18next";
import "./styles/UserVibes.css";
import ShareModal from "@/features/vibes/components/ShareModal";

export default function UserVibes() {
  const { t } = useTranslation("myvibes");
  const { isAuthenticated } = useAuth();

  const { vibes, loading, remove, setLoading } = useUserVibes({
    enabled: isAuthenticated,
  });

  const [shareVibe, setShareVibe] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleDelete = async (vibeId) => {
    if (!window.confirm(t("delete_confirm"))) return;
    setLoading(true);
    try {
      await remove(vibeId);
    } catch (err) {
      console.error(err);
      alert(t("toast_error") ?? "Error: " + (err?.message || "unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (vibe) => {
    setShareVibe(vibe);
    setCopied(false);
  };

  const handleCloseShare = () => {
    setShareVibe(null);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!shareVibe) return;
    const link = `${window.location.origin}/view/${shareVibe.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main
      className="container myvibes py-5"
      style={{
        paddingLeft: "max(16px, env(safe-area-inset-left))",
        paddingRight: "max(16px, env(safe-area-inset-right))",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
      }}
      aria-labelledby="myvibes-title"
    >
      <HeaderActions />

      <h1 id="myvibes-title" className="visually-hidden">
        {t("title", "My Vibes")}
      </h1>

      {loading ? (
        <Loader />
      ) : vibes.length === 0 ? (
        <div className="text-center text-muted mt-4">
          <div>{t("no_vibes")}</div>
          <div className="small">{t("no_vibes_hint")}</div>
        </div>
      ) : (
        <section className="vibes-grid" role="list" aria-label={t("list_aria", "Your vibes")}>
          <VibesList vibes={vibes} onDelete={handleDelete} onShare={handleShare} />
        </section>
      )}

      <ShareModal
        show={!!shareVibe}
        onClose={handleCloseShare}
        shareUrl={shareVibe ? `${window.location.origin}/view/${shareVibe.id}` : ""}
        copied={copied}
        onCopy={handleCopy}
      />
    </main>
  );
}
