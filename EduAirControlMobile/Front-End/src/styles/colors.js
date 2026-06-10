// ─── Tema oscuro (por defecto) ────────────────────────────────────────────────
export const darkColors = {
  accent:           '#5de6c8',
  accentHover:      '#4dd4b6',
  accentDim:        'rgba(93,230,200,0.15)',
  bgBody:           '#0f172a',
  bgCard:           '#111827',
  bgCardAlt:        '#1a2332',
  bgInput:          '#1f2937',
  textPrimary:      '#f9fafb',
  textSecondary:    '#d1d5db',
  textMuted:        '#9ca3af',
  borderColor:      '#374151',
  borderColorLight: '#2d3748',
  error:            '#F44336',
  errorDim:         'rgba(244,67,54,0.15)',
  warning:          '#FFC107',
  warningDim:       'rgba(255,193,7,0.15)',
  success:          '#4CAF50',
  successDim:       'rgba(76,175,80,0.15)',
  facebook:         '#1877F2',
}

// ─── Tema claro ───────────────────────────────────────────────────────────────
export const lightColors = {
  accent:           '#0ea18a',
  accentHover:      '#0c8f7a',
  accentDim:        'rgba(14,161,138,0.15)',
  bgBody:           '#f0f4f8',
  bgCard:           '#ffffff',
  bgCardAlt:        '#f8fafc',
  bgInput:          '#f1f5f9',
  textPrimary:      '#0f172a',
  textSecondary:    '#334155',
  textMuted:        '#64748b',
  borderColor:      '#cbd5e1',
  borderColorLight: '#e2e8f0',
  error:            '#dc2626',
  errorDim:         'rgba(220,38,38,0.15)',
  warning:          '#d97706',
  warningDim:       'rgba(217,119,6,0.15)',
  success:          '#16a34a',
  successDim:       'rgba(22,163,74,0.15)',
  facebook:         '#1877F2',
}

// Alias y default export — compatibilidad con archivos que ya usan { colors } o import colors from
export const colors = darkColors
export default darkColors