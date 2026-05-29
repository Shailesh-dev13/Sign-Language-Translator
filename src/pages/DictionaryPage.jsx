/**
 * pages/DictionaryPage.jsx
 * Phase 5 — ASL Dictionary with search, category tabs, and sign cards.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Hash, MessageSquare } from 'lucide-react';
import { ALL_SIGNS, ASL_ALPHABET, ASL_NUMBERS, ASL_COMMON } from '../utils/aslData';
import SignCard from '../components/ui/SignCard';
import { staggerContainer, fadeUp, pageVariants } from '../animations/variants';

const CATEGORIES = [
  { id: 'all',      label: 'All Signs',   icon: BookOpen,      data: ALL_SIGNS,     count: ALL_SIGNS.length },
  { id: 'alphabet', label: 'Alphabet',    icon: BookOpen,      data: ASL_ALPHABET,  count: ASL_ALPHABET.length },
  { id: 'numbers',  label: 'Numbers',     icon: Hash,          data: ASL_NUMBERS,   count: ASL_NUMBERS.length },
  { id: 'common',   label: 'Common Signs',icon: MessageSquare, data: ASL_COMMON,    count: ASL_COMMON.length },
];

export default function DictionaryPage() {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('all');

  const source = CATEGORIES.find((c) => c.id === category)?.data || ALL_SIGNS;

  const filtered = useMemo(() => {
    if (!query.trim()) return source;
    const q = query.toLowerCase();
    return source.filter(
      (s) => s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [query, source]);

  return (
    <motion.main
      id="main-content"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 pb-16"
      aria-label="ASL Dictionary"
    >
      {/* Background glows */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '50vw', height: '50vw', top: '-10vw', right: '-5vw', background: 'radial-gradient(circle, rgba(180,77,255,0.06) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', width: '40vw', height: '40vw', bottom: '-5vw', left: '-5vw', background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 65%)' }} />
      </div>

      <div className="page-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--neon-cyan)', letterSpacing: '0.12em' }}>// MODULE: 05</span>
          </div>
          <h1 className="text-display-sm" style={{ color: 'var(--on-surface)', marginBottom: 8 }}>
            ASL <span className="text-gradient-cyan">Dictionary</span>
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--on-surface-variant)' }}>
            Browse and search the complete American Sign Language reference library.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} style={{ marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
            <input
              className="signa-input"
              style={{ paddingLeft: 40 }}
              placeholder="Search signs, letters, descriptions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search ASL signs"
            />
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 10,
                  background: active ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: active ? 'var(--neon-cyan)' : 'var(--on-surface-variant)',
                  fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  letterSpacing: '0.04em',
                }}
                aria-pressed={active}
              >
                <Icon size={13} />
                {cat.label}
                <span style={{ background: active ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 6, fontSize: 9 }}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Results count */}
        <div style={{ marginBottom: 18, fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--outline)' }}>
          {filtered.length} sign{filtered.length !== 1 ? 's' : ''} found
          {query && <span style={{ color: 'var(--neon-cyan)', marginLeft: 6 }}>· searching "{query}"</span>}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${category}-${query}`}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}
            >
              {filtered.map((sign) => (
                <motion.div key={sign.id} variants={fadeUp}>
                  <SignCard sign={sign} onPractice={(s) => console.log('Practice:', s.label)} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '60px 20px' }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤷</div>
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--outline)' }}>
                No signs found for "{query}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
