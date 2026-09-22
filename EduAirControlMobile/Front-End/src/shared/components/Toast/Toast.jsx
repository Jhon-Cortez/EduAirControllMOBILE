import React, { createContext, useContext, useState, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'

const ToastContext = createContext(null)

const ICONS = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
}

const COLORS = {
  success: '#4ca649',
  error: '#f23838',
  info: '#3376b0',
}

let toastId = 0

function ToastItem({ toast, onClose }) {
  const { currentColors: c } = useTheme()
  const color = COLORS[toast.type] || COLORS.info
  return (
    <View style={[styles.toast, { backgroundColor: c.bgCard, borderColor: c.borderColor, borderLeftColor: color }]}>
      <Ionicons name={ICONS[toast.type]} size={20} color={color} />
      <Text style={[styles.message, { color: c.textPrimary }]}>{toast.message}</Text>
      <Pressable onPress={() => onClose(toast.id)} hitSlop={8} accessibilityLabel="Cerrar">
        <Ionicons name="close" size={18} color={c.textMuted} />
      </Pressable>
    </View>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
  }

  return (
    <ToastContext.Provider value={toast}>
      <View style={styles.root}>
        {children}
        {toasts.length > 0 && (
          <View pointerEvents="box-none" style={styles.container}>
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onClose={removeToast} />
            ))}
          </View>
        )}
      </View>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 54,
    zIndex: 1000,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  message: { flex: 1, fontSize: 14 },
})