import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import {
  STATUS_COLORS, STATUS_DIM, STATUS_LABELS,
  QUALITY_LABELS, QUALITY_COLORS,
  IDEAL_RANGES,
} from '../../constants/environments'
import { useEnvironments } from '../../context/EnvironmentsContext'

const STATUS_ICONS = {
  normal: 'checkmark-circle',
  warning: 'warning',
  alert: 'alert-circle',
  'dashboard.statusNormal': 'checkmark-circle',
  'dashboard.statusWarning': 'warning',
  'dashboard.statusAlert': 'alert-circle',
}

function getProgress(value, min, max) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}

function MetricTile({ metric, currentColors }) {
  const pct = getProgress(metric.raw, metric.min, metric.max)

  return (
    <View style={[styles.metricTile, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      <View style={styles.metricTileTop}>
        <View style={[styles.metricIconBox, { backgroundColor: `${metric.color}18` }]}>
          <Ionicons name={metric.icon} size={20} color={metric.color} />
        </View>
        <Text style={[styles.metricLabel, { color: currentColors.textMuted }]}>{metric.label}</Text>
      </View>

      <Text style={[styles.metricValue, { color: currentColors.textPrimary }]}>
        {metric.value}
        <Text style={[styles.metricUnit, { color: currentColors.textMuted }]}>{metric.unit}</Text>
      </Text>

      <View style={[styles.progressTrack, { backgroundColor: currentColors.bgInput }]}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: metric.color }]} />
      </View>

      <View style={styles.metricFooter}>
        <Text style={[styles.idealText, { color: currentColors.textMuted }]} numberOfLines={1}>
          Ideal {metric.ideal}
        </Text>
        {metric.warning && <Ionicons name="alert-circle" size={14} color={metric.color} />}
      </View>
    </View>
  )
}

