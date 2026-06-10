import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

export default function SignUpScreen({ navigation }) {
  const { currentColors, darkMode } = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentColors.bgBody }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.accent }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={currentColors.accent} />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={[styles.title, { color: currentColors.textPrimary }]}>Registrarse</Text>
            <Ionicons name="person-circle-outline" size={50} color={currentColors.accent} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentColors.textSecondary }]}>Nombre</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
              placeholder="Tu nombre"
              placeholderTextColor={currentColors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentColors.textSecondary }]}>Correo electrónico</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={currentColors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentColors.textSecondary }]}>Contraseña</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
                placeholder="••••••••"
                placeholderTextColor={currentColors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={currentColors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: currentColors.textSecondary }]}>Confirmar contraseña</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor, color: currentColors.textPrimary }]}
                placeholder="••••••••"
                placeholderTextColor={currentColors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color={currentColors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.termsRow}>
            <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)}>
              <View style={[styles.checkbox, { borderColor: currentColors.borderColor, backgroundColor: acceptTerms ? currentColors.accent : 'transparent' }]}>
                {acceptTerms && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: currentColors.textSecondary }]}>
              Acepto los{' '}
              <Text
                style={[styles.termsLink, { color: currentColors.accent }]}
                onPress={() => navigation.navigate('Terms')}
              >
                Términos de uso y Política de privacidad
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.btnRegister, { backgroundColor: acceptTerms ? currentColors.accent : currentColors.borderColor }]}
            onPress={() => acceptTerms && navigation.navigate('App')}
          >
            <Text style={[styles.btnRegisterText, { color: currentColors.bgBody }]}>Registrarse</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: currentColors.borderColor }]} />
            <Text style={[styles.dividerText, { color: currentColors.textMuted }]}>o continúa con</Text>
            <View style={[styles.dividerLine, { backgroundColor: currentColors.borderColor }]} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor }]}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={[styles.socialBtnText, { color: currentColors.textPrimary }]}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: currentColors.bgInput, borderColor: currentColors.borderColor }]}>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={[styles.socialBtnText, { color: currentColors.textPrimary }]}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: currentColors.textSecondary }]}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: currentColors.accent, fontWeight: '600' }}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    borderRadius: 20, padding: 24, borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10, padding: 4 },
  header: { alignItems: 'center', marginBottom: 24, gap: 12 },
  title: { fontSize: 26, fontWeight: 'bold' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { position: 'absolute', right: 12, padding: 4 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  termsText: { fontSize: 13, flex: 1, fontWeight: 'bold' },
  termsLink: { fontWeight: '600' },
  btnRegister: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  btnRegisterText: { fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontWeight: 'bold' },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 10, borderWidth: 1, paddingVertical: 12,
  },
  socialBtnText: { fontSize: 14, fontWeight: 'bold' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  loginText: { fontSize: 14, fontWeight: 'bold' },
})