import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
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
    navigate(`/projects/${id}`)
  }

  return (
    <div
      ref={scrollRef}
      className="no-scrollbar fade-mask-x"
      style={{
        display: 'flex',
        gap: '1.25rem',
        overflowX: 'auto',
        padding: '0.5rem 2rem 1.25rem',
        cursor: 'grab',
        height: '100%',
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
      {projects.map((project, index) => (
        <CarouselCard
          key={project.id}
          project={project}
          index={index}
          onClick={() => handleCardClick(project.id)}
        />
      ))}
    </div>
  )
}

function CardMedia({ project }: { project: Project }) {
  if (project.images && project.images.length > 0) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <img
          src={project.images[0]}
          alt={project.title}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
        {project.icon && (
          <img
            src={project.icon}
            alt=""
            draggable={false}
            style={{ position: 'absolute', bottom: '8px', left: '8px', width: '32px', height: '32px', borderRadius: '7px', boxShadow: '0 2px 8px rgba(0,0,0,0.6)', display: 'block' }}
          />
        )}
      </div>
    )
  }

  if (project.icon) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={project.icon}
          alt={project.title}
          draggable={false}
          style={{ width: '60px', height: '60px', borderRadius: '12px', boxShadow: '0 0 20px rgba(var(--accent-rgb), 0.18)', display: 'block' }}
        />
      </div>
    )
  }

  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.7rem',
      color: 'rgba(var(--accent-rgb), 0.3)',
      letterSpacing: '0.1em',
    }}>
      [ {project.id} ]
    </span>
  )
}

function CarouselCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: 'var(--glow-md)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: '300px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        transition: 'border-color 0.2s',
      }}
      onHoverStart={(e) => {
        ;(e.target as HTMLDivElement).style.borderColor = 'rgba(var(--accent-rgb), 0.55)'
      }}
      onHoverEnd={(e) => {
        ;(e.target as HTMLDivElement).style.borderColor = 'var(--border)'
      }}
    >
      {/* Media */}
      <div
        className="scanlines"
        style={{
          height: '150px',
          flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.08) 0%, rgba(var(--accent-rgb), 0.02) 100%)',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <CardMedia project={project} />
      </div>

      {/* Body */}
      <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'rgba(var(--accent-rgb), 0.55)',
            letterSpacing: '0.08em',
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {project.title}
          </h3>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.05em',
                color: 'rgba(var(--accent-rgb), 0.7)',
                background: 'rgba(var(--accent-rgb), 0.08)',
                border: '1px solid rgba(var(--accent-rgb), 0.15)',
                borderRadius: '2px',
                padding: '1px 6px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.78rem',
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

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border)',
            paddingTop: '0.6rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            open
            <ArrowUpRight size={11} />
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            cd {project.id}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
