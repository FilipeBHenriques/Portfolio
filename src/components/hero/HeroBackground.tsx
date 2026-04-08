import { useEffect, useRef } from 'react'

const HEX_CHARS = '0123456789ABCDEF'
const EXTRA_CHARS = '#@$&%?!><|~'
const EMOTICONS = [':)', ':/', '^^', ':D', ':3', 'XD', ';)', ':o', 'o.O']

function randChar(): string {
  const r = Math.random()
  if (r < 0.75) return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
  if (r < 0.92) return EXTRA_CHARS[Math.floor(Math.random() * EXTRA_CHARS.length)]
  return EMOTICONS[Math.floor(Math.random() * EMOTICONS.length)]
}

const FONT_SIZE = 13
const COL_SPACING = 22
const CHARS_PER_COL = 16
const BASE_VY_MIN = 0.4
const BASE_VY_MAX = 1.0
const FORCE_RADIUS = 185
const MOUSE_FORCE = 0.13
const MOTION_BOOST = 0.08
const DRAG_X = 0.92
const DRAG_Y = 0.97
const RESTORE_VY = 0.03
const SPRING_K = 0.018
const MAX_VX = 5.5
const MAX_VY_BOOST = 3.2

interface Particle {
  homeX: number
  x: number
  y: number
  vx: number
  vy: number
  baseVy: number
  char: string
  tick: number
  rate: number
}

interface MouseState {
  x: number
  y: number
  vx: number
  vy: number
  active: boolean
}

