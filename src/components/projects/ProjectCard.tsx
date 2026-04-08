import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, ExternalLink } from 'lucide-react'
import type { Project } from '@/data/projects'

export function ProjectCard({ project }: { project: Project }) {
  const articleRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  return (
    <motion.article
      ref={articleRef}
      layoutId={`card-${project.id}`}
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => navigate(`/projects/${project.id}`)}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={() => {
        if (articleRef.current) {
          articleRef.current.style.borderColor = 'var(--accent)'
          articleRef.current.style.boxShadow = 'var(--glow-md)'
        }
      }}
      onMouseLeave={() => {
        if (articleRef.current) {
          articleRef.current.style.borderColor = 'var(--border)'
          articleRef.current.style.boxShadow = 'none'
        }
      }}
    >
      {/* Media placeholder */}
      <div style={{
        height: '180px',
        background: 'linear-gradient(135deg, rgba(57,255,20,0.07) 0%, rgba(57,255,20,0.02) 50%, rgba(8,8,8,0.5) 100%)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Scanlines effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          pointerEvents: 'none',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'rgba(57,255,20,0.25)',
          letterSpacing: '0.1em',
          position: 'relative',
          zIndex: 1,
        }}>
          [ {project.id} ]
        </span>

        <ActionButtons project={project} />
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}>
          {project.title}
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.06em',
                color: 'rgba(57,255,20,0.65)',
                background: 'rgba(57,255,20,0.07)',
                border: '1px solid rgba(57,255,20,0.12)',
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
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          flex: 1,
        }}>
          {project.description}
        </p>
      </div>

      {project.featured && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#080808',
          background: 'var(--accent)',
          borderRadius: '2px',
          padding: '2px 6px',
        }}>
          Featured
        </div>
      )}
    </motion.article>
  )
}

function ActionButtons({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        display: 'flex',
        gap: '0.375rem',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            background: 'rgba(8,8,8,0.85)',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            color: 'var(--text-muted)',
            transition: 'color 0.15s, border-color 0.15s',
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
          <Code2 size={12} />
        </a>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            background: 'rgba(8,8,8,0.85)',
            border: '1px solid rgba(57,255,20,0.3)',
            borderRadius: '2px',
            color: 'var(--accent)',
            transition: 'box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--glow-sm)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <ExternalLink size={12} />
        </a>
      )}
    </motion.div>
  )
}
