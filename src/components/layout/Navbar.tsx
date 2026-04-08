import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

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
        className="font-mono"
        style={{
          color: 'var(--accent)',
          textDecoration: 'none',
          fontSize: '0.875rem',
          letterSpacing: '0.05em',
          fontFamily: 'var(--font-mono)',
        }}
      >
        &gt; filipe.dev
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link
          to="/projects"
          style={{
            color: pathname === '/projects' ? 'var(--accent)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em',
            padding: '4px 0',
            borderBottom: pathname === '/projects'
              ? '1px solid var(--accent)'
              : '1px solid transparent',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (pathname !== '/projects') {
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.borderBottomColor = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== '/projects') {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderBottomColor = 'transparent'
            }
          }}
        >
          Projects
        </Link>
        <Link
          to="/games"
          style={{
            color: pathname === '/games' ? 'var(--accent)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.05em',
            padding: '4px 0',
            borderBottom: pathname === '/games'
              ? '1px solid var(--accent)'
              : '1px solid transparent',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (pathname !== '/games') {
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.borderBottomColor = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== '/games') {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderBottomColor = 'transparent'
            }
          }}
        >
          Games
        </Link>
      </div>
    </motion.nav>
  )
}
