import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../styles/colors'
import { STATUS_COLORS, STATUS_LABELS, QUALITY_LABELS } from '../../constants/environments'
import { useEnvironments } from '../../context/EnvironmentsContext'

export default function EnvironmentCard({ environment, onPress }) {
  const { toggleFavorite } = useEnvironments()

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleGroup}>
          <Text style={styles.name}>{environment.name}</Text>
          <Text style={styles.location}>{environment.location}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLORS[environment.statusKey]}20`, borderColor: STATUS_COLORS[environment.statusKey] }]}>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[environment.statusKey] }]} />
            <Text style={[styles.statusText, { color: STATUS_COLORS[environment.statusKey] }]}>
              {STATUS_LABELS[environment.statusKey]}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(environment.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={environment.isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={environment.isFavorite ? '#ff6b6b' : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metric}>
          <Text style={styles.metricIcon}>🌡️</Text>
          <Text style={styles.metricValue}>{environment.temp}°C</Text>
          <Text style={styles.metricLabel}>Temp</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricIcon}>💧</Text>
          <Text style={styles.metricValue}>{environment.humidity}%</Text>
          <Text style={styles.metricLabel}>Humedad</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricIcon}>🌫️</Text>
          <Text style={styles.metricValue}>{environment.co2}</Text>
          <Text style={styles.metricLabel}>CO₂ ppm</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricIcon}>🔊</Text>
          <Text style={styles.metricValue}>{environment.noise}</Text>
          <Text style={styles.metricLabel}>dB</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.qualityLabel}>Calidad del aire:</Text>
        <Text style={[styles.qualityValue, { color: STATUS_COLORS[environment.statusKey] }]}>
          {QUALITY_LABELS[environment.qualityKey]}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleGroup: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  location: { fontSize: 12, color: colors.textMuted },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  favBtn: { padding: 4 },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: `${colors.bgInput}80`,
    borderRadius: 10,
    paddingVertical: 10,
  },
  metric: { flex: 1, alignItems: 'center', gap: 2 },
  metricIcon: { fontSize: 16 },
  metricValue: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary },
  metricLabel: { fontSize: 10, color: colors.textMuted },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    paddingTop: 10,
    gap: 6,
  },
  qualityLabel: { fontSize: 13, color: colors.textMuted },
  qualityValue: { fontSize: 13, fontWeight: 'bold' },
  chevron: { marginLeft: 'auto' },
})