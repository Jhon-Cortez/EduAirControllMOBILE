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
import { useNotificationsVM } from '../viewmodels/useNotificationsVM'

const TYPE_CONFIG = {
  danger: { icon: 'alert-circle', color: '#F44336', bg: 'rgba(244,67,54,0.12)' },
  warning: { icon: 'warning', color: '#FFC107', bg: 'rgba(255,193,7,0.12)' },
  info: { icon: 'information-circle', color: '#00b894', bg: 'rgba(0,184,148,0.12)' },
}

const HOUR_LOCALES = { es: 'es-CO', en: 'en-US', fr: 'fr-FR', pt: 'pt-BR' }

function timeLabel(date, currentColors, lang) {
  const locale = HOUR_LOCALES[lang] || 'es-CO'
  try {
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function NotificationItem({ notification, onPress, currentColors }) {
  const { i18n } = useTranslation()
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: cfg.bg, borderColor: cfg.color }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!notification.envId}
    >
      <View style={[styles.iconWrap, { backgroundColor: cfg.color + '22' }]}>
        <Ionicons name={cfg.icon} size={22} color={cfg.color} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: currentColors.textPrimary }]}>{notification.title}</Text>
        <Text style={[styles.itemMsg, { color: currentColors.textSecondary }]} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={[styles.itemTime, { color: currentColors.textMuted }]}>{timeLabel(notification.time, currentColors, i18n.language)}</Text>
      </View>
      {notification.envId && (
        <Ionicons name="chevron-forward" size={16} color={currentColors.textMuted} />
      )}
    </TouchableOpacity>
  )
}

export default function NotificationsScreen({ navigation }) {
  const { darkMode, currentColors } = useTheme()
  const { t } = useTranslation()
  const vm = useNotificationsVM()

  const filters = [
    { key: 'all', label: t('notifications.all', 'Todas') },
    { key: 'danger', label: t('notifications.alerts', 'Alertas') },
    { key: 'warning', label: t('notifications.warning') },
    { key: 'info', label: t('notifications.dailySummary') },
  ]

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <Ionicons name="notifications" size={24} color={currentColors.accent} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>{t('notifications.title')}</Text>
          {vm.unreadCount > 0 && (
            <Text style={[styles.headerSub, { color: TYPE_CONFIG.danger.color }]}>
              {t('notifications.activeAlerts', '{{count}} alertas activas', { count: vm.unreadCount })}
            </Text>
          )}
        </View>
        {vm.unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: TYPE_CONFIG.danger.color }]}>
            <Text style={styles.badgeText}>{vm.unreadCount}</Text>
          </View>
        )}
      </View>

      {vm.all.length > 0 && (
        <TouchableOpacity style={[styles.markReadRow, { borderBottomColor: currentColors.borderColor }]} onPress={vm.markAllRead} hitSlop={6}>
          <Ionicons name="checkmark-done-outline" size={16} color={currentColors.accent} />
          <Text style={[styles.markReadText, { color: currentColors.accent }]}>{t('notifications.markAllRead')}</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              { borderColor: currentColors.borderColor },
              vm.filter === f.key && { backgroundColor: currentColors.accent, borderColor: currentColors.accent },
            ]}
            onPress={() => vm.setFilter(f.key)}
          >
            <Text style={[
              styles.filterChipText,
              { color: vm.filter === f.key ? currentColors.bgBody : currentColors.textSecondary },
            ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {vm.notifications.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle" size={60} color={currentColors.accent} />
            <Text style={[styles.emptyTitle, { color: currentColors.textPrimary }]}>
              {t('notifications.empty')}
            </Text>
          </View>
        ) : (
          vm.notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              currentColors={currentColors}
              onPress={() => n.envId && navigation.navigate('EnvironmentDetail', { envId: n.envId })}
            />
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 55, paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSub: { fontSize: 12, marginTop: 1 },
  badge: {
    borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3,
    minWidth: 24, alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  markReadRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1,
  },
  markReadText: { fontSize: 13, fontWeight: '700' },
  filterScroll: { marginTop: 12, maxHeight: 58, flexGrow: 0 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 4 },
  filterChip: {
    paddingHorizontal: 18, paddingVertical: 11, borderRadius: 24, borderWidth: 1.5,
    backgroundColor: 'transparent', minHeight: 48, justifyContent: 'center',
  },
  filterChipText: { fontSize: 14, fontWeight: '800' },
  list: { flex: 1 },
  listContent: { padding: 16 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, borderWidth: 1.5, padding: 14, marginBottom: 10,
  },
  iconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  itemMsg: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  itemTime: { fontSize: 11 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold' },
  emptyText: { fontSize: 13, textAlign: 'center', maxWidth: 280 },
})