import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger } from '@/lib/motionVariants'
import { timelineEvents } from '@/data/timeline'
import { TimelineEventCard } from './TimelineEventCard'
import { DecodeText } from '@/components/hero/DecodeText'

export function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wheelLockRef = useRef(false)
  const [activeSlide, setActiveSlide] = useState(0)
  // total slides = 1 header + N events + 1 overview
  const totalSlides = timelineEvents.length + 2

  const workCount = timelineEvents.filter((e) => e.type === 'work').length
  const eduCount = timelineEvents.filter((e) => e.type === 'education').length

  const scrollToSlide = (idx: number) => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: idx * el.clientHeight, behavior: 'smooth' })
  }

  // Track active slide from scroll position
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const releaseWheelLock = () => {
      wheelLockRef.current = false
    }

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 6) return
      if (wheelLockRef.current) {
        e.preventDefault()
        return
      }

      e.preventDefault()
      const current = Math.round(el.scrollTop / el.clientHeight)
      const direction = e.deltaY > 0 ? 1 : -1
      const next = Math.max(0, Math.min(totalSlides - 1, current + direction))
      if (next === current) return

      wheelLockRef.current = true
      scrollToSlide(next)
      window.setTimeout(releaseWheelLock, 420)
    }

    const onScroll = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight)
      setActiveSlide(idx)
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current)
      }
      snapTimeoutRef.current = setTimeout(() => {
        const settled = Math.round(el.scrollTop / el.clientHeight)
        el.scrollTo({ top: settled * el.clientHeight, behavior: 'smooth' })
      }, 120)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', onScroll)
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current)
      }
    }
  }, [totalSlides])

  // Arrow key navigation — skip when shell input is focused
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return
      const el = containerRef.current
      if (!el) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const current = Math.round(el.scrollTop / el.clientHeight)
        scrollToSlide(Math.min(current + 1, totalSlides - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const current = Math.round(el.scrollTop / el.clientHeight)
        scrollToSlide(Math.max(current - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [totalSlides])

  return (
    <div style={{ position: 'relative' }}>
      {/* Slide dot navigation */}
      <div
        style={{
          position: 'fixed',
          right: '22px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 40,
        }}
      >
        {Array.from({ length: totalSlides }, (_, i) => {
          const active = activeSlide === i
          const label =
            i === 0 ? 'intro' : i === totalSlides - 1 ? 'overview' : timelineEvents[i - 1].year
          return (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${label}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 0',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  color: active ? 'var(--accent)' : 'transparent',
                  transition: 'color 0.2s',
                  userSelect: 'none',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  width: active ? '10px' : '6px',
                  height: active ? '10px' : '6px',
                  borderRadius: '50%',
                  background: active ? 'var(--accent)' : 'var(--border)',
                  boxShadow: active ? 'var(--glow-sm)' : 'none',
                  transition: 'all 0.25s',
                  flexShrink: 0,
                }}
              />
            </button>
          )
        })}
      </div>

      <div
        ref={containerRef}
        className="no-scrollbar"
        style={{
          height: 'calc(100vh - 56px)',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          scrollPaddingTop: '16px',
        }}
      >
        {/* Header slide */}
        <div
          style={{
            height: 'calc(100vh - 56px)',
            scrollSnapAlign: 'start',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Giant watermark */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '-2%',
              bottom: '-6%',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(10rem, 28vw, 22rem)',
              fontWeight: 700,
              lineHeight: 0.85,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(var(--accent-rgb), 0.07)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            2019→
          </span>

          <div
            style={{
              maxWidth: '900px',
              width: '100%',
              margin: '0 auto',
              padding: '0 2rem',
              position: 'relative',
            }}
          >
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.p
                variants={fadeUp}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                }}
              >
                <span style={{ color: 'var(--accent)' }}>~</span> $ git log --reverse ~/filipe
                <span className="cursor-blink" style={{ marginLeft: '4px' }}>▌</span>
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                }}
              >
                <DecodeText text="Progression" delay={250} />
              </motion.h1>
              <motion.p
                variants={fadeUp}
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  marginTop: '0.9rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                }}
              >
                Where I&apos;ve been — commit by commit
              </motion.p>

              {/* Stats strip */}
              <motion.div
                variants={fadeUp}
                style={{
                  display: 'flex',
                  gap: '2.5rem',
                  marginTop: '2.5rem',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '1.5rem',
                  maxWidth: '460px',
                }}
              >
                <HeaderStat value={String(workCount).padStart(2, '0')} label="roles" />
                <HeaderStat value={String(eduCount).padStart(2, '0')} label="education" />
                <HeaderStat value={`${new Date().getFullYear() - 2019}+`} label="years in tech" />
              </motion.div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              style={{
                marginTop: '3rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                style={{ color: 'var(--accent)', fontSize: '0.8rem', display: 'inline-flex' }}
              >
                ↓
              </motion.span>
              scroll or use arrow keys
            </motion.div>
          </div>
        </div>

        {/* Events wrapper — spine + snap sections */}
        <div style={{ position: 'relative' }}>
          {/* Vertical spine */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background:
                'linear-gradient(180deg, transparent 0%, var(--accent) 4%, var(--accent) 96%, transparent 100%)',
              boxShadow: 'var(--glow-sm)',
              transform: 'translateX(-50%)',
            }}
          />

          {timelineEvents.map((event, index) => (
            <div
              key={event.id}
              style={{
                height: 'calc(100vh - 56px)',
                scrollSnapAlign: 'start',
                display: 'flex',
                alignItems: 'center',
                padding: '0 2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Giant year watermark */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: index % 2 === 0 ? 'auto' : '2%',
                  right: index % 2 === 0 ? '2%' : 'auto',
                  transform: 'translateY(-50%)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(8rem, 22vw, 18rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(var(--accent-rgb), 0.08)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  transition: 'opacity 0.4s',
                  opacity: activeSlide === index + 1 ? 1 : 0.3,
                }}
              >
                {event.year}
              </span>

              {/* Slide counter */}
              <span
                style={{
                  position: 'absolute',
                  bottom: '28px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.16em',
                  color: 'var(--text-muted)',
                  userSelect: 'none',
                }}
              >
                [ {String(index + 1).padStart(2, '0')} / {String(timelineEvents.length).padStart(2, '0')} ]
              </span>

              <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', position: 'relative' }}>
                <TimelineEventCard
                  event={event}
                  side={index % 2 === 0 ? 'left' : 'right'}
                  isActive={activeSlide === index + 1}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Overview slide — compact view of all nodes */}
        <div
          style={{
            height: 'calc(100vh - 56px)',
            scrollSnapAlign: 'start',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              marginBottom: '3rem',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>~</span> $ git log --oneline
            <span className="cursor-blink" style={{ marginLeft: '4px' }}>▌</span>
          </motion.p>

          <div
            className="no-scrollbar fade-mask-x"
            style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: 0,
              width: '100%',
              maxWidth: '1280px',
              overflowX: 'auto',
              padding: '0.5rem 2rem',
            }}
          >
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.09 }}
                onClick={() => scrollToSlide(index + 1)}
                style={{
                  flex: '1 0 0',
                  minWidth: '180px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Year label */}
                <div
                  style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    color: 'var(--accent)',
                    height: '26px',
                  }}
                >
                  {event.year}
                </div>

                {/* Dot row — each column draws its own line segment so the
                    connector is always perfectly aligned with the dots */}
                <div style={{ position: 'relative', height: '24px', flexShrink: 0 }}>
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: index === 0 ? '50%' : 0,
                      right: index === timelineEvents.length - 1 ? '50%' : 0,
                      height: '1px',
                      background: 'rgba(var(--accent-rgb), 0.4)',
                      transform: 'translateY(-50%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      boxShadow: 'var(--glow-sm)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </div>

                {/* Card */}
                <div
                  style={{
                    margin: '0.9rem 0.45rem 0',
                    padding: '0.9rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                    borderTop: '2px solid rgba(var(--accent-rgb), 0.35)',
                    background: 'var(--bg-surface)',
                    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'rgba(var(--accent-rgb), 0.55)'
                    el.style.boxShadow = 'var(--glow-sm)'
                    el.style.transform = 'translateY(-3px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = 'var(--border)'
                    el.style.borderTopColor = 'rgba(var(--accent-rgb), 0.35)'
                    el.style.boxShadow = 'none'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(var(--accent-rgb), 0.7)',
                    }}
                  >
                    {event.type === 'work' ? 'work' : 'education'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                    }}
                  >
                    {event.title}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.66rem',
                      color: 'var(--text-muted)',
                      marginTop: 'auto',
                    }}
                  >
                    {event.institution}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              marginTop: '2.75rem',
              opacity: 0.5,
            }}
          >
            click an entry to jump to it
          </motion.p>
        </div>
      </div>
    </div>
  )
}

function HeaderStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--accent)',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </span>
    </div>
  )
}
