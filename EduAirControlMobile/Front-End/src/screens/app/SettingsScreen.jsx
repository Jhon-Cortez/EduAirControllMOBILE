import { useState, useEffect } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, TextInput, Modal, Alert,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from '../../context/ThemeContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const TIMEZONES = [
  { value: 'America/Bogota',      label: 'Bogotá (UTC-5)' },
  { value: 'America/Lima',        label: 'Lima (UTC-5)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6)' },
  { value: 'America/New_York',    label: 'Nueva York (UTC-5/-4)' }, 
  { value: 'America/Los_Angeles', label: 'Los Ángeles (UTC-8/-7)' },
  { value: 'America/Sao_Paulo',   label: 'São Paulo (UTC-3)' },
  { value: 'America/Santiago',    label: 'Santiago (UTC-4/-3)' },
  { value: 'Europe/London',       label: 'Londres (UTC+0/+1)' },
  { value: 'Europe/Madrid',       label: 'Madrid (UTC+1/+2)' },
  { value: 'Europe/Paris',        label: 'París (UTC+1/+2)' },
  { value: 'Asia/Tokyo',          label: 'Tokio (UTC+9)' },
  { value: 'Asia/Dubai',          label: 'Dubái (UTC+4)' },
  { value: 'Australia/Sydney',    label: 'Sídney (UTC+10/+11)' },
]

const THEMES = [
  { key: '',                   label: 'Normal' },
  { key: 'theme-protanopia',   label: 'Protanopía' },
  { key: 'theme-deuteranopia', label: 'Deuteranopía' },
  { key: 'theme-tritanopia',   label: 'Tritanopía' },
]

