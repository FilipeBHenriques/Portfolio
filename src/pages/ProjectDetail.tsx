import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { Code2, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight, Shield, Maximize2, Minimize2 } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { projects, type Project } from '@/data/projects'
import { fadeUp, stagger } from '@/lib/motionVariants'

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return width
}

export function ProjectDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)
  const isMobile = useWindowWidth() <= 900

  if (!project) {
    return (
      <PageWrapper>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '4rem 2rem 6rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '1.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
            }}
          >
            {'>'} project not found
          </p>
          <Link
            to="/projects"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--accent)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              borderBottom: '1px solid rgba(var(--accent-rgb), 0.3)',
              paddingBottom: '1px',
            }}
          >
            ← back to projects
          </Link>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '4rem 2rem 6rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '4rem',
            alignItems: isMobile ? 'stretch' : 'flex-start',
          }}
        >
          {/* ── Left column ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            style={{
              flex: '0 0 55%',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Breadcrumb */}
            <motion.div variants={fadeUp}>
              <Link
                to="/projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  marginBottom: '2.5rem',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'var(--accent)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'var(--text-muted)')
                }
              >
                <ArrowLeft size={13} />
                Projects
              </Link>
            </motion.div>

            {/* Title block */}
            <motion.div variants={fadeUp} style={{ marginBottom: '1.5rem' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.05,
                  marginBottom: '0.75rem',
                }}
              >
                {project.title}
              </h1>
              <div
                style={{
                  width: '60px',
                  height: '2px',
                  background: 'var(--accent)',
                  boxShadow: 'var(--glow-sm)',
                  marginTop: '0.5rem',
                }}
              />
            </motion.div>

            {/* Tags */}
            <motion.div
              variants={fadeUp}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.4rem',
                marginBottom: '1.75rem',
              }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.08em',
                    color: 'rgba(var(--accent-rgb), 0.75)',
                    background: 'rgba(var(--accent-rgb), 0.07)',
                    border: '1px solid rgba(var(--accent-rgb), 0.15)',
                    borderRadius: '2px',
                    padding: '3px 8px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--text-muted)',
                lineHeight: 1.8,
                maxWidth: '520px',
                marginBottom: '1.5rem',
              }}
            >
              {project.longDescription ?? project.description}
            </motion.p>

            {/* Divider */}
            <motion.hr
              variants={fadeUp}
              style={{
                border: 'none',
                borderTop: '1px solid var(--border)',
                margin: '0 0 2rem 0',
              }}
            />

            {/* Tech stack section */}
            <motion.div variants={fadeUp} style={{ marginBottom: '2rem' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--accent)',
                  letterSpacing: '0.08em',
                  marginBottom: '1rem',
                }}
              >
                {'// stack'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: '3px',
                      padding: '5px 12px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTA row */}
            {(project.githubUrl || project.liveUrl || project.privacyPolicyUrl) && (
              <motion.div
                variants={fadeUp}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  marginBottom: '3rem',
                }}
              >
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      color: 'var(--text-primary)',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '3px',
                      padding: '9px 18px',
                      textDecoration: 'none',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--text-muted)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                  >
                    <Code2 size={14} />
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      color: 'var(--accent)',
                      background: 'transparent',
                      border: '1px solid rgba(var(--accent-rgb), 0.45)',
                      borderRadius: '3px',
                      padding: '9px 18px',
                      textDecoration: 'none',
                      transition: 'box-shadow 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--glow-md)'
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.45)'
                    }}
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
                {project.privacyPolicyUrl && (
                  <a
                    href={project.privacyPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      color: 'var(--text-muted)',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '3px',
                      padding: '9px 18px',
                      textDecoration: 'none',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--text-muted)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.color = 'var(--text-muted)'
                    }}
                  >
                    <Shield size={14} />
                    Privacy Policy
                  </a>
                )}
              </motion.div>
            )}

            {/* Bottom cd link */}
            <motion.div variants={fadeUp} style={{ marginTop: 'auto' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  background: 'transparent',
                  border: 'none',
                  letterSpacing: '0.06em',
                  opacity: 0.6,
                  transition: 'opacity 0.15s',
                  padding: 0,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = '1')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = '0.6')
                }
              >
                {'>'} cd ..
              </button>
            </motion.div>
          </motion.div>

          {/* ── Right column ── */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            style={{
              flex: '0 0 45%',
              minWidth: '320px',
              position: 'sticky',
              top: '88px',
              alignSelf: 'flex-start',
            }}
          >
            <PreviewPanel project={project} />
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

function ImageGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          width: '100%',
          aspectRatio: '9/16',
          maxHeight: '520px',
          overflow: 'hidden',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.img
          key={index}
          src={images[index]}
          alt={`screenshot ${index + 1}`}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(8,8,8,0.75)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              color: 'var(--text-muted)',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent)'
              e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(8,8,8,0.75)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              color: 'var(--text-muted)',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent)'
              e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <ChevronRight size={16} />
          </button>

          {/* Dot indicators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 0 0',
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  width: i === index ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === index ? 'var(--accent)' : 'var(--border)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.2s, background 0.2s',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function EmbedPanel({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: expanded ? '600px' : '400px',
          transition: 'height 0.3s ease',
          background: '#000',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={project.embedUrl}
          title={project.title}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          allow="accelerometer; autoplay"
        />
        {/* Scanline overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
            pointerEvents: 'none',
          }}
        />
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((e) => !e)}
          title={expanded ? 'Collapse' : 'Expand'}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(8,8,8,0.8)',
            border: '1px solid var(--border)',
            borderRadius: '3px',
            color: 'var(--text-muted)',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>
      <div
        style={{
          padding: '8px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(var(--accent-rgb), 0.4)',
            letterSpacing: '0.08em',
          }}
        >
          ● live embed
        </span>
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textDecoration: 'none',
            marginLeft: 'auto',
            opacity: 0.6,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        >
          open in new tab ↗
        </a>
      </div>
    </div>
  )
}

function PreviewPanel({ project }: { project: Project }) {
  if (project.embedUrl) {
    return (
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          overflow: 'hidden',
          padding: '1rem',
        }}
      >
        {project.featured && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#080808',
                background: 'var(--accent)',
                borderRadius: '2px',
                padding: '2px 7px',
                boxShadow: 'var(--glow-sm)',
              }}
            >
              Featured
            </span>
          </div>
        )}
        <EmbedPanel project={project} />
        <div
          style={{
            borderTop: '1px solid var(--border)',
            marginTop: '1rem',
            paddingTop: '10px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'rgba(var(--accent-rgb), 0.3)',
              letterSpacing: '0.08em',
            }}
          >
            {project.id}.preview
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              opacity: 0.4,
              letterSpacing: '0.06em',
            }}
          >
            {project.tags.join(' · ')}
          </span>
        </div>
      </div>
    )
  }

  if (project.images && project.images.length > 0) {
    return (
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          overflow: 'hidden',
          padding: '1rem',
        }}
      >
        {project.featured && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#080808',
                background: 'var(--accent)',
                borderRadius: '2px',
                padding: '2px 7px',
                boxShadow: 'var(--glow-sm)',
              }}
            >
              Featured
            </span>
          </div>
        )}
        <ImageGallery images={project.images} />
        <div
          style={{
            borderTop: '1px solid var(--border)',
            marginTop: '1rem',
            paddingTop: '10px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'rgba(var(--accent-rgb), 0.3)',
              letterSpacing: '0.08em',
            }}
          >
            {project.id}.preview
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              opacity: 0.4,
              letterSpacing: '0.06em',
            }}
          >
            {project.tags.join(' · ')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        minHeight: '420px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '18%',
          left: '50%',
          transform: 'translateX(-50%) rotate(-15deg)',
          fontFamily: 'var(--font-display)',
          fontSize: '7.5rem',
          fontWeight: 700,
          color: 'var(--accent)',
          opacity: 0.04,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '-0.04em',
        }}
      >
        {project.id}
      </span>
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '55%',
          left: '60%',
          transform: 'translateX(-50%) rotate(-15deg)',
          fontFamily: 'var(--font-display)',
          fontSize: '7.5rem',
          fontWeight: 700,
          color: 'var(--accent)',
          opacity: 0.04,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '-0.04em',
        }}
      >
        {project.id}
      </span>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
          pointerEvents: 'none',
        }}
      />
      {project.featured && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#080808',
            background: 'var(--accent)',
            borderRadius: '2px',
            padding: '2px 7px',
            boxShadow: 'var(--glow-sm)',
            zIndex: 2,
          }}
        >
          Featured
        </div>
      )}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            border: '1px solid var(--border)',
            padding: '6px 14px',
            borderRadius: '2px',
          }}
        >
          [ NO PREVIEW ]
        </span>
        {(project.githubUrl || project.liveUrl) && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View source"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
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
                <Code2 size={15} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open live demo"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid rgba(var(--accent-rgb), 0.25)',
                  borderRadius: '3px',
                  color: 'var(--accent)',
                  transition: 'box-shadow 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--glow-sm)'
                  e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.25)'
                }}
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid var(--border)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(var(--accent-rgb), 0.3)',
            letterSpacing: '0.08em',
          }}
        >
          {project.id}.preview
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            opacity: 0.4,
            letterSpacing: '0.06em',
          }}
        >
          {project.tags.join(' · ')}
        </span>
      </div>
    </div>
  )
}
