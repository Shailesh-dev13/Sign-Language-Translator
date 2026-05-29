/**
 * pages/LearningPage.jsx
 * Phase 6 — Learning system with lessons, progress tracking, and quiz mode.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Trophy, BookOpen } from 'lucide-react';
import { LESSONS, ALL_SIGNS } from '../utils/aslData';
import LessonCard from '../components/ui/LessonCard';
import QuizMode from '../components/ui/QuizMode';
import SignCard from '../components/ui/SignCard';
import { staggerContainer, fadeUp, pageVariants } from '../animations/variants';

const STORAGE_KEY = 'signa_lesson_progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Lesson Detail view ────────────────────────────────────────────────────────
function LessonDetail({ lesson, progress, onBack, onComplete }) {
  const signs = ALL_SIGNS.filter((s) => lesson.signs.includes(s.id));
  const [completedSigns, setCompletedSigns] = useState([]);
  const pct = Math.round((completedSigns.length / signs.length) * 100);

  const handlePractice = (sign) => {
    if (!completedSigns.includes(sign.id)) {
      const next = [...completedSigns, sign.id];
      setCompletedSigns(next);
      if (next.length === signs.length) onComplete(lesson.id);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <button
          onClick={onBack}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 12px', color: 'var(--on-surface-variant)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'JetBrains Mono', fontSize: 11 }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, color: 'var(--on-surface)', margin: 0 }}>
            {lesson.icon} {lesson.title}
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--outline)', margin: '3px 0 0' }}>{lesson.subtitle}</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--outline)' }}>Lesson Progress</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: lesson.accent }}>{pct}%</span>
        </div>
        <div className="progress-bar-track">
          <motion.div className="progress-bar-fill" style={{ background: `linear-gradient(to right, ${lesson.accent}cc, ${lesson.accent})` }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
        </div>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)', marginTop: 8 }}>
          Click "PRACTICE" on each sign card to mark it as learned.
        </p>
      </div>

      {/* Sign grid */}
      <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 14 }}>
        {signs.map((sign) => (
          <motion.div key={sign.id} variants={fadeUp} style={{ opacity: completedSigns.includes(sign.id) ? 0.55 : 1, transition: 'opacity 0.3s' }}>
            <SignCard sign={sign} onPractice={handlePractice} />
          </motion.div>
        ))}
      </motion.div>

      {pct === 100 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: 28, textAlign: 'center', padding: '28px', background: `${lesson.accent}10`, border: `1px solid ${lesson.accent}40`, borderRadius: 16 }}>
          <Trophy size={32} style={{ color: '#f0d070', marginBottom: 10 }} />
          <h3 style={{ fontFamily: 'Orbitron', fontSize: 18, color: '#f0d070', marginBottom: 6 }}>Lesson Complete!</h3>
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--on-surface-variant)' }}>+{lesson.xp} XP earned</p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LearningPage() {
  const [progress,       setProgress]       = useState(loadProgress);
  const [activeLesson,   setActiveLesson]   = useState(null);
  const [quizActive,     setQuizActive]     = useState(false);

  const totalXP = LESSONS.reduce((sum, l) => sum + (progress[l.id] ? l.xp : 0), 0);
  const totalCompleted = LESSONS.filter((l) => progress[l.id] === 100).length;

  const handleComplete = (lessonId) => {
    const next = { ...progress, [lessonId]: 100 };
    setProgress(next);
    saveProgress(next);
  };

  if (quizActive) {
    return (
      <motion.main
        id="main-content"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen pt-24 pb-16"
      >
        <div className="page-wrapper" style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 className="text-display-sm" style={{ color: 'var(--on-surface)' }}>
              <span className="text-gradient-cyan">Quiz</span> Mode
            </h2>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '28px 28px' }}>
            <QuizMode signsPool={ALL_SIGNS} onClose={() => setQuizActive(false)} />
          </div>
        </div>
      </motion.main>
    );
  }

  if (activeLesson) {
    return (
      <motion.main
        id="main-content"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen pt-24 pb-16"
      >
        <div className="page-wrapper">
          <LessonDetail
            lesson={activeLesson}
            progress={progress[activeLesson.id] || 0}
            onBack={() => setActiveLesson(null)}
            onComplete={handleComplete}
          />
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      id="main-content"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-24 pb-16"
      aria-label="Learning Module"
    >
      {/* Background glows */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '45vw', height: '45vw', top: '-5vw', left: '-8vw', background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 65%)' }} />
      </div>

      <div className="page-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--neon-cyan)', letterSpacing: '0.12em' }}>// MODULE: 06</span>
          <h1 className="text-display-sm" style={{ color: 'var(--on-surface)', margin: '6px 0 8px' }}>
            Learning <span className="text-gradient-cyan">System</span>
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--on-surface-variant)' }}>
            Master ASL at your own pace with structured lessons and interactive quizzes.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { label: 'Total XP', value: totalXP, icon: '⭐', color: '#f0d070' },
            { label: 'Completed', value: `${totalCompleted}/${LESSONS.length}`, icon: '🏆', color: '#39ff85' },
            { label: 'Signs Available', value: ALL_SIGNS.length, icon: '🤟', color: '#00e5ff' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
              <div>
                <div style={{ fontFamily: 'Orbitron', fontSize: 18, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)' }}>{stat.label}</div>
              </div>
            </div>
          ))}

          {/* Quiz button */}
          <button
            onClick={() => setQuizActive(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(180,77,255,0.12))',
              border: '1px solid rgba(0,229,255,0.25)',
              color: 'var(--neon-cyan)', cursor: 'pointer',
              fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 24px rgba(0,229,255,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
          >
            <Zap size={15} />
            QUIZ MODE
          </button>
        </motion.div>

        <hr className="laser-divider" style={{ marginBottom: 28 }} />

        {/* Lessons */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {LESSONS.map((lesson, i) => {
            const lessonProgress = progress[lesson.id] || 0;
            const prevCompleted  = i === 0 ? true : (progress[LESSONS[i - 1]?.id] || 0) >= 100;
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={lessonProgress}
                locked={!prevCompleted}
                completed={lessonProgress >= 100}
                onClick={() => setActiveLesson(lesson)}
              />
            );
          })}
        </motion.div>
      </div>
    </motion.main>
  );
}
