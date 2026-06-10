import { useState, useMemo } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { useEnvironments } from '../../context/EnvironmentsContext'
import { useLanguage } from '../../context/LanguageContext'

// ── Score formula (igual que web) ─────────────────────────────
function calcScore(env) {
  const t = env.temp ?? env.temperature ?? 22
  const tempScore     = Math.max(0, 100 - Math.abs(t - 21) * 8)
  const humidityScore = Math.max(0, 100 - Math.abs(env.humidity - 50) * 3)
  const co2Score      = Math.max(0, 100 - Math.max(0, env.co2 - 600) * 0.08)
  const noiseScore    = Math.max(0, 100 - Math.max(0, env.noise - 30) * 2)
  return Math.round((tempScore + humidityScore + co2Score + noiseScore) / 4)
}

// ── Score Ring ─────────────────────────────────────────────────
function ScoreRing({ score, size = 52, currentColors }) {
  const color = score >= 75 ? '#4CAF50' : score >= 50 ? '#FFC107' : '#F44336'
  return (
    <View style={[srStyles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: color }]}>
      <Text style={[srStyles.num, { color, fontSize: size * 0.27 }]}>{score}</Text>
    </View>
  )
}
const srStyles = StyleSheet.create({
  ring: { borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  num:  { fontWeight: 'bold' },
})

// ── Status Icon ────────────────────────────────────────────────
function StatusIcon({ statusKey, size = 18 }) {
  const map = {
    'dashboard.statusNormal':  { name: 'checkmark-circle', color: '#4CAF50' },
    'dashboard.statusWarning': { name: 'warning',           color: '#FFC107' },
    'dashboard.statusAlert':   { name: 'alert-circle',      color: '#F44336' },
    normal:  { name: 'checkmark-circle', color: '#4CAF50' },
    warning: { name: 'warning',          color: '#FFC107' },
    alert:   { name: 'alert-circle',     color: '#F44336' },
  }
  const icon = map[statusKey] || map['normal']
  return <Ionicons name={icon.name} size={size} color={icon.color} />
}

// ── Helpers ────────────────────────────────────────────────────
const isNormal  = (e) => e.statusKey === 'dashboard.statusNormal'  || e.statusKey === 'normal'
const isWarning = (e) => e.statusKey === 'dashboard.statusWarning' || e.statusKey === 'warning'
const isAlert   = (e) => e.statusKey === 'dashboard.statusAlert'   || e.statusKey === 'alert'

// ── Global Health Card ─────────────────────────────────────────
function GlobalHealthCard({ environments, currentColors, t }) {
  const total   = environments.length
  if (!total) return null
  const normal  = environments.filter(isNormal).length
  const warning = environments.filter(isWarning).length
  const alert   = environments.filter(isAlert).length
  const pct     = Math.round((normal / total) * 100)
  const color   = pct >= 70 ? '#4CAF50' : pct >= 40 ? '#FFC107' : '#F44336'
  const emoji   = pct >= 70 ? '🟢' : pct >= 40 ? '🟡' : '🔴'
  const label   = pct >= 70 ? t('dashboard.goodHealth') : pct >= 40 ? t('dashboard.recommendedAttention') : t('dashboard.interventionNeeded')

  return (
    <View style={[hcStyles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      <View style={hcStyles.row}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[hcStyles.label, { color: currentColors.textPrimary }]}>{label}</Text>
          <Text style={[hcStyles.sub,   { color: currentColors.textMuted }]}>{t('dashboard.monitored', { count: total })}</Text>
        </View>
        <Text style={[hcStyles.pct, { color }]}>{pct}%</Text>
      </View>
      <View style={hcStyles.track}>
        {normal  > 0 && <View style={[hcStyles.seg, { flex: normal,  backgroundColor: '#4CAF50' }]} />}
        {warning > 0 && <View style={[hcStyles.seg, { flex: warning, backgroundColor: '#FFC107' }]} />}
        {alert   > 0 && <View style={[hcStyles.seg, { flex: alert,   backgroundColor: '#F44336' }]} />}
      </View>
      <View style={hcStyles.legend}>
        {[
          { color: '#4CAF50', icon: 'checkmark-circle', count: normal, label: t('status.normal') },
          { color: '#FFC107', icon: 'warning', count: warning, label: t('status.warning') },
          { color: '#F44336', icon: 'alert-circle', count: alert, label: t('status.alert') },
        ].map((item) => (
          <View
            key={item.label}
            style={[
              hcStyles.legendItem,
              { backgroundColor: `${item.color}14`, borderColor: `${item.color}55` },
            ]}
          >
            <Ionicons name={item.icon} size={13} color={item.color} />
            <Text style={[hcStyles.legendCount, { color: item.color }]}>{item.count}</Text>
            <Text style={[hcStyles.legendTxt, { color: currentColors.textMuted }]} numberOfLines={1}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
const hcStyles = StyleSheet.create({
  card:       { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1 },
  row:        { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  label:      { fontSize: 14, fontWeight: '700' },
  sub:        { fontSize: 12, marginTop: 2 },
  pct:        { fontSize: 20, fontWeight: 'bold' },
  track:      { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 10, backgroundColor: '#f0f0f0' },
  seg:        { height: '100%' },
  legend:     { flexDirection: 'row', gap: 8 },
  legendItem: {
    flex: 1,
    minHeight: 30,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  legendCount: { fontSize: 13, fontWeight: '800' },
  legendTxt:  { fontSize: 10.5, fontWeight: '700', flexShrink: 1 },
})

// ── Stats Bar ──────────────────────────────────────────────────
function StatsBar({ environments, currentColors, t }) {
  const counts = [
    { n: environments.filter(isNormal).length,  color: '#4CAF50', icon: 'checkmark-circle', label: t('status.normal') },
    { n: environments.filter(isWarning).length, color: '#FFC107', icon: 'warning',           label: t('status.warning') },
    { n: environments.filter(isAlert).length,   color: '#F44336', icon: 'alert-circle',      label: t('status.alert') },
    { n: environments.length,                   color: currentColors.accent, icon: 'trophy', label: t('dashboard.total') },
  ]
  return (
    <View style={[sbStyles.bar, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      {counts.map((s, i) => (
        <View key={i} style={[sbStyles.stat, i < counts.length - 1 && { borderRightWidth: 1, borderRightColor: currentColors.borderColor }]}>
          <Ionicons name={s.icon} size={18} color={s.color} />
          <Text style={[sbStyles.count, { color: s.color }]}>{s.n}</Text>
          <Text style={[sbStyles.label, { color: currentColors.textMuted }]}>{s.label}</Text>
        </View>
      ))}
    </View>
  )
}
const sbStyles = StyleSheet.create({
  bar:   { flexDirection: 'row', borderRadius: 14, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  stat:  { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 3 },
  count: { fontSize: 18, fontWeight: 'bold' },
  label: { fontSize: 10, fontWeight: '600' },
})

// ── Alerts Panel ───────────────────────────────────────────────
function AlertsPanel({ environments, onPress, currentColors, t }) {
  const problematic = environments.filter((e) => isAlert(e) || isWarning(e))

  if (!problematic.length) {
    return (
      <View style={[apStyles.empty, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
        <Text style={[apStyles.emptyTxt, { color: currentColors.textMuted }]}>{t('dashboard.noAlerts')}</Text>
      </View>
    )
  }

  return (
    <View style={[apStyles.panel, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      <View style={apStyles.titleRow}>
        <Ionicons name="notifications" size={16} color={currentColors.accent} />
        <Text style={[apStyles.title, { color: currentColors.textPrimary }]}>{t('dashboard.activeAlerts')}</Text>
        <View style={[apStyles.badge, { backgroundColor: currentColors.accent }]}>
          <Text style={apStyles.badgeTxt}>{problematic.length}</Text>
        </View>
      </View>
      {problematic.map((env) => {
        const alert  = isAlert(env)
        const color  = alert ? '#F44336' : '#FFC107'
        const t      = env.temp ?? env.temperature ?? 0
        const issues = []
        if (t < 18 || t > 24)                       issues.push(`Temp ${t}°C`)
        if (env.humidity < 40 || env.humidity > 60) issues.push(`Hum ${env.humidity}%`)
        if (env.co2 > 1000)                         issues.push(`CO₂ ${env.co2}ppm`)
        if (env.noise > 50)                         issues.push(`${t('dashboard.noise')} ${env.noise}dB`)
        return (
          <TouchableOpacity
            key={env.id}
            style={[apStyles.item, { borderLeftColor: color, backgroundColor: `${color}15` }]}
            onPress={() => onPress(env.id)}
          >
            <Ionicons name={alert ? 'alert-circle' : 'warning'} size={18} color={color} />
            <View style={{ flex: 1 }}>
              <Text style={[apStyles.itemName, { color: currentColors.textPrimary }]}>{env.name}</Text>
              {issues.length > 0 && <Text style={[apStyles.itemIssues, { color }]}>{issues.join(' · ')}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={14} color={currentColors.textMuted} />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
const apStyles = StyleSheet.create({
  empty:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  emptyTxt:  { fontSize: 13, flex: 1 },
  panel:     { borderRadius: 14, borderWidth: 1, marginBottom: 12, padding: 12 },
  titleRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  title:     { fontSize: 14, fontWeight: '700', flex: 1 },
  badge:     { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  badgeTxt:  { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  item:      { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, borderLeftWidth: 3, marginBottom: 6 },
  itemName:  { fontSize: 13, fontWeight: '600' },
  itemIssues:{ fontSize: 11, marginTop: 2 },
})

// ── Podium Card (rank 1–3) ─────────────────────────────────────
const MEDAL = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }

function PodiumCard({ env, rank, score, onPress, onToggleFav, currentColors }) {
  const isWinner = rank === 1

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
        <StatusIcon statusKey={env.statusKey} size={isWinner ? 24 : 19} />
      </View>
      <Text
        style={[pdStyles.name, isWinner && pdStyles.nameWinner, { color: currentColors.textPrimary }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {env.name}
      </Text>
      {env.location ? (
        <View style={pdStyles.locRow}>
          <Ionicons name="location-outline" size={10} color={currentColors.textMuted} />
          <Text style={[pdStyles.loc, { color: currentColors.textMuted }]} numberOfLines={1}>{env.location}</Text>
        </View>
      ) : null}
      <ScoreRing score={score} size={isWinner ? 50 : 42} currentColors={currentColors} />
      <TouchableOpacity onPress={() => onToggleFav(env.id, !env.isFavorite)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
        <Ionicons name={env.isFavorite ? 'heart' : 'heart-outline'} size={50} color={env.isFavorite ? '#ff6b6b' : currentColors.textMuted} />
      </TouchableOpacity>
      <View style={[pdStyles.stand, isWinner && pdStyles.standWinner, { backgroundColor: MEDAL[rank] }]}>
        <Text style={[pdStyles.standN, isWinner && pdStyles.standWinnerN]}>{rank}</Text>
      </View>
    </TouchableOpacity>
  )
}
const pdStyles = StyleSheet.create({
  card: {
    alignItems: 'center', borderRadius: 14, borderWidth: 2,
    paddingHorizontal: 8, paddingTop: 12, paddingBottom: 42, gap: 5,
    justifyContent: 'flex-start',
    overflow: 'visible',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  rank1:  { width: 132, height: 300, marginTop: 5, zIndex: 2 },
  rank23: { width: 120, height: 260, marginTop: 24 },
  crown:  { fontSize: 21, position: 'absolute', top: -20, zIndex: 3 },
  bubble: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  bubbleWinner: { width: 46, height: 46, borderRadius: 23 },
  name:   { textAlign: 'center', fontWeight: '800', fontSize: 11.5, lineHeight: 14, minHeight: 30, maxWidth: '100%' },
  nameWinner: { fontSize: 13, lineHeight: 16, minHeight: 34 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  loc:    { fontSize: 10, maxWidth: 82 },
  stand:  {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: 34, alignItems: 'center', justifyContent: 'center',
    borderBottomLeftRadius: 11, borderBottomRightRadius: 11,
  },
  standWinner: { height: 38 },
  standN: { color: '#fff', fontWeight: '900', fontSize: 16 },
  standWinnerN: { fontSize: 18 },
})

// ── Rank Row (rank 4+) ─────────────────────────────────────────
function RankRow({ env, rank, score, onPress, onToggleFav, currentColors }) {
  const t      = env.temp ?? env.temperature ?? 0
  const pills  = [
    { label: `${t}°C`,          warn: t < 18 || t > 24 },
    { label: `${env.humidity}%`, warn: env.humidity < 40 || env.humidity > 60 },
    { label: `${env.co2}ppm`,    warn: env.co2 > 1000 },
    { label: `${env.noise}dB`,   warn: env.noise > 50 },
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
      <StatusIcon statusKey={env.statusKey} size={18} />
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
      <ScoreRing score={score} size={42} currentColors={currentColors} />
      <TouchableOpacity onPress={() => onToggleFav(env.id, !env.isFavorite)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} style={{ marginLeft: 6 }}>
        <Ionicons name={env.isFavorite ? 'heart' : 'heart-outline'} size={50} color={env.isFavorite ? '#ff6b6b' : currentColors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}
const rrStyles = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  rank:    { fontSize: 13, fontWeight: '700', width: 28 },
  name:    { fontSize: 14, fontWeight: '600' },
  loc:     { fontSize: 11, marginTop: 1 },
  pills:   { flexDirection: 'row', gap: 4 },
  pill:    { borderWidth: 1, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  pillTxt: { fontSize: 10, fontWeight: '600' },
})

// ── Filter Bar ─────────────────────────────────────────────────
const FILTERS = [
  { key: 'all',     labelKey: 'dashboard.all' },
  { key: 'normal',  icon: 'checkmark-circle', labelKey: 'status.normal' },
  { key: 'warning', icon: 'warning', labelKey: 'status.warning' },
  { key: 'alert',   icon: 'alert-circle', labelKey: 'status.alert' },
]

// ── Main ───────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }) {
  const { darkMode, currentColors, loaded } = useTheme()
  const { environments, toggleFavorite } = useEnvironments()
  const { t } = useLanguage()
  const [filter, setFilter] = useState('all')

  const ranked = useMemo(() =>
    environments
      .map((env) => ({ env, score: calcScore(env) }))
      .sort((a, b) => b.score - a.score),
    [environments]
  )

  const filtered = useMemo(() => {
    if (filter === 'all') return ranked
    return ranked.filter(({ env }) =>
      filter === 'normal'  ? isNormal(env)  :
      filter === 'warning' ? isWarning(env) :
      isAlert(env)
    )
  }, [ranked, filter])

  const top3 = filtered.slice(0, 3)
  const rest = filtered.slice(3)
  const PODIUM_ORDER = [2, 1, 3]

  const handlePress = (id) => navigation.navigate('EnvironmentDetail', { envId: id })

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: '#f0fafa' }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#999' }}>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <Ionicons name="trophy" size={24} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>{t('dashboard.title')}</Text>
          <Text style={[styles.headerSub,   { color: currentColors.textMuted }]}>{t('dashboard.subtitle')}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <StatsBar environments={environments} currentColors={currentColors} t={t} />

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterBtn,
                { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor },
                filter === f.key && { backgroundColor: currentColors.accent, borderColor: currentColors.accent },
              ]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterTxt, { color: filter === f.key ? currentColors.bgBody : currentColors.textSecondary }]}>
                {f.icon ? `${t(f.labelKey)}` : t(f.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Empty */}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 36 }}>🏜️</Text>
            <Text style={[styles.emptyTxt, { color: currentColors.textMuted }]}>{t('dashboard.emptyByStatus')}</Text>
          </View>
        )}

        {/* Podium */}
        {top3.length > 0 && (
          <View style={styles.podium}>
            {PODIUM_ORDER.map((rank) => {
              const item = top3[rank - 1]
              return item ? (
                <PodiumCard
                  key={rank}
                  env={item.env}
                  rank={rank}
                  score={item.score}
                  onPress={handlePress}
                  onToggleFav={toggleFavorite}
                  currentColors={currentColors}
                />
              ) : <View key={rank} style={{ width: 100 }} />
            })}
          </View>
        )}

        {/* Rest of list */}
        {rest.length > 0 && (
          <View style={styles.listSection}>
            <Text style={[styles.listTitle, { color: currentColors.textMuted }]}>
              {t('dashboard.positions', { from: top3.length + 1, to: filtered.length })}
            </Text>
            {rest.map(({ env, score }, idx) => (
              <RankRow
                key={env.id}
                env={env}
                rank={top3.length + idx + 1}
                score={score}
                onPress={handlePress}
                onToggleFav={toggleFavorite}
                currentColors={currentColors}
              />
            ))}
          </View>
        )}

        {/* Legend */}
        <View style={[styles.legend, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <Text style={[styles.legendTitle, { color: currentColors.textPrimary }]}>{t('dashboard.scoreTitle')}</Text>
          {[
            t('dashboard.idealTemp'),
            t('dashboard.idealHumidity'),
            t('dashboard.idealCo2'),
            t('dashboard.idealNoise'),
          ].map((l) => (
            <Text key={l} style={[styles.legendItem, { color: currentColors.textSecondary }]}>{l}</Text>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:         { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 55, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle:  { fontSize: 18, fontWeight: 'bold' },
  headerSub:    { fontSize: 12, marginTop: 1 },
  scroll:       { flex: 1 },
  scrollContent:{ padding: 16 },
  filterScroll: { marginBottom: 12, maxHeight: 44, flexGrow: 0 },
  filterRow:    { flexDirection: 'row', gap: 8, paddingRight: 8 },
  filterBtn:    { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1, minHeight: 36, justifyContent: 'center' },
  filterTxt:    { fontSize: 12, fontWeight: '700' },
  empty:        { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyTxt:     { fontSize: 14 },
  podium:       { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginBottom: 24, paddingTop: 20 },
  listSection:  { marginTop: 4 },
  listTitle:    { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  legend:       { borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  legendTitle:  { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  legendItem:   { fontSize: 12 },
})