function RatingCard({ rating, setRating, onSubmit, submitted, currentColors }) {
  if (submitted) {
    return (
      <View style={[styles.ratingCard, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
        <Ionicons name="checkmark-circle" size={28} color={currentColors.accent} />
        <Text style={[styles.ratingSubmittedTxt, { color: currentColors.textPrimary }]}>
          Calificacion enviada. Gracias por tu opinion.
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.ratingCard, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name="star-outline" size={18} color={currentColors.accent} />
        <Text style={[styles.sectionTitle, { color: currentColors.textPrimary }]}>Confort percibido</Text>
      </View>

      <Text style={[styles.ratingQuestion, { color: currentColors.textMuted }]}>
        Califica como se siente este ambiente para estudiar o trabajar.
      </Text>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={rating >= star ? 'star' : 'star-outline'}
              size={32}
              color={rating >= star ? '#FFD700' : currentColors.borderColor}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.ratingBtn, { backgroundColor: rating > 0 ? currentColors.accent : currentColors.borderColor }]}
        onPress={() => rating > 0 && onSubmit(rating)}
        disabled={rating === 0}
      >
        <Text style={[styles.ratingBtnTxt, { color: currentColors.bgBody }]}>Enviar calificacion</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function EnvironmentDetailScreen({ route, navigation }) {
  const { envId } = route.params
  const { darkMode, currentColors, loaded } = useTheme()
  const { environments, toggleFavorite } = useEnvironments()
  const env = environments.find((e) => e.id === envId)

  const [rating, setRating] = useState(0)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
        <View style={styles.center}>
          <Text style={{ color: currentColors.textMuted }}>Cargando...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!env) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
        <View style={styles.center}>
          <Text style={{ color: currentColors.textPrimary, fontSize: 16 }}>Ambiente no encontrado</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: currentColors.accent, marginTop: 10 }}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const statusColor = STATUS_COLORS[env.statusKey] || currentColors.accent
  const statusDim = STATUS_DIM[env.statusKey] || currentColors.accentDim
  const statusLabel = STATUS_LABELS[env.statusKey] || env.statusKey
  const qualityLabel = QUALITY_LABELS[env.qualityKey] || env.qualityKey
  const qualityColor = QUALITY_COLORS[env.qualityKey] || currentColors.accent

  const temp = env.temp ?? env.temperature ?? 0
  const humidity = env.humidity ?? 0
  const co2 = env.co2 ?? 0
  const noise = env.noise ?? 0

  const metrics = [
    {
      key: 'temp',
      icon: 'thermometer-outline',
      label: 'Temperatura',
      value: temp,
      unit: ' C',
      raw: temp,
      ideal: IDEAL_RANGES.temperature || '18-24 C',
      color: temp < 18 || temp > 24 ? '#FFC107' : '#4CAF50',
      warning: temp < 18 || temp > 24,
      min: 10,
      max: 40,
    },
    {
      key: 'humidity',
      icon: 'water-outline',
      label: 'Humedad',
      value: humidity,
      unit: '%',
      raw: humidity,
      ideal: IDEAL_RANGES.humidity || '40-60%',
      color: humidity < 40 || humidity > 60 ? '#FFC107' : '#4CAF50',
      warning: humidity < 40 || humidity > 60,
      min: 0,
      max: 100,
    },
    {
      key: 'co2',
      icon: 'cloud-outline',
      label: 'CO2',
      value: co2,
      unit: ' ppm',
      raw: co2,
      ideal: IDEAL_RANGES.co2 || '< 1000 ppm',
      color: co2 > 1000 ? '#F44336' : '#4CAF50',
      warning: co2 > 1000,
      min: 400,
      max: 2000,
    },
    {
      key: 'noise',
      icon: 'volume-medium-outline',
      label: 'Ruido',
      value: noise,
      unit: ' dB',
      raw: noise,
      ideal: IDEAL_RANGES.noise || '< 50 dB',
      color: noise > 50 ? '#FFC107' : '#4CAF50',
      warning: noise > 50,
      min: 0,
      max: 120,
    },
  ]

  const activeIssues = metrics.filter((metric) => metric.warning)
  const recommendation = activeIssues.length
    ? `Revisar ${activeIssues.map((metric) => metric.label.toLowerCase()).join(', ')}.`
    : 'Las condiciones estan dentro del rango recomendado.'

  const handleSubmitRating = () => setRatingSubmitted(true)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      <View style={[styles.header, { backgroundColor: currentColors.bgBody }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.iconButton, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}
        >
          <Ionicons name="arrow-back" size={21} color={currentColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]} numberOfLines={1}>Detalle</Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(env.id, !env.isFavorite)}
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
            <View style={[styles.roomIcon, { backgroundColor: statusDim, borderColor: statusColor }]}>
              <Ionicons name="business-outline" size={28} color={statusColor} />
            </View>
            <View style={styles.heroTitleBlock}>
              <Text style={[styles.roomName, { color: currentColors.textPrimary }]} numberOfLines={2}>{env.name}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color={currentColors.textMuted} />
                <Text style={[styles.metaText, { color: currentColors.textMuted }]} numberOfLines={1}>{env.location || 'Sin ubicacion'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusDim, borderColor: statusColor }]}>
              <Ionicons name={STATUS_ICONS[env.statusKey] || 'help-circle'} size={14} color={statusColor} />
              <Text style={[styles.statusBadgeText, { color: statusColor }]}>{statusLabel}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${qualityColor}18`, borderColor: qualityColor }]}>
              <Ionicons name="leaf-outline" size={14} color={qualityColor} />
              <Text style={[styles.statusBadgeText, { color: qualityColor }]}>{qualityLabel}</Text>
            </View>
          </View>

          <View style={[styles.heroStats, { borderTopColor: currentColors.borderColor }]}>
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatValue, { color: currentColors.textPrimary }]}>{env.capacity || 0}</Text>
              <Text style={[styles.heroStatLabel, { color: currentColors.textMuted }]}>Personas</Text>
            </View>
            <View style={[styles.heroDivider, { backgroundColor: currentColors.borderColor }]} />
            <View style={styles.heroStat}>
              <Text style={[styles.heroStatValue, { color: qualityColor }]}>{qualityLabel}</Text>
              <Text style={[styles.heroStatLabel, { color: currentColors.textMuted }]}>Calidad</Text>
            </View>
          </View>
        </View>

        <View style={[styles.insightCard, { backgroundColor: `${statusColor}12`, borderColor: `${statusColor}55` }]}>
          <Ionicons name={activeIssues.length ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={22} color={statusColor} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightTitle, { color: statusColor }]}>
              {activeIssues.length ? 'Atencion necesaria' : 'Ambiente estable'}
            </Text>
            <Text style={[styles.insightText, { color: currentColors.textSecondary }]}>{recommendation}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Ionicons name="analytics-outline" size={18} color={currentColors.accent} />
          <Text style={[styles.sectionTitle, { color: currentColors.textPrimary }]}>Metricas en tiempo real</Text>
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map((metric) => (
            <MetricTile key={metric.key} metric={metric} currentColors={currentColors} />
          ))}
        </View>

        <RatingCard
          rating={rating}
          setRating={setRating}
          onSubmit={handleSubmitRating}
          submitted={ratingSubmitted}
          currentColors={currentColors}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 18, paddingTop: 8 },

  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  heroTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  roomIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitleBlock: { flex: 1 },
  roomName: { fontSize: 23, fontWeight: '900', lineHeight: 29 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  metaText: { fontSize: 13, fontWeight: '600', flex: 1 },

  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusBadgeText: { fontSize: 12, fontWeight: '800' },

  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { fontSize: 18, fontWeight: '900' },
  heroStatLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  heroDivider: { width: 1, height: 34 },

  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  insightTitle: { fontSize: 14, fontWeight: '900', marginBottom: 2 },
  insightText: { fontSize: 13, lineHeight: 18 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '900' },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricTile: {
    width: '48.5%',
    minHeight: 146,
    borderRadius: 15,
    borderWidth: 1,
    padding: 12,
  },
  metricTileTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  metricIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: { fontSize: 12, fontWeight: '800', flex: 1 },
  metricValue: { fontSize: 23, fontWeight: '900', marginBottom: 10 },
  metricUnit: { fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 7, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  metricFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  idealText: { fontSize: 10.5, fontWeight: '700', flex: 1 },

  ratingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  ratingQuestion: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  starsRow: { flexDirection: 'row', gap: 8 },
  ratingBtn: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  ratingBtnTxt: { fontSize: 14, fontWeight: '900' },
  ratingSubmittedTxt: { fontSize: 14, fontWeight: '700', textAlign: 'center', lineHeight: 20 },
})
