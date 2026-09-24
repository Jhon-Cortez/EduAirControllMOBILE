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
import { useDashboardVM } from '../../viewmodels/useDashboardVM.js'
import { getEnvironmentStatus } from '../../../environment/utils/getEnvironmentStatus.js'
import { pdStyles, rrStyles, srStyles, styles } from './DashboardScreen.styles'

const MEDAL = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }

function scoreColor(score) {
  return score >= 75 ? '#4CAF50' : score >= 50 ? '#FFC107' : '#F44336'
}

function ScoreRing({ score, size = 52 }) {
  const color = scoreColor(score)
  return (
    <View style={[srStyles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
      <Text style={[srStyles.num, { color, fontSize: size * 0.27 }]}>{score}</Text>
    </View>
  )
}


function PodiumCard({ env, rank, score, onPress, onToggleFav, currentColors, t }) {
  const isWinner = rank === 1
  const status = getEnvironmentStatus(env.statusKey, t)

  return (
    <TouchableOpacity
      style={[
        pdStyles.card,
        isWinner ? pdStyles.rank1 : pdStyles.rank23,
        { backgroundColor: currentColors.bgCard, borderColor: MEDAL[rank] },
      ]}
      onPress={() => onPress(env.id)}
      activeOpacity={0.85}
    >
      {rank === 1 && <Text style={pdStyles.crown}>👑</Text>}
      <View style={[pdStyles.bubble, isWinner && pdStyles.bubbleWinner, { borderColor: MEDAL[rank], backgroundColor: `${MEDAL[rank]}20` }]}>
        <Ionicons
          name={
            env.statusKey === 'dashboard.statusAlert' ? 'alert-circle'
              : env.statusKey === 'dashboard.statusWarning' ? 'warning'
                : 'checkmark-circle'
          }
          size={isWinner ? 24 : 19}
          color={status.color}
        />
      </View>
      <Text style={[pdStyles.name, isWinner && pdStyles.nameWinner, { color: currentColors.textPrimary }]} numberOfLines={2} ellipsizeMode="tail">
        {env.name}
      </Text>
      {env.location ? (
        <View style={pdStyles.locRow}>
          <Ionicons name="location-outline" size={10} color={currentColors.textMuted} />
          <Text style={[pdStyles.loc, { color: currentColors.textMuted }]} numberOfLines={1}>{env.location}</Text>
        </View>
      ) : null}
      <ScoreRing score={score} size={isWinner ? 50 : 42} />
      <TouchableOpacity onPress={() => onToggleFav(env.id, !env.isFavorite)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
        <Ionicons
          name={env.isFavorite ? 'heart' : 'heart-outline'}
          size={50}
          color={env.isFavorite ? '#ff6b6b' : currentColors.textMuted}
          accessibilityLabel={env.isFavorite ? t('leaderboard.removeFavorite') : t('leaderboard.addFavorite')}
        />
      </TouchableOpacity>
      <View style={[pdStyles.stand, isWinner && pdStyles.standWinner, { backgroundColor: MEDAL[rank] }]}>
        <Text style={[pdStyles.standN, isWinner && pdStyles.standWinnerN]}>{rank}</Text>
      </View>
    </TouchableOpacity>
  )
}


function RankRow({ env, rank, score, onPress, onToggleFav, currentColors, t }) {
  const status = getEnvironmentStatus(env.statusKey, t)
  const temp = env.temp ?? env.temperature ?? 0
  const pills = [
    { label: `${temp}°`, warn: temp < 18 || temp > 24 },
    { label: `${env.humidity ?? 0}%`, warn: (env.humidity ?? 0) < 40 || (env.humidity ?? 0) > 60 },
    { label: `${env.co2 ?? 0}ppm`, warn: (env.co2 ?? 0) > 1000 },
    { label: `${env.noise ?? 0}dB`, warn: (env.noise ?? 0) > 50 },
  ]
  const warn = pills.filter((p) => p.warn)
  const visible = warn.length ? warn.slice(0, 2) : pills.slice(0, 2)

  return (
    <TouchableOpacity
      style={[rrStyles.row, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}
      onPress={() => onPress(env.id)}
      activeOpacity={0.85}
    >
      <Text style={[rrStyles.rank, { color: currentColors.textMuted }]}>#{rank}</Text>
      <Ionicons
        name={
          env.statusKey === 'dashboard.statusAlert' ? 'alert-circle'
            : env.statusKey === 'dashboard.statusWarning' ? 'warning'
              : 'checkmark-circle'
        }
        size={18}
        color={status.color}
      />
      <View style={{ flex: 1 }}>
        <Text style={[rrStyles.name, { color: currentColors.textPrimary }]} numberOfLines={1}>{env.name}</Text>
        {env.location ? <Text style={[rrStyles.loc, { color: currentColors.textMuted }]}>{env.location}</Text> : null}
      </View>
      <View style={rrStyles.pills}>
        {visible.map((p, i) => (
          <View key={i} style={[rrStyles.pill, { backgroundColor: p.warn ? '#FFC10720' : currentColors.bgCard, borderColor: p.warn ? '#FFC107' : currentColors.borderColor }]}>
            <Text style={[rrStyles.pillTxt, { color: p.warn ? '#FFC107' : currentColors.textMuted }]}>{p.label}</Text>
          </View>
        ))}
      </View>
      <ScoreRing score={score} size={42} />
      <TouchableOpacity onPress={() => onToggleFav(env.id, !env.isFavorite)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} style={{ marginLeft: 6 }}>
        <Ionicons
          name={env.isFavorite ? 'heart' : 'heart-outline'}
          size={50}
          color={env.isFavorite ? '#ff6b6b' : currentColors.textMuted}
          accessibilityLabel={env.isFavorite ? t('leaderboard.removeFavorite') : t('leaderboard.addFavorite')}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}


export default function DashboardScreen({ navigation }) {
  const { darkMode, currentColors } = useTheme()
  const { t } = useTranslation()
  const vm = useDashboardVM()

  const PODIUM_ORDER = [2, 1, 3]
  const FILTERS = [
    { key: 'all', label: t('leaderboard.filters.all') },
    { key: 'normal', label: t('leaderboard.filters.normal') },
    { key: 'warning', label: t('leaderboard.filters.warning') },
    { key: 'alert', label: t('leaderboard.filters.alert') },
  ]

  const handlePress = (id) => navigation.navigate('EnvironmentDetail', { envId: id })

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <Ionicons name="trophy" size={24} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>{t('leaderboard.title')}</Text>
          <Text style={[styles.headerSub, { color: currentColors.textMuted }]}>{t('leaderboard.subtitle')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationsPanel')} style={[styles.iconBtn, { backgroundColor: currentColors.bgBody, borderColor: currentColors.borderColor }]} hitSlop={6}>
          <Ionicons name="notifications-outline" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterBtn,
                { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor },
                vm.filter === f.key && { backgroundColor: currentColors.accent, borderColor: currentColors.accent },
              ]}
              onPress={() => vm.setFilter(f.key)}
            >
              <Text style={[styles.filterTxt, { color: vm.filter === f.key ? '#fff' : currentColors.textSecondary }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {vm.filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 36 }}>🏜️</Text>
            <Text style={[styles.emptyTxt, { color: currentColors.textMuted }]}>{t('leaderboard.empty')}</Text>
          </View>
        )}

        {vm.top3.length > 0 && (
          <View style={styles.podium}>
            {PODIUM_ORDER.map((rank) => {
              const item = vm.top3[rank - 1]
              return item ? (
                <PodiumCard
                  key={rank}
                  env={item.env}
                  rank={rank}
                  score={item.score}
                  onPress={handlePress}
                  onToggleFav={vm.toggleFavorite}
                  currentColors={currentColors}
                  t={t}
                />
              ) : <View key={rank} style={{ width: 100 }} />
            })}
          </View>
        )}

        {vm.rest.length > 0 && (
          <View style={styles.listSection}>
            <Text style={[styles.listTitle, { color: currentColors.textMuted }]}>
              {t('leaderboard.positions')}
            </Text>
            {vm.rest.map(({ env, score }, idx) => (
              <RankRow
                key={env.id}
                env={env}
                rank={vm.top3.length + idx + 1}
                score={score}
                onPress={handlePress}
                onToggleFav={vm.toggleFavorite}
                currentColors={currentColors}
                t={t}
              />
            ))}
          </View>
        )}

        <View style={[styles.legend, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <Text style={[styles.legendTitle, { color: currentColors.textPrimary }]}>{t('leaderboard.scoreCalculation')}</Text>
          <Text style={[styles.legendItem, { color: currentColors.textSecondary }]}>{t('leaderboard.tempIdeal')}</Text>
          <Text style={[styles.legendItem, { color: currentColors.textSecondary }]}>{t('leaderboard.humidityIdeal')}</Text>
          <Text style={[styles.legendItem, { color: currentColors.textSecondary }]}>{t('leaderboard.co2Ideal')}</Text>
          <Text style={[styles.legendItem, { color: currentColors.textSecondary }]}>{t('leaderboard.noiseIdeal')}</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