function makeParticle(homeX: number, y: number): Particle {
  const baseVy = BASE_VY_MIN + Math.random() * (BASE_VY_MAX - BASE_VY_MIN)
  return {
    homeX,
    x: homeX + (Math.random() - 0.5) * 4,
    y,
    vx: 0,
    vy: baseVy,
    baseVy,
    char: randChar(),
    tick: Math.floor(Math.random() * 20),
    rate: 10 + Math.floor(Math.random() * 18),
  }
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseState = useRef<MouseState>({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    active: false,
  })
  const particles = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return
    const ctx = context

    const c = canvas

    function buildParticles() {
      const cols = Math.ceil(c.width / COL_SPACING)
      const pList: Particle[] = []

      for (let ci = 0; ci < cols; ci++) {
        const hx = ci * COL_SPACING + COL_SPACING / 2
        for (let j = 0; j < CHARS_PER_COL; j++) {
          const y = (j / CHARS_PER_COL) * c.height + Math.random() * (c.height / CHARS_PER_COL)
          pList.push(makeParticle(hx, y))
        }
      }

      particles.current = pList
    }

    function resize() {
      c.width = c.offsetWidth
      c.height = c.offsetHeight
      buildParticles()
    }

    function draw() {
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.textAlign = 'center'

      const ms = mouseState.current

      for (const p of particles.current) {
        if (ms.active) {
          const dx = p.x - ms.x
          const dy = p.y - ms.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < FORCE_RADIUS && dist > 1) {
            const strength = (1 - dist / FORCE_RADIUS) ** 2
            const motion = Math.min(1, Math.sqrt(ms.vx * ms.vx + ms.vy * ms.vy) / 24)
            const totalForce = MOUSE_FORCE + motion * MOTION_BOOST

            p.vx += (dx / dist) * totalForce * strength
            p.vy += (dy / dist) * totalForce * strength * 0.6

            if (motion > 0.02) {
              p.vx += ms.vx * 0.03 * strength
              p.vy += ms.vy * 0.02 * strength
            }
          }
        }

        p.vx += (p.homeX - p.x) * SPRING_K
        p.vy += (p.baseVy - p.vy) * RESTORE_VY

        p.vx *= DRAG_X
        p.vy *= DRAG_Y

        if (p.vx > MAX_VX) p.vx = MAX_VX
        if (p.vx < -MAX_VX) p.vx = -MAX_VX
        if (p.vy > p.baseVy + MAX_VY_BOOST) p.vy = p.baseVy + MAX_VY_BOOST
        if (p.vy < -MAX_VY_BOOST) p.vy = -MAX_VY_BOOST

        p.x += p.vx
        p.y += p.vy

        if (p.y > c.height + FONT_SIZE) {
          p.y = -FONT_SIZE - Math.random() * 60
          p.vy = p.baseVy
          p.vx = 0
          p.x = p.homeX
          p.char = randChar()
        }

        if (p.y < -(c.height * 0.3)) {
          p.y = -FONT_SIZE
          p.vy = Math.abs(p.vy)
        }

        if (p.x < -30) p.x = c.width + 15
        if (p.x > c.width + 30) p.x = -15

        p.tick++
        if (p.tick >= p.rate) {
          p.char = randChar()
          p.tick = 0
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const excited = speed > 2.5
        const isEmote = p.char.length > 1
        const base = isEmote ? 0.14 : 0.07

        let alpha: number
        if (excited) {
          alpha = Math.min(0.95, base + (speed - 2.5) * 0.1)
        } else {
          alpha = base + Math.random() * 0.025
        }

        const fontSize = isEmote ? 10 : FONT_SIZE
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`

        if (excited && speed > 5) {
          ctx.fillStyle = `rgba(200, 255, 180, ${Math.min(1, alpha)})`
        } else if (isEmote) {
          ctx.fillStyle = `rgba(57, 255, 20, ${Math.min(0.5, alpha * 1.4)})`
        } else {
          ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`
        }

        ctx.fillText(p.char, p.x, p.y)
      }

      ms.vx *= 0.82
      ms.vy *= 0.82

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    rafRef.current = requestAnimationFrame(draw)

    const ro = new ResizeObserver(resize)
    ro.observe(c)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return

    const clearPointer = () => {
      mouseState.current.x = -9999
      mouseState.current.y = -9999
      mouseState.current.vx = 0
      mouseState.current.vy = 0
      mouseState.current.active = false
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = c.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!inside) {
        clearPointer()
        return
      }

      const nextX = e.clientX - rect.left
      const nextY = e.clientY - rect.top
      const current = mouseState.current

      if (current.active) {
        current.vx = nextX - current.x
        current.vy = nextY - current.y
      } else {
        current.vx = 0
        current.vy = 0
      }

      current.x = nextX
      current.y = nextY
      current.active = true
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', clearPointer)
    window.addEventListener('blur', clearPointer)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', clearPointer)
      window.removeEventListener('blur', clearPointer)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <MouseSpotlight />
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          width: '120px',
          height: '120px',
          borderTop: '1px solid rgba(57,255,20,0.12)',
          borderLeft: '1px solid rgba(57,255,20,0.12)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '40px',
          width: '120px',
          height: '120px',
          borderBottom: '1px solid rgba(57,255,20,0.12)',
          borderRight: '1px solid rgba(57,255,20,0.12)',
        }}
      />
    </div>
  )
}

function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let lx = -999
    let ly = -999
    let visible = false
    let rafId = 0

    const onMove = (e: PointerEvent) => {
      if (!el.parentElement) return

      const rect = el.parentElement.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!inside) {
        visible = false
        el.style.opacity = '0'
        return
      }

      lx = e.clientX
      ly = e.clientY
      visible = true
    }

    const hide = () => {
      visible = false
      el.style.opacity = '0'
    }

    const tick = () => {
      if (visible && lx > 0 && el.parentElement) {
        const rect = el.parentElement.getBoundingClientRect()
        el.style.transform = `translate(${lx - rect.left}px, ${ly - rect.top}px)`
        el.style.opacity = '1'
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '360px',
        height: '360px',
        marginLeft: '-180px',
        marginTop: '-180px',
        background: 'radial-gradient(circle, rgba(57,255,20,0.055) 0%, rgba(57,255,20,0.01) 50%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.4s',
        willChange: 'transform',
      }}
    />
  )
}
