/**
 * NotificationsScreen — móvil
 * Equivalente a NotificationPanel.jsx de la web.
 * Muestra las notificaciones generadas desde useNotifications.
 */
import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications } from '../../hooks/useNotifications'

const TYPE_CONFIG = {
  danger:  { icon: 'alert-circle',      color: '#F44336', bg: 'rgba(244,67,54,0.12)'  },
  warning: { icon: 'warning',           color: '#FFC107', bg: 'rgba(255,193,7,0.12)'  },
  info:    { icon: 'information-circle', color: '#00b894', bg: 'rgba(0,184,148,0.12)' },
}

function NotificationItem({ notification, onPress, currentColors }) {
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info
  const timeStr = notification.time instanceof Date
    ? notification.time.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
    : ''

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
        <Text style={[styles.itemTime, { color: currentColors.textMuted }]}>{timeStr}</Text>
      </View>
      {notification.envId && (
        <Ionicons name="chevron-forward" size={16} color={currentColors.textMuted} />
      )}
    </TouchableOpacity>
  )
}

export default function NotificationsScreen({ navigation }) {
  const { darkMode, currentColors, loaded } = useTheme()
  const { notifications, unreadCount }      = useNotifications()

  const [filter, setFilter] = useState('all')

  const FILTERS = [
    { key: 'all',     label: 'Todas' },
    { key: 'danger',  label: '🔴 Alertas' },
    { key: 'warning', label: '⚠️ Advertencias' },
    { key: 'info',    label: 'ℹ️ Info' },
  ]

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === filter)

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: '#f0fafa' }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#999' }}>Cargando...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <Ionicons name="notifications" size={24} color={currentColors.accent} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>Notificaciones</Text>
          {unreadCount > 0 && (
            <Text style={[styles.headerSub, { color: '#F44336' }]}>{unreadCount} alertas activas</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <View style={[styles.badge, { backgroundColor: '#F44336' }]}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              { borderColor: currentColors.borderColor },
              filter === f.key && { backgroundColor: currentColors.accent, borderColor: currentColors.accent },
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[
              styles.filterChipText,
              { color: filter === f.key ? currentColors.bgBody : currentColors.textSecondary }
            ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notification list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle" size={60} color={currentColors.accent} />
            <Text style={[styles.emptyTitle, { color: currentColors.textPrimary }]}>Sin notificaciones</Text>
            <Text style={[styles.emptyText, { color: currentColors.textMuted }]}>
              Todos los ambientes están dentro de los parámetros normales
            </Text>
          </View>
        ) : (
          filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              currentColors={currentColors}
              onPress={() => {
                if (n.envId) navigation.navigate('EnvironmentDetail', { envId: n.envId })
              }}
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
  headerSub:   { fontSize: 12, marginTop: 1 },
  badge: {
    borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3,
    minWidth: 24, alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  filterScroll:     { marginTop: 12, maxHeight: 48, flexGrow: 0 },
  filterRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 4 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1.5,
    backgroundColor: 'transparent',
    minHeight: 36,
    justifyContent: 'center',
  },
  filterChipText: { fontSize: 13, fontWeight: '600' },

  list:        { flex: 1 },
  listContent: { padding: 16 },

  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, borderWidth: 1.5,
    padding: 14, marginBottom: 10,
  },
  iconWrap: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  itemContent: { flex: 1 },
  itemTitle:   { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  itemMsg:     { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  itemTime:    { fontSize: 11 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold' },
  emptyText:  { fontSize: 13, textAlign: 'center', maxWidth: 280 },
})
