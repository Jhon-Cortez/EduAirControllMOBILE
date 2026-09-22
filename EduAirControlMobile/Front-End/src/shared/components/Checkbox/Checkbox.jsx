import React from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'

function Checkbox({ label, checked, onChange, disabled }) {
  const { currentColors: c } = useTheme()
  return (
    <Pressable
      style={[styles.row, disabled && styles.disabled]}
      onPress={() => onChange?.(!checked)}
      disabled={disabled}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? c.accent : c.borderColor,
            backgroundColor: checked ? c.accent : 'transparent',
          },
        ]}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#ffffff" />}
      </View>
      {label ? <Text style={[styles.label, { color: c.textSecondary }]}>{label}</Text> : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  disabled: { opacity: 0.6 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 14 },
})

export default Checkbox