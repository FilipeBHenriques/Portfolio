import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { Code2, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight, Shield } from 'lucide-react'
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

function GooglePlayBadge({ href }: { href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 20px 10px 14px',
        borderRadius: '8px',
        background: 'rgba(var(--accent-rgb), 0.05)',
        border: '1px solid rgba(var(--accent-rgb), 0.45)',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: '0 0 14px rgba(var(--accent-rgb), 0.2), inset 0 1px 0 rgba(var(--accent-rgb), 0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.8)'
        e.currentTarget.style.boxShadow = '0 0 28px rgba(var(--accent-rgb), 0.45), 0 0 60px rgba(var(--accent-rgb), 0.15), inset 0 1px 0 rgba(var(--accent-rgb), 0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.45)'
        e.currentTarget.style.boxShadow = '0 0 14px rgba(var(--accent-rgb), 0.2), inset 0 1px 0 rgba(var(--accent-rgb), 0.06)'
      }}
    >
      {/* Google Play 4-color icon */}
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
        <path d="M1 0.5L10 5.75L7 11L1 11Z" fill="#4285F4"/>
        <path d="M10 5.75L19 11L7 11Z" fill="#FBBC04"/>
        <path d="M7 11L19 11L10 16.25Z" fill="#EA4335"/>
        <path d="M1 11L7 11L10 16.25L1 21.5Z" fill="#34A853"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.57rem',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.45)',
          textTransform: 'uppercase',
        }}>
          Get it on
        </span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '0.01em',
          lineHeight: 1,
        }}>
          Google Play
        </span>
      </div>
    </motion.a>
  )
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

            {/* Tech stack */}
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
            <motion.div
              variants={fadeUp}
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '3rem',
              }}
            >
              {/* Google Play — shiny, first in row */}
              {project.storeUrl && (
                <GooglePlayBadge href={project.storeUrl} />
              )}

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
                    transition: 'border-color 0.2s',
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

            {/* cd .. */}
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

