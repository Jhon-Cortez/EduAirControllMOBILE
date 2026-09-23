import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { setAppLanguage } from '../../../shared/i18n/i18n'
import storage from '../../../shared/storage/storage'
import {
  getAccessibilitySettings,
  saveAccessibilitySettings,
} from '../../../shared/accessibility/accessibilitySettings'
import Modal from '../../../shared/components/Modal/Modal'
import Button from '../../../shared/components/Button/Button'

const TIMEZONES = [
  { value: 'America/Bogota', labelKey: 'settings.timezoneBogota' },
  { value: 'America/Lima', labelKey: 'settings.timezoneLima' },
  { value: 'America/Mexico_City', labelKey: 'settings.timezoneMexicoCity' },
  { value: 'America/New_York', labelKey: 'settings.timezoneNewYork' },
  { value: 'America/Los_Angeles', labelKey: 'settings.timezoneLosAngeles' },
  { value: 'Europe/London', labelKey: 'settings.timezoneLondon' },
  { value: 'Europe/Madrid', labelKey: 'settings.timezoneMadrid' },
  { value: 'Europe/Paris', labelKey: 'settings.timezoneParis' },
  { value: 'Asia/Tokyo', labelKey: 'settings.timezoneTokyo' },
  { value: 'Australia/Sydney', labelKey: 'settings.timezoneSydney' },
]

const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
]

const COLOR_THEMES = [
  { key: '', label: 'settings.themeNormal' },
  { key: 'theme-protanopia', label: 'settings.themeProtanopia' },
  { key: 'theme-deuteranopia', label: 'settings.themeDeuteranopia' },
  { key: 'theme-tritanopia', label: 'settings.themeTritanopia' },
]

function Toggle({ value, onValueChange, currentColors }) {
  return (
    <TouchableOpacity
      style={[styles.toggle, { backgroundColor: value ? currentColors.accent : currentColors.borderColor }]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleCircle, value && { transform: [{ translateX: 20 }] }]} />
    </TouchableOpacity>
  )
}

