// Estilos compartidos de texto y layout. Consumen el tema desde ThemeContext.
// Utilizado por los componentes de shared/components y las pantallas.

import { StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'

export const typeScale = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
}

export function useAppStyles() {
  const { currentColors } = useTheme()
  return {
    colors: currentColors,
    radius: currentColors.radius,
    space: currentColors.space,
    shadows: currentColors.shadows,
    text: StyleSheet.create({
      h1: { color: currentColors.textPrimary, fontSize: typeScale['3xl'], fontWeight: '700' },
      h2: { color: currentColors.textPrimary, fontSize: typeScale['2xl'], fontWeight: '700' },
      h3: { color: currentColors.textPrimary, fontSize: typeScale.lg, fontWeight: '600' },
      body: { color: currentColors.textSecondary, fontSize: typeScale.base, lineHeight: 22 },
      muted: { color: currentColors.textMuted, fontSize: typeScale.sm },
      label: { color: currentColors.textSecondary, fontSize: typeScale.sm, fontWeight: '600' },
      accent: { color: currentColors.accent, fontSize: typeScale.base, fontWeight: '600' },
    }),
    layout: styles.layout,
    surface: StyleSheet.create({
      card: {
        backgroundColor: currentColors.bgCard,
        borderRadius: currentColors.radius.md,
        padding: currentColors.space.sm,
      },
      input: {
        backgroundColor: currentColors.bgInput,
        borderRadius: currentColors.radius.md,
        borderWidth: 1,
        borderColor: currentColors.borderColor,
      },
    }),
  }
}

const styles = StyleSheet.create({
  layout: {
    row: { flexDirection: 'row', alignItems: 'center' },
    between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    gapXs: { gap: 6 },
    gapSm: { gap: 12 },
    gapMd: { gap: 20 },
    padded: { padding: 20 },
  },
})

export default useAppStyles