import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const LINKS = [
  { to: '/projects', label: 'projects' },
  { to: '/games', label: 'games' },
  { to: '/progression', label: 'progression' },
]

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        height: '56px',
        background: 'rgba(8, 8, 8, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link
        to="/"
        style={{
          color: 'var(--accent)',
          textDecoration: 'none',
          fontSize: '0.875rem',
          letterSpacing: '0.05em',
          fontFamily: 'var(--font-mono)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>&gt;</span>
        filipe.dev
        <span className="cursor-blink" style={{ fontSize: '0.75rem' }}>▌</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
        {LINKS.map((link) => {
          const active = pathname === link.to || pathname.startsWith(`${link.to}/`)
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                position: 'relative',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
                padding: '4px 2px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              <span style={{ color: active ? 'var(--accent)' : 'transparent', transition: 'color 0.2s' }}>
                ./
              </span>
              {link.label}
              {active && (
                <motion.span
                  layoutId="nav-underline"
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: '-2px',
                    height: '1px',
                    background: 'var(--accent)',
                    boxShadow: '0 0 6px rgba(var(--accent-rgb), 0.8)',
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
