import React, { forwardRef } from 'react'
import { View, TextInput as RNTextInput, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../../context/ThemeContext'

const Input = forwardRef(function Input(
  { label, type = 'text', placeholder, error, icon, disabled, style, multiline, secureTextEntry, ...props },
  ref
) {
  const { currentColors: c } = useTheme()
  const borderColor = error ? c.error : c.borderColor

  return (
    <View style={[styles.field, disabled && styles.disabled, style]}>
      {label && <Text style={[styles.label, { color: c.textSecondary }]}>{label}</Text>}
      <View style={[styles.wrapper, { backgroundColor: c.bgInput, borderColor }]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <RNTextInput
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor={c.textMuted}
          editable={!disabled}
          multiline={multiline}
          secureTextEntry={secureTextEntry ?? type === 'password'}
          selectionColor={c.accent}
          style={[styles.input, { color: c.textPrimary }]}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: c.error }]} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  disabled: { opacity: 0.6 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 12 },
  error: { fontSize: 12, marginTop: 4 },
})

export default Input