export default function SettingsScreen({ navigation, route }) {
  const { darkMode, toggleDarkMode, currentColors, loaded } = useTheme()

  const [autoTimezone, setAutoTimezone] = useState(true)
  const [manualTimezone, setManualTimezone] = useState('America/Bogota')
  const [reminders, setReminders] = useState({
    alertas: true, advertencias: true, resumenDiario: false, sonido: true,
  })
  const [privacy, setPrivacy] = useState({
    perfilPublico: false, compartirDatos: false,
  })
  const [settings, setSettings] = useState({ language: 'Español', dateFormat: 'DD-MM-YYYY' })
  const [theme, setTheme] = useState('')
  const [showLangModal, setShowLangModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState({ open: false, type: null })
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false })

  // Cargar configuración guardada
  useEffect(() => {
    const load = async () => {
      try {
        const savedAuto = await AsyncStorage.getItem('autoTimezone')
        if (savedAuto !== null) setAutoTimezone(JSON.parse(savedAuto))

        const savedManual = await AsyncStorage.getItem('manualTimezone')
        if (savedManual !== null) setManualTimezone(savedManual)

        const savedReminders = await AsyncStorage.getItem('reminders')
        if (savedReminders !== null) setReminders(JSON.parse(savedReminders))

        const savedPrivacy = await AsyncStorage.getItem('privacy')
        if (savedPrivacy !== null) setPrivacy(JSON.parse(savedPrivacy))

        const savedSettings = await AsyncStorage.getItem('settings')
        if (savedSettings !== null) {
          const parsed = JSON.parse(savedSettings)
          const LANG_NAMES = { es: 'Español', en: 'English', fr: 'Français', pt: 'Português' }
          setSettings({
            language: LANG_NAMES[parsed.language] || 'Español',
            dateFormat: parsed.dateFormat || 'DD-MM-YYYY',
          })
        }

        const savedTheme = await AsyncStorage.getItem('theme')
        if (savedTheme !== null) setTheme(savedTheme)
      } catch (e) {
        console.warn('Error cargando settings:', e)
      }
    }
    load()
  }, [])

  // Abrir modal contraseña desde Profile
  useEffect(() => {
    if (route?.params?.openPasswordModal) {
      setShowPasswordModal(true)
    }
  }, [route?.params?.openPasswordModal])

  const toggleReminder = async (key) => {
    const next = { ...reminders, [key]: !reminders[key] }
    setReminders(next)
    await AsyncStorage.setItem('reminders', JSON.stringify(next))
  }

  const togglePrivacy = async (key) => {
    const next = { ...privacy, [key]: !privacy[key] }
    setPrivacy(next)
    await AsyncStorage.setItem('privacy', JSON.stringify(next))
  }

  const handleDarkModeToggle = (value) => toggleDarkMode(value)

  const handleAutoTimezoneToggle = async (value) => {
    setAutoTimezone(value)
    await AsyncStorage.setItem('autoTimezone', JSON.stringify(value))
  }

  const handleManualTimezoneChange = async (value) => {
    setManualTimezone(value)
    await AsyncStorage.setItem('manualTimezone', value)
  }

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme)
    await AsyncStorage.setItem('theme', newTheme)
  }

  const handleChangeLanguage = async (langCode) => {
    const LANG_NAMES = { es: 'Español', en: 'English', fr: 'Français', pt: 'Português' }
    const newSettings = { ...settings, language: LANG_NAMES[langCode] || 'English' }
    setSettings(newSettings)
    await AsyncStorage.setItem('settings', JSON.stringify({ ...newSettings, language: langCode }))
    setShowLangModal(false)
  }

  const handleDateFormatChange = async (newFormat) => {
    const newSettings = { ...settings, dateFormat: newFormat }
    setSettings(newSettings)
    await AsyncStorage.setItem('settings', JSON.stringify({ ...newSettings, dateFormat: newFormat }))
  }

  const handleSavePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      Alert.alert('Campos requeridos', 'Completa todos los campos.')
      return
    }
    if (passwordData.new !== passwordData.confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden.')
      return
    }
    if (passwordData.new.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.')
      return
    }
    Alert.alert('Éxito', 'Contraseña actualizada correctamente 😎')
    setShowPasswordModal(false)
    setPasswordData({ current: '', new: '', confirm: '' })
  }

  const themeLabel = (key) => {
    if (key === '') return 'Normal'
    if (key === 'theme-protanopia') return 'Protanopía'
    if (key === 'theme-deuteranopia') return 'Deuteranopía'
    return 'Tritanopía'
  }

  const renderHelpContent = (tc) => {
    switch (showHelpModal.type) {
      case 'faq':
        return (
          <>
            <View style={styles.helpSectionTitle}>
              <Text style={[styles.helpIcon, { color: tc.accent }]}>❓</Text>
              <Text style={[styles.helpTitle, { color: tc.textPrimary }]}>Preguntas frecuentes</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={[styles.helpQuestion, { color: tc.textPrimary }]}>¿Cómo agregar un ambiente?</Text>
              <Text style={[styles.helpAnswer, { color: tc.textSecondary }]}>Ve a Gestión → Agregar ambiente</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={[styles.helpQuestion, { color: tc.textPrimary }]}>¿Cómo cambiar el tema?</Text>
              <Text style={[styles.helpAnswer, { color: tc.textSecondary }]}>En Configuración → Apariencia</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={[styles.helpQuestion, { color: tc.textPrimary }]}>¿Olvidé mi contraseña?</Text>
              <Text style={[styles.helpAnswer, { color: tc.textSecondary }]}>Usa la opción "Olvidé mi contraseña" en login</Text>
            </View>
          </>
        )
      case 'contact':
        return (
          <>
            <View style={styles.helpSectionTitle}>
              <Text style={[styles.helpIcon, { color: tc.accent }]}>📬</Text>
              <Text style={[styles.helpTitle, { color: tc.textPrimary }]}>Contacto</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={[styles.helpIconSmall, { color: tc.textMuted }]}>✉️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.helpLabel, { color: tc.textPrimary }]}>Correo</Text>
                <Text style={[styles.helpValue, { color: tc.textSecondary }]}>soporte@eduaircontrol.com</Text>
              </View>
            </View>
            <View style={styles.helpItem}>
              <Text style={[styles.helpIconSmall, { color: tc.textMuted }]}>🕐</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.helpLabel, { color: tc.textPrimary }]}>Horario</Text>
                <Text style={[styles.helpValue, { color: tc.textSecondary }]}>L-V 8am-6pm</Text>
              </View>
            </View>
          </>
        )
      case 'terms':
        return (
          <>
            <View style={styles.helpSectionTitle}>
              <Text style={[styles.helpIcon, { color: tc.accent }]}>📋</Text>
              <Text style={[styles.helpTitle, { color: tc.textPrimary }]}>Términos y condiciones</Text>
            </View>
            <Text style={[styles.helpText, { color: tc.textSecondary }]}>Al usar EduAirControl, aceptas nuestros términos de servicio.</Text>
            <View style={styles.helpList}>
              <Text style={[styles.helpListItem, { color: tc.textSecondary }]}>• Uso responsable de la plataforma</Text>
              <Text style={[styles.helpListItem, { color: tc.textSecondary }]}>• Protección de datos personales</Text>
              <Text style={[styles.helpListItem, { color: tc.textSecondary }]}>• Propiedad intelectual</Text>
            </View>
          </>
        )
      case 'privacy':
        return (
          <>
            <View style={styles.helpSectionTitle}>
              <Text style={[styles.helpIcon, { color: tc.accent }]}>🔒</Text>
              <Text style={[styles.helpTitle, { color: tc.textPrimary }]}>Política de privacidad</Text>
            </View>
            <Text style={[styles.helpText, { color: tc.textSecondary }]}>Tu privacidad es importante para nosotros.</Text>
            <View style={styles.helpList}>
              <Text style={[styles.helpListItem, { color: tc.textSecondary }]}>• No compartimos datos con terceros</Text>
              <Text style={[styles.helpListItem, { color: tc.textSecondary }]}>• Datos encriptados</Text>
              <Text style={[styles.helpListItem, { color: tc.textSecondary }]}>• Derechos del usuario</Text>
            </View>
          </>
        )
      case 'version':
        return (
          <>
            <View style={styles.helpSectionTitle}>
              <Text style={[styles.helpIcon, { color: tc.accent }]}>📱</Text>
              <Text style={[styles.helpTitle, { color: tc.textPrimary }]}>Versión</Text>
            </View>
            <View style={[styles.versionBadgeBase, { backgroundColor: `${tc.accent}20`, borderColor: tc.accent }]}>
              <Text style={[styles.versionNumber, { color: tc.accent }]}>v1.0.0</Text>
            </View>
            <Text style={[styles.helpText, { color: tc.textSecondary }]}>EduAirControl Mobile App</Text>
            <Text style={[styles.versionDate, { color: tc.textMuted }]}>Mayo 2026</Text>
          </>
        )
      default:
        null
    }
  }

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
        <StatusBar barStyle="dark-content" backgroundColor={currentColors.bgBody} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textMuted }}>Cargando...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={currentColors.bgBody}
      />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={30} color={currentColors.accent} />
        <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>Configuración</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Apariencia */}
        <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="color-palette-outline" size={18} color={currentColors.accent} />
            <Text style={[styles.cardTitle, { color: currentColors.textPrimary }]}>Apariencia</Text>
          </View>
          <TouchableOpacity style={styles.row} onPress={() => handleDarkModeToggle(!darkMode)}>
            <View style={styles.rowLeft}>
              <Ionicons name={darkMode ? 'moon' : 'moon-outline'} size={16} color={currentColors.textMuted} />
              <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>Modo oscuro</Text>
            </View>
            <View style={[
              styles.toggle,
              { backgroundColor: darkMode ? currentColors.accent : currentColors.borderColor }
            ]}>
              <View style={[styles.toggleCircle, darkMode && { transform: [{ translateX: 20 }] }]} />
            </View>
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="color-palette-outline" size={16} color={currentColors.textMuted} />
              <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>Tema accesible</Text>
            </View>
            <Text style={[styles.rowValue, { color: currentColors.textMuted }]} numberOfLines={1}>{themeLabel(theme)}</Text>
          </View>
          <View style={styles.themePicker}>
            {THEMES.map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: currentColors.bgBody,
                    borderColor: theme === key ? currentColors.accent : currentColors.borderColor,
                  },
                  theme === key && { backgroundColor: currentColors.accentDim }
                ]}
                onPress={() => handleThemeChange(key)}
              >
                <Text style={[
                  styles.themeChipLabel,
                  { color: theme === key ? currentColors.accent : currentColors.textSecondary }
                ]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Idioma y fechas */}
        <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="globe-outline" size={18} color={currentColors.accent} />
            <Text style={[styles.cardTitle, { color: currentColors.textPrimary }]}>Idioma y fechas</Text>
          </View>
          <TouchableOpacity style={styles.row} onPress={() => setShowLangModal(true)}>
            <View style={styles.rowLeft}>
              <Ionicons name="language-outline" size={16} color={currentColors.textMuted} />
              <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>Idioma</Text>
            </View>
            <Text style={[styles.rowValue, { color: currentColors.textMuted }]} numberOfLines={1}>{settings.language}</Text>
            <Ionicons name="chevron-forward" size={16} color={currentColors.textMuted} />
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="calendar-outline" size={16} color={currentColors.textMuted} />
              <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>Formato de fecha</Text>
            </View>
            <Text style={[styles.rowValue, { color: currentColors.textMuted }]} numberOfLines={1}>{settings.dateFormat}</Text>
          </View>
          <TouchableOpacity style={styles.row} onPress={() => handleAutoTimezoneToggle(!autoTimezone)}>
            <View style={styles.rowLeft}>
              <Ionicons name="time-outline" size={16} color={currentColors.textMuted} />
              <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>Zona horaria automática</Text>
            </View>
            <View style={[
              styles.toggle,
              { backgroundColor: autoTimezone ? `${currentColors.accent}80` : currentColors.borderColor }
            ]}>
              <View style={[styles.toggleCircle, autoTimezone && { transform: [{ translateX: 20 }] }]} />
            </View>
          </TouchableOpacity>
          {!autoTimezone && (
            <View style={styles.timezoneRow}>
              <Ionicons name="location-outline" size={16} color={currentColors.textMuted} />
              <Text style={[styles.timezoneLabel, { color: currentColors.textSecondary }]}>Zona horaria:</Text>
              {TIMEZONES.map(({ value, label }) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.timezoneChip,
                    {
                      backgroundColor: currentColors.bgBody,
                      borderColor: manualTimezone === value ? currentColors.accent : currentColors.borderColor,
                    },
                    manualTimezone === value && { backgroundColor: `${currentColors.accent}20` }
                  ]}
                  onPress={() => handleManualTimezoneChange(value)}
                >
                  <Text style={[
                    styles.timezoneChipLabel,
                    { color: manualTimezone === value ? currentColors.accent : currentColors.textSecondary }
                  ]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Recordatorios */}
        <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="notifications-outline" size={18} color={currentColors.accent} />
            <Text style={[styles.cardTitle, { color: currentColors.textPrimary }]}>Recordatorios</Text>
          </View>
          {[
            { key: 'alertas', label: 'Alertas críticas' },
            { key: 'advertencias', label: 'Advertencias' },
            { key: 'resumenDiario', label: 'Resumen diario' },
            { key: 'sonido', label: 'Sonido' },
          ].map(({ key, label }) => (
            <TouchableOpacity key={key} style={styles.row} onPress={() => toggleReminder(key)}>
              <View style={styles.rowLeft}>
                <Ionicons name="notifications-outline" size={16} color={currentColors.textMuted} />
                <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>{label}</Text>
              </View>
              <View style={[
                styles.toggle,
                { backgroundColor: reminders[key] ? `${currentColors.accent}80` : currentColors.borderColor }
              ]}>
                <View style={[styles.toggleCircle, reminders[key] && { transform: [{ translateX: 20 }] }]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacidad */}
        <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark-outline" size={18} color={currentColors.accent} />
            <Text style={[styles.cardTitle, { color: currentColors.textPrimary }]}>Privacidad</Text>
          </View>
          <TouchableOpacity style={styles.row} onPress={() => togglePrivacy('perfilPublico')}>
            <View style={styles.rowLeft}>
              <Ionicons name="eye-outline" size={16} color={currentColors.textMuted} />
              <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>Perfil público</Text>
            </View>
            <View style={[
              styles.toggle,
              { backgroundColor: privacy.perfilPublico ? `${currentColors.accent}80` : currentColors.borderColor }
            ]}>
              <View style={[styles.toggleCircle, privacy.perfilPublico && { transform: [{ translateX: 20 }] }]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => togglePrivacy('compartirDatos')}>
            <View style={styles.rowLeft}>
              <Ionicons name="share-social-outline" size={16} color={currentColors.textMuted} />
              <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>Compartir datos</Text>
            </View>
            <View style={[
              styles.toggle,
              { backgroundColor: privacy.compartirDatos ? `${currentColors.accent}80` : currentColors.borderColor }
            ]}>
              <View style={[styles.toggleCircle, privacy.compartirDatos && { transform: [{ translateX: 20 }] }]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => setShowPasswordModal(true)}>
            <View style={styles.rowLeft}>
              <Ionicons name="lock-closed-outline" size={16} color={currentColors.accent} />
              <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>Cambiar contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={currentColors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => setShowDeleteModal(true)}>
            <View style={[styles.rowLeft, { flex: 1 }]}>
              <Ionicons name="trash-outline" size={16} color={currentColors.error} />
              <Text style={[styles.rowLabel, { color: currentColors.error }]}>Eliminar cuenta</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Ayuda */}
        <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="help-circle-outline" size={18} color={currentColors.accent} />
            <Text style={[styles.cardTitle, { color: currentColors.textPrimary }]}>Ayuda</Text>
          </View>
          {[
            { type: 'faq',     icon: 'help-circle-outline',     label: 'Preguntas frecuentes' },
            { type: 'contact', icon: 'mail-outline',            label: 'Contacto' },
            { type: 'terms',   icon: 'document-text-outline',   label: 'Términos y condiciones' },
            { type: 'privacy', icon: 'lock-closed-outline',     label: 'Política de privacidad' },
            { type: 'version', icon: 'information-circle-outline', label: 'Versión' },
          ].map(({ type, icon, label }) => (
            <TouchableOpacity key={type} style={styles.row} onPress={() => setShowHelpModal({ open: true, type })}>
              <View style={styles.rowLeft}>
                <Ionicons name={icon} size={16} color={currentColors.textMuted} />
                <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>{label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={currentColors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

       {/* Modal contraseña */}
       <Modal visible={showPasswordModal} transparent animationType="slide" onRequestClose={() => setShowPasswordModal(false)}>
         <View style={styles.modalOverlay}>
           <View style={[styles.modalCard, { backgroundColor: currentColors.bgCard }]}>
            <View style={styles.modalHeader}>
              <Ionicons name="lock-closed-outline" size={22} color={currentColors.accent} />
              <Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>Cambiar contraseña</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={22} color={currentColors.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
              placeholder="Contraseña actual"
              placeholderTextColor={currentColors.textMuted}
              value={passwordData.current}
              onChangeText={(v) => setPasswordData(p => ({ ...p, current: v }))}
              secureTextEntry
            />
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1, backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
                placeholder="Nueva contraseña"
                placeholderTextColor={currentColors.textMuted}
                value={passwordData.new}
                onChangeText={(v) => setPasswordData(p => ({ ...p, new: v }))}
                secureTextEntry={!showPassword.new}
              />
              <TouchableOpacity onPress={() => setShowPassword(p => ({ ...p, new: !p.new }))}>
                <Ionicons name={showPassword.new ? 'eye-outline' : 'eye-off-outline'} size={20} color={currentColors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1, backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
                placeholder="Confirmar contraseña"
                placeholderTextColor={currentColors.textMuted}
                value={passwordData.confirm}
                onChangeText={(v) => setPasswordData(p => ({ ...p, confirm: v }))}
                secureTextEntry={!showPassword.confirm}
              />
              <TouchableOpacity onPress={() => setShowPassword(p => ({ ...p, confirm: !p.confirm }))}>
                <Ionicons name={showPassword.confirm ? 'eye-outline' : 'eye-off-outline'} size={20} color={currentColors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: currentColors.borderColor }]} onPress={() => setShowPasswordModal(false)}>
                <Text style={[styles.cancelBtnText, { color: currentColors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: currentColors.accent }]} onPress={handleSavePassword}>
                <Text style={[styles.saveBtnText, { color: currentColors.bgBody }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
       {/* Modal eliminar cuenta */}
       <Modal visible={showDeleteModal} transparent animationType="slide" onRequestClose={() => setShowDeleteModal(false)}>
         <View style={styles.modalOverlay}>
           <View style={[styles.modalCard, { backgroundColor: currentColors.bgCard }]}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning-outline" size={22} color={currentColors.error} />
              <Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>Eliminar cuenta</Text>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <Ionicons name="close" size={22} color={currentColors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalText, { color: currentColors.textSecondary }]}>¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: currentColors.borderColor }]} onPress={() => setShowDeleteModal(false)}>
                <Text style={[styles.cancelBtnText, { color: currentColors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: currentColors.error }]} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.deleteBtnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

       {/* Modal idioma */}
       <Modal visible={showLangModal} transparent animationType="slide" onRequestClose={() => setShowLangModal(false)}>
         <View style={styles.modalOverlay}>
           <View style={[styles.modalCard, { backgroundColor: currentColors.bgCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>Idioma</Text>
              <TouchableOpacity onPress={() => setShowLangModal(false)}>
                <Ionicons name="close" size={22} color={currentColors.textMuted} />
              </TouchableOpacity>
            </View>
            {[
              { code: 'es', name: 'Español' },
              { code: 'en', name: 'English' },
              { code: 'fr', name: 'Français' },
              { code: 'pt', name: 'Português' },
            ].map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langOption, { borderBottomColor: currentColors.borderColor }]}
                onPress={() => handleChangeLanguage(lang.code)}
              >
                <Text style={[styles.langOptionText, { color: currentColors.accent }]}>{lang.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

       {/* Modal ayuda */}
       <Modal visible={showHelpModal.open} transparent animationType="slide" onRequestClose={() => setShowHelpModal({ open: false, type: null })}>
         <View style={styles.modalOverlay}>
           <View style={[styles.modalCard, { maxHeight: '80%', backgroundColor: currentColors.bgCard }]}>
            <View style={styles.modalHeader}>
              <Ionicons name="help-circle-outline" size={22} color={currentColors.accent} />
              <Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>Ayuda</Text>
              <TouchableOpacity onPress={() => setShowHelpModal({ open: false, type: null })}>
                <Ionicons name="close" size={22} color={currentColors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.helpScroll} contentContainerStyle={{ padding: 16 }}>
              {renderHelpContent(currentColors)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0fafa' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: 55, paddingBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 16,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },

  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 8 },
  rowLabel: { fontSize: 14, color: '#0f172a', flexShrink: 1, flex: 1 },
  rowValue: { fontSize: 13, color: '#999999', flexShrink: 0, maxWidth: 110, textAlign: 'right' },

  toggle: {
    width: 46, height: 26, borderRadius: 13,
    backgroundColor: '#cccccc',
    padding: 3, justifyContent: 'center', alignItems: 'flex-start',
  },
  toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' },

  themePicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  themeChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: '#cccccc',
    backgroundColor: '#f0fafa',
  },
  themeChipActive: { borderColor: '#00b894', backgroundColor: 'rgba(0,184,148,0.2)' },
  themeChipLabel: { fontSize: 12, color: '#666666' },
  themeChipLabelActive: { color: '#00b894', fontWeight: '600' },

  timezoneRow: { marginTop: 8, gap: 8 },
  timezoneLabel: { fontSize: 13, color: '#666666', marginBottom: 4 },
  timezoneChip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 12, borderWidth: 1, borderColor: '#cccccc',
    backgroundColor: '#f0fafa', marginRight: 6, marginBottom: 6,
  },
  timezoneChipActive: { borderColor: '#00b894', backgroundColor: 'rgba(0,184,148,0.2)' },
  timezoneChipLabel: { fontSize: 11, color: '#666666' },
  timezoneChipLabelActive: { color: '#00b894', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24 ,
    padding: 24, maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20,
  },
  modalTitle: { flex: 1, fontSize: 17, fontWeight: 'bold', color: '#0f172a' },

  input: {
    backgroundColor: '#ffffff', borderRadius: 10, borderWidth: 1,
    borderColor: '#cccccc', paddingHorizontal: 14, paddingVertical: 11,
    color: '#0f172a', fontSize: 15, marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#ffffff', borderRadius: 10, borderWidth: 1,
    borderColor: '#cccccc', paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 12,
  },

  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1, borderRadius: 12, borderWidth: 1, borderColor: '#cccccc',
    paddingVertical: 13, alignItems: 'center',
  },
  cancelBtnText: { color: '#666666', fontWeight: '600', fontSize: 15 },
  saveBtn: {
    flex: 1, borderRadius: 12, backgroundColor: '#00b894',
    paddingVertical: 13, alignItems: 'center',
  },
  saveBtnText: { color: '#f0fafa', fontWeight: 'bold', fontSize: 15 },
  deleteBtn: {
    flex: 1, borderRadius: 12, backgroundColor: '#ef4444',
    paddingVertical: 13, alignItems: 'center',
  },
  deleteBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },

  langOption: {
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#cccccc',
  },
  langOptionText: { fontSize: 15, color: '#00b894', textAlign: 'center' },

  helpScroll: { maxHeight: 400 },
  modalText: { fontSize: 15, textAlign: 'center', marginBottom: 20 },

  // Help content styles
  helpSectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  helpIcon: { fontSize: 20 },
  helpTitle: { fontSize: 17, fontWeight: 'bold' },
  helpItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  helpIconSmall: { fontSize: 16, marginTop: 2 },
  helpLabel: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  helpValue: { fontSize: 13 },
  helpQuestion: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  helpAnswer: { fontSize: 13 },
  helpText: { fontSize: 14, marginBottom: 12, lineHeight: 20 },
  helpList: { gap: 6 },
  helpListItem: { fontSize: 13, lineHeight: 20 },

  // Version
  versionBadgeBase: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
  },
  versionNumber: { fontSize: 14, fontWeight: 'bold' },
  versionDate: { fontSize: 12, textAlign: 'center', marginTop: 4 },
})
