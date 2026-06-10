import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LanguageContext = createContext()

const LANGUAGE_NAMES = {
  es: 'Espanol',
  en: 'English',
}

const STRINGS = {
  es: {
    loading: 'Cargando...',
    tabs: {
      home: 'Inicio',
      favorites: 'Favoritos',
      management: 'Gestion',
      alerts: 'Alertas',
      profile: 'Perfil',
    },
    status: {
      normal: 'Normal',
      warning: 'Advertencia',
      alert: 'Alerta',
    },
    quality: {
      good: 'Buena',
      regular: 'Regular',
      bad: 'Mala',
    },
    common: {
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      add: 'Agregar',
      edit: 'Editar',
    },
    dashboard: {
      title: 'Ranking de Ambientes',
      subtitle: 'Toca un ambiente para ver detalles',
      goodHealth: 'Estado general bueno',
      recommendedAttention: 'Atencion recomendada',
      interventionNeeded: 'Intervencion necesaria',
      monitored: '{{count}} ambientes monitoreados',
      total: 'Total',
      all: 'Todos',
      noAlerts: 'Sin alertas activas - todos los ambientes estan bien',
      activeAlerts: 'Alertas activas',
      noise: 'Ruido',
      emptyByStatus: 'No hay ambientes con este estado',
      positions: 'Posiciones {{from}} - {{to}}',
      scoreTitle: 'Como se calcula el puntaje',
      idealTemp: 'Temp ideal: 18-24C',
      idealHumidity: 'Humedad ideal: 40-60%',
      idealCo2: 'CO2 ideal: < 1000 ppm',
      idealNoise: 'Ruido ideal: < 50 dB',
    },
    settings: {
      title: 'Configuracion',
      appearance: 'Apariencia',
      darkMode: 'Modo oscuro',
      accessibleTheme: 'Tema accesible',
      languageDates: 'Idioma y fechas',
      language: 'Idioma',
      dateFormat: 'Formato de fecha',
      autoTimezone: 'Zona horaria automatica',
      timezone: 'Zona horaria:',
      reminders: 'Recordatorios',
      criticalAlerts: 'Alertas criticas',
      warnings: 'Advertencias',
      dailySummary: 'Resumen diario',
      sound: 'Sonido',
      privacy: 'Privacidad',
      publicProfile: 'Perfil publico',
      shareData: 'Compartir datos',
      changePassword: 'Cambiar contrasena',
      deleteAccount: 'Eliminar cuenta',
      help: 'Ayuda',
      faq: 'Preguntas frecuentes',
      contact: 'Contacto',
      terms: 'Terminos y condiciones',
      privacyPolicy: 'Politica de privacidad',
      version: 'Version',
      currentPassword: 'Contrasena actual',
      newPassword: 'Nueva contrasena',
      confirmPassword: 'Confirmar contrasena',
      requiredFieldsTitle: 'Campos requeridos',
      requiredFieldsMessage: 'Completa todos los campos.',
      passwordMismatchTitle: 'Error',
      passwordMismatchMessage: 'Las contrasenas no coinciden.',
      passwordLengthMessage: 'La contrasena debe tener al menos 6 caracteres.',
      passwordSuccessTitle: 'Exito',
      passwordSuccessMessage: 'Contrasena actualizada correctamente',
      deleteMessage: 'Estas seguro de eliminar tu cuenta? Esta accion no se puede deshacer.',
      faqAddQuestion: 'Como agregar un ambiente?',
      faqAddAnswer: 'Ve a Gestion -> Agregar ambiente',
      faqThemeQuestion: 'Como cambiar el tema?',
      faqThemeAnswer: 'En Configuracion -> Apariencia',
      faqPasswordQuestion: 'Olvide mi contrasena?',
      faqPasswordAnswer: 'Usa la opcion "Olvide mi contrasena" en login',
      email: 'Correo',
      schedule: 'Horario',
      scheduleValue: 'L-V 8am-6pm',
      termsText: 'Al usar EduAirControl, aceptas nuestros terminos de servicio.',
      termsUse: 'Uso responsable de la plataforma',
      termsData: 'Proteccion de datos personales',
      termsIp: 'Propiedad intelectual',
      privacyText: 'Tu privacidad es importante para nosotros.',
      privacyNoShare: 'No compartimos datos con terceros',
      privacyEncrypted: 'Datos encriptados',
      privacyRights: 'Derechos del usuario',
      versionDate: 'Mayo 2026',
      normalTheme: 'Normal',
      protanopia: 'Protanopia',
      deuteranopia: 'Deuteranopia',
      tritanopia: 'Tritanopia',
    },
    notifications: {
      title: 'Notificaciones',
      activeAlerts: '{{count}} alertas activas',
      all: 'Todas',
      alerts: 'Alertas',
      warnings: 'Advertencias',
      info: 'Info',
      emptyTitle: 'Sin notificaciones',
      emptyText: 'Todos los ambientes estan dentro de los parametros normales',
      highCo2: 'CO2 elevado',
      highTemp: 'Temperatura alta',
      highNoise: 'Ruido elevado',
      humidityOut: 'Humedad fuera de rango',
      dailySummary: 'Resumen del dia',
      maxRecommended: 'max recomendado',
      summaryMessage: '{{alerts}} alertas - {{warnings}} advertencias en {{count}} ambientes',
    },
    favorites: {
      title: 'Favoritos',
      noneYet: 'No tienes ambientes favoritos aun',
      saved: '{{count}} ambiente{{plural}} guardado{{plural}}',
      emptyTitle: 'Sin favoritos',
      emptyText: 'Toca el corazon en cualquier ambiente del dashboard para guardarlo aqui',
      goDashboard: 'Ir al Dashboard',
      removeTitle: 'Eliminar de favoritos',
      removeQuestion: 'Deseas quitar "{{name}}" de tus favoritos?',
      people: 'personas',
      airQuality: 'Calidad del aire',
    },
    profile: {
      title: 'Mi Perfil',
      personalInfo: 'Informacion personal',
      fullName: 'Nombre completo',
      email: 'Correo electronico',
      role: 'Cargo / Rol',
      logout: 'Cerrar sesion',
      logoutQuestion: 'Estas seguro de que quieres salir?',
      exit: 'Salir',
      edit: 'Editar {{label}}',
      placeholder: 'Ingresa {{label}}',
    },
    management: {
      title: 'Gestion de Ambientes',
      add: 'Agregar',
      warning: 'Advertencia',
      searchPlaceholder: 'Buscar por nombre o ubicacion...',
      showing: 'Mostrando {{shown}} de {{total}} ambientes',
      clear: 'Limpiar',
      noResults: 'Sin resultados',
      noEnvironments: 'Sin ambientes',
      tryAnother: 'Intenta con otro termino o cambia los filtros',
      startMonitoring: 'Toca "Agregar" para comenzar a monitorear',
      clearSearch: 'Limpiar busqueda',
      addEnvironment: 'Agregar ambiente',
      newEnvironment: 'Nuevo ambiente',
      editEnvironment: 'Editar ambiente',
      name: 'Nombre *',
      capacity: 'Capacidad',
      location: 'Ubicacion',
      requiredTitle: 'Campo requerido',
      requiredName: 'El nombre del ambiente es obligatorio.',
      noLocation: 'Sin ubicacion',
      deleteTitle: 'Eliminar ambiente',
      deleteQuestion: 'Eliminar "{{name}}"? Esta accion no se puede deshacer.',
    },
  },
  en: {
    loading: 'Loading...',
    tabs: {
      home: 'Home',
      favorites: 'Favorites',
      management: 'Manage',
      alerts: 'Alerts',
      profile: 'Profile',
    },
    status: {
      normal: 'Normal',
      warning: 'Warning',
      alert: 'Alert',
    },
    quality: {
      good: 'Good',
      regular: 'Fair',
      bad: 'Poor',
    },
    common: {
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      add: 'Add',
      edit: 'Edit',
    },
    dashboard: {
      title: 'Environment Ranking',
      subtitle: 'Tap an environment to view details',
      goodHealth: 'Overall status is good',
      recommendedAttention: 'Attention recommended',
      interventionNeeded: 'Intervention needed',
      monitored: '{{count}} environments monitored',
      total: 'Total',
      all: 'All',
      noAlerts: 'No active alerts - all environments are OK',
      activeAlerts: 'Active alerts',
      noise: 'Noise',
      emptyByStatus: 'No environments with this status',
      positions: 'Positions {{from}} - {{to}}',
      scoreTitle: 'How the score is calculated',
      idealTemp: 'Ideal temp: 18-24C',
      idealHumidity: 'Ideal humidity: 40-60%',
      idealCo2: 'Ideal CO2: < 1000 ppm',
      idealNoise: 'Ideal noise: < 50 dB',
    },
    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      darkMode: 'Dark mode',
      accessibleTheme: 'Accessible theme',
      languageDates: 'Language and dates',
      language: 'Language',
      dateFormat: 'Date format',
      autoTimezone: 'Automatic time zone',
      timezone: 'Time zone:',
      reminders: 'Reminders',
      criticalAlerts: 'Critical alerts',
      warnings: 'Warnings',
      dailySummary: 'Daily summary',
      sound: 'Sound',
      privacy: 'Privacy',
      publicProfile: 'Public profile',
      shareData: 'Share data',
      changePassword: 'Change password',
      deleteAccount: 'Delete account',
      help: 'Help',
      faq: 'FAQ',
      contact: 'Contact',
      terms: 'Terms and conditions',
      privacyPolicy: 'Privacy policy',
      version: 'Version',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmPassword: 'Confirm password',
      requiredFieldsTitle: 'Required fields',
      requiredFieldsMessage: 'Complete all fields.',
      passwordMismatchTitle: 'Error',
      passwordMismatchMessage: 'Passwords do not match.',
      passwordLengthMessage: 'Password must be at least 6 characters.',
      passwordSuccessTitle: 'Success',
      passwordSuccessMessage: 'Password updated successfully',
      deleteMessage: 'Are you sure you want to delete your account? This action cannot be undone.',
      faqAddQuestion: 'How do I add an environment?',
      faqAddAnswer: 'Go to Manage -> Add environment',
      faqThemeQuestion: 'How do I change the theme?',
      faqThemeAnswer: 'Go to Settings -> Appearance',
      faqPasswordQuestion: 'Forgot your password?',
      faqPasswordAnswer: 'Use the "Forgot password" option on login',
      email: 'Email',
      schedule: 'Hours',
      scheduleValue: 'Mon-Fri 8am-6pm',
      termsText: 'By using EduAirControl, you accept our terms of service.',
      termsUse: 'Responsible use of the platform',
      termsData: 'Personal data protection',
      termsIp: 'Intellectual property',
      privacyText: 'Your privacy matters to us.',
      privacyNoShare: 'We do not share data with third parties',
      privacyEncrypted: 'Encrypted data',
      privacyRights: 'User rights',
      versionDate: 'May 2026',
      normalTheme: 'Normal',
      protanopia: 'Protanopia',
      deuteranopia: 'Deuteranopia',
      tritanopia: 'Tritanopia',
    },
    notifications: {
      title: 'Notifications',
      activeAlerts: '{{count}} active alerts',
      all: 'All',
      alerts: 'Alerts',
      warnings: 'Warnings',
      info: 'Info',
      emptyTitle: 'No notifications',
      emptyText: 'All environments are within normal parameters',
      highCo2: 'High CO2',
      highTemp: 'High temperature',
      highNoise: 'High noise',
      humidityOut: 'Humidity out of range',
      dailySummary: 'Daily summary',
      maxRecommended: 'recommended max',
      summaryMessage: '{{alerts}} alerts - {{warnings}} warnings across {{count}} environments',
    },
    favorites: {
      title: 'Favorites',
      noneYet: 'You do not have favorite environments yet',
      saved: '{{count}} saved environment{{plural}}',
      emptyTitle: 'No favorites',
      emptyText: 'Tap the heart on any dashboard environment to save it here',
      goDashboard: 'Go to Dashboard',
      removeTitle: 'Remove from favorites',
      removeQuestion: 'Remove "{{name}}" from your favorites?',
      people: 'people',
      airQuality: 'Air quality',
    },
    profile: {
      title: 'My Profile',
      personalInfo: 'Personal information',
      fullName: 'Full name',
      email: 'Email',
      role: 'Job / Role',
      logout: 'Log out',
      logoutQuestion: 'Are you sure you want to leave?',
      exit: 'Exit',
      edit: 'Edit {{label}}',
      placeholder: 'Enter {{label}}',
    },
    management: {
      title: 'Environment Management',
      add: 'Add',
      warning: 'Warning',
      searchPlaceholder: 'Search by name or location...',
      showing: 'Showing {{shown}} of {{total}} environments',
      clear: 'Clear',
      noResults: 'No results',
      noEnvironments: 'No environments',
      tryAnother: 'Try another term or change the filters',
      startMonitoring: 'Tap "Add" to start monitoring',
      clearSearch: 'Clear search',
      addEnvironment: 'Add environment',
      newEnvironment: 'New environment',
      editEnvironment: 'Edit environment',
      name: 'Name *',
      capacity: 'Capacity',
      location: 'Location',
      requiredTitle: 'Required field',
      requiredName: 'Environment name is required.',
      noLocation: 'No location',
      deleteTitle: 'Delete environment',
      deleteQuestion: 'Delete "{{name}}"? This action cannot be undone.',
    },
  },
}

