// src/components/hero/MatrixRain.tsx
import { useState, useEffect } from 'react'
import { getThemePalette, rgba } from '@/lib/theme'

const CHARS = 'アイウエオカキクケコサシスセソタナニヌネノマトリックス01ABCDEF9Z'
const COLS = 26
const ROWS = 14

function rand() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

interface Col {
  head: number    // current head row (can be negative = above visible area)
  trail: number   // trail length (rows behind head that are lit)
  period: number  // ticks per step
  tick: number    // countdown to next move
  chars: string[] // character at each visible row
}

function makeCol(initialDelay = 0): Col {
  return {
    head: -Math.floor(Math.random() * 8) - initialDelay,
    trail: 4 + Math.floor(Math.random() * 5),
    period: 1 + Math.floor(Math.random() * 3),
    tick: Math.floor(Math.random() * 4),
    chars: Array.from({ length: ROWS }, () => rand()),
  }
}

export function MatrixRain() {
  const [cols, setCols] = useState<Col[]>(() =>
    Array.from({ length: COLS }, (_, i) => makeCol(Math.floor(i / 4)))
  )

  useEffect(() => {
    const id = setInterval(() => {
      setCols(prev =>
        prev.map(col => {
          const nextTick = col.tick - 1
          if (nextTick > 0) return { ...col, tick: nextTick }

          const nextHead = col.head + 1
          const newChars = [...col.chars]
          if (nextHead >= 0 && nextHead < ROWS) {
            newChars[nextHead] = rand()
          }

          if (nextHead > ROWS + col.trail) {
            return makeCol()
          }

          return { ...col, head: nextHead, tick: col.period, chars: newChars }
        })
      )
    }, 80)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ display: 'flex', userSelect: 'none' }}>
      {cols.map((col, c) => (
        <div key={c} style={{ display: 'flex', flexDirection: 'column' }}>
          {Array.from({ length: ROWS }, (_, r) => {
            const theme = getThemePalette()
            const dist = col.head - r
            const isHead = dist === 0
            const inTrail = dist > 0 && dist <= col.trail
            const alpha = inTrail ? Math.max(0.05, 1 - dist / col.trail) : 0

            return (
              <span
                key={r}
                style={{
                  display: 'block',
                  width: '1.1ch',
                  height: '1.5em',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  lineHeight: 1.5,
                  color: isHead ? '#ffffff' : 'var(--accent)',
                  opacity: isHead ? 1 : inTrail ? alpha : 0,
                  textShadow: isHead
                    ? '0 0 10px #ffffff, 0 0 4px #ffffff'
                    : inTrail
                    ? `0 0 4px ${rgba(theme.accentRgb, 0.92)}`
                    : 'none',
                }}
              >
                {isHead || inTrail ? col.chars[r] ?? '' : '\u00a0'}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}
