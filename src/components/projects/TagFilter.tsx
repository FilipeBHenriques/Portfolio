import { motion } from 'framer-motion'

interface TagFilterProps {
  tags: string[]
  active: string | null
  onChange: (tag: string | null) => void
}

export function TagFilter({ tags, active, onChange }: TagFilterProps) {
  return (
    <div
      className="no-scrollbar"
      style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
      }}
    >
      <Pill
        label="All"
        isActive={active === null}
        onClick={() => onChange(null)}
      />
      {tags.map((tag) => (
        <Pill
          key={tag}
          label={tag}
          isActive={active === tag}
          onClick={() => onChange(tag)}
        />
      ))}
    </div>
  )
}

function Pill({ label, isActive, onClick }: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      layout
      onClick={onClick}
      style={{
        flexShrink: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        letterSpacing: '0.08em',
        padding: '4px 12px',
        borderRadius: '2px',
        cursor: 'pointer',
        border: '1px solid',
        transition: 'box-shadow 0.2s',
        background: isActive ? 'var(--accent)' : 'transparent',
        color: isActive ? '#080808' : 'var(--text-muted)',
        borderColor: isActive ? 'var(--accent)' : 'var(--border)',
      }}
      whileHover={!isActive ? { borderColor: 'var(--text-muted)', color: 'var(--text-primary)' } : {}}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.button>
  )
}
