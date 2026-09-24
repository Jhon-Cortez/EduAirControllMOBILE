import React from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { styles } from './Checkbox.styles'

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



export default Checkbox