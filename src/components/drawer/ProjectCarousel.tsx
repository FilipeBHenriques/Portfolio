import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Project } from '@/data/projects'

interface ProjectCarouselProps {
  projects: Project[]
  onClose: () => void
}

export function ProjectCarousel({ projects, onClose }: ProjectCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleCardClick = (id: string) => {
    onClose()
    navigate(`/projects?focus=${id}`)
  }

  return (
    <div
      ref={scrollRef}
      className="no-scrollbar fade-mask-x"
      style={{
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto',
        padding: '0.5rem 2rem 1rem',
        cursor: 'grab',
      }}
      onMouseDown={(e) => {
        const el = scrollRef.current
        if (!el) return
        el.style.cursor = 'grabbing'
        const startX = e.pageX - el.offsetLeft
        const scrollLeft = el.scrollLeft
        const onMove = (ev: MouseEvent) => {
          el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX)
        }
        const onUp = () => {
          el.style.cursor = 'grab'
          window.removeEventListener('mousemove', onMove)
          window.removeEventListener('mouseup', onUp)
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
      }}
    >
      {projects.map((project) => (
        <CarouselCard
          key={project.id}
          project={project}
          onClick={() => handleCardClick(project.id)}
        />
      ))}
    </div>
  )
}

function CarouselCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: 'var(--glow-md)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: '280px',
        height: '340px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        userSelect: 'none',
        transition: 'border-color 0.2s',
      }}
      onHoverStart={(e) => {
        ;(e.target as HTMLDivElement).style.borderColor = 'var(--accent)'
      }}
      onHoverEnd={(e) => {
        ;(e.target as HTMLDivElement).style.borderColor = 'var(--border)'
      }}
    >
      {/* Placeholder image area */}
      <div
        style={{
          height: '140px',
          borderRadius: '2px',
          background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.08) 0%, rgba(var(--accent-rgb), 0.02) 100%)',
          border: '1px solid rgba(var(--accent-rgb), 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'rgba(var(--accent-rgb), 0.3)',
          letterSpacing: '0.1em',
        }}>
          [ preview ]
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
      }}>
        {project.title}
      </h3>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.05em',
              color: 'rgba(var(--accent-rgb), 0.7)',
              background: 'rgba(var(--accent-rgb), 0.08)',
              border: '1px solid rgba(var(--accent-rgb), 0.15)',
              borderRadius: '2px',
              padding: '2px 6px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        flex: 1,
      }}>
        {project.description}
      </p>
    </motion.div>
  )
}
