/**
 * FacebookSignUpScreen — móvil
 * Equivalente a FacebookSignUpScreen.jsx de la web.
 */
import { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, StatusBar, TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

export default function FacebookSignUpScreen({ navigation }) {
  const { currentColors, darkMode } = useTheme()
  const [companyCode, setCompanyCode] = useState('')
  const [agreed, setAgreed]           = useState(false)

  const handleConfirm = () => {
    if (!companyCode.trim() || !agreed) return
    navigation.navigate('App')
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentColors.bgBody }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />
      <ScrollView contentContainerStyle={styles.scroll}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={currentColors.accent} />
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: '#1877F2' }]}>
          {/* Header */}
          <View style={styles.logoRow}>
            <View style={[styles.fbBubble, { backgroundColor: '#1877F2' }]}>
              <Ionicons name="logo-facebook" size={28} color="#fff" />
            </View>
            <View>
              <Text style={[styles.title, { color: currentColors.textPrimary }]}>Registro con Facebook</Text>
              <Text style={[styles.connectedText, { color: '#1877F2' }]}>Cuenta conectada ✓</Text>
            </View>
          </View>

          <Text style={[styles.subtitle, { color: currentColors.textMuted }]}>
            Tu cuenta de Facebook ha sido verificada. Ingresa el código de tu institución para continuar.
          </Text>

          {/* Company code */}
          <Text style={[styles.label, { color: currentColors.textSecondary }]}>Código de empresa *</Text>
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

          {/* Terms toggle */}
          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
            <View style={[styles.checkbox, agreed && { backgroundColor: '#1877F2', borderColor: '#1877F2' }]}>
              {agreed && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={[styles.termsText, { color: currentColors.textSecondary }]}>
              Acepto los{' '}
              <Text style={{ color: '#1877F2', fontWeight: '600' }}>términos y condiciones</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmBtn,
              { backgroundColor: companyCode.trim() && agreed ? '#1877F2' : currentColors.borderColor }
            ]}
            onPress={handleConfirm}
            disabled={!companyCode.trim() || !agreed}
          >
            <Ionicons name="logo-facebook" size={18} color="#fff" />
            <Text style={styles.confirmBtnText}>Completar registro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { flexGrow: 1, justifyContent: 'center', padding: 20 },
  backBtn:   { padding: 4, alignSelf: 'flex-start', marginBottom: 12 },

  card: {
    borderRadius: 20, padding: 24, borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  logoRow:       { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  fbBubble:      { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  title:         { fontSize: 19, fontWeight: 'bold' },
  connectedText: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  subtitle:      { fontSize: 13, marginBottom: 20, lineHeight: 19 },

  label:     { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16,
  },
  input: { flex: 1, fontSize: 15 },

  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  checkbox: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 2, borderColor: '#cccccc',
    alignItems: 'center', justifyContent: 'center',
  },
  termsText: { fontSize: 13, flex: 1 },

  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 12, paddingVertical: 14,
  },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})
