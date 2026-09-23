import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import Button from '../../../shared/components/Button/Button'
import { useToast } from '../../../shared/components/Toast/Toast'
import { useTheme } from '../../../context/ThemeContext'

const CODE_LENGTH = 5

export default function VerifyCodeScreen() {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { currentColors: c } = useTheme()
  const toast = useToast()
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''))
  const inputsRef = useRef([])

  const handleResend = () => {
    setCode(Array(CODE_LENGTH).fill(''))
    inputsRef.current[0]?.focus()
    toast.success(t('forgotPassword.sent', 'Revisa tu correo'))
  }

  const handleChange = (index, value) => {
    if (value.length > 1) return
    const next = [...code]
    next[index] = value
    setCode(next)
    if (value && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus()
    if (!value && index > 0) inputsRef.current[index - 1]?.focus()
  }

  const fullCode = code.join('')

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bgBody }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={c.textPrimary} />
        </Pressable>

        <View style={styles.iconWrap}>
          <View style={[styles.icon, { backgroundColor: c.accentDim }]}>
            <Ionicons name="shield-checkmark-outline" size={30} color={c.accent} />
          </View>
        </View>
        <Text style={[styles.title, { color: c.textPrimary }]}>{t('verifyCode.title')}</Text>
        <Text style={[styles.subtitle, { color: c.textMuted }]}>
          {t('verifyCode.description')}
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              value={digit}
              onChangeText={(v) => handleChange(index, v)}
              keyboardType="number-pad"
              maxLength={1}
              style={[
                styles.codeInput,
                {
                  color: c.textPrimary,
                  backgroundColor: c.bgInput,
                  borderColor: digit ? c.accent : c.borderColor,
                },
              ]}
              accessibilityLabel={t('verifyCode.digitLabel', 'Código dígito {{n}}', { n: index + 1 })}
            />
          ))}
        </View>

        <Pressable style={styles.resend} onPress={handleResend}>
          <Text style={[styles.resendText, { color: c.accent }]}>{t('verifyCode.resend')}</Text>
        </Pressable>

        <Button
          onPress={() => navigation.navigate('ChangePassword')}
          size="lg"
          style={styles.submit}
          disabled={fullCode.length !== CODE_LENGTH}
        >
          {t('verifyCode.verifyBtn')}
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  back: { position: 'absolute', top: 12, left: 20, zIndex: 2 },
  iconWrap: { alignItems: 'center', marginBottom: 16 },
  icon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 28 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  codeInput: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  resend: { alignSelf: 'center', marginTop: 18 },
  resendText: { fontSize: 14, fontWeight: '600' },
  submit: { marginTop: 24 },
})