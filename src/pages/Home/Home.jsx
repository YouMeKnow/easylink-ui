import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import SegmentedTabs from "./components/SegmentedTabs";
import PanelPersonal from "./components/PanelPersonal";
import PanelBusiness from "./components/PanelBusiness";
import PanelOther from "./components/PanelOther";

import useTiltOnHover from "./hooks/useTiltOnHover";
import "../styles/Home.css";

import BusinessVibeDemo from "@/features/vibes/forms/business/BusinessVibeDemo";
import PersonalVibeDemo from "@/features/vibes/forms/personal/PersonalVibeDemo";
import EventVibeDemo from "@/features/vibes/forms/events/EventVibeDemo";
import VibeSearch from "@/components/common/VibeSearch";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};
const scaleTap = { whileTap: { scale: 0.985 } };

export default function Home() {
  const { isAuthenticated = false } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("home");
  const reduce = useReducedMotion();
  const shouldReduce = useReducedMotion();

  const [tab, setTab] = useState("business");
  const TabPanel = useMemo(() => {
    if (tab === "personal") return PanelPersonal;
    if (tab === "business") return PanelBusiness;
    return PanelOther;
  }, [tab]);

  const [showDemo, setShowDemo] = useState(false);
  const cardMouse = useTiltOnHover({ maxDeg: 2, liftPx: 2 });

  // --- helpers ---
  const tabToType = (tt) =>
    tt === "personal" ? "PERSONAL" : tt === "event" ? "EVENT" : "BUSINESS";

  // --- get started button ---
  const handleGetStarted = useCallback(() => {
    if (isAuthenticated) {
      navigate("/create-vibe");
    } else {
      navigate(`/signin?redirectTo=${encodeURIComponent("/create-vibe")}`);
    }
  }, [isAuthenticated, navigate]);

  const handleCreateThisVibe = useCallback(() => {
    const type = tabToType(tab);
    const target = `/create-vibe?type=${type}`;
    if (isAuthenticated) {
      navigate(target);
    } else {
      navigate(`/signin?redirectTo=${encodeURIComponent(target)}`);
    }
  }, [isAuthenticated, navigate, tab]);

  // close drawer if tab changes from business
  useEffect(() => {
    if (tab !== "business") setShowDemo(false);
  }, [tab]);

  // lock body scroll when drawer is open
  useEffect(() => {
    if (!showDemo) return;
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [showDemo]);

  // ESC closes drawer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowDemo(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="home" role="main">
      {/* HERO (instagram-like: left copy, right device preview) */}
      <motion.section
        className="hero hero--ig"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        aria-labelledby="hero-title"
      >
        <div className="hero-inner">
          <div className="hero-ig">
            {/* LEFT */}
            <div className="hero-ig__left">
              <motion.h1 id="hero-title" className="hero-ig__title" variants={fadeUp}>
                {t("headline_prefix", "Your digital identity,")}
                <br className="hide-sm" />
                <span className="hero__title-gradient">
                  {t("headline_suffix", "beautifully simple")}
                </span>
              </motion.h1>
              <motion.p className="hero-ig__sub" variants={fadeUp}>
                {t(
                  "subheadline",
                  "Create a Vibe — a shareable profile with passwordless login and built-in analytics."
                )}
              </motion.p>

              <motion.div className="hero-ig__actions" variants={fadeUp}>
                <button
                  type="button"
                  className="btn-cta btn-cta--pill btn-cta--lg"
                  onClick={handleGetStarted}
                >
                  {t("get_started", "Get started")} →
                </button>

                <button
                  type="button"
                  className="btn-link-ghost btn-link-ghost--pill"
                  onClick={() => navigate("/about")}
                >
                  {t("learn_more", "How it works")}
                </button>
              </motion.div>
            </div>

            {/* RIGHT */}
            <motion.div className="hero-ig__right" variants={fadeUp} aria-hidden="true">
            <div className="hero-media">
              <img
                src="/home_page/example3.png"
                alt=""
                className="hero-media__img"
                loading="eager"
                decoding="async"
              />
            </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Search — empty visual block (WIP) */}
      <section className="search-stage">
        <div className="search-stage__shell">
          <div className="search-stage__inner">
            {/* LEFT */}
            <div className="search-stage__left">
              <h2 className="search-stage__title">
                {t("search.title")}
              </h2>

              <p className="search-stage__desc">
                {t("search.description")}
              </p>

              <VibeSearch autoFocus={false} />
            </div>

            {/* RIGHT */}
            <div className="search-stage__right" aria-hidden="true">
              <img
                className="search-stage__img"
                src="/home_page/search/hero.png"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
            </div>
        </div>
      </section>

      {/* Visual divider between sections */}
      <div className="home__divider" aria-hidden="true" />

      {/* Tabs section */}
      <motion.section
        className="container-xxl px-3 px-md-4 home__explore"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="glass p-3 p-md-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3">
            <h2 className="m-0">{t("explore_types", "Explore Vibe types")}</h2>
            <SegmentedTabs
              value={tab}
              onChange={setTab}
              ariaLabel={t("explore_types", "Explore Vibe types")}
              labels={{
                personal: t("tab_personal", "Personal"),
                business: t("tab_business", "Business"),
                other: t("tab_other", "Other"),
              }}
            />
          </div>

          <div className="mt-3 mt-md-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <TabPanel cardMouse={cardMouse} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="cta-row">
            <motion.button
              {...scaleTap}
              onClick={handleCreateThisVibe}
              className="btn-cta btn-cta--pill btn-cta--lg"
              whileHover={!shouldReduce ? { y: -1 } : undefined}
            >
              {t("cta_build", "Create this Vibe")}
            </motion.button>

            <button
              type="button"
              className="btn-link-ghost btn-link-ghost--pill"
              onClick={() => setShowDemo(true)}
            >
              {t("cta_demo", "See a live demo")} →
            </button>
          </div>
        </div>
      </motion.section>

      {/* Drawer demo for Business */}
      <AnimatePresence>
        {tab === "business" && showDemo && (
          <>
            <motion.div
              key="demo-backdrop"
              className="demo-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowDemo(false)}
              aria-hidden
            />

            <motion.aside
              key="demo-panel"
              className="demo-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Business Vibe live demo"
            >
              <div className="demo-panel__header">
                <h3 className="m-0">Business Vibe — Live demo</h3>
                <button
                  className="demo-close"
                  onClick={() => setShowDemo(false)}
                  aria-label="Close"
                  autoFocus
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="demo-panel__body">
                <BusinessVibeDemo />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Drawer demo for Personal */}
      <AnimatePresence>
        {tab === "personal" && showDemo && (
          <>
            <motion.div
              key="demo-backdrop-personal"
              className="demo-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowDemo(false)}
              aria-hidden
            />

            <motion.aside
              key="demo-panel-personal"
              className="demo-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Personal Vibe live demo"
            >
              <div className="demo-panel__header">
                <h3 className="m-0">Personal Vibe — Live demo</h3>
                <button
                  className="demo-close"
                  onClick={() => setShowDemo(false)}
                  aria-label="Close"
                  autoFocus
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="demo-panel__body">
                <PersonalVibeDemo />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Drawer demo for Other */}
      <AnimatePresence>
        {tab === "other" && showDemo && (
          <>
            <motion.div
              key="demo-backdrop-event"
              className="demo-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowDemo(false)}
              aria-hidden
            />

            <motion.aside
              key="demo-panel-event"
              className="demo-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Other Vibe live demo"
            >
              <div className="demo-panel__header">
                <h3 className="m-0">Other Vibe — Live demo</h3>
                <button
                  className="demo-close"
                  onClick={() => setShowDemo(false)}
                  aria-label="Close"
                  autoFocus
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="demo-panel__body">
                <EventVibeDemo />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
