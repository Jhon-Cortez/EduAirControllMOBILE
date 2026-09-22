import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { setAppLanguage } from '../../i18n/i18n'
import { useTheme } from '../../../context/ThemeContext'
import Modal from '../Modal/Modal'

const LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
]

function LanguageSelector({ compact = true, onSelect }) {
  const { i18n } = useTranslation()
  const { currentColors: c } = useTheme()
  const [show, setShow] = useState(false)

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  const handleChange = (code) => {
    setAppLanguage(code)
    setShow(false)
    onSelect?.(code)
  }

  return (
    <>
      <Pressable
        style={[styles.button, { borderColor: c.glassBorder, backgroundColor: c.glassSurface }]}
        onPress={() => setShow(true)}
      >
        <Text style={[styles.buttonText, { color: c.textPrimary }]}>{current.label}</Text>
        <Ionicons name="chevron-down" size={16} color={c.textMuted} />
      </Pressable>

      <Modal isOpen={show} onClose={() => setShow(false)} title="Idioma · Language">
        {LANGUAGES.map((lang) => {
          const active = lang.code === i18n.language
          return (
            <Pressable
              key={lang.code}
              style={[styles.option, active && { backgroundColor: c.accentDim }]}
              onPress={() => handleChange(lang.code)}
            >
              <Text style={[styles.optionText, { color: active ? c.accent : c.textPrimary }]}>
                {lang.label}
              </Text>
              {active && <Ionicons name="checkmark" size={18} color={c.accent} />}
            </Pressable>
          )
        })}
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buttonText: { fontSize: 14, fontWeight: '600' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  optionText: { fontSize: 16 },
})

export default LanguageSelector