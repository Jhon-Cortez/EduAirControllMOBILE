import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

export default function ForgotPasswordScreen({ navigation }) {
  const { currentColors, darkMode } = useTheme()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />
      <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.accent }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={currentColors.accent} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentColors.textPrimary }]}>Recuperar contraseña</Text>
          <Ionicons name="key-outline" size={50} color={currentColors.accent} />
        </View>
        <Text style={[styles.description, { color: currentColors.textSecondary }]}>
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
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
        {submitted ? (
          <View style={[styles.successBox, { backgroundColor: currentColors.accentDim }]}>
            <Ionicons name="checkmark-circle" size={32} color={currentColors.accent} />
            <Text style={[styles.successText, { color: currentColors.textPrimary }]}>
              Consulta tu correo. Hemos enviado las instrucciones.
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: currentColors.accent }]}
            onPress={() => setSubmitted(true)}
          >
            <Text style={[styles.submitBtnText, { color: currentColors.bgBody }]}>Enviar enlace</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: currentColors.accent, textAlign: 'center', marginTop: 20 }}>
            Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    borderRadius: 20, padding: 24, borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10, padding: 4 },
  header: { alignItems: 'center', marginBottom: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  description: { fontSize: 14, textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
  },
  successBox: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, marginBottom: 20 },
  successText: { flex: 1, fontSize: 14, fontWeight: '500' },
  submitBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  submitBtnText: { fontSize: 16, fontWeight: 'bold' },
})
