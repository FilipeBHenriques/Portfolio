import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Snake } from '@/components/games/Snake'
import { Pong } from '@/components/games/Pong'
import { Breakout } from '@/components/games/Breakout'
import { fadeUp, stagger } from '@/lib/motionVariants'

// ─── Types ────────────────────────────────────────────────────────────────────

type GameId = 'snake' | 'pong' | 'breakout'

interface GameDef {
  id: GameId
  index: string
  title: string
  descriptor: string
  component: React.ComponentType
}

// ─── Game catalogue ───────────────────────────────────────────────────────────

const GAMES: GameDef[] = [
  {
    id: 'snake',
    index: '01',
    title: 'Snake',
    descriptor: 'WASD · Grid · Classic',
    component: Snake,
  },
  {
    id: 'pong',
    index: '02',
    title: 'Pong',
    descriptor: 'W/S · Paddle · Versus AI',
    component: Pong,
  },
  {
    id: 'breakout',
    index: '03',
    title: 'Breakout',
    descriptor: 'Mouse · ← → · Levels',
    component: Breakout,
  },
]

// ─── GameCard ─────────────────────────────────────────────────────────────────

interface GameCardProps {
  game: GameDef
  onClick: () => void
}

function GameCard({ game, onClick }: GameCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        y: -4,
        borderColor: 'var(--accent)',
        boxShadow: 'var(--glow-md)',
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      style={{
        width: '300px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '1.5rem',
        cursor: 'pointer',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.12em',
          color: 'var(--accent)',
          marginBottom: '0.75rem',
        }}
      >
        {game.index}
      </p>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}
      >
        {game.title}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
        }}
      >
        {game.descriptor}
      </p>
    </motion.div>
  )
}

// ─── GameModal ────────────────────────────────────────────────────────────────

interface GameModalProps {
  game: GameDef | null
  onClose: () => void
}

function GameModal({ game, onClose }: GameModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!game) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [game, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    if (game) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [game])

  const GameComponent = game?.component ?? null

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          key={game.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header bar */}
          <div
            style={{
              height: '48px',
              flexShrink: 0,
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1.25rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                letterSpacing: '0.08em',
                color: 'var(--accent)',
              }}
            >
              {game.title.toLowerCase()}
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                color: 'var(--text-muted)',
                lineHeight: 1,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
              aria-label="Close game"
            >
              [×]
            </button>
          </div>

          {/* Game area */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {GameComponent && <GameComponent />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Games page ───────────────────────────────────────────────────────────────

export function Games() {
  const [activeGame, setActiveGame] = useState<GameDef | null>(null)

  const handleClose = useCallback(() => setActiveGame(null), [])

  return (
    <PageWrapper>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 6rem' }}>
        {/* Page header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: '3rem' }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '0.5rem',
            }}
          >
            /games
          </motion.p>
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            Games
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--text-muted)',
            }}
          >
            Playable in browser.
          </motion.p>
        </motion.div>

        {/* Game cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center',
          }}
        >
          {GAMES.map((game) => (
            <motion.div key={game.id} variants={fadeUp}>
              <GameCard game={game} onClick={() => setActiveGame(game)} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Full-screen modal */}
      <GameModal game={activeGame} onClose={handleClose} />
    </PageWrapper>
  )
}