function ImageGallery({ images, expanded = false, floating = false }: { images: string[]; expanded?: boolean; floating?: boolean }) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  return (
    <div style={{ position: 'relative', width: '100%', ...(floating ? { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 } : {}) }}>
      <div
        style={{
          width: '100%',
          ...(floating
            ? { flex: 1, minHeight: 0 }
            : { aspectRatio: '9/16', maxHeight: expanded ? '900px' : '520px', transition: 'max-height 0.4s ease' }
          ),
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
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>

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

function EmbedPanel({ project, expanded = false, floating = false }: { project: Project; expanded?: boolean; floating?: boolean }) {
  return (
    <div style={{ width: '100%', ...(floating ? { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 } : {}) }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          ...(floating ? { flex: 1, minHeight: 0 } : { height: expanded ? '680px' : '400px', transition: 'height 0.4s ease' }),
          background: '#000',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={project.embedUrl}
          title={project.title}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          allow="accelerometer; autoplay"
        />
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
      </div>
      <div style={{ padding: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
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

function VideoPanel({ project, expanded = false, floating = false }: { project: Project; expanded?: boolean; floating?: boolean }) {
  return (
    <div style={{ width: '100%', ...(floating ? { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 } : {}) }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          ...(floating
            ? { flex: 1, minHeight: 0 }
            : { aspectRatio: '16/9', maxHeight: expanded ? '720px' : '420px', transition: 'max-height 0.4s ease' }),
          background: '#000',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <video
          src={project.videoUrl}
          title={project.title}
          controls
          preload="metadata"
          playsInline
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', background: '#000' }}
        />
      </div>
      <div style={{ padding: '8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(var(--accent-rgb), 0.4)',
            letterSpacing: '0.08em',
          }}
        >
          ● recorded demo
        </span>
        <a
          href={project.videoUrl}
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
          open video ↗
        </a>
      </div>
    </div>
  )
}

function PreviewPanel({ project }: { project: Project }) {
  const canFloat = Boolean(project.floatingPreview)
  const [expanded, setExpanded] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [winWidth, setWinWidth] = useState(0)
  const [winHeight, setWinHeight] = useState(0)
  const [ready, setReady] = useState(false)
  const ghostRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  // Measure ghost div position before first paint so window appears in the right place
  useLayoutEffect(() => {
    if (!canFloat || !ghostRef.current) return
    const rect = ghostRef.current.getBoundingClientRect()
    setPos({ x: rect.left, y: rect.top })
    setWinWidth(rect.width)
    setWinHeight(Math.min(Math.max(rect.height, 460), window.innerHeight - rect.top - 24))
    setReady(true)
  }, [canFloat])

  const beginDrag = (e: React.MouseEvent) => {
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    const onMove = (ev: MouseEvent) => {
      setPos({ x: ev.clientX - dragOffset.current.x, y: ev.clientY - dragOffset.current.y })
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    e.preventDefault()
  }

  const beginResize = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startY = e.clientY
    const startW = winWidth
    const startH = winHeight
    const onMove = (ev: MouseEvent) => {
      setWinWidth(Math.max(320, startW + ev.clientX - startX))
      setWinHeight(Math.max(200, startH + ev.clientY - startY))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    e.preventDefault()
    e.stopPropagation()
  }

  const previewContent = (isFloating: boolean) => project.embedUrl
    ? <EmbedPanel project={project} expanded={expanded} floating={isFloating} />
    : project.videoUrl
    ? <VideoPanel project={project} expanded={expanded} floating={isFloating} />
    : project.images?.length
    ? <ImageGallery images={project.images} expanded={expanded} floating={isFloating} />
    : null

  const staticBody = previewContent(false) ?? (
    project.icon ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <div style={{ position: 'absolute', inset: '-16px', borderRadius: '32px', background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <img src={project.icon} alt={`${project.title} icon`} style={{ width: '120px', height: '120px', borderRadius: '22px', boxShadow: '0 0 40px rgba(var(--accent-rgb), 0.25), 0 8px 32px rgba(0,0,0,0.6)', display: 'block', position: 'relative', zIndex: 1 }} />
        </div>
      </div>
    ) : (
      <div style={{ minHeight: '340px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span aria-hidden style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%) rotate(-15deg)', fontFamily: 'var(--font-display)', fontSize: '7rem', fontWeight: 700, color: 'var(--accent)', opacity: 0.04, whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', letterSpacing: '-0.04em' }}>{project.id}</span>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)', pointerEvents: 'none' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.12em', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: '2px', position: 'relative', zIndex: 1 }}>[ NO PREVIEW ]</span>
      </div>
    )
  )

  const terminalBar = (draggable: boolean) => (
    <div
      onMouseDown={draggable ? beginDrag : undefined}
      style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '8px', cursor: draggable ? 'grab' : 'default', userSelect: 'none', flexShrink: 0 }}
    >
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e', flexShrink: 0 }} />
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
          title={expanded ? 'Collapse' : 'Expand'}
          style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'transform 0.15s' }}
          onMouseEnter={ev => ((ev.currentTarget as HTMLButtonElement).style.transform = 'scale(1.4)')}
          onMouseLeave={ev => ((ev.currentTarget as HTMLButtonElement).style.transform = 'scale(1)')}
        />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', flex: 1, textAlign: 'center', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        ~/{project.id}/preview
      </span>
      {project.featured && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#080808', background: 'var(--accent)', borderRadius: '2px', padding: '2px 6px', boxShadow: 'var(--glow-sm)', flexShrink: 0 }}>featured</span>
      )}
    </div>
  )

  const metaBar = (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(var(--accent-rgb), 0.3)', letterSpacing: '0.08em' }}>{project.id}.preview</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', opacity: 0.4, letterSpacing: '0.06em' }}>{project.tags.join(' · ')}</span>
    </div>
  )

  // Floating terminal — always a free window, ghost div holds the layout space
  if (canFloat) {
    return (
      <>
        <div ref={ghostRef} style={{ width: '100%', minHeight: '460px' }} />
        {ready && createPortal(
          <div
            style={{
              position: 'fixed',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: `${winWidth}px`,
              height: `${winHeight}px`,
              zIndex: 9999,
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {terminalBar(true)}
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
              {previewContent(true) ?? staticBody}
            </div>
            {metaBar}
            {/* Resize grip — bottom-right corner */}
            <div
              onMouseDown={beginResize}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '32px',
                height: '32px',
                cursor: 'se-resize',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                padding: '6px',
                color: 'rgba(255,255,255,0.4)',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.color = 'var(--accent)')}
              onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.color = 'rgba(255,255,255,0.4)')}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="2" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="6" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
                <circle cx="10" cy="6" r="1.5" fill="currentColor"/>
                <circle cx="10" cy="2" r="1.5" fill="currentColor"/>
              </svg>
            </div>
          </div>,
          document.body
        )}
      </>
    )
  }

  // Normal docked panel (floatingPreview not set)
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
      {terminalBar(false)}
      <div style={{ padding: '1rem' }}>{staticBody}</div>
      {metaBar}
    </div>
  )
}
