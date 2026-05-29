/**
 * pages/CommunityPage.jsx
 * Phase 7 — Community Hub with ASL resources, guides, organizations, accessibility.
 * Design-only, no backend required.
 */

import { motion } from 'framer-motion';
import { ExternalLink, Heart, Users, Globe, Shield, BookOpen, Video, Headphones, Star } from 'lucide-react';
import { staggerContainer, fadeUp, pageVariants } from '../animations/variants';

const ORGANIZATIONS = [
  { name: 'National Association of the Deaf', abbr: 'NAD', url: 'https://www.nad.org', desc: 'The oldest and largest organization of deaf and hard-of-hearing people in the US.', color: '#00e5ff', icon: '🏛️' },
  { name: 'Hearing Loss Association of America', abbr: 'HLAA', url: 'https://www.hearingloss.org', desc: 'The nation\'s leading organization for people with hearing loss.', color: '#b44dff', icon: '🦻' },
  { name: 'ASL Connect', abbr: 'ASL-C', url: 'https://aslconnect.gallaudet.edu', desc: 'Online ASL courses from Gallaudet University — the world\'s premier deaf university.', color: '#39ff85', icon: '🎓' },
  { name: 'ASDC — Deaf Children', abbr: 'ASDC', url: 'https://www.asdc.org', desc: 'Support for deaf and hard-of-hearing children and their families.', color: '#f472b6', icon: '👨‍👩‍👧' },
];

const GUIDES = [
  { title: 'Getting Started with ASL', desc: 'A beginner\'s complete roadmap to learning American Sign Language from scratch.', icon: BookOpen, color: '#00e5ff', level: 'Beginner' },
  { title: 'Video Resources', desc: 'Curated YouTube channels and online video courses for visual ASL learners.', icon: Video, color: '#b44dff', level: 'All Levels' },
  { title: 'ASL Grammar Basics', desc: 'Understanding the unique grammatical structure of ASL, including topic-comment order.', icon: Globe, color: '#39ff85', level: 'Intermediate' },
  { title: 'Deaf Culture & Etiquette', desc: 'Essential cultural competency for respectful communication in the Deaf community.', icon: Heart, color: '#f472b6', level: 'All Levels' },
];

const ACCESSIBILITY = [
  { title: 'Live Captions', desc: 'Enable real-time captions on Google Meet, Zoom, and Teams for inclusive meetings.', icon: Headphones, color: '#00e5ff' },
  { title: 'ASL Interpreters', desc: 'Connect with certified ASL interpreters via telehealth and in-person services.', icon: Users, color: '#b44dff' },
  { title: 'Assistive Technology', desc: 'Explore hearing loops, vibrating alerts, and visual notification devices.', icon: Shield, color: '#39ff85' },
];

function ResourceCard({ icon: Icon, title, desc, color, badge }) {
  return (
    <motion.div
      variants={fadeUp}
      className="glass-card holo-card"
      style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}12`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} style={{ color }} />
        </div>
        {badge && (
          <span className="chip" style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15, color: 'var(--on-surface)', marginBottom: 6 }}>{title}</h3>
        <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>{desc}</p>
      </div>
      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${color}30, transparent)`, marginTop: 'auto' }} />
    </motion.div>
  );
}

