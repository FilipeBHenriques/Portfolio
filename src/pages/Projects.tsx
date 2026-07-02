import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { TagFilter } from '@/components/projects/TagFilter'
import { DecodeText } from '@/components/hero/DecodeText'
import { projects, allTags } from '@/data/projects'
import { fadeUp, stagger } from '@/lib/motionVariants'

export function Projects() {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects

  return (
    <PageWrapper>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 2rem 6rem' }}>
        {/* Page header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: '3rem' }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>~</span> $ ls ~/projects/
            <span className="cursor-blink" style={{ marginLeft: '4px' }}>▌</span>
          </motion.p>
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              lineHeight: 1.05,
            }}
          >
            <DecodeText text="Projects" delay={200} />
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              maxWidth: '520px',
              lineHeight: 1.65,
            }}
          >
            Things I&apos;ve built — from a Play Store app that makes you gamble
            for screen time, to AI desktop experiments and 3D visualizers.
          </motion.p>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.25rem',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '0.75rem 0',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            filter:
          </span>
          <TagFilter tags={allTags} active={activeTag} onChange={setActiveTag} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              flexShrink: 0,
              marginLeft: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {filtered.length}/{projects.length}{' '}
            <span style={{ opacity: 0.6 }}>shown</span>
          </span>
        </motion.div>

        {/* Grid */}
        <ProjectGrid projects={filtered} />
      </div>
    </PageWrapper>
  )
}
