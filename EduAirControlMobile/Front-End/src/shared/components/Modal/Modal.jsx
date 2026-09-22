import React from 'react'
import { Modal as RNModal, Pressable, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const { currentColors: c } = useTheme()
  if (!isOpen) return null

  const width = size === 'sm' ? '85%' : size === 'lg' ? '92%' : '88%'

  return (
    <RNModal transparent visible={isOpen} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.content, { width, backgroundColor: c.bgCard, borderColor: c.glassBorder }]} onPress={() => {}}>
          <Pressable style={styles.closeBtn} onPress={onClose} accessibilityLabel="Cerrar" hitSlop={8}>
            <Ionicons name="close" size={22} color={c.textMuted} />
          </Pressable>
          {title && <Text style={[styles.title, { color: c.textPrimary }]}>{title}</Text>}
          <View style={styles.body}>{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  closeBtn: { position: 'absolute', top: 14, right: 14, zIndex: 1 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16, marginRight: 32 },
  body: {},
})

export default Modal