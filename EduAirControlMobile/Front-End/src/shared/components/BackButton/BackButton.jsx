import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'

function BackButton({ onPress, color }) {
  const { currentColors: c } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityLabel="Volver"
      hitSlop={8}
    >
      <Ionicons name="arrow-back" size={22} color={color || c.textPrimary} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  pressed: { opacity: 0.6 },
})

export default BackButton