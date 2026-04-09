import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motionVariants'
import { timelineEvents } from '@/data/timeline'
import { TimelineEventCard } from './TimelineEventCard'

export function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wheelLockRef = useRef(false)
  const [activeSlide, setActiveSlide] = useState(0)
  // total slides = 1 header + N events + 1 overview
  const totalSlides = timelineEvents.length + 2

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
    <div
      ref={containerRef}
      className="no-scrollbar"
      style={{
        height: 'calc(100vh - 56px)',
        overflowY: 'scroll',
        scrollSnapType: 'y proximity',
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
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            width: '100%',
            margin: '0 auto',
            padding: '0 2rem',
            position: 'relative',
          }}
        >
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Progression
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginTop: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
              }}
            >
              Where I&apos;ve been
            </p>
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
            <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>↓</span>
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
            background: 'var(--accent)',
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
            }}
          >
            <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
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
        }}
      >
        {/* Horizontal line */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: '50%',
            height: '2px',
            background: 'var(--accent)',
            boxShadow: 'var(--glow-sm)',
            transform: 'translateY(-50%)',
            opacity: 0.7,
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '2.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          full timeline
        </motion.p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '1240px',
            position: 'relative',
            zIndex: 1,
            transform: 'scale(0.96)',
            transformOrigin: 'center center',
            overflowX: 'auto',
            padding: '1.25rem 0.75rem',
          }}
        >
          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: index % 2 === 0 ? -18 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => scrollToSlide(index + 1)}
              style={{
                display: 'grid',
                gridTemplateRows: '1fr 20px 1fr',
                alignItems: 'center',
                cursor: 'pointer',
                minWidth: '250px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '0.8rem' }}>
                {index % 2 === 0 && (
                  <OverviewCard event={event} align="center" />
                )}
              </div>

              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: 'var(--glow-sm)',
                  margin: '0 auto',
                  flexShrink: 0,
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.5)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
              />

              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.8rem' }}>
                {index % 2 !== 0 && (
                  <OverviewCard event={event} align="center" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            marginTop: '2.5rem',
            position: 'relative',
            zIndex: 1,
            opacity: 0.5,
          }}
        >
          click a node to jump to it
        </motion.p>
      </div>
    </div>
  )
}

function OverviewCard({
  event,
  align,
}: {
  event: { year: string; title: string; institution: string }
  align: 'left' | 'right' | 'center'
}) {
  return (
    <div
      style={{
        textAlign: align,
        padding: '12px 14px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        maxWidth: '320px',
        transformOrigin: align === 'left' ? 'left center' : align === 'right' ? 'right center' : 'center center',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--accent)'
        el.style.boxShadow = 'var(--glow-sm)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = 'none'
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
        }}
      >
        {event.title}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          marginTop: '4px',
        }}
      >
        {event.institution} · {event.year}
      </div>
    </div>
  )
}
