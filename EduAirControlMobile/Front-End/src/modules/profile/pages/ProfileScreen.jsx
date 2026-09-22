import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useProfileVM } from '../viewmodels/useProfileVM'
import Modal from '../../../shared/components/Modal/Modal'
import Button from '../../../shared/components/Button/Button'
import Input from '../../../shared/components/Input/Input'

const FIELD_CONFIG = [
  { field: 'fullName', icon: 'person-outline' },
  { field: 'email', icon: 'mail-outline', keyboardType: 'email-address' },
  { field: 'title', icon: 'briefcase-outline' },
  { field: 'phone', icon: 'call-outline', keyboardType: 'phone-pad' },
  { field: 'location', icon: 'location-outline' },
]

function fieldLabel(t, field) {
  const map = {
    fullName: 'profile.fullName',
    email: 'profile.email',
    title: 'profile.titleLabel',
    phone: 'profile.phone',
    location: 'profile.location',
  }
  return t(map[field])
}

function initials(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export default function ProfileScreen({ navigation }) {
  const { darkMode, currentColors } = useTheme()
  const { t } = useTranslation()
  const vm = useProfileVM({
    onLogout: () => navigation.replace('Login'),
  })

  const unfilled = !vm.profile.fullName && !vm.profile.email

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <View style={{ width: 36 }} />
        <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>{t('profile.title')}</Text>
        <TouchableOpacity
          style={[styles.settingsBtn, { backgroundColor: currentColors.accentDim }]}
          onPress={() => navigation.navigate('Settings')}
          hitSlop={6}
        >
          <Ionicons name="settings-outline" size={20} color={currentColors.accent} />
        </TouchableOpacity>
      </View>

      {unfilled ? (
        <View style={styles.loading}>
          <ActivityIndicator color={currentColors.accent} />
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={[styles.avatar, { backgroundColor: currentColors.accentDim, borderColor: currentColors.accent }]}
              onPress={vm.openAvatarPicker}
              accessibilityLabel={t('profile.update')}
            >
              {vm.avatar ? (
                <View style={{ width: 86, height: 86 }}>
                  <Ionicons name="image-outline" size={30} color={currentColors.accent} style={{ position: 'absolute', right: 0, bottom: 0 }} />
                </View>
              ) : (
                <Text style={[styles.avatarText, { color: currentColors.accent }]}>{initials(vm.profile.fullName)}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarActions} onPress={vm.openAvatarPicker} hitSlop={8}>
              <Ionicons name="camera-outline" size={14} color={currentColors.accent} />
              <Text style={[styles.avatarActionText, { color: currentColors.accent }]}>{t('profile.update')}</Text>
            </TouchableOpacity>
            {vm.avatar && (
              <TouchableOpacity style={styles.avatarActions} onPress={vm.handleRemoveAvatar} hitSlop={8}>
                <Ionicons name="trash-outline" size={14} color={currentColors.error} />
                <Text style={[styles.avatarActionText, { color: currentColors.error }]}>{t('common.delete', 'Quitar')}</Text>
              </TouchableOpacity>
            )}
            {vm.avatarLoading && <ActivityIndicator color={currentColors.accent} style={{ marginTop: 8 }} />}
            {vm.avatarError && <Text style={[styles.avatarError, { color: currentColors.error }]}>{vm.avatarError}</Text>}
            <Text style={[styles.profileName, { color: currentColors.textPrimary }]}>{vm.profile.fullName}</Text>
            <Text style={[styles.profileRole, { color: currentColors.textMuted }]}>{vm.profile.title}</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: currentColors.textMuted }]}>{t('profile.personalInfo')}</Text>

          <View style={[styles.fieldsCard, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
            {vm.isEditing ? (
              <View style={styles.editFields}>
                {FIELD_CONFIG.map((c) => (
                  <Input
                    key={c.field}
                    label={fieldLabel(t, c.field)}
                    value={vm.form[c.field]}
                    onChangeText={(v) => vm.handleChange(c.field, v)}
                    keyboardType={c.keyboardType}
                    icon={c.icon}
                  />
                ))}
                <View style={styles.editActions}>
                  <Button variant="outline" onPress={vm.handleCancel}>
                    {t('profile.cancel')}
                  </Button>
                  <Button onPress={vm.handleSave}>
                    {t('profile.save')}
                  </Button>
                </View>
              </View>
            ) : (
              FIELD_CONFIG.map((c, index) => (
                <TouchableOpacity
                  key={c.field}
                  style={[
                    styles.fieldRow,
                    index < FIELD_CONFIG.length - 1 && [styles.fieldRowBorder, { borderBottomColor: currentColors.borderColor }],
                  ]}
                  onPress={() => vm.setIsEditing(true)}
                  disabled={!vm.editable}
                >
                  <View style={styles.fieldLeft}>
                    <View style={[styles.fieldIconWrap, { backgroundColor: currentColors.accentDim }]}>
                      <Ionicons name={c.icon} size={16} color={currentColors.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: currentColors.textMuted }]}>{fieldLabel(t, c.field)}</Text>
                      <Text style={[styles.fieldValue, { color: currentColors.textPrimary }]} numberOfLines={1}>
                        {vm.profile[c.field] || '—'}
                      </Text>
                    </View>
                    <Ionicons name="pencil-outline" size={16} color={currentColors.textMuted} />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          <TouchableOpacity style={[styles.logoutBtn, { borderColor: currentColors.error }]} onPress={() => vm.setLogoutModal(true)}>
            <Ionicons name="log-out-outline" size={18} color={currentColors.error} />
            <Text style={[styles.logoutText, { color: currentColors.error }]}>{t('profile.logoutBtn')}</Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      <Modal isOpen={vm.logoutModal} onClose={() => vm.setLogoutModal(false)} title={t('profile.logoutTitle')} size="sm">
        <Text style={[styles.modalText, { color: currentColors.textSecondary }]}>{t('profile.logoutMessage')}</Text>
        <View style={styles.modalActions}>
          <Button variant="outline" onPress={() => vm.setLogoutModal(false)}>
            {t('profile.cancel')}
          </Button>
          <Button variant="danger" onPress={vm.handleLogout}>
            {t('profile.logoutBtn')}
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 55, paddingBottom: 16, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  settingsBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarSection: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 20 },
  avatar: {
    width: 90, height: 90, borderRadius: 45, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden',
  },
  avatarText: { fontSize: 32, fontWeight: 'bold' },
  avatarActions: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  avatarActionText: { fontSize: 13, fontWeight: '600' },
  avatarError: { fontSize: 12, marginTop: 6 },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  profileRole: { fontSize: 15, marginTop: 4, textAlign: 'center' },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 10, marginTop: 8,
  },
  fieldsCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', paddingHorizontal: 16 },
  fieldRow: { paddingVertical: 14 },
  fieldRowBorder: { borderBottomWidth: 1 },
  fieldLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fieldIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 11, marginBottom: 2 },
  fieldValue: { fontSize: 14, fontWeight: '500' },
  editFields: { paddingVertical: 14, gap: 12 },
  editActions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginTop: 24, borderRadius: 12, borderWidth: 1, paddingVertical: 14,
    backgroundColor: 'rgba(244,67,54,0.08)',
  },
  logoutText: { fontSize: 15, fontWeight: 'bold' },
  modalText: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
})