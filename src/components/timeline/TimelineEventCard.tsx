import { motion } from 'framer-motion'
import { GraduationCap, Briefcase } from 'lucide-react'
import type { TimelineEvent } from '@/data/timeline'

interface Props {
  event: TimelineEvent
  side: 'left' | 'right'
  isActive?: boolean
}

export function TimelineEventCard({ event, side, isActive }: Props) {
  const isLeft = side === 'left'
  const Icon = event.icon === 'graduation' ? GraduationCap : Briefcase

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 32px 1fr',
        alignItems: 'center',
      }}
    >
      {/* Left column */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '2rem' }}>
        {isLeft && <Card event={event} Icon={Icon} side="left" />}
      </div>

      {/* Connector dot on spine */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          width: isActive ? '16px' : '12px',
          height: isActive ? '16px' : '12px',
          borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: isActive ? 'var(--glow-lg)' : 'var(--glow-md)',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          transition: 'width 0.3s, height 0.3s, box-shadow 0.3s',
        }}
      />

      {/* Right column */}
      <div style={{ paddingLeft: '2rem' }}>
        {!isLeft && <Card event={event} Icon={Icon} side="right" />}
      </div>
    </div>
  )
}

function Card({
  event,
  Icon,
  side,
}: {
  event: TimelineEvent
  Icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>
  side: 'left' | 'right'
}) {
  const xOffset = side === 'left' ? -50 : 50

  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '1.25rem 1.5rem',
        maxWidth: '380px',
        width: '100%',
        transition: 'border-color 0.2s, box-shadow 0.2s',
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
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '0.75rem' }}>
        <Icon
          size={16}
          style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '3px' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.25rem',
              lineHeight: 1.3,
            }}
          >
            {event.title}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.03em',
            }}
          >
            {event.institution}
          </p>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--accent)',
            opacity: 0.75,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {event.period}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: 1.65,
          marginBottom: event.tags.length > 0 ? '1rem' : 0,
        }}
      >
        {event.description}
      </p>

      {/* Tags */}
      {event.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {event.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                color: 'var(--accent)',
                background: 'rgba(var(--accent-rgb), 0.07)',
                border: '1px solid rgba(var(--accent-rgb), 0.18)',
                borderRadius: '2px',
                padding: '0.2rem 0.5rem',
                letterSpacing: '0.04em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
