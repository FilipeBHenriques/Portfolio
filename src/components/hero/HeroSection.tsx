import { motion } from 'framer-motion'
import { Code2, ArrowDown } from 'lucide-react'
import { HeroBackground } from './HeroBackground'
import { fadeUp, stagger } from '@/lib/motionVariants'

interface HeroSectionProps {
  onViewProjects: () => void
}

export function HeroSection({ onViewProjects }: HeroSectionProps) {
  return (
    <section
      data-hero
      style={{
        position: 'relative',
        height: 'calc(100vh - 56px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <HeroBackground />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '720px',
          padding: '0 2rem',
        }}
      >
        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Hi, I&apos;m Filipe
          <span className="cursor-blink" style={{ marginLeft: '2px' }}>_</span>
        </motion.h1>

        {/* Sub-line */}
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
            color: 'var(--accent)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          Software Engineer
        </motion.p>

        {/* Bio */}
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
          }}
        >
          I build performant systems and obsessive UIs — from low-level Go services
          to browser-native experiences. I care about the craft.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button
            onClick={onViewProjects}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              color: 'var(--accent)',
              background: 'transparent',
              border: '1px solid var(--accent)',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--glow-sm)'
              e.currentTarget.style.background = 'rgba(57,255,20,0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <ArrowDown size={14} />
            View Projects
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.5rem',
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
    </section>
  )
}
