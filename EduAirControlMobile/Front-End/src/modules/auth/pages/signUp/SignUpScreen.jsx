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
import { RegisterSchema } from '../../schemas/registerSchema.js'
import authService from '../../services/authService.js'
import Button from '../../../../shared/components/Button/Button.jsx'
import Checkbox from '../../../../shared/components/Checkbox/Checkbox.jsx'
import Divider from '../../../../shared/components/Divider/Divider.jsx'
import LanguageSelector from '../../../../shared/components/LanguageSelector/LanguageSelector.jsx'
import Modal from '../../../../shared/components/Modal/Modal.jsx'
import { useTheme } from '../../../../context/ThemeContext.jsx'
import { useToast } from '../../../../shared/components/Toast/Toast.jsx'
import { styles } from './signUpScreen.style'

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

const STRENGTH_LABELS = ['signup.passwordStrength.weak', 'signup.passwordStrength.weak', 'signup.passwordStrength.weak', 'signup.passwordStrength.medium', 'signup.passwordStrength.good', 'signup.passwordStrength.strong']

export default function SignUpScreen() {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { currentColors: c } = useTheme()
  const toast = useToast()

  const [form, setForm] = useState({
    companyCode: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const requirements = {
    minLength: form.password.length >= 8,
    hasUppercase: /[A-Z]/.test(form.password),
    hasLowercase: /[a-z]/.test(form.password),
    hasNumber: /[0-9]/.test(form.password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(form.password),
  }
  const strength = Object.values(requirements).filter(Boolean).length

  const onSubmit = async () => {
    setApiError('')
    if (!form.acceptTerms) {
      toast.info(t('signup.mustAgreeTerms', 'Debes aceptar los Términos y Condiciones'))
      return
    }
    const parsed = RegisterSchema.safeParse(form)
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
      await authService.register(parsed.data.name, parsed.data.email, parsed.data.password)
      navigation.reset({ index: 0, routes: [{ name: 'App' }] })
    } catch (err) {
      const msg = err.message || t('signup.error', 'Error al registrarse')
      setApiError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const termsObj = t('signup.termsModal', { returnObjects: true })
  const modalItems = Array.isArray(termsObj?.items) ? termsObj.items : []

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bgBody }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={c.textPrimary} />
          </Pressable>
          <View style={styles.langRow}>
            <LanguageSelector />
          </View>

          <Text style={[styles.title, { color: c.textPrimary }]}>{t('signup.title')}</Text>
          <Text style={[styles.subtitle, { color: c.textMuted }]}>
            {t('signup.subtitle', 'Únete a la red de monitoreo inteligente')}
          </Text>

          <Field
            icon="business-outline"
            value={form.companyCode}
            onChangeText={(v) => handleChange('companyCode', v.toUpperCase())}
            placeholder={t('signup.placeholderCompany', 'Ej: EDU-2024')}
            autoCapitalize="characters"
          />
          {errors.companyCode && (
            <Text style={[styles.errorText, { color: c.error }]}>{errors.companyCode}</Text>
          )}

          <Field
            icon="person-outline"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
            placeholder={t('signup.placeholderName')}
          />
          {errors.name && <Text style={[styles.errorText, { color: c.error }]}>{errors.name}</Text>}

          <Field
            icon="mail-outline"
            value={form.email}
            onChangeText={(v) => handleChange('email', v)}
            placeholder={t('signup.placeholderEmail')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={[styles.errorText, { color: c.error }]}>{errors.email}</Text>}

          <View>
            <Field
              icon="lock-closed-outline"
              value={form.password}
              onChangeText={(v) => handleChange('password', v)}
              placeholder={t('signup.password')}
              secureTextEntry
            />
            {form.password.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={[styles.strengthBar, { backgroundColor: c.borderColor }]}>
                  <View
                    style={[
                      styles.strengthFill,
                      { width: `${(strength / 5) * 100}%`, backgroundColor: c.accent },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthLabel, { color: c.textMuted }]}>
                  {t(STRENGTH_LABELS[strength])}
                </Text>
              </View>
            )}
          </View>
          {errors.password && (
            <Text style={[styles.errorText, { color: c.error }]}>{errors.password}</Text>
          )}

          <Field
            icon="lock-closed-outline"
            value={form.confirmPassword}
            onChangeText={(v) => handleChange('confirmPassword', v)}
            placeholder={t('signup.confirmPassword', 'Confirmar contraseña')}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text style={[styles.errorText, { color: c.error }]}>{errors.confirmPassword}</Text>
          )}

          <View style={styles.termsRow}>
            <Checkbox
              checked={form.acceptTerms}
              onChange={(v) => handleChange('acceptTerms', v)}
            />
            <Text style={[styles.termsAccept, { color: c.textSecondary }]}>
              <Text
                onPress={() => handleChange('acceptTerms', !form.acceptTerms)}
                suppressHighlighting
              >
                {t('signup.termsModal.acceptPrefix')}
              </Text>{' '}
              <Text
                style={[styles.link, { color: c.accent }]}
                onPress={() => setShowTerms(true)}
                suppressHighlighting
              >
                {t('signup.termsModal.link')}
              </Text>
            </Text>
          </View>

          {apiError ? (
            <Text style={[styles.errorBanner, { color: c.error }]}>{apiError}</Text>
          ) : null}

          <Button onPress={onSubmit} loading={submitting} size="lg" style={styles.submit}>
            {t('signup.signUpBtn')}
          </Button>

          <Divider text={t('common.or', 'O')} />
          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: c.textMuted }]}>
              {t('signup.haveAccount', '¿Ya tienes una cuenta?')}
            </Text>
            <Pressable onPress={() => navigation.navigate('Login')} hitSlop={6}>
              <Text style={[styles.link, { color: c.accent }]}>{t('login.title')}</Text>
            </Pressable>
          </View>

          <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title={t('signup.termsModal.title')}>
            <Text style={[styles.termsSubtitle, { color: c.textMuted }]}>
              {t('signup.termsModal.subtitle')}
            </Text>
            <Text style={[styles.termsIntro, { color: c.textSecondary }]}>
              {t('signup.termsModal.intro')}
            </Text>
            <ScrollView style={styles.termsScroll}>
              {modalItems.map((item, i) => (
                <View key={`${item}-${i}`} style={styles.termListItem}>
                  <Ionicons name="checkmark-circle" size={16} color={c.success} />
                  <Text style={[styles.termParagraph, { color: c.textSecondary }]}>{item}</Text>
                </View>
              ))}
              <Text style={[styles.termNote, { color: c.textMuted }]}>
                {t('signup.termsModal.notice')}
              </Text>
            </ScrollView>
            <Button variant="outline" onPress={() => setShowTerms(false)} style={styles.termsBtn}>
              {t('common.close')}
            </Button>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

