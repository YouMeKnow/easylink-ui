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
  const [tab, setTab] = useState("business");
  const TabPanel = useMemo(() => {
    if (tab === "personal") return PanelPersonal;
    if (tab === "business") return PanelBusiness;
    return PanelOther;
  }, [tab]);

  const [showDemo, setShowDemo] = useState(false);
  const shouldReduce = useReducedMotion();
  const cardMouse = useTiltOnHover({ maxDeg: 2, liftPx: 2 });
  
  // --- helpers ---
  const tabToType = (t) =>
    t === "personal" ? "PERSONAL" : t === "event" ? "EVENT" : "BUSINESS";

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
    return () => { body.style.overflow = prev; };
  }, [showDemo]);

  // ESC closes drawer
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setShowDemo(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="home" role="main">
      <motion.section
        className="hero"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        aria-labelledby="hero-title"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") handleGetStarted(); }}
      >
        <div className="hero-bg" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-shell">
            <motion.h1 id="hero-title" className="hero__title" variants={fadeUp}>
              <span className="hero__title-gradient">
                {t("headline_prefix", "Your digital identity,")}
                <br className="hide-sm" /> {t("headline_suffix", "beautifully simple")}
              </span>
            </motion.h1>

            <motion.p className="hero__subtitle" variants={fadeUp}>
              {t("subheadline", "Create a Vibe — a fast, shareable profile with passwordless login and built-in analytics.")}
            </motion.p>

            <div className="heroCtaHit">
              <motion.a
                href="#"
                role="button"
                tabIndex={0}
                className="heroCta-wrap"
                aria-label={t("get_started", "Get started")}
                title={t("get_started", "Get started")}
                onClick={(e) => {
                  e.preventDefault();
                  handleGetStarted();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleGetStarted();
                  }
                }}
                whileTap={!reduce ? { scale: 0.985 } : undefined}   // hover УБРАЛИ
              >
                <span className="heroCta heroCta--xl">
                  {t("get_started", "Get started")}
                  <span className="heroCta__arrow">→</span>
                </span>
              </motion.a>
            </div>

          </div>
        </div>
      </motion.section>


      <div className="hero__search">
        <VibeSearch autoFocus={false} />
      </div>
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
            {/* Backdrop */}
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

            {/* Panel */}
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
                  {/* simple close icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
            {/* Backdrop */}
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

            {/* Panel */}
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
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
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
      {/* Drawer demo for Event */}
      <AnimatePresence>
        {tab === "other" && showDemo && (
          <>
            {/* Backdrop */}
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

            {/* Panel */}
            <motion.aside
              key="demo-panel-event"
              className="demo-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Event Vibe live demo"
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
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
