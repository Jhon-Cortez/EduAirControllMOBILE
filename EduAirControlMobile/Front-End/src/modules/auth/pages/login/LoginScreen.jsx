import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { loginSchema } from '../../schemas/loginSchema.js'
import authService from '../../services/authService.js'
import Button from '../../../../shared/components/Button/Button.jsx'
import Checkbox from '../../../../shared/components/Checkbox/Checkbox.jsx'
import LanguageSelector from '../../../../shared/components/LanguageSelector/LanguageSelector.jsx'
import { useTheme } from '../../../../context/ThemeContext.jsx'
import { useToast } from '../../../../shared/components/Toast/Toast.jsx'
import { styles } from './LoginScreen.style'

function Field({ icon, ...props }) {
  const { currentColors: c } = useTheme()
  const [focused, setFocused] = useState(false)
  return (
    <View
      style={[
        styles.field,
        { backgroundColor: c.bgInput, borderColor: focused ? c.accent : c.borderColor },
      ]}
    >
      {icon && <Ionicons name={icon} size={18} color={c.textMuted} style={styles.fieldIcon} />}
      <TextInput
        placeholderTextColor={c.textMuted}
        selectionColor={c.accent}
        style={[styles.fieldInput, { color: c.textPrimary }]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </View>
  )
}

export default function LoginScreen() {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { currentColors: c } = useTheme()
  const toast = useToast()

  const [form, setForm] = useState({ companyCode: '', email: '', password: '', rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const onSubmit = async () => {
    setApiError('')
    const parsed = loginSchema.safeParse(form)
    if (!parsed.success) {
      const next = {}
      parsed.error.issues.forEach((issue) => {
        next[issue.path[0]] = t(issue.message)
      })
      setErrors(next)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await authService.login(parsed.data.email, parsed.data.password)
      navigation.reset({ index: 0, routes: [{ name: 'App' }] })
    } catch (err) {
      const msg = err.message || t('login.error', 'Error al iniciar sesión')
      setApiError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bgBody }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.langRow}>
            <LanguageSelector />
          </View>

          <View style={styles.brand}>
            <View style={[styles.logo, { backgroundColor: c.accentDim }]}>
              <Ionicons name="leaf" size={34} color={c.accent} />
            </View>
            <Text style={[styles.brandTitle, { color: c.textPrimary }]}>EduAirControl</Text>
            <Text style={[styles.brandSub, { color: c.textMuted }]}>
              {t('login.subtitle', 'Bienvenido de nuevo a EduAirControl')}
            </Text>
          </View>

          <View style={styles.form}>
            <Field
              icon="business-outline"
              value={form.companyCode}
              onChangeText={(v) => handleChange('companyCode', v.toUpperCase())}
              placeholder={t('login.placeholderCompany', 'Ej: EDU-2024')}
              autoCapitalize="characters"
            />
            {errors.companyCode && (
              <Text style={[styles.errorText, { color: c.error }]}>{errors.companyCode}</Text>
            )}

            <Field
              icon="mail-outline"
              value={form.email}
              onChangeText={(v) => handleChange('email', v)}
              placeholder={t('login.placeholderEmail')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={[styles.errorText, { color: c.error }]}>{errors.email}</Text>
            )}

            <View>
              <Field
                icon="lock-closed-outline"
                value={form.password}
                onChangeText={(v) => handleChange('password', v)}
                placeholder={t('login.placeholderPassword')}
                secureTextEntry={!showPassword}
                onSubmitEditing={onSubmit}
              />
              <Pressable
                style={styles.eye}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={c.textMuted}
                />
              </Pressable>
            </View>
            {errors.password && (
              <Text style={[styles.errorText, { color: c.error }]}>{errors.password}</Text>
            )}

            <View style={styles.options}>
              <Checkbox
                checked={form.rememberMe}
                onChange={(v) => handleChange('rememberMe', v)}
                label={t('login.rememberMe')}
              />
              <Pressable onPress={() => navigation.navigate('ForgotPassword')} hitSlop={6}>
                <Text style={[styles.forgot, { color: c.accent }]}>
                  {t('login.forgotPassword')}
                </Text>
              </Pressable>
            </View>

            {apiError ? (
              <Text style={[styles.errorBanner, { color: c.error }]}>{apiError}</Text>
            ) : null}

            <Button onPress={onSubmit} loading={submitting} size="lg" style={styles.submit}>
              {t('login.title')}
            </Button>

            <View style={styles.switchRow}>
              <Text style={[styles.switchText, { color: c.textMuted }]}>
                {t('login.noAccount', '¿No tienes una cuenta?')}
              </Text>
              <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={6}>
                <Text style={[styles.forgot, { color: c.accent }]}>{t('login.signUpBtn')}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

