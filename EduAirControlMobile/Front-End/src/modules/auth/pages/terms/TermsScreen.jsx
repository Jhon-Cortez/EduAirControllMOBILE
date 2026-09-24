import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../../context/ThemeContext.jsx'
import { styles } from './TermsScreen.styles'

export default function TermsScreen() {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { currentColors: c } = useTheme()

  const terms = t('terms', { returnObjects: true })
  const sections = Array.isArray(terms?.sections) ? terms.sections : []

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bgBody }]}>
      <View style={[styles.header, { borderBottomColor: c.borderColor }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={c.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: c.textPrimary }]}>
          {t('terms.title', 'Términos y condiciones')}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.intro, { color: c.textSecondary }]}>
          {`${terms?.brand || t('terms.brand', 'EduAirControl')} · ${t('terms.subtitle')}`}
        </Text>
        {sections.map((section, i) => (
          <View key={`${section.title}-${i}`} style={[styles.section, { borderColor: c.borderCard, backgroundColor: c.bgCard }]}>
            <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>{section.title}</Text>
            {section.paragraphs?.map((p) => (
              <Text key={p} style={[styles.paragraph, { color: c.textSecondary }]}>
                {p}
              </Text>
            ))}
            {section.list?.map((item) => (
              <View key={item} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={16} color={c.success} />
                <Text style={[styles.paragraph, { color: c.textSecondary }]}>{item}</Text>
              </View>
            ))}
            {section.note && (
              <Text style={[styles.note, { color: c.textMuted }]}>{section.note}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

