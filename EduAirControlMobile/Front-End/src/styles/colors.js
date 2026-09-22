import { darkTokens, lightTokens, applyColorTheme } from '../shared/styles/tokens'

// Tema oscuro y claro (definidos 1:1 con el web en shared/styles/tokens).
export const darkColors = darkTokens
export const lightColors = lightTokens

// Aplica el tema daltonismo sobre un set de tokens (misma firma que el web).
export { applyColorTheme, darkTokens, lightTokens }

// Alias y default export — compatibilidad con archivos que ya usan { colors } o import colors from
export const colors = darkColors
export default darkColors