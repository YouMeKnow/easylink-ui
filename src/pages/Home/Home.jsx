import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import "../styles/Home.css"
import BusinessVibeDemo from '@/features/vibes/forms/business/BusinessVibeDemo';
import { useAuth } from "@/context/AuthContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const Home = () => {
  const t = (text) => text;
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      id: "all-in-one",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
      ),
      title: t("A mini-website, not a menu"),
      description: t("Basic link trees just show buttons. We let you create a fully interactive page where your audience can deeply engage with your content."),
    },
    {
      id: "privacy",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      ),
      title: t("You control the access"),
      description: t("Share public links with everyone, but keep personal contact info gated behind interactions. Decide exactly who sees what."),
    },
    {
      id: "analytics",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
      ),
      title: t("Powerful Insights"),
      description: t("Track who engages with your Vibe in real-time. Understand your audience and optimize your outreach."),
    },
    {
      id: "qr-sharing",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>
      ),
      title: t("Built for the real world"),
      description: t("Generate sleek, auto-updating QR codes that you can drop on presentations, business cards, or store fronts instantly."),
    }
  ];

  return (
    <main className={`ymk-home-page ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="ymk-page-journey-bg"></div>

      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="glow-blob top-left"></div>
          <div className="glow-blob bottom-right"></div>
          <div className="grid-pattern"></div>
        </div>

        <div className="container hero-container">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 className="hero-title text-gradient" variants={fadeInUp}>
              {t("All your contacts. ")}
              <br className="desktop-break" />
              {t("One simple link.")}
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeInUp}>
              {t("Consolidate your social links, contact info, and portfolio into one premium profile. Share it anywhere with a tap or scan.")}
            </motion.p>

            <motion.div className="hero-actions" variants={fadeInUp}>
              <Link to={isAuthenticated ? "/create-vibe" : "/signin"} className="btn btn-primary btn-xl">
                {t("Create your Vibe")}
                <svg
                  className="hero-btn-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="4" y1="12" x2="18" y2="12" />
                  <polyline points="11 5 18 12 11 19" />
                </svg>
              </Link>
              <Link to="/explore" className="btn btn-secondary btn-xl">
                {t("See examples")}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <BusinessVibeDemo />
          </motion.div>
        </div>
      </section>

      {/* 2 & 3. SHOWCASE SECTIONS (Airy, deep spacing) */}
      <div className="showcases-wrapper">
        <div className="showcase-glow-1"></div>
        <div className="showcase-glow-2"></div>

        {/* SHOWCASE SECTION A (Text Left, Image Right) */}
        <section className="showcase-section">
          <div className="container showcase-container">
            <motion.div
              className="showcase-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div className="eyebrow" variants={fadeInUp}>{t("Limitless Design")}</motion.div>
              <motion.h2 className="section-title showcase-title" variants={fadeInUp}>
                {t("Stop reducing your identity to a boring list of plain buttons.")}
              </motion.h2>
              <motion.p className="section-description showcase-desc" variants={fadeInUp}>
                {t("Basic link trees are dead. YouMeKnow lets you create a fully interactive landing page where your audience can deeply engage with your content. Access premium themes, custom colors, soft glassmorphism, and dynamic animations instantly.")}
              </motion.p>
            </motion.div>

            <motion.div
              className="showcase-image-wrapper"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="image-placeholder">
                <img src="/home_page/showcase-1.png" alt="Rich interactive profile UI" className="placeholder-img" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                <div className="placeholder-fallback">
                  <span>[Insert Image: /images/home/showcase-1.jpg]</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SHOWCASE SECTION B (Image Left, Text Right) */}
        <section className="showcase-section reverse-layout">
          <div className="container showcase-container">
            <motion.div
              className="showcase-image-wrapper"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="image-placeholder">
                <img src="/home_page/showcase-2.png" alt="Multiple vibes for different purposes" className="placeholder-img" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                <div className="placeholder-fallback">
                  <span>[Insert Image: /images/home/showcase-2.jpg]</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="showcase-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div className="eyebrow" variants={fadeInUp}>{t("Context is Everything")}</motion.div>
              <motion.h2 className="section-title showcase-title" variants={fadeInUp}>
                {t("One account. Multiple Vibes.")}
              </motion.h2>
              <motion.p className="section-description showcase-desc" variants={fadeInUp}>
                {t("You play different roles. Keep a 'Business Vibe' for professional contacts, a 'Creator Vibe' for your audience, and a 'Personal Vibe' for close friends. Switch between them instantly. Seamlessly control who gets access to your private phone number.")}
              </motion.p>
            </motion.div>
          </div>
        </section>
      </div>

      {/* 4. FEATURES CARDS (Restored Glass UI) */}
      <section className="features-section">
        <div className="container">
          <motion.div
            className="features-header text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="section-title">{t("Way more than just a link-in-bio")}</h2>
            <p className="section-description mx-auto max-w-2xl">
              {t("Everything you need to grow your network, embedded right into your Vibe.")}
            </p>
          </motion.div>

          <motion.div
            className="features-cards modern-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                className="feature-block glass-panel glass-hover"
                variants={fadeInUp}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION (Premium Island) */}
      <section className="final-cta-section">
        <div className="container">
          <motion.div
            className="cta-burst-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <div className="cta-glow-bg"></div>
            <div className="cta-burst-content text-center">
              <h2 className="cta-title">{t("Ready to upgrade your identity?")}</h2>
              <p className="cta-description">
                {t("Join other top creators and professionals. Get your interactive profile live in less than a minute. No credit card required.")}
              </p>
              <div className="cta-actions">
                <Link to={isAuthenticated ? "/create-vibe" : "/signin"} className="btn btn-primary btn-xl">
                  {t("Create your Vibe for Free")}
                  <svg
                    className="hero-btn-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="4" y1="12" x2="18" y2="12" />
                    <polyline points="11 5 18 12 11 19" />
                  </svg>
                </Link>
                <Link to="/explore" className="btn btn-secondary btn-xl">
                  {t("Explore Examples")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