function normalizeLanguage(value) {
  if (!value) return 'es'
  const clean = String(value).toLowerCase()
  if (clean.startsWith('en') || clean.includes('english')) return 'en'
  return 'es'
}

function getValue(path, language) {
  return path.split('.').reduce((current, part) => current?.[part], STRINGS[language])
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('es')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('settings')
        if (saved) {
          const parsed = JSON.parse(saved)
          setLanguageState(normalizeLanguage(parsed.language))
        }
      } catch (e) {
        console.warn('Error loading language:', e)
      } finally {
        setLoaded(true)
      }
    }
    load()
  }, [])

  const setLanguage = async (nextLanguage) => {
    const normalized = normalizeLanguage(nextLanguage)
    setLanguageState(normalized)
    try {
      const saved = await AsyncStorage.getItem('settings')
      const parsed = saved ? JSON.parse(saved) : {}
      await AsyncStorage.setItem('settings', JSON.stringify({ ...parsed, language: normalized }))
    } catch (e) {
      console.warn('Error saving language:', e)
    }
  }

  const value = useMemo(() => {
    const t = (key, params = {}) => {
      const template = getValue(key, language) ?? getValue(key, 'es') ?? key
      if (typeof template !== 'string') return key
      return Object.entries(params).reduce(
        (text, [param, val]) => text.split(`{{${param}}}`).join(String(val)),
        template
      )
    }

    return {
      language,
      languageName: LANGUAGE_NAMES[language],
      languageOptions: LANGUAGE_NAMES,
      loaded,
      setLanguage,
      t,
    }
  }, [language, loaded])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
