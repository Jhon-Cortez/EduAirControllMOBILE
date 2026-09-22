import storage from '../storage/storage'

export const ACCESSIBILITY_STORAGE_KEYS = {
  fontSize: 'a11y-font-size',
  darkMode: 'darkMode',
  colorTheme: 'a11y-color-theme',
  legacyTheme: 'theme',
}

export const ACCESSIBILITY_THEMES = [
  '',
  'theme-protanopia',
  'theme-deuteranopia',
  'theme-tritanopia',
]

const FONT_SIZES = { base: 16, lg: 18, xl: 20 }

const listeners = new Set()

function emitA11yChange() {
  listeners.forEach((cb) => {
    try {
      cb()
    } catch (e) {
      console.warn('a11y listener error:', e)
    }
  })
}

export function onAccessibilityChange(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function readDarkMode() {
  try {
    return JSON.parse(storage.getItem(ACCESSIBILITY_STORAGE_KEYS.darkMode) || 'false') === true
  } catch {
    return false
  }
}

export function getAccessibilitySettings() {
  const savedTheme = storage.getItem(ACCESSIBILITY_STORAGE_KEYS.colorTheme)
  const legacyTheme = storage.getItem(ACCESSIBILITY_STORAGE_KEYS.legacyTheme)
  const colorTheme = ACCESSIBILITY_THEMES.includes(savedTheme ?? '')
    ? (savedTheme ?? '')
    : ACCESSIBILITY_THEMES.includes(legacyTheme ?? '')
      ? (legacyTheme ?? '')
      : ''
  const fontSize = storage.getItem(ACCESSIBILITY_STORAGE_KEYS.fontSize) || 'base'

  return {
    fontSize: FONT_SIZES[fontSize] ? fontSize : 'base',
    darkMode: readDarkMode(),
    colorTheme,
  }
}

// Tamaño de fuente accesible en píxeles (número).
export function getComputedA11yFontSizePx() {
  const settings = getAccessibilitySettings()
  return FONT_SIZES[settings.fontSize] || 16
}

export function saveAccessibilitySettings(settings) {
  storage.setItem(ACCESSIBILITY_STORAGE_KEYS.fontSize, settings.fontSize)
  storage.setItem(ACCESSIBILITY_STORAGE_KEYS.darkMode, JSON.stringify(settings.darkMode))
  storage.setItem(ACCESSIBILITY_STORAGE_KEYS.colorTheme, settings.colorTheme)
  storage.setItem(ACCESSIBILITY_STORAGE_KEYS.legacyTheme, settings.colorTheme)
  emitA11yChange()
}

export function resetAccessibilitySettings() {
  saveAccessibilitySettings({ fontSize: 'base', darkMode: false, colorTheme: '' })
}