import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../../context/ThemeContext'

const SIZES = { sm: 'small', md: 'large', lg: 'large' }

function Spinner({ size = 'md', label = 'Cargando...' }) {
  const { currentColors: c } = useTheme()
  return (
    <View style={styles.wrapper} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size={SIZES[size] || 'large'} color={c.accent} />
      {label ? <Text style={[styles.label, { color: c.textMuted }]}>{label}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
  label: { fontSize: 13 },
})

export default Spinner