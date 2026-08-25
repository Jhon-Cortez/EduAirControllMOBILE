import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { accessibleColors, darkColors, lightColors } from "../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [accessibilityTheme, setAccessibilityTheme] = useState("");
  const [fontScale, setFontScale] = useState(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [savedDarkMode, savedAccessibilityTheme, savedFontScale] =
          await Promise.all([
            AsyncStorage.getItem("darkMode"),
            AsyncStorage.getItem("theme"),
            AsyncStorage.getItem("fontScale"),
          ]);
        if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode));
        if (
          savedAccessibilityTheme !== null &&
          accessibleColors[savedAccessibilityTheme]
        ) {
          setAccessibilityTheme(savedAccessibilityTheme);
        }
        if (
          savedFontScale !== null &&
          [1, 1.15, 1.3].includes(Number(savedFontScale))
        ) {
          setFontScale(Number(savedFontScale));
        }
      } catch (e) {
        console.warn("Error loading darkMode:", e);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, []);

  const changeFontScale = useCallback(async (value) => {
    const nextScale = [1, 1.15, 1.3].includes(value) ? value : 1;
    setFontScale(nextScale);
    try {
      await AsyncStorage.setItem("fontScale", String(nextScale));
    } catch (e) {
      console.warn("Error saving font scale:", e);
    }
  }, []);

  const resetAccessibility = useCallback(async () => {
    setDarkMode(false);
    setAccessibilityTheme("");
    setFontScale(1);
    try {
      await Promise.all([
        AsyncStorage.setItem("darkMode", "false"),
        AsyncStorage.setItem("theme", ""),
        AsyncStorage.setItem("fontScale", "1"),
      ]);
    } catch (e) {
      console.warn("Error resetting accessibility settings:", e);
    }
  }, []);

  const changeAccessibilityTheme = useCallback(async (value) => {
    const nextTheme = accessibleColors[value] ? value : "";
    setAccessibilityTheme(nextTheme);
    try {
      await AsyncStorage.setItem("theme", nextTheme);
    } catch (e) {
      console.warn("Error saving accessibility theme:", e);
    }
  }, []);

  const toggleDarkMode = useCallback(async (value) => {
    setDarkMode(value);
    try {
      await AsyncStorage.setItem("darkMode", JSON.stringify(value));
    } catch (e) {
      console.warn("Error saving darkMode:", e);
    }
  }, []);

  const baseColors = darkMode ? darkColors : lightColors;
  const currentColors = useMemo(
    () => ({
      ...baseColors,
      ...(accessibleColors[accessibilityTheme] || {}),
    }),
    [accessibilityTheme, baseColors],
  );
  const contextValue = useMemo(
    () => ({
      darkMode,
      toggleDarkMode,
      accessibilityTheme,
      changeAccessibilityTheme,
      fontScale,
      changeFontScale,
      resetAccessibility,
      currentColors,
      loaded,
    }),
    [
      accessibilityTheme,
      changeAccessibilityTheme,
      currentColors,
      darkMode,
      loaded,
      toggleDarkMode,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