function OrgCard({ org }) {
  return (
    <motion.a
      variants={fadeUp}
      href={org.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card"
      whileHover={{ y: -3, borderColor: `${org.color}40` }}
      transition={{ duration: 0.2 }}
      style={{
        padding: '20px 22px', display: 'flex', alignItems: 'flex-start', gap: 16,
        textDecoration: 'none', cursor: 'pointer',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{org.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: org.color, fontWeight: 700, letterSpacing: '0.06em' }}>{org.abbr}</span>
          <ExternalLink size={11} style={{ color: 'var(--outline)' }} />
        </div>
        <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: 'var(--on-surface)', marginBottom: 5, lineHeight: 1.3 }}>{org.name}</h3>
        <p style={{ fontFamily: 'Inter', fontSize: 11.5, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>{org.desc}</p>
      </div>
    </motion.a>
  );
}

export default function CommunityPage() {
  return (
    <motion.main
      id="main-content"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 pb-20"
      aria-label="Community Hub"
    >
      {/* Background */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '55vw', height: '55vw', top: '-15vw', right: '-10vw', background: 'radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', width: '40vw', height: '40vw', bottom: '0', left: '-5vw', background: 'radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 65%)' }} />
      </div>

      <div className="page-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#f472b6', letterSpacing: '0.12em' }}>// MODULE: 07</span>
          <h1 className="text-display-sm" style={{ color: 'var(--on-surface)', margin: '6px 0 10px' }}>
            Community <span style={{ background: 'linear-gradient(135deg, #f472b6, #b44dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hub</span>
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--on-surface-variant)', maxWidth: 560 }}>
            Connect with the Deaf community, discover learning resources, and explore organizations working to bridge communication gaps.
          </p>
        </motion.div>

        {/* Organizations */}
        <section style={{ marginBottom: 52 }} aria-labelledby="orgs-heading">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <Users size={16} style={{ color: '#f472b6' }} />
              <h2 id="orgs-heading" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: 'var(--on-surface)', margin: 0 }}>
                Key Organizations
              </h2>
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'var(--on-surface-variant)', paddingLeft: 26 }}>
              Leading nonprofits and institutions supporting the Deaf community.
            </p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {ORGANIZATIONS.map((org) => <OrgCard key={org.abbr} org={org} />)}
          </motion.div>
        </section>

        <hr className="laser-divider" style={{ marginBottom: 52 }} />

        {/* Learning Guides */}
        <section style={{ marginBottom: 52 }} aria-labelledby="guides-heading">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <BookOpen size={16} style={{ color: '#00e5ff' }} />
              <h2 id="guides-heading" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: 'var(--on-surface)', margin: 0 }}>Learning Guides</h2>
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'var(--on-surface-variant)', paddingLeft: 26 }}>Structured resources for every stage of your ASL journey.</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {GUIDES.map((g) => <ResourceCard key={g.title} icon={g.icon} title={g.title} desc={g.desc} color={g.color} badge={g.level} />)}
          </motion.div>
        </section>

        <hr className="laser-divider" style={{ marginBottom: 52 }} />

        {/* Accessibility Resources */}
        <section aria-labelledby="access-heading">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <Shield size={16} style={{ color: '#39ff85' }} />
              <h2 id="access-heading" style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: 'var(--on-surface)', margin: 0 }}>Accessibility Tools</h2>
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'var(--on-surface-variant)', paddingLeft: 26 }}>Technology and services that support inclusive communication.</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {ACCESSIBILITY.map((r) => <ResourceCard key={r.title} icon={r.icon} title={r.title} desc={r.desc} color={r.color} />)}
          </motion.div>
        </section>

        {/* Community CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ marginTop: 56, textAlign: 'center', padding: '40px 32px', background: 'linear-gradient(135deg, rgba(0,229,255,0.04), rgba(180,77,255,0.06))', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 }}>
          <Star size={32} style={{ color: '#f0d070', margin: '0 auto 12px' }} />
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 22, color: 'var(--on-surface)', marginBottom: 10 }}>
            Help us grow Signa AI
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--on-surface-variant)', maxWidth: 440, margin: '0 auto 22px', lineHeight: 1.65 }}>
            Signa AI is open-source. Contribute to our ASL dataset, improve model accuracy, or share the tool with anyone who might benefit.
          </p>
          <a
            href="https://github.com"
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #00e5ff22, #b44dff22)', border: '1px solid rgba(0,229,255,0.3)', color: 'var(--neon-cyan)', fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em', transition: 'all 0.2s' }}
          >
            <ExternalLink size={14} />
            VIEW ON GITHUB
          </a>
        </motion.div>
      </div>
    </motion.main>
  );
}
