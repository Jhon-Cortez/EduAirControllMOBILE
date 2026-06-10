import { createContext, useContext, useState, useEffect } from 'react'
import { darkColors, lightColors } from '../styles/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('darkMode')
        if (saved !== null) setDarkMode(JSON.parse(saved))
      } catch (e) {
        console.warn('Error loading darkMode:', e)
      } finally {
        setLoaded(true)
      }
    }
    load()
  }, [])

  const toggleDarkMode = async (value) => {
    setDarkMode(value)
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(value))
    } catch (e) {
      console.warn('Error saving darkMode:', e)
    }
  }

  const currentColors = darkMode ? darkColors : lightColors

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, currentColors, loaded }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}