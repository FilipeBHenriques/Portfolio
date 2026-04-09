import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { drawerSpring } from '@/lib/motionVariants'
import { projects } from '@/data/projects'
import { DrawerHandle } from './DrawerHandle'
import { ProjectCarousel } from './ProjectCarousel'

interface ProjectsDrawerProps {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
}

export function ProjectsDrawer({ isOpen, onClose, onToggle }: ProjectsDrawerProps) {
  return (
    <>
      <DrawerHandle isOpen={isOpen} onClick={onToggle} />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 30,
              }}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={drawerSpring}
              style={{
                position: 'fixed',
                bottom: '40px', // above handle
                left: 0,
                right: 0,
                height: '65vh',
                background: 'var(--bg-surface)',
                borderTop: '1px solid var(--border)',
                zIndex: 35,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 2rem 0.75rem',
                borderBottom: '1px solid var(--border)',
              }}>
                <div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}>
                    Selected Work
                  </span>
                </div>
                <Link
                  to="/projects"
                  onClick={onClose}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    border: '1px solid rgba(var(--accent-rgb), 0.3)',
                    borderRadius: '2px',
                    padding: '3px 10px',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--glow-sm)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  View All →
                </Link>
              </div>

              {/* Carousel */}
              <div style={{ flex: 1, overflow: 'hidden', paddingTop: '1rem' }}>
                <ProjectCarousel projects={projects} onClose={onClose} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
