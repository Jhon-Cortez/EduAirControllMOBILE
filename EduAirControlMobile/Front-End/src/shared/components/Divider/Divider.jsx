import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { styles } from './Divider.styles'

function Divider({ text, style }) {
  const { currentColors: c } = useTheme()
  if (!text) return <View style={[styles.line, { backgroundColor: c.borderColor }, style]} />

  return (
    <View style={[styles.row, style]}>
      <View style={[styles.line, { flex: 1, backgroundColor: c.borderColor }]} />
      <Text style={[styles.text, { color: c.textMuted }]}>{text}</Text>
      <View style={[styles.line, { flex: 1, backgroundColor: c.borderColor }]} />
    </View>
  )
}



export default Divider