function SectionCard({ icon, title, children, currentColors, style }) {
  return (
    <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={18} color={currentColors.accent} />
        <Text style={[styles.cardTitle, { color: currentColors.textPrimary }]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

function Row({ icon, color, label, value, onPress, right, currentColors }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={16} color={color || currentColors.textMuted} />
        <Text style={[styles.rowLabel, { color: color ? currentColors[color] || color : currentColors.textPrimary }]}>
          {label}
        </Text>
      </View>
      {value ? <Text style={[styles.rowValue, { color: currentColors.textMuted }]} numberOfLines={1}>{value}</Text> : null}
      {right || (onPress ? <Ionicons name="chevron-forward" size={16} color={currentColors.textMuted} /> : null)}
    </TouchableOpacity>
  )
}

export default function SettingsScreen({ navigation }) {
  const { darkMode, toggleDarkMode, currentColors } = useTheme()
  const { t, i18n } = useTranslation()

  const [colorTheme, setColorTheme] = useState('')
  const [autoTimezone, setAutoTimezone] = useState(true)
  const [manualTimezone, setManualTimezone] = useState('America/Bogota')
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY')
  const [reminders, setReminders] = useState({ alerts: true, warnings: true, daily: false, sound: true })
  const [privacy, setPrivacy] = useState({ visible: false })
  const [showLangModal, setShowLangModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteSent, setDeleteSent] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState({ open: false, type: null })
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [showPassword, setShowPassword] = useState({ new: false, confirm: false })

  useEffect(() => {
    setColorTheme(getAccessibilitySettings().colorTheme || '')
    ;['autoTimezone', 'manualTimezone', 'settings', 'reminders', 'privacy'].forEach((key) => {
      const raw = storage.getItem(key)
      if (raw != null) {
        try {
          if (key === 'autoTimezone') setAutoTimezone(JSON.parse(raw))
          else if (key === 'manualTimezone') setManualTimezone(raw)
          else if (key === 'settings') setDateFormat(JSON.parse(raw).dateFormat || 'DD-MM-YYYY')
          else if (key === 'reminders') setReminders(JSON.parse(raw))
          else if (key === 'privacy') setPrivacy(JSON.parse(raw))
        } catch (e) {
          console.warn('Error loading', key, e)
        }
      }
    })
  }, [])

  const persist = async (key, value) => {
    try {
      await storage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    } catch (e) {
      console.warn('Error saving', key, e)
    }
  }

  const handleThemeChange = (key) => {
    setColorTheme(key)
    const a11y = getAccessibilitySettings()
    saveAccessibilitySettings({ ...a11y, colorTheme: key })
  }

  const handleChangeLanguage = (code) => {
    setAppLanguage(code)
    setShowLangModal(false)
  }

  const handleSavePassword = () => {
    const pm = t('settings.passwordModal', { returnObjects: true })
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      return Alert.alert('', pm.errorEmpty)
    }
    if (passwordData.new !== passwordData.confirm) {
      return Alert.alert('', pm.errorMatch)
    }
    if (passwordData.new.length < 6) {
      return Alert.alert('', pm.errorLength)
    }
    Alert.alert('', pm.success)
    setShowPasswordModal(false)
    setPasswordData({ current: '', new: '', confirm: '' })
  }

  const themeLabel = (key) => {
    const entry = COLOR_THEMES.find((c) => c.key === key)
    return entry ? t(entry.label) : t('settings.themeNormal')
  }

  const renderHelpContent = () => {
    switch (showHelpModal.type) {
      case 'faq':
        return [
          { q: t('settings.faq.q1'), a: t('settings.faq.a1') },
          { q: t('settings.faq.q2'), a: t('settings.faq.a2') },
          { q: t('settings.faq.q3'), a: t('settings.faq.a3') },
          { q: t('settings.faq.q4'), a: t('settings.faq.a4') },
        ].map((item, idx) => (
          <View key={idx} style={styles.helpItem}>
            <Text style={[styles.helpQuestion, { color: currentColors.textPrimary }]}>{item.q}</Text>
            <Text style={[styles.helpAnswer, { color: currentColors.textSecondary }]}>{item.a}</Text>
          </View>
        ))
      case 'contact':
        return (
          <>
            {[
              { icon: '✉️', label: t('settings.contact.emailTitle'), value: t('settings.contact.emailDesc') },
              { icon: '🕐', label: t('settings.contact.scheduleTitle'), value: t('settings.contact.scheduleDesc') },
              { icon: '⏱️', label: t('settings.contact.responseTitle'), value: t('settings.contact.responseDesc') },
            ].map((row, idx) => (
              <View key={idx} style={styles.helpItem}>
                <Text style={styles.helpIcon}>{row.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.helpLabel, { color: currentColors.textPrimary }]}>{row.label}</Text>
                  <Text style={[styles.helpValue, { color: currentColors.textSecondary }]}>{row.value}</Text>
                </View>
              </View>
            ))}
          </>
        )
      case 'terms':
        return (
          <>
            <Text style={[styles.helpText, { color: currentColors.textSecondary }]}>{t('settings.terms.intro')}</Text>
            {t('settings.terms.sections', { returnObjects: true }).map((sec, idx) => (
              <View key={idx} style={styles.helpSection}>
                <Text style={[styles.helpSectionTitle, { color: currentColors.textPrimary }]}>{sec.title}</Text>
                {sec.items.map((item, i) => (
                  <Text key={i} style={[styles.helpListItem, { color: currentColors.textSecondary }]}>- {item}</Text>
                ))}
              </View>
            ))}
          </>
        )
      case 'privacy':
        return (
          <>
            <Text style={[styles.helpText, { color: currentColors.textSecondary }]}>{t('settings.privacyModal.intro')}</Text>
            {t('settings.privacyModal.sections', { returnObjects: true }).map((sec, idx) => (
              <View key={idx} style={styles.helpSection}>
                <Text style={[styles.helpSectionTitle, { color: currentColors.textPrimary }]}>{sec.title}</Text>
                {sec.items.map((item, i) => (
                  <Text key={i} style={[styles.helpListItem, { color: currentColors.textSecondary }]}>- {item}</Text>
                ))}
              </View>
            ))}
          </>
        )
      case 'version':
        return (
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text style={[styles.versionDesc, { color: currentColors.textSecondary }]}>{t('settings.versionDesc')}</Text>
            <Text style={[styles.versionDate, { color: currentColors.textMuted }]}>{t('settings.versionDate')}</Text>
          </View>
        )
      default:
        return null
    }
  }

  const currentLanguage = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <Ionicons name="settings-outline" size={30} color={currentColors.accent} />
        <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionCard icon="color-palette-outline" title={t('settings.appearance')} currentColors={currentColors}>
          <Row
            icon={darkMode ? 'moon' : 'moon-outline'}
            label={t('settings.darkMode')}
            currentColors={currentColors}
            right={<Toggle value={darkMode} onValueChange={toggleDarkMode} currentColors={currentColors} />}
          />
          <Row icon="eye-outline" label={t('settings.accessibleThemes')} value={themeLabel(colorTheme)} currentColors={currentColors} color={colorTheme === '' ? null : currentColors.accent} />
          <View style={styles.chipWrap}>
            {COLOR_THEMES.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[
                  styles.chip,
                  { backgroundColor: currentColors.bgBody, borderColor: colorTheme === c.key ? currentColors.accent : currentColors.borderColor },
                  colorTheme === c.key && { backgroundColor: currentColors.accentDim },
                ]}
                onPress={() => handleThemeChange(c.key)}
              >
                <Text style={[styles.chipLabel, { color: colorTheme === c.key ? currentColors.accent : currentColors.textSecondary }]}>
                  {t(c.label)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        <SectionCard icon="globe-outline" title={t('settings.langAndDates')} currentColors={currentColors}>
          <Text style={[styles.cardDesc, { color: currentColors.textMuted }]}>{t('settings.langDescription')}</Text>
          <Row
            icon="language-outline"
            label={t('settings.language')}
            value={currentLanguage.name}
            currentColors={currentColors}
            onPress={() => setShowLangModal(true)}
          />
          <Row
            icon="calendar-outline"
            label={t('settings.dateFormat')}
            value={dateFormat}
            currentColors={currentColors}
            onPress={() => {
              const next = dateFormat === 'DD-MM-YYYY' ? 'YYYY-MM-DD' : 'DD-MM-YYYY'
              setDateFormat(next)
              persist('settings', { dateFormat: next })
            }}
          />
          <Row
            icon="time-outline"
            label={t('settings.autoTimezone')}
            currentColors={currentColors}
            right={<Toggle value={autoTimezone} onValueChange={(v) => { setAutoTimezone(v); persist('autoTimezone', v) }} currentColors={currentColors} />}
          />
          {!autoTimezone && (
            <View style={styles.timezoneWrap}>
              <Text style={[styles.timezoneLabel, { color: currentColors.textSecondary }]}>{t('settings.selectTimezone')}</Text>
              <View style={styles.chipWrap}>
                {TIMEZONES.map((tz) => (
                  <TouchableOpacity
                    key={tz.value}
                    style={[styles.chip, { backgroundColor: currentColors.bgBody, borderColor: manualTimezone === tz.value ? currentColors.accent : currentColors.borderColor }]}
                    onPress={() => { setManualTimezone(tz.value); persist('manualTimezone', tz.value) }}
                  >
                    <Text style={[styles.chipLabel, { color: manualTimezone === tz.value ? currentColors.accent : currentColors.textSecondary }]}>
                      {t(tz.labelKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </SectionCard>

        <SectionCard icon="notifications-outline" title={t('settings.reminders')} currentColors={currentColors}>
          <Text style={[styles.cardDesc, { color: currentColors.textMuted }]}>{t('settings.remindersDescription')}</Text>
          {[
            { key: 'alerts', icon: 'alert-circle-outline', label: t('settings.reminderAlerts'), value: reminders.alerts },
            { key: 'warnings', icon: 'warning-outline', label: t('settings.reminderWarnings'), value: reminders.warnings },
            { key: 'daily', icon: 'calendar-outline', label: t('settings.reminderDaily'), value: reminders.daily },
            { key: 'sound', icon: 'volume-high-outline', label: t('settings.reminderSound'), value: reminders.sound },
          ].map((item) => (
            <Row
              key={item.key}
              icon={item.icon}
              label={item.label}
              currentColors={currentColors}
              right={<Toggle value={item.value} onValueChange={(v) => { setReminders((prev) => { const next = { ...prev, [item.key]: v }; persist('reminders', next); return next }) }} currentColors={currentColors} />}
            />
          ))}
        </SectionCard>

        <SectionCard icon="shield-checkmark-outline" title={t('settings.privacy')} currentColors={currentColors}>
          <Text style={[styles.cardDesc, { color: currentColors.textMuted }]}>{t('settings.privacyDescription')}</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="shield-outline" size={16} color={currentColors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: currentColors.textPrimary }]}>{t('settings.privacyInfoLabel')}</Text>
                <Text style={[styles.helpValue, { color: currentColors.textMuted }]}>{t('settings.privacyInfo')}</Text>
              </View>
            </View>
          </View>
          <Row icon="lock-closed-outline" label={t('settings.changePassword')} currentColors={currentColors} onPress={() => setShowPasswordModal(true)} />
          <Row icon="book-outline" label={t('settings.viewPrivacyPolicy')} currentColors={currentColors} onPress={() => setShowHelpModal({ open: true, type: 'privacy' })} />
          <Row icon="trash-outline" label={t('settings.deleteAccount')} currentColors={currentColors} color={currentColors.error} onPress={() => { setDeleteSent(false); setShowDeleteModal(true) }} />
        </SectionCard>

        <SectionCard icon="help-circle-outline" title={t('settings.help')} currentColors={currentColors}>
          <Text style={[styles.cardDesc, { color: currentColors.textMuted }]}>{t('settings.helpDescription')}</Text>
          {[
            { type: 'faq', icon: 'help-circle-outline', label: t('settings.helpFaq') },
            { type: 'contact', icon: 'mail-outline', label: t('settings.helpContact') },
            { type: 'terms', icon: 'document-text-outline', label: t('settings.helpTerms') },
            { type: 'privacy', icon: 'lock-closed-outline', label: t('settings.helpPrivacy') },
            { type: 'version', icon: 'information-circle-outline', label: t('settings.helpVersion') },
          ].map((item) => (
            <Row key={item.type} icon={item.icon} label={item.label} currentColors={currentColors} onPress={() => setShowHelpModal({ open: true, type: item.type })} />
          ))}
        </SectionCard>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal isOpen={showLangModal} onClose={() => setShowLangModal(false)} title={t('settings.language')} size="sm">
        {LANGUAGES.map((lang) => {
          const active = lang.code === i18n.language
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langOption, active && { backgroundColor: currentColors.accentDim }]}
              onPress={() => handleChangeLanguage(lang.code)}
            >
              <Text style={[styles.langOptionText, { color: active ? currentColors.accent : currentColors.textPrimary }]}>
                {lang.name}
              </Text>
              {active && <Ionicons name="checkmark" size={18} color={currentColors.accent} />}
            </TouchableOpacity>
          )
        })}
      </Modal>

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title={t('settings.passwordModal.title')}>
        <TextInput
          style={[styles.input, { backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
          placeholder={t('settings.passwordModal.current')}
          placeholderTextColor={currentColors.textMuted}
          value={passwordData.current}
          onChangeText={(v) => setPasswordData((p) => ({ ...p, current: v }))}
          secureTextEntry
          autoCapitalize="none"
        />
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
            placeholder={t('settings.passwordModal.new')}
            placeholderTextColor={currentColors.textMuted}
            value={passwordData.new}
            onChangeText={(v) => setPasswordData((p) => ({ ...p, new: v }))}
            secureTextEntry={!showPassword.new}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword((p) => ({ ...p, new: !p.new }))} hitSlop={8}>
            <Ionicons name={showPassword.new ? 'eye-outline' : 'eye-off-outline'} size={20} color={currentColors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
            placeholder={t('settings.passwordModal.confirm')}
            placeholderTextColor={currentColors.textMuted}
            value={passwordData.confirm}
            onChangeText={(v) => setPasswordData((p) => ({ ...p, confirm: v }))}
            secureTextEntry={!showPassword.confirm}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))} hitSlop={8}>
            <Ionicons name={showPassword.confirm ? 'eye-outline' : 'eye-off-outline'} size={20} color={currentColors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalActions}>
          <Button variant="outline" onPress={() => setShowPasswordModal(false)}>
            {t('settings.passwordModal.cancel')}
          </Button>
          <Button onPress={handleSavePassword}>
            {t('settings.passwordModal.save')}
          </Button>
        </View>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title={t('settings.deleteAccount')}>
        {deleteSent ? (
          <Text style={[styles.modalText, { color: currentColors.textSecondary }]}>{t('settings.deleteRequestSent')}</Text>
        ) : (
          <>
            <Text style={[styles.modalText, { color: currentColors.textSecondary }]}>{t('settings.deleteAccountConfirm')}</Text>
            <Text style={[styles.helpValue, { color: currentColors.textMuted }]}>{t('settings.deleteAccountDetail')}</Text>
            <View style={styles.modalActions}>
              <Button variant="outline" onPress={() => setShowDeleteModal(false)}>
                {t('settings.passwordModal.cancel')}
              </Button>
              <Button variant="danger" onPress={() => { setDeleteSent(true); }}>
                {t('settings.deleteBtn')}
              </Button>
            </View>
          </>
        )}
      </Modal>

      <Modal isOpen={showHelpModal.open} onClose={() => setShowHelpModal({ open: false, type: null })} title={t('settings.help')} size="lg">
        <ScrollView style={{ maxHeight: 480 }} contentContainerStyle={{ paddingBottom: 8 }}>
          {renderHelpContent()}
        </ScrollView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: 55, paddingBottom: 20, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden', paddingHorizontal: 16, paddingVertical: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardDesc: { fontSize: 12, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, marginRight: 8 },
  rowLabel: { fontSize: 14, flex: 1 },
  rowValue: { fontSize: 13, flexShrink: 0, maxWidth: 140, textAlign: 'right' },
  toggle: { width: 46, height: 26, borderRadius: 13, padding: 3, justifyContent: 'center', alignItems: 'flex-start' },
  toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipLabel: { fontSize: 12 },
  timezoneWrap: { marginTop: 10, gap: 8 },
  timezoneLabel: { fontSize: 13, marginBottom: 4 },
  input: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, marginBottom: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  langOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, marginBottom: 6,
  },
  langOptionText: { fontSize: 15, fontWeight: '600' },
  modalText: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 12 },
  helpItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  helpIcon: { fontSize: 16, marginTop: 2 },
  helpLabel: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  helpValue: { fontSize: 13 },
  helpQuestion: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  helpAnswer: { fontSize: 13, lineHeight: 18 },
  helpText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  helpSection: { marginBottom: 14 },
  helpSectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  helpListItem: { fontSize: 13, lineHeight: 19 },
  versionDesc: { fontSize: 15, fontWeight: '600' },
  versionDate: { fontSize: 12 },
})