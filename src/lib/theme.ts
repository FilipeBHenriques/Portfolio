export interface ThemePalette {
  accent: string
  accentRgb: string
  bgBase: string
  bgSurface: string
  textPrimary: string
  textMuted: string
  border: string
}

const FALLBACK_THEME: ThemePalette = {
  accent: '#39ff14',
  accentRgb: '57, 255, 20',
  bgBase: '#080808',
  bgSurface: '#111111',
  textPrimary: '#f0f0f0',
  textMuted: '#666666',
  border: '#222222',
}

export function getThemePalette(): ThemePalette {
  if (typeof window === 'undefined') return FALLBACK_THEME

  const styles = window.getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback

  return {
    accent: read('--accent', FALLBACK_THEME.accent),
    accentRgb: read('--accent-rgb', FALLBACK_THEME.accentRgb),
    bgBase: read('--bg-base', FALLBACK_THEME.bgBase),
    bgSurface: read('--bg-surface', FALLBACK_THEME.bgSurface),
    textPrimary: read('--text-primary', FALLBACK_THEME.textPrimary),
    textMuted: read('--text-muted', FALLBACK_THEME.textMuted),
    border: read('--border', FALLBACK_THEME.border),
  }
}

export function rgba(rgb: string, alpha: number) {
  return `rgba(${rgb}, ${alpha})`
}
