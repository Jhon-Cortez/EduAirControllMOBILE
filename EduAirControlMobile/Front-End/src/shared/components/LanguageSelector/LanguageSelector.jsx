import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { setAppLanguage } from '../../i18n/i18n.js'
import { useTheme } from '../../../context/ThemeContext.jsx'
import Modal from '../Modal/Modal.jsx'
import { styles } from './LanguageSelector.styles'

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
]

function LanguageSelector({ onSelect }) {
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
        <Text style={styles.buttonFlag}>{current.flag}</Text>
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
              <Text style={styles.optionFlag}>{lang.flag}</Text>
              <Text style={[styles.optionText, { color: active ? c.accent : c.textPrimary }]}>
                {lang.label}
              </Text>
              <View style={styles.optionSpacer} />
              {active && <Ionicons name="checkmark" size={18} color={c.accent} />}
            </Pressable>
          )
        })}
      </Modal>
    </>
  )
}



export default LanguageSelector