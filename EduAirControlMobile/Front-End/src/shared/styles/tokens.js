// Tokens de tema 1:1 con index.css y design-system.css del web.
// Unión de la paleta legacy del móvil (darkColors/lightColors) con los
// tokens CSS del web (--accent, --lb-glass-*, --radius-*, --space-*, --shadow-*).

export function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = parseInt(full, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r},${g},${b},${alpha})`
}

// ── Radios de borde ──
export const RADII = { sm: 10, md: 16, lg: 20, xl: 28, full: 999 }

// ── Espaciado ──
export const SPACE = { xs: 6, sm: 12, md: 20, lg: 32, xl: 48 }

// ── Sombras ──
export const SHADOWS = {
  sm: { shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  md: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  lg: { shadowColor: '#000', shadowOpacity: 0.14, shadowRadius: 40, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  xl: { shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 60, shadowOffset: { width: 0, height: 20 }, elevation: 12 },
  glass: { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 32, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
}

function baseTokens({ dark }) {
  return {
    dark,
    // legacy móvil
    accent: '#01805b',
    accentHover: '#016d4d',
    accentDim: 'rgba(1,128,91,0.15)',
    bgBody: dark ? '#0a0f1e' : '#f0fafa',
    bgCard: dark ? '#111827' : '#ffffff',
    bgCardAlt: dark ? '#162035' : '#f8fafc',
    bgInput: dark ? '#1a2540' : '#ffffff',
    textPrimary: dark ? '#f1f5f9' : '#111827',
    textSecondary: dark ? '#cbd5e1' : '#374151',
    textMuted: dark ? '#94a3b8' : '#4b5563',
    borderColor: dark ? '#2d3f5c' : '#d1d5db',
    borderColorLight: dark ? '#1e2d45' : '#e5e7eb',
    error: dark ? '#f23838' : '#d63030',
    errorDim: dark ? 'rgba(242,56,56,0.15)' : 'rgba(214,48,48,0.15)',
    warning: dark ? '#ffc107' : '#9d6602',
    warningDim: dark ? 'rgba(255,193,7,0.15)' : 'rgba(157,102,2,0.15)',
    success: dark ? '#4ca649' : '#368139',
    successDim: dark ? 'rgba(76,166,73,0.15)' : 'rgba(54,129,57,0.15)',
    facebook: '#1877F2',
    // nuevos (web)
    accentLight: '#e8faf5',
    accentDark: '#00513d',
    bgNav: dark ? '#060c1a' : '#ffffff',
    bgSubtle: dark ? '#162035' : '#f3f6f6',
    info: dark ? '#57b752' : '#3376b0',
    infoDim: dark ? 'rgba(87,183,82,0.15)' : 'rgba(51,118,176,0.15)',
    borderCard: dark ? '#1e2d45' : '#e5e7eb',
    // glass
    glassBg: dark ? 'rgba(8,16,38,0.82)' : 'rgba(255,255,255,0.78)',
    glassBgHover: dark ? 'rgba(8,16,38,0.96)' : 'rgba(255,255,255,0.94)',
    glassBorder: dark ? 'rgba(1,128,91,0.16)' : 'rgba(1,128,91,0.22)',
    glassBorderHover: dark ? 'rgba(1,128,91,0.42)' : 'rgba(1,128,91,0.52)',
    glassBlur: dark ? 18 : 16,
    glassTextPrimary: dark ? '#e2e8f0' : '#0f172a',
    glassTextMuted: dark ? '#94a3b8' : '#64748b',
    glassTextPill: dark ? '#cbd5e1' : '#334155',
    glassSurface: dark ? 'rgba(1,128,91,0.07)' : 'rgba(1,128,91,0.08)',
    glassTrack: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    // escala
    radius: RADII,
    space: SPACE,
    shadows: SHADOWS,
  }
}

export const darkTokens = baseTokens({ dark: true })
export const lightTokens = baseTokens({ dark: false })

// ── Temas daltonismo (accent + superficies) ──
const COLOR_BLIND_ACCENTS = {
  'theme-protanopia': { light: { accent: '#007aa7', accentHover: '#005f8a', accentLight: '#e6f5fb', accentDark: '#005a82' }, dark: { accent: '#0085b5', accentHover: '#005f8a', accentLight: '#e6f5fb', accentDark: '#005a82' } },
  'theme-deuteranopia': { light: { accent: '#4f7e00', accentHover: '#3f6500', accentLight: '#eef9dc', accentDark: '#335d00' }, dark: { accent: '#4ca649', accentHover: '#3f6500', accentLight: '#eef9dc', accentDark: '#335d00' } },
  'theme-tritanopia': { light: { accent: '#5b4b8a', accentHover: '#483d72', accentLight: '#f0ebff', accentDark: '#413460' }, dark: { accent: '#8a7ae6', accentHover: '#7664d6', accentLight: '#f1eeff', accentDark: '#5d4eb1' } },
}

export function applyColorTheme(tokens, colorTheme) {
  const override = COLOR_BLIND_ACCENTS[colorTheme]
  if (!override) return tokens
  const next = { ...tokens, ...override[tokens.dark ? 'dark' : 'light'] }
  next.accentDim = hexToRgba(next.accent.replace('#', ''), 0.15)
  next.glassBorder = hexToRgba(next.accent.replace('#', ''), tokens.dark ? 0.16 : 0.22)
  next.glassBorderHover = hexToRgba(next.accent.replace('#', ''), tokens.dark ? 0.42 : 0.52)
  next.glassSurface = hexToRgba(next.accent.replace('#', ''), tokens.dark ? 0.07 : 0.08)
  return next
}