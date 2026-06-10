import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

export default function LoginScreen({ navigation }) {
  const { currentColors, darkMode } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: currentColors.bgBody }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.accent }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: currentColors.textPrimary }]}>Iniciar sesión</Text>
            <Ionicons name="person-circle-outline" size={50} color={currentColors.accent} />
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

          <TouchableOpacity style={styles.rememberRow} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && { backgroundColor: currentColors.accent, borderColor: currentColors.accent }]}>
              {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={[styles.rememberText, { color: currentColors.textSecondary }]}>Recordarme</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.forgotBtn, { borderBottomColor: currentColors.borderColor }]} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={{ color: currentColors.accent }}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: currentColors.accent }]}
            onPress={() => navigation.navigate('App')}
          >
            <Text style={[styles.loginBtnText, { color: currentColors.bgBody }]}>Iniciar sesión</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.line, { backgroundColor: currentColors.borderColor }]} />
            <Text style={[styles.dividerText, { color: currentColors.textMuted }]}>o continúa con</Text>
            <View style={[styles.line, { backgroundColor: currentColors.borderColor }]} />
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

          <View style={styles.signupRow}>
            <Text style={[styles.signupText, { color: currentColors.textSecondary }]}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ color: currentColors.accent, fontWeight: '600' }}>Regístrate</Text>
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
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,  },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 2, borderColor: '#cccccc',
    alignItems: 'center', justifyContent: 'center',
  },
  rememberText: { fontSize: 13, fontWeight: 'bold' },
  forgotBtn: {  fontWeight: 'bold', marginBottom: 20 ,    },
  loginBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  loginBtnText: { fontSize: 16, fontWeight: 'bold' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  line: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontWeight: 'bold' },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 10, borderWidth: 1, paddingVertical: 12,
  },
  socialBtnText: { fontSize: 14, fontWeight: 'bold' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 4 },
  signupText: {alignSelf: 'center', fontSize: 14, fontWeight: 'bold'  },
})