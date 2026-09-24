import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../../context/ThemeContext.jsx'
import { useTranslation } from 'react-i18next'
import { useEnvironments } from '../../../../context/EnvironmentContext.jsx'
import { getEnvironmentStatus } from '../../utils/getEnvironmentStatus.js'
import calculateEnvironmentScore from '../../utils/calculateEnvironmentScore.js'
import { getMetricColor } from '../../utils/environmentHelpers.js'
import { METRIC_DEFINITIONS } from '../../constants/metricDefinitions.js'
import { METRIC_ICONS } from '../../../../shared/constants/iconMap.js'
import { useToast } from '../../../../shared/components/Toast/Toast.jsx'
import { styles } from './EnvironmentDetailScreen.styles'

function getProgress(value, min, max) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}

const METRIC_RANGES = {
  temp: { min: 10, max: 40, unit: '°C', ideal: '18–24°C' },
  humidity: { min: 0, max: 100, unit: '%', ideal: '40–60%' },
  co2: { min: 400, max: 2000, unit: ' ppm', ideal: '< 1000 ppm' },
  noise: { min: 0, max: 120, unit: ' dB', ideal: '< 50 dB' },
}

function MetricTile({ metric, currentColors }) {
  const { t } = useTranslation()
  const range = METRIC_RANGES[metric.key]
  const raw = metric.getRaw(metric.environment)
  const color = getMetricColor(metric.key, raw)
  const pct = getProgress(raw, range.min, range.max)

  return (
    <View style={[styles.metricTile, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      <View style={styles.metricTileTop}>
        <View style={[styles.metricIconBox, { backgroundColor: `${color}18` }]}>
          <Ionicons name={METRIC_ICONS[metric.iconKey]} size={20} color={color} />
        </View>
        <Text style={[styles.metricLabel, { color: currentColors.textMuted }]}>{metric.label}</Text>
      </View>

      <Text style={[styles.metricValue, { color: currentColors.textPrimary }]}>
        {metric.getValue(metric.environment)}
      </Text>

      <View style={[styles.progressTrack, { backgroundColor: currentColors.bgInput }]}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>

      <View style={styles.metricFooter}>
        <Text style={[styles.idealText, { color: currentColors.textMuted }]} numberOfLines={1}>
          {t('detail.ideal', 'Ideal')} {range.ideal}
        </Text>
        {raw > 0 && <Ionicons name="alert-circle" size={14} color={color} />}
      </View>
    </View>
  )
}

export default function EnvironmentDetailScreen({ route, navigation }) {
  const { envId } = route.params
  const { currentColors } = useTheme()
  const { t } = useTranslation()
  const toast = useToast()
  const { environments, toggleFavorite } = useEnvironments()

  const env = environments.find((e) => e.id === envId)

  if (!env) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
        <View style={styles.center}>
          <Text style={{ color: currentColors.textPrimary, fontSize: 16 }}>{t('detail.notFound')}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: currentColors.accent, marginTop: 10 }}>{t('common.back', 'Volver')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const status = getEnvironmentStatus(env.statusKey, t)
  const score = calculateEnvironmentScore(env)
  const metrics = METRIC_DEFINITIONS.map((def) => ({
    ...def,
    label: t(def.labelKey),
    environment: env,
  }))
  const issues = metrics.filter((m) => {
    const raw = m.getRaw(env)
    return (
      (m.key === 'temp' && (raw > 26 || raw < 18))
      || (m.key === 'humidity' && (raw > 60 || raw < 40))
      || (m.key === 'co2' && raw > 800)
      || (m.key === 'noise' && raw > 55)
    )
  })
  const recommendation = issues.length
    ? t('detail.recommendation', 'Revisar {{list}}.', { list: issues.map((m) => m.label.toLowerCase()).join(', ') })
    : t('detail.perfect', 'Las condiciones están dentro del rango recomendado.')

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar backgroundColor={currentColors.bgBody} />

      <View style={[styles.header, { backgroundColor: currentColors.bgBody }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.iconButton, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}
        >
          <Ionicons name="arrow-back" size={21} color={currentColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]} numberOfLines={1}>
          {t('detail.title', 'Detalle')}
        </Text>
        <TouchableOpacity
          onPress={() => {
            toggleFavorite(env.id, !env.isFavorite)
            toast[env.isFavorite ? 'info' : 'success'](
              env.isFavorite ? t('allEnvironments.removeFavorite') : t('allEnvironments.favorite')
            )
          }}
          style={[styles.iconButton, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}
        >
          <Ionicons
            name={env.isFavorite ? 'heart' : 'heart-outline'}
            size={21}
            color={env.isFavorite ? '#ff6b6b' : currentColors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <View style={styles.heroTop}>
            <View style={[styles.roomIcon, { backgroundColor: status.bg }]}>
              <Ionicons name="business-outline" size={28} color={status.color} />
            </View>
            <View style={styles.heroTitleBlock}>
              <Text style={[styles.roomName, { color: currentColors.textPrimary }]} numberOfLines={2}>{env.name}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color={currentColors.textMuted} />
                <Text style={[styles.metaText, { color: currentColors.textMuted }]} numberOfLines={1}>{env.location || '—'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.color }]}>
              <Ionicons name="pulse-outline" size={14} color={status.color} />
              <Text style={[styles.statusBadgeText, { color: status.color }]}>{status.text}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${currentColors.accent}18`, borderColor: currentColors.accent }]}>
              <Ionicons name="trophy-outline" size={14} color={currentColors.accent} />
              <Text style={[styles.statusBadgeText, { color: currentColors.accent }]}>{score}</Text>
            </View>
          </View>

          <View style={[styles.heroStats, { borderTopColor: currentColors.borderColor }]}>
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatValue, { color: currentColors.textPrimary }]}>{env.capacity || 0}</Text>
              <Text style={[styles.heroStatLabel, { color: currentColors.textMuted }]}>{t('detail.people')}</Text>
            </View>
            <View style={[styles.heroDivider, { backgroundColor: currentColors.borderColor }]} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatValue, { color: currentColors.textPrimary }]}>{t('detail.capacityTitle')}</Text>
              <Text style={[styles.heroStatLabel, { color: currentColors.textMuted }]}>{t('detail.conditionsTitle')}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.insightCard, { backgroundColor: status.bg, borderColor: `${status.color}55` }]}>
          <Ionicons name={issues.length ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={22} color={status.color} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightTitle, { color: status.color }]}>
              {issues.length ? t('detail.needsAttention', 'Requiere atención') : t('detail.stable', 'Ambiente estable')}
            </Text>
            <Text style={[styles.insightText, { color: currentColors.textSecondary }]}>{recommendation}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Ionicons name="analytics-outline" size={18} color={currentColors.accent} />
          <Text style={[styles.sectionTitle, { color: currentColors.textPrimary }]}>{t('detail.metricsTitle')}</Text>
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <MetricTile key={metric.key} metric={metric} currentColors={currentColors} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={18} color={currentColors.accent} />
          <Text style={[styles.sectionTitle, { color: currentColors.textPrimary }]}>{t('detail.locationTitle')}</Text>
        </View>
        <View style={[styles.infoCard, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <Ionicons name="location-outline" size={16} color={currentColors.textMuted} />
          <Text style={[styles.infoText, { color: currentColors.textPrimary }]}>{env.location || '—'}</Text>
          <Ionicons name="people-outline" size={16} color={currentColors.textMuted} />
          <Text style={[styles.infoText, { color: currentColors.textPrimary }]}>{env.capacity || 0} {t('detail.people')}</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

