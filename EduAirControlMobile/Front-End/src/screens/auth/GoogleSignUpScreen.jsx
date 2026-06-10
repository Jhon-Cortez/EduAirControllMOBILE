/**
 * GoogleSignUpScreen — móvil
 * Equivalente a GoogleSignUpScreen.jsx de la web.
 * Flujo de registro con cuenta de Google.
 */
import { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, StatusBar, TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

const GOOGLE_ACCOUNTS = [
  { id: 1, name: 'Keneth Rubiano',  email: 'keneth.rubiano@gmail.com',  initials: 'KR' },
  { id: 2, name: 'Usuario Ejemplo', email: 'usuario.ejemplo@gmail.com', initials: 'UE' },
]

export default function GoogleSignUpScreen({ navigation }) {
  const { currentColors, darkMode } = useTheme()
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [companyCode, setCompanyCode]         = useState('')
  const [step, setStep] = useState(1) // 1 = elegir cuenta, 2 = código empresa

  const handleSelectAccount = (account) => {
    setSelectedAccount(account)
    setStep(2)
  }

  const handleConfirm = () => {
    if (!companyCode.trim()) return
    navigation.navigate('App')
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentColors.bgBody }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step === 2 ? setStep(1) : navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={currentColors.accent} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.accent }]}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Ionicons name="logo-google" size={32} color="#DB4437" />
            <Text style={[styles.title, { color: currentColors.textPrimary }]}>
              {step === 1 ? 'Elige una cuenta' : 'Código de empresa'}
            </Text>
          </View>

          {step === 1 ? (
            <>
              <Text style={[styles.subtitle, { color: currentColors.textMuted }]}>
                Selecciona la cuenta de Google con la que quieres registrarte en EduAirControl
              </Text>
              {GOOGLE_ACCOUNTS.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.accountItem, { backgroundColor: currentColors.bgCardAlt || currentColors.bgBody, borderColor: currentColors.borderColor }]}
                  onPress={() => handleSelectAccount(account)}
                >
                  <View style={[styles.avatar, { backgroundColor: currentColors.accentDim }]}>
                    <Text style={[styles.avatarText, { color: currentColors.accent }]}>{account.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.accountName, { color: currentColors.textPrimary }]}>{account.name}</Text>
                    <Text style={[styles.accountEmail, { color: currentColors.textMuted }]}>{account.email}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={currentColors.textMuted} />
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              {/* Selected account chip */}
              <View style={[styles.selectedChip, { backgroundColor: currentColors.accentDim, borderColor: currentColors.accent }]}>
                <Ionicons name="logo-google" size={14} color={currentColors.accent} />
                <Text style={[styles.selectedChipText, { color: currentColors.accent }]} numberOfLines={1}>
                  {selectedAccount?.email}
                </Text>
              </View>

              <Text style={[styles.subtitle, { color: currentColors.textMuted }]}>
                Ingresa el código de tu institución para completar el registro
              </Text>

              <Text style={[styles.label, { color: currentColors.textSecondary }]}>Código de empresa</Text>
              <View style={[styles.inputWrap, { backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor }]}>
                <Ionicons name="business-outline" size={18} color={currentColors.textMuted} />
                <TextInput
                  style={[styles.input, { color: currentColors.textPrimary }]}
                  placeholder="Ej: EDU-2024"
                  placeholderTextColor={currentColors.textMuted}
                  value={companyCode}
                  onChangeText={setCompanyCode}
                  autoCapitalize="characters"
                />
              </View>

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: companyCode.trim() ? currentColors.accent : currentColors.borderColor }]}
                onPress={handleConfirm}
                disabled={!companyCode.trim()}
              >
                <Text style={[styles.confirmBtnText, { color: currentColors.bgBody }]}>Completar registro</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { flexGrow: 1, justifyContent: 'center', padding: 20 },

  header:  { marginBottom: 12 },
  backBtn: { padding: 4, alignSelf: 'flex-start' },

  card: {
    borderRadius: 20, padding: 24, borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title:   { fontSize: 22, fontWeight: 'bold' },
  subtitle:{ fontSize: 13, marginBottom: 20, lineHeight: 19 },

  accountItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 12, borderWidth: 1,
    padding: 14, marginBottom: 10,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:   { fontSize: 16, fontWeight: 'bold' },
  accountName:  { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  accountEmail: { fontSize: 12 },

  selectedChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 6,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  selectedChipText: { fontSize: 13, fontWeight: '600', maxWidth: 220 },

  label:     { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20,
  },
  input: { flex: 1, fontSize: 15 },

  confirmBtn: {
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  confirmBtnText: { fontSize: 16, fontWeight: 'bold' },
})
