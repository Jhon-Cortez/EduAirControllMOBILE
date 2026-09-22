import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../../context/ThemeContext'

function EmptyState({ icon, title, description, action }) {
  const { currentColors: c } = useTheme()
  return (
    <View style={styles.wrapper}>
      {icon && <View style={styles.icon}>{icon}</View>}
      {title && <Text style={[styles.title, { color: c.textPrimary }]}>{title}</Text>}
      {description && <Text style={[styles.description, { color: c.textMuted }]}>{description}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  icon: { marginBottom: 4 },
  title: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  description: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  action: { marginTop: 12 },
})

export default EmptyState