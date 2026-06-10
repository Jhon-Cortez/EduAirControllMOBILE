import { useState, useEffect } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
  TextInput, Modal, Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'

const DEFAULT_PROFILE = {
  fullName: 'Keneth Santiago Rubiano Silva',
  email: 'Kensarusi@gmail.com',
  title: 'Product Manager',
}

export default function ProfileScreen({ navigation, route }) {
  const { darkMode, currentColors, loaded } = useTheme()
  const { t } = useLanguage()

  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [modal, setModal] = useState({ open: false, field: '', value: '', label: '' })

  const fieldConfig = {
    fullName: { label: t('profile.fullName'), icon: 'person-outline', keyboardType: 'default' },
    email: { label: t('profile.email'), icon: 'mail-outline', keyboardType: 'email-address' },
    title: { label: t('profile.role'), icon: 'briefcase-outline', keyboardType: 'default' },
  }

  const openModal = (field) =>
    setModal({ open: true, field, value: profile[field], label: fieldConfig[field].label })

  const handleSave = () => {
    setProfile((prev) => ({ ...prev, [modal.field]: modal.value }))
    setModal({ open: false, field: '', value: '', label: '' })
  }

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutQuestion'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.exit'), style: 'destructive', onPress: () => navigation.navigate('Login') },
      ]
    )
  }

  const initials = profile.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
        <StatusBar barStyle="dark-content" backgroundColor={currentColors.bgBody} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textMuted }}>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor={currentColors.bgBody} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <View style={{ width: 36 }} />
        <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>{t('profile.title')}</Text>
        <TouchableOpacity
          style={[styles.settingsBtn, { backgroundColor: currentColors.accentDim }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={20} color={currentColors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: currentColors.accentDim, borderColor: currentColors.accent }]}>
            <Text style={[styles.avatarText, { color: currentColors.accent }]}>{initials}</Text>
          </View>
          <Text style={[styles.profileName, { color: currentColors.textPrimary }]}>{profile.fullName}</Text>
          <Text style={[styles.profileTitle, { color: currentColors.textMuted }]}>{profile.title}</Text>
          <View style={[styles.emailBadge, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
            <Ionicons name="mail-outline" size={24} color={currentColors.accent} />
            <Text style={[styles.emailText, { color: currentColors.textSecondary }]}>{profile.email}</Text>
          </View>
        </View>

        {/* Info fields */}
        <Text style={[styles.sectionTitle, { color: currentColors.textMuted }]}>{t('profile.personalInfo')}</Text>
        <View style={[styles.fieldsCard, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          {Object.entries(fieldConfig).map(([key, config], index, arr) => (
            <TouchableOpacity
              key={key}
              style={[styles.fieldRow, index < arr.length - 1 && [styles.fieldRowBorder, { borderBottomColor: currentColors.borderColor }]]}
              onPress={() => openModal(key)}
            >
              <View style={styles.fieldLeft}>
                <View style={[styles.fieldIconWrap, { backgroundColor: currentColors.accentDim }]}>
                  <Ionicons name={config.icon} size={16} color={currentColors.accent} />
                </View>
                <View>
                  <Text style={[styles.fieldLabel, { color: currentColors.textMuted }]}>{config.label}</Text>
                  <Text style={[styles.fieldValue, { color: currentColors.textPrimary }]}>{profile[key]}</Text>
                </View>
              </View>
              <Ionicons name="pencil-outline" size={16} color={currentColors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: currentColors.error }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={currentColors.error} />
          <Text style={[styles.logoutText, { color: currentColors.error }]}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={modal.open} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: currentColors.bgCard, borderTopColor: currentColors.accent }]}>
            <Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>{t('profile.edit', { label: modal.label })}</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
              value={modal.value}
              onChangeText={(v) => setModal((prev) => ({ ...prev, value: v }))}
              placeholder={t('profile.placeholder', { label: modal.label.toLowerCase() })}
              placeholderTextColor={currentColors.textMuted}
              autoFocus
              keyboardType={modal.field ? fieldConfig[modal.field]?.keyboardType : 'default'}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancel, { borderColor: currentColors.borderColor }]}
                onPress={() => setModal({ open: false, field: '', value: '', label: '' })}
              >
                <Text style={[styles.modalCancelText, { color: currentColors.textSecondary }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalSave, { backgroundColor: currentColors.accent }]} onPress={handleSave}>
                <Text style={[styles.modalSaveText, { color: currentColors.bgBody }]}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0fafa' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 55, paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  settingsBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  avatarSection: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(0,184,148,0.1)',
    borderWidth: 2, borderColor: '#00b894',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#00b894' },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 4, textAlign: 'center' },
  profileTitle: { fontSize: 15, color: '#999999', marginBottom: 16, textAlign: 'center' },
  emailBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#ffffff', borderRadius: 22, borderWidth: 1,
    borderColor: '#cccccc', paddingHorizontal: 14, paddingVertical: 8,
    marginBottom: 4, maxWidth: '100%',
  },
  emailText: { fontSize: 13, color: '#666666', flexShrink: 1 },

  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#999999',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 10, marginTop: 20,
  },

  fieldsCard: {
    backgroundColor: '#ffffff', borderRadius: 16,
    borderWidth: 1, borderColor: '#cccccc', overflow: 'hidden',
  },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  fieldRowBorder: { borderBottomWidth: 1, borderBottomColor: '#cccccc' },
  fieldLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  fieldIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(0,184,148,0.1)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  fieldLabel: { fontSize: 11, color: '#999999', marginBottom: 2 },
  fieldValue: { fontSize: 14, color: '#0f172a', fontWeight: '500', flexShrink: 1 },
  optionLabel: { fontSize: 15, color: '#0f172a', flexShrink: 1 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    marginTop: 24, borderRadius: 12, borderWidth: 1,
    paddingVertical: 14,
    backgroundColor: 'rgba(244,67,54,0.08)',
  },
  logoutText: { color: '#ef4444', fontSize: 15, fontWeight: 'bold' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24,
    borderTopWidth: 2, borderColor: '#00b894',
  },
  modalTitle: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#ffffff', borderRadius: 10,
    borderWidth: 1, borderColor: '#cccccc',
    padding: 14, fontSize: 15, marginBottom: 20,
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancel: {
    flex: 1, borderRadius: 10, borderWidth: 1,
    borderColor: '#cccccc', padding: 14, alignItems: 'center',
  },
  modalCancelText: { color: '#666666', fontWeight: '600' },
  modalSave: {
    flex: 1, borderRadius: 10, backgroundColor: '#00b894',
    padding: 14, alignItems: 'center',
  },
  modalSaveText: { color: '#f0fafa', fontWeight: 'bold' },
})
