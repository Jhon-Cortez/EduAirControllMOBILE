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
import { useTheme } from '../../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useEnvironments } from '../../../context/EnvironmentContext'
import { getEnvironmentStatus } from '../../../modules/environment/utils/getEnvironmentStatus'
import calculateEnvironmentScore from '../../../modules/environment/utils/calculateEnvironmentScore'
import { getMetricColor } from '../../../modules/environment/utils/environmentHelpers'
import { METRIC_DEFINITIONS } from '../../../modules/environment/constants/metricDefinitions'
import { METRIC_ICONS } from '../../../shared/constants/iconMap'
import { useToast } from '../../../shared/components/Toast/Toast'

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

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  iconButton: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 18, paddingTop: 8 },
  heroCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
  heroTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  roomIcon: { width: 58, height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  heroTitleBlock: { flex: 1 },
  roomName: { fontSize: 23, fontWeight: '900', lineHeight: 29 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  metaText: { fontSize: 13, fontWeight: '600', flex: 1 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6,
  },
  statusBadgeText: { fontSize: 12, fontWeight: '800' },
  heroStats: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTopWidth: 1 },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 18, fontWeight: '900' },
  heroStatLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  heroDivider: { width: 1, height: 34 },
  insightCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16,
  },
  insightTitle: { fontSize: 14, fontWeight: '900', marginBottom: 2 },
  insightText: { fontSize: 13, lineHeight: 18 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '900' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  metricTile: {
    width: '48.5%', minHeight: 146, borderRadius: 15, borderWidth: 1, padding: 12,
  },
  metricTileTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  metricIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  metricLabel: { fontSize: 12, fontWeight: '800', flex: 1 },
  metricValue: { fontSize: 20, fontWeight: '900', marginBottom: 10 },
  progressTrack: { height: 7, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  metricFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  idealText: { fontSize: 10.5, fontWeight: '700', flex: 1 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: 14, fontWeight: '600' },
})