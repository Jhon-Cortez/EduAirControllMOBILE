import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Modal,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import {
  STATUS_COLORS, STATUS_DIM, STATUS_LABELS,
  QUALITY_LABELS, QUALITY_COLORS,
} from '../../constants/environments'
import { useEnvironments } from '../../context/EnvironmentsContext'
import { useLanguage } from '../../context/LanguageContext'

function getMetricColor(key, value) {
  if (key === 'temp') return value < 18 || value > 24 ? '#FFC107' : '#00b894'
  if (key === 'humidity') return value < 40 || value > 60 ? '#FFC107' : '#00b894'
  if (key === 'co2') return value > 1000 ? '#F44336' : '#00b894'
  if (key === 'noise') return value > 50 ? '#FFC107' : '#00b894'
  return '#00b894'
}

function EnvironmentCard({ environment, onPress, onRemoveFavorite, currentColors, t }) {
  const statusColor = STATUS_COLORS[environment.statusKey] || '#00b894'
  const statusDim = STATUS_DIM[environment.statusKey] || 'rgba(0,184,148,0.1)'
  const statusLabel = t(`status.${environment.statusKey}`)
  const qualityLabel = t(`quality.${environment.qualityKey}`)
  const qualityColor = QUALITY_COLORS[environment.qualityKey] || '#00b894'
  const temp = environment.temp ?? environment.temperature ?? 0
  const metrics = [
    { key: 'temp', icon: 'thermometer-outline', label: 'Temp', value: `${temp}C`, raw: temp },
    { key: 'humidity', icon: 'water-outline', label: 'Hum', value: `${environment.humidity ?? 0}%`, raw: environment.humidity ?? 0 },
    { key: 'co2', icon: 'cloud-outline', label: 'CO2', value: `${environment.co2 ?? 0}ppm`, raw: environment.co2 ?? 0 },
    { key: 'noise', icon: 'volume-medium-outline', label: t('dashboard.noise'), value: `${environment.noise ?? 0}dB`, raw: environment.noise ?? 0 },
  ]

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: currentColors.bgCard }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={[styles.cardName, { color: currentColors.textPrimary }]} numberOfLines={1}>{environment.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusDim, borderColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onRemoveFavorite(environment)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="heart"
            size={22}
            color="#ff6b6b"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={13} color={currentColors.textMuted} />
        <Text style={[styles.locationText, { color: currentColors.textMuted }]}>{environment.location}</Text>
        <Ionicons name="people-outline" size={13} color={currentColors.textMuted} style={{ marginLeft: 10 }} />
        <Text style={[styles.locationText, { color: currentColors.textMuted }]}>{environment.capacity} {t('favorites.people')}</Text>
      </View>

      <View style={styles.metricsRow}>
        {metrics.map((metric) => {
          const color = getMetricColor(metric.key, metric.raw)
          return (
            <View key={metric.key} style={[styles.metricChip, { borderColor: color, backgroundColor: `${color}12` }]}>
              <Ionicons name={metric.icon} size={14} color={color} />
              <Text style={[styles.metricValue, { color }]} numberOfLines={1}>{metric.value}</Text>
              <Text style={[styles.metricLabel, { color: currentColors.textMuted }]}>{metric.label}</Text>
            </View>
          )
        })}
      </View>

      <View style={[styles.qualityRow, { borderTopColor: currentColors.borderColor }]}>
        <Text style={[styles.qualityLabel, { color: currentColors.textSecondary }]}>{t('favorites.airQuality')}</Text>
        <Text style={[styles.qualityValue, { color: qualityColor }]}>{qualityLabel}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function FavoritesScreen({ navigation }) {
  const { darkMode, currentColors, loaded } = useTheme()
  const { t } = useLanguage()

  const { environments, toggleFavorite } = useEnvironments()
  const [confirmEnv, setConfirmEnv] = useState(null)

  const favorites = environments.filter((e) => e.isFavorite)

  const confirmRemove = () => {
    if (!confirmEnv) return
    toggleFavorite(confirmEnv.id, false)
    setConfirmEnv(null)
  }

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
        <StatusBar barStyle="dark-content" backgroundColor={currentColors.bgBody} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textMuted }}>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor={currentColors.bgBody} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <View style={styles.headerTitle}>
          <Ionicons name="heart" size={35} color="#ff6b6b" />
          <Text style={[styles.headerText, { color: currentColors.textPrimary }]}>{t('favorites.title')}</Text>
        </View>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: currentColors.textMuted }]}>
          {favorites.length === 0
            ? t('favorites.noneYet')
            : t('favorites.saved', { count: favorites.length, plural: favorites.length > 1 ? 's' : '' })}
        </Text>

        {favorites.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={64} color={currentColors.borderColor} />
            <Text style={[styles.emptyTitle, { color: currentColors.textPrimary }]}>{t('favorites.emptyTitle')}</Text>
            <Text style={[styles.emptyText, { color: currentColors.textMuted }]}>
              {t('favorites.emptyText')}
            </Text>
            <TouchableOpacity
              style={styles.goBackBtn}
              onPress={() => navigation.getParent()?.navigate('Dashboard')}
            >
              <Text style={styles.goBackText}>{t('favorites.goDashboard')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favorites.map((fav) => (
            <EnvironmentCard
              key={fav.id}
              environment={fav}
              onPress={() => navigation.navigate('EnvironmentDetail', { envId: fav.id })}
              onRemoveFavorite={setConfirmEnv}
              currentColors={currentColors}
              t={t}
            />
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      <Modal visible={!!confirmEnv} transparent animationType="fade" onRequestClose={() => setConfirmEnv(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
            <View style={styles.modalHeader}>
              <Ionicons name="heart" size={24} color="#ff6b6b" />
              <Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>{t('favorites.removeTitle')}</Text>
            </View>
            <Text style={[styles.modalText, { color: currentColors.textSecondary }]}>
              {t('favorites.removeQuestion', { name: confirmEnv?.name || 'este ambiente' })}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn, { borderColor: currentColors.borderColor }]}
                onPress={() => setConfirmEnv(null)}
              >
                <Text style={[styles.cancelText, { color: currentColors.textSecondary }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.removeBtn]}
                onPress={confirmRemove}
              >
                <Text style={styles.removeText}>{t('common.delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0fafa' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
    gap: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#00b894',
  },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerText: { fontSize: 24, fontWeight: 'bold' },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 10 },

  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },

  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleBlock: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '600' },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  locationText: { fontSize: 12 },

  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  metricChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 7,
    paddingHorizontal: 3,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 58,
  },
  metricIcon: { fontSize: 12 },
  metricValue: { fontSize: 11, fontWeight: '800' },
  metricLabel: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase' },

  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  qualityLabel: { fontSize: 12, color: '#666666', flex: 1 },
  qualityValue: { fontSize: 13, fontWeight: '600', flexShrink: 0 },

  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  emptyText: { fontSize: 13, color: '#999999', textAlign: 'center' },

  goBackBtn: {
    marginTop: 12,
    backgroundColor: 'rgba(0,184,148,0.1)',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#00b894',
  },
  goBackText: { color: '#00b894', fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalText: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtn: { borderWidth: 1 },
  removeBtn: { backgroundColor: '#ff6b6b' },
  cancelText: { fontSize: 14, fontWeight: '700' },
  removeText: { color: '#fff', fontSize: 14, fontWeight: '800' },
})
