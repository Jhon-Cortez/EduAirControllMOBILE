import React from 'react'
import { Pressable, ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { styles } from './Button.styles'

const VARIANTS = {
  primary: (c) => ({ backgroundColor: c.accent, text: '#ffffff' }),
  secondary: (c) => ({ backgroundColor: c.glassSurface, borderColor: c.glassBorder, text: c.textPrimary }),
  outline: (c) => ({ backgroundColor: 'transparent', borderColor: c.accent, text: c.accent }),
  ghost: (c) => ({ backgroundColor: 'transparent', text: c.accent }),
  danger: (c) => ({ backgroundColor: c.error, text: '#ffffff' }),
}

const SIZES = {
  sm: { px: 10, py: 6, fs: 13 },
  md: { px: 16, py: 10, fs: 15 },
  lg: { px: 20, py: 14, fs: 17 },
}

function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  ...props
}) {
  const { currentColors } = useTheme()
  const v = VARIANTS[variant]?.(currentColors) || VARIANTS.primary(currentColors)
  const s = SIZES[size] || SIZES.md
  const inactive = Boolean(disabled || loading)

  return (
    <Pressable
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.backgroundColor,
          borderWidth: v.borderColor ? 1 : 0,
          borderColor: v.borderColor,
          paddingHorizontal: s.px,
          paddingVertical: s.py,
          opacity: inactive ? 0.6 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.row}>
        {loading && <ActivityIndicator color={v.text} size="small" style={styles.leftIcon} />}
        {!loading && icon && iconPosition === 'left' && <View style={styles.leftIcon}>{icon}</View>}
        {children != null && (
          <Text style={[styles.label, { color: v.text, fontSize: s.fs }, textStyle]}>{children}</Text>
        )}
        {!loading && icon && iconPosition === 'right' && <View style={styles.rightIcon}>{icon}</View>}
      </View>
    </Pressable>
  )
}



export default Button