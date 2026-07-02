import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, ExternalLink, ArrowUpRight } from 'lucide-react'
import type { Project } from '@/data/projects'

const TILT_MAX = 5 // degrees

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  const articleRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  const handleTilt = (e: React.MouseEvent) => {
    const el = articleRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-py * TILT_MAX}deg) rotateY(${px * TILT_MAX}deg) translateY(-4px)`
  }

  const resetTilt = () => {
    const el = articleRef.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)'
    el.style.borderColor = 'var(--border)'
    el.style.boxShadow = 'none'
  }

  return (
    <motion.article
      ref={articleRef}
      layoutId={`card-${project.id}`}
      layout
      onClick={() => navigate(`/projects/${project.id}`)}
      onMouseMove={handleTilt}
      onMouseEnter={() => {
        if (articleRef.current) {
          articleRef.current.style.borderColor = 'rgba(var(--accent-rgb), 0.55)'
          articleRef.current.style.boxShadow = 'var(--glow-md)'
        }
      }}
      onMouseLeave={resetTilt}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Media area */}
      <div
        className="scanlines"
        style={{
          height: '190px',
          background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.07) 0%, rgba(var(--accent-rgb), 0.02) 50%, rgba(8,8,8,0.5) 100%)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {project.images && project.images.length > 0 ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img
              src={project.images[0]}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
            {project.icon && (
              <img
                src={project.icon}
                alt=""
                style={{ position: 'absolute', bottom: '10px', left: '10px', width: '40px', height: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.6)', display: 'block' }}
              />
            )}
          </div>
        ) : project.videoUrl ? (
          <div style={{ width: '100%', height: '100%', position: 'relative', background: 'radial-gradient(circle at 50% 20%, rgba(var(--accent-rgb), 0.18), transparent 35%), linear-gradient(180deg, rgba(10,16,10,0.95) 0%, rgba(8,8,8,0.98) 100%)' }}>
            <div style={{
              position: 'absolute',
              inset: '18px',
              border: '1px solid rgba(var(--accent-rgb), 0.18)',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '14px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                letterSpacing: '0.14em',
                color: 'rgba(var(--accent-rgb), 0.72)',
              }}>
                {'>'} recorded desktop demo
              </div>
              <div style={{
                alignSelf: 'center',
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                border: '1px solid rgba(var(--accent-rgb), 0.3)',
                background: 'rgba(var(--accent-rgb), 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 22px rgba(var(--accent-rgb), 0.16)',
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderTop: '9px solid transparent',
                  borderBottom: '9px solid transparent',
                  borderLeft: '14px solid var(--accent)',
                  marginLeft: '4px',
                }} />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '12px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {project.title}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.56rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(var(--accent-rgb), 0.55)',
                  textTransform: 'uppercase',
                }}>
                  mp4 preview
                </span>
              </div>
            </div>
          </div>
        ) : project.icon ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.06) 0%, rgba(var(--accent-rgb), 0.01) 100%)' }}>
            <img
              src={project.icon}
              alt={project.title}
              style={{ width: '72px', height: '72px', borderRadius: '14px', boxShadow: '0 0 24px rgba(var(--accent-rgb), 0.2), 0 4px 16px rgba(0,0,0,0.5)', display: 'block' }}
            />
          </div>
        ) : (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'rgba(var(--accent-rgb), 0.25)',
            letterSpacing: '0.1em',
            position: 'relative',
            zIndex: 1,
          }}>
            [ {project.id} ]
          </span>
        )}

        <ActionButtons project={project} />
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          {index !== undefined && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'rgba(var(--accent-rgb), 0.55)',
                letterSpacing: '0.08em',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}>
            {project.title}
          </h3>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.06em',
                color: 'rgba(var(--accent-rgb), 0.65)',
                background: 'rgba(var(--accent-rgb), 0.07)',
                border: '1px solid rgba(var(--accent-rgb), 0.12)',
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

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border)',
            paddingTop: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            open project
            <ArrowUpRight size={12} />
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}
          >
            cd {project.id}
          </span>
        </div>
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
          zIndex: 2,
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
        zIndex: 2,
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
            border: '1px solid rgba(var(--accent-rgb), 0.3)',
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
