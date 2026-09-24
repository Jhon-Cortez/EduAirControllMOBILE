import React from 'react'
import { Modal as RNModal, Pressable, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext.jsx'
import { styles } from './Modal.styles'

function Modal({ isOpen, onClose, title, children, size = 'md', contentStyle }) {
  const { currentColors: c } = useTheme()
  if (!isOpen) return null

  const width = size === 'sm' ? '85%' : size === 'lg' ? '92%' : '88%'

  return (
    <RNModal transparent visible={isOpen} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
            style={[
              styles.content,
              { width, backgroundColor: c.bgCard, borderColor: c.glassBorder },
              contentStyle,
            ]}
            onPress={() => {}}
          >
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



export default Modal