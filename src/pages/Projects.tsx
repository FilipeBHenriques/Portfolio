import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { TagFilter } from '@/components/projects/TagFilter'
import { projects, allTags } from '@/data/projects'
import { fadeUp, stagger } from '@/lib/motionVariants'

export function Projects() {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects

  return (
    <PageWrapper>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
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
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '0.5rem',
            }}
          >
            /projects
          </motion.p>
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            Projects
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--text-muted)',
            }}
          >
            Things I&apos;ve built.
          </motion.p>
        </motion.div>

        {/* Tag filter */}
        <div style={{ marginBottom: '2rem' }}>
          <TagFilter tags={allTags} active={activeTag} onChange={setActiveTag} />
        </div>

        {/* Grid */}
        <ProjectGrid projects={filtered} />
      </div>
    </PageWrapper>
  )
}
