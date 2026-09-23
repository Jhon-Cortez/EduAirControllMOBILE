import { createContext, useContext, useState, useEffect } from 'react'
import { darkColors, lightColors, applyColorTheme } from '../styles/colors'
import {
  getAccessibilitySettings,
  saveAccessibilitySettings,
  onAccessibilityChange,
} from '../shared/accessibility/accessibilitySettings'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)
  const [colorTheme, setColorTheme] = useState('')

  useEffect(() => {
    const a11y = getAccessibilitySettings()
    setDarkMode(a11y.darkMode)
    setColorTheme(a11y.colorTheme || '')
    return onAccessibilityChange(() => {
      const next = getAccessibilitySettings()
      setDarkMode(next.darkMode)
      setColorTheme(next.colorTheme || '')
    })
  }, [])

  const toggleDarkMode = async (value) => {
    const a11y = getAccessibilitySettings()
    saveAccessibilitySettings({ ...a11y, darkMode: value })
  }

  const currentColors = applyColorTheme(darkMode ? darkColors : lightColors, colorTheme)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, currentColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}