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
import { useFavoritesVM } from '../../viewmodels/useFavoritesVM.js'
import { getEnvironmentStatus } from '../../../environment/utils/getEnvironmentStatus.js'
import calculateEnvironmentScore from '../../../environment/utils/calculateEnvironmentScore.js'
import Modal from '../../../../shared/components/Modal/Modal.jsx'
import Button from '../../../../shared/components/Button/Button.jsx'
import { styles } from './FavoritesScreen.styles'

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

