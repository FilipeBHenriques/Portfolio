// src/components/hero/HeroSection.tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, ArrowDown, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroBackground } from './HeroBackground'
import { DecodeText } from './DecodeText'
import { fadeUp, stagger } from '@/lib/motionVariants'

interface HeroSectionProps {
  onViewProjects: () => void
}

const ROLES = [
  'Software Engineer',
  'AI Engineer',
  'Builds. Breaks. Fixes.',
  'Ships the next thing',
]

export function HeroSection({ onViewProjects }: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 4200)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      data-hero
      style={{
        position: 'relative',
        height: 'calc(100vh - 56px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <HeroBackground />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2.5rem',
        }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: '620px' }}
        >
          {/* Status chip */}
          <motion.div
            variants={fadeUp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3rem 0.75rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(var(--accent-rgb), 0.25)',
              borderRadius: '999px',
              background: 'rgba(var(--accent-rgb), 0.05)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
            }}
          >
            <span
              className="pulse-dot"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 6px var(--accent)',
                flexShrink: 0,
              }}
            />
            currently
            <span style={{ color: 'var(--accent)' }}>AI Engineer @ Yelhow</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              marginBottom: '1rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              whiteSpace: 'nowrap',
            }}
          >
            <DecodeText text="Hi, I'm Filipe" delay={350} />
            <span className="cursor-blink" style={{ marginLeft: '2px' }}>_</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
              color: 'var(--accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              minHeight: '1.5em',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: 'var(--text-muted)', userSelect: 'none' }}>&gt; </span>
            <DecodeText text={ROLES[roleIndex]} delay={roleIndex === 0 ? 900 : 0} />
          </motion.p>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: 'var(--text-muted)',
              marginBottom: '2.25rem',
              maxWidth: '460px',
            }}
          >
            I build performant systems and obsessive UIs — from AI-powered
            scheduling to apps that make you gamble for your own screen time.
            Currently shipping at Yelhow, MSc in CS with an AI minor from IST.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <button
              onClick={onViewProjects}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.6rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                color: '#080808',
                background: 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: '2px',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--glow-md)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <ArrowDown size={14} />
              View Projects
            </button>

            <Link
              to="/progression"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.6rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                color: 'var(--accent)',
                background: 'transparent',
                border: '1px solid rgba(var(--accent-rgb), 0.4)',
                borderRadius: '2px',
                textDecoration: 'none',
                transition: 'box-shadow 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--glow-sm)'
                e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              My Path
            </Link>

            <a
              href="https://github.com/FilipeBHenriques"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.6rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '2px',
                textDecoration: 'none',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.borderColor = 'var(--text-muted)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              <Code2 size={14} />
              GitHub
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        scroll
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{ display: 'flex', color: 'var(--accent)' }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.div>
    </section>
  )
}
