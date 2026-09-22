import React from 'react'
import { View, StyleSheet } from 'react-native'
import { BlurView } from 'expo-blur'
import { useTheme } from '../../context/ThemeContext'

/**
 * Equivalente móvil de `.ds-card` (glass-morphism del web).
 * Usa BlurView cuando está disponible y cae a un fondo translúcido
 * sin degradar a opaco.
 */
export default function GlassCard({ style, children, intensity = 40, hovered = false, ...props }) {
  const { currentColors } = useTheme()

  const base = {
    backgroundColor: hovered ? currentColors.glassBgHover : currentColors.glassBg,
    borderWidth: 1,
    borderColor: hovered ? currentColors.glassBorderHover : currentColors.glassBorder,
    ...currentColors.shadows.glass,
  }

  return (
    <View style={StyleSheet.flatten([styles.card, base, style])} {...props}>
      <BlurView
        style={StyleSheet.absoluteFill}
        tint={currentColors.dark ? 'dark' : 'light'}
        intensity={intensity}
        experimentalBlurMethod="dimezisBlurView"
      />
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    zIndex: 1,
  },
})