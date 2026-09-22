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
import { useFavoritesVM } from '../viewmodels/useFavoritesVM'
import { getEnvironmentStatus } from '../../environment/utils/getEnvironmentStatus'
import calculateEnvironmentScore from '../../environment/utils/calculateEnvironmentScore'
import Modal from '../../../shared/components/Modal/Modal'
import Button from '../../../shared/components/Button/Button'

function scoreColor(score) {
  return score >= 75 ? '#4CAF50' : score >= 50 ? '#FFC107' : '#F44336'
}

function EnvironmentCard({ environment, rank, onPress, onRemoveFavorite, currentColors, t }) {
  const status = getEnvironmentStatus(environment.statusKey, t)
  const score = calculateEnvironmentScore(environment)

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.rank, { color: currentColors.textMuted }]}>#{rank}</Text>
      <View style={[styles.statusIcon, { backgroundColor: status.bg }]}>
        <Ionicons name="business-outline" size={18} color={status.color} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, { color: currentColors.textPrimary }]} numberOfLines={1}>{environment.name}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={12} color={currentColors.textMuted} />
          <Text style={[styles.cardMetaTxt, { color: currentColors.textMuted }]} numberOfLines={1}>{environment.location || '—'}</Text>
          <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        </View>
      </View>
      <View style={[styles.scoreRing, { borderColor: scoreColor(score) }]}>
        <Text style={[styles.scoreText, { color: scoreColor(score) }]}>{score}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onRemoveFavorite(environment)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.heartBtn}
        accessibilityLabel={t('allEnvironments.removeFavorite')}
      >
        <Ionicons name="heart" size={34} color="#ff6b6b" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default function FavoritesScreen({ navigation }) {
  const { darkMode, currentColors } = useTheme()
  const { t } = useTranslation()
  const vm = useFavoritesVM()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <Ionicons name="heart" size={28} color="#ff6b6b" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerText, { color: currentColors.textPrimary }]}>{t('favorites.title')}</Text>
          <Text style={[styles.headerSub, { color: currentColors.textMuted }]}>{t('favorites.description')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationsPanel')} style={[styles.iconBtn, { backgroundColor: currentColors.bgBody, borderColor: currentColors.borderColor }]} hitSlop={6}>
          <Ionicons name="notifications-outline" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {vm.favorites.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={64} color={currentColors.borderColor} />
            <Text style={[styles.emptyTitle, { color: currentColors.textPrimary }]}>{t('favorites.empty')}</Text>
            <Text style={[styles.emptyText, { color: currentColors.textMuted }]}>{t('favorites.emptyHint')}</Text>
          </View>
        ) : vm.favorites.map((fav, index) => (
          <EnvironmentCard
            key={fav.id}
            environment={fav}
            rank={index + 1}
            onPress={() => navigation.navigate('EnvironmentDetail', { envId: fav.id })}
            onRemoveFavorite={vm.openConfirm}
            currentColors={currentColors}
            t={t}
          />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>

      <Modal
        isOpen={Boolean(vm.confirmId)}
        onClose={vm.cancelRemove}
        title={t('favorites.removeTitle', 'Quitar de favoritos')}
        size="sm"
      >
        <Text style={[styles.modalText, { color: currentColors.textSecondary }]}>
          {t('favorites.removeQuestion', '¿Quitar a {{name}} de favoritos?', { name: vm.confirmName || 'este ambiente' })}
        </Text>
        <View style={styles.modalActions}>
          <Button variant="outline" onPress={vm.cancelRemove}>
            {t('management.cancelBtn')}
          </Button>
          <Button variant="danger" onPress={vm.confirmRemove}>
            {t('favorites.removeLabel', 'Quitar')}
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 55, paddingBottom: 16, gap: 12, borderBottomWidth: 1,
  },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  headerSub: { fontSize: 12, marginTop: 1 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 16 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  rank: { width: 30, fontSize: 13, fontWeight: '800' },
  statusIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaTxt: { fontSize: 11, flexShrink: 1, maxWidth: 110 },
  statusText: { fontSize: 10, fontWeight: '800', marginLeft: 4 },
  scoreRing: { width: 42, height: 42, borderRadius: 21, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  scoreText: { fontSize: 12, fontWeight: '900' },
  heartBtn: { marginLeft: 2 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold' },
  emptyText: { fontSize: 13, textAlign: 'center' },
  modalText: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 4 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
})