import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ExploreVibeDemo from "./ExploreVibeDemo";
import '../styles/Explore.css';

const examples = [
  {
    id: 'creator',
    type: 'PERSONAL',
    name: 'Isabella Rossi',
    category: 'Digital Artist',
    desc: 'Digital Artist & Photographer. A stunning showcase of creative work combined with direct booking links.',
    description: 'Digital Artist & Photographer specializing in surreal portrait photography. Currently accepting new commissions.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
    contacts: [{ type: 'instagram', value: 'isabellarossi' }, { type: 'email', value: 'hello@isabellarossi.com' }],
    glow: '#ff6b8b'
  },
  {
    id: 'business',
    type: 'BUSINESS',
    name: 'Aura Studio',
    category: 'Interior Design',
    desc: 'High-end interior design firm. Consolidate your portfolio, client intake forms, and social presence in one elegant link.',
    description: 'Award-winning interior design firm. We create spaces that breathe life into your daily routines.',
    photo: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&h=400&q=80',
    contacts: [{ type: 'website', value: 'aurastudio.com' }, { type: 'telegram', value: 'aurastudio' }],
    glow: '#5f9cff'
  },
  {
    id: 'corporate',
    type: 'BUSINESS',
    name: 'Marcus Chen',
    category: 'Angel Investor',
    desc: 'Ex-VP of Product at Stripe. A pristine digital business card for networking with investors and founders.',
    description: 'Product Leader & Angel Investor. Helping early-stage startups navigate the 0-1 journey.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
    contacts: [{ type: 'linkedin', value: 'marcuschen' }, { type: 'twitter', value: 'marcuschen' }],
    glow: '#a881ff'
  },
  {
    id: 'agency',
    type: 'BUSINESS',
    name: 'Lumina Digital',
    category: 'Marketing Agency',
    desc: 'Boutique marketing agency. Showcasing case studies, team roster, and immediate consultation scheduling.',
    description: 'We turn brands into cultural phenomena. Strategic consulting and digital masterclasses.',
    photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&h=400&q=80',
    contacts: [{ type: 'youtube', value: 'luminadigital' }, { type: 'email', value: 'contact@lumina.agency' }],
    glow: '#f97316'
  },
  {
    id: 'freelance',
    type: 'PERSONAL',
    name: 'Sarah Jenkins',
    category: 'UX/UI Designer',
    desc: 'Senior UX/UI Designer. A curated hub for resume, Dribbble shots, and freelance availability calendar.',
    description: 'Crafting digital experiences with a focus on human-centered design. Based in Toronto.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
    contacts: [{ type: 'linkedin', value: 'sarahjenkins' }, { type: 'telegram', value: 'sarahjenkins' }],
    glow: '#22c55e'
  },
  {
    id: 'personal',
    type: 'OTHER',
    name: 'David & Emma',
    category: 'Wedding Hub',
    desc: 'Wedding Hub. RSVPs, location details, registry links, and photo galleries shared privately with guests.',
    description: 'We are getting married! Join us on our special day. September 12th, 2026. Lake Como, Italy.',
    photo: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&h=400&q=80',
    contacts: [{ type: 'email', value: 'wedding@davidandemma.com' }, { type: 'instagram', value: 'emmaswedding2026' }],
    glow: '#ec4899'
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function ExplorePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="explore-page">
      <div className="explore-ambient"></div>

      <div className="explore-container">

        <section className="explore-hero">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div className="explore-badge" variants={fadeInUp}>
              Vibes Showcase
            </motion.div>
            <motion.h1 className="explore-title" variants={fadeInUp}>
              Discover Your Vibe
            </motion.h1>
            <motion.p className="explore-subtitle" variants={fadeInUp}>
              Explore how world-class creators, executives, and agencies are using YouMeKnow to craft bespoke digital identities.
              Find inspiration for your own interactive profile.
            </motion.p>
          </motion.div>
        </section>

        <motion.section
          className="explore-list"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {examples.map((ex, index) => (
            <motion.div
              key={ex.id}
              className={`explore-row ${index % 2 !== 0 ? 'explore-row-reverse' : ''}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <div className="explore-row-visual">
                <div className="explore-vibe-wrapper">
                  <ExploreVibeDemo demo={ex} />
                </div>
              </div>

              <div className="explore-row-content">
                <div className="explore-type-tags">
                  <span className={`explore-main-type type-${ex.type.toLowerCase()}`}>
                    {ex.type}
                  </span>
                  <span className="explore-sub-category">{ex.category}</span>
                </div>

                <h3 className="explore-name">{ex.name}</h3>
                <p className="explore-desc">{ex.description}</p>

                <div className="explore-row-actions">
                  <Link to="/signup" className="explore-cta-btn">
                    Create your {ex.type.toLowerCase()} Vibe
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

      </div>
    </main>
  );
}
