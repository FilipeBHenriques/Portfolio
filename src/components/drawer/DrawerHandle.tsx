interface DrawerHandleProps {
  isOpen: boolean
  onClick: () => void
}

export function DrawerHandle({ isOpen, onClick }: DrawerHandleProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={isOpen ? 'Close projects drawer' : 'Open projects drawer'}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40px',
        background: 'rgba(8, 8, 8, 0.95)',
        borderTop: '1px solid var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 40,
        userSelect: 'none',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(var(--accent-rgb), 0.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(8,8,8,0.95)'
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{
          display: 'inline-block',
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.3s',
          lineHeight: 1,
        }}>▲</span>
        Projects
      </span>
    </div>
  )
}
