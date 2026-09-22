import { useEffect, useState } from 'react'
import {
  getAccessibilitySettings,
  onAccessibilityChange,
  saveAccessibilitySettings,
} from '../accessibility/accessibilitySettings'

export function useDarkMode() {
  const [darkMode, setDarkModeState] = useState(() => getAccessibilitySettings().darkMode)

  const setDarkMode = (val) => {
    const settings = getAccessibilitySettings()
    saveAccessibilitySettings({ ...settings, darkMode: val })
    setDarkModeState(val)
  }

  useEffect(() => onAccessibilityChange(() => setDarkModeState(getAccessibilitySettings().darkMode)), [])

  return [darkMode, setDarkMode]
}