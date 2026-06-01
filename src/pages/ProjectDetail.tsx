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

function GooglePlayBadge({ href }: { href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        borderRadius: '6px',
        background: 'linear-gradient(135deg, #1a2a1a 0%, #0f1f0f 100%)',
        border: '1px solid rgba(var(--accent-rgb), 0.55)',
        boxShadow: '0 0 14px rgba(var(--accent-rgb), 0.22), inset 0 1px 0 rgba(var(--accent-rgb), 0.12)',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          '0 0 28px rgba(var(--accent-rgb), 0.45), inset 0 1px 0 rgba(var(--accent-rgb), 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          '0 0 14px rgba(var(--accent-rgb), 0.22), inset 0 1px 0 rgba(var(--accent-rgb), 0.12)'
      }}
    >
      {/* Play Store triangle icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M3.18 23.76c.4.22.86.24 1.28.04l13.1-7.56-3.02-3.02L3.18 23.76z"
          fill="var(--accent)"
          opacity="0.7"
        />
        <path
          d="M21.54 10.27a1.96 1.96 0 0 0 0 3.46l-17.36 10a2 2 0 0 1-.04-3.5L17.56 12 4.14 3.77a2 2 0 0 1 .04-3.5l17.36 10z"
          fill="var(--accent)"
        />
        <path
          d="M3.18.24C2.78.04 2.32.06 1.92.28L14.54 13.22l3.02-3.02L3.18.24z"
          fill="var(--accent)"
          opacity="0.7"
        />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.12em',
            color: 'rgba(var(--accent-rgb), 0.65)',
            textTransform: 'uppercase',
          }}
        >
          Get it on
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--accent)',
            letterSpacing: '0.01em',
            lineHeight: 1,
          }}
        >
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

function PreviewPanel({ project }: { project: Project }) {
  const panelBase: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    overflow: 'hidden',
    padding: '1rem',
  }

  const metaStrip = (
    <div
      style={{
        borderTop: '1px solid var(--border)',
        marginTop: '1rem',
        paddingTop: '10px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(var(--accent-rgb), 0.3)', letterSpacing: '0.08em' }}>
        {project.id}.preview
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', opacity: 0.4, letterSpacing: '0.06em' }}>
        {project.tags.join(' · ')}
      </span>
    </div>
  )

  const featuredBadge = project.featured && (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
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
  )

  if (project.embedUrl) {
    return (
      <div style={panelBase}>
        {featuredBadge}
        <EmbedPanel project={project} />
        {metaStrip}
      </div>
    )
  }

  if (project.images && project.images.length > 0) {
    return (
      <div style={panelBase}>
        {featuredBadge}
        <ImageGallery images={project.images} />
        {metaStrip}
      </div>
    )
  }

  if (project.icon) {
    return (
      <div style={panelBase}>
        {featuredBadge}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 0',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '120px',
              height: '120px',
            }}
          >
            {/* Glow ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-16px',
                borderRadius: '32px',
                background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <img
              src={project.icon}
              alt={`${project.title} icon`}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '22px',
                boxShadow: '0 0 40px rgba(var(--accent-rgb), 0.25), 0 8px 32px rgba(0,0,0,0.6)',
                display: 'block',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
        </div>
        {metaStrip}
      </div>
    )
  }

  // Fallback — no preview
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
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(var(--accent-rgb), 0.3)', letterSpacing: '0.08em' }}>
          {project.id}.preview
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', opacity: 0.4, letterSpacing: '0.06em' }}>
          {project.tags.join(' · ')}
        </span>
      </div>
    </div>
  )
}
