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
import Button from '../../../../shared/components/Button/Button.jsx'
import { useTheme } from '../../../../context/ThemeContext.jsx'
import { styles } from './forgotPasswordScreen.style'

export default function ForgotPasswordScreen() {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { currentColors: c } = useTheme()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = () => {
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bgBody }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={c.textPrimary} />
          </Pressable>

          <View style={styles.iconWrap}>
            <View style={[styles.icon, { backgroundColor: c.accentDim }]}>
              <Ionicons name="key-outline" size={30} color={c.accent} />
            </View>
          </View>
          <Text style={[styles.title, { color: c.textPrimary }]}>{t('forgotPassword.title')}</Text>
          <Text style={[styles.subtitle, { color: c.textMuted }]}>
            {t('forgotPassword.description')}
          </Text>

          {submitted ? (
            <View style={[styles.successBox, { borderColor: c.success, backgroundColor: c.successDim }]}>
              <Ionicons name="checkmark-circle" size={40} color={c.success} />
              <Text style={[styles.successTitle, { color: c.textPrimary }]}>
                {t('forgotPassword.sent', 'Revisa tu correo')}
              </Text>
              <Text style={[styles.successText, { color: c.textSecondary }]}>
                {t('forgotPassword.sentTo', 'Te enviamos instrucciones a')} {email}
              </Text>
              <Button onPress={() => navigation.navigate('VerifyCode')} size="lg" style={styles.successBtn}>
                {t('forgotPassword.continue', 'Continuar')}
              </Button>
              <Button variant="ghost" onPress={() => setSubmitted(false)} style={styles.successBtn}>
                {t('forgotPassword.tryAnother')}
              </Button>
            </View>
          ) : (
            <>
              <View style={[styles.field, { backgroundColor: c.bgInput, borderColor: c.borderColor }]}>
                <Ionicons name="mail-outline" size={18} color={c.textMuted} style={styles.fieldIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('forgotPassword.emailLabel')}
                  placeholderTextColor={c.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.fieldInput, { color: c.textPrimary }]}
                />
              </View>
              <Button onPress={onSubmit} size="lg" style={styles.submit}>
                {t('forgotPassword.sendBtn')}
              </Button>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

