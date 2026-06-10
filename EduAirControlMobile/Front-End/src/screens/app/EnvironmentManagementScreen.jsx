import { useState, useMemo } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
  TextInput, Modal, Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/environments'
import { useEnvironments } from '../../context/EnvironmentsContext'
import { useLanguage } from '../../context/LanguageContext'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const isNormal  = (e) => e.statusKey === 'normal'  || e.statusKey === 'dashboard.statusNormal'
const isWarning = (e) => e.statusKey === 'warning' || e.statusKey === 'dashboard.statusWarning'
const isAlert   = (e) => e.statusKey === 'alert'   || e.statusKey === 'dashboard.statusAlert'

function getMetricColor(key, val) {
  if (key === 'temp')     return val > 26 ? '#F44336' : val > 24 ? '#FFC107' : '#4CAF50'
  if (key === 'humidity') return val < 35 || val > 65 ? '#F44336' : val < 40 || val > 60 ? '#FFC107' : '#4CAF50'
  if (key === 'co2')      return val > 1200 ? '#F44336' : val > 1000 ? '#FFC107' : '#4CAF50'
  if (key === 'noise')    return val > 70 ? '#F44336' : val > 55 ? '#FFC107' : '#4CAF50'
  return '#4CAF50'
}

// ─────────────────────────────────────────────────────────────────────────────
// FormField
// ─────────────────────────────────────────────────────────────────────────────
function FormField({ label, value, onChangeText, placeholder, keyboardType = 'default', currentColors }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: currentColors.textMuted }]}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, {
          backgroundColor: currentColors.bgInput,
          borderColor: currentColors.borderColor,
          color: currentColors.textPrimary,
        }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={currentColors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SummaryCard — filtro rápido por estado (igual que web)
// ─────────────────────────────────────────────────────────────────────────────
function SummaryCard({ label, value, emoji, accent, active, onPress, currentColors }) {
  return (
    <TouchableOpacity
      style={[
        styles.summaryCard,
        { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor },
        active && { borderColor: accent, backgroundColor: `${accent}18` },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.summaryEmoji}>{emoji}</Text>
      <Text style={[styles.summaryValue, { color: active ? accent : currentColors.textPrimary }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: active ? accent : currentColors.textMuted }]}>{label}</Text>
    </TouchableOpacity>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EnvironmentCard — métricas + toque para navegar al detalle (igual que web)
// ─────────────────────────────────────────────────────────────────────────────
function EnvironmentCard({ environment, onEdit, onDelete, onPress, currentColors, t }) {
  const statusColor = STATUS_COLORS[environment.statusKey] || currentColors.accent
  const statusLabel = t(`status.${environment.statusKey}`) || STATUS_LABELS[environment.statusKey] || environment.statusKey

  const metrics = [
    { key: 'temp',     icon: '🌡️', label: 'Temp',   value: `${environment.temp}°C`       },
    { key: 'humidity', icon: '💧', label: 'Hum',    value: `${environment.humidity}%`     },
    { key: 'co2',      icon: '☁️', label: 'CO₂',    value: `${environment.co2}ppm`        },
    { key: 'noise',    icon: '🔊', label: t('dashboard.noise'),  value: `${environment.noise}dB`       },
  ]

  // raw values for color coding
  const raws = {
    temp: environment.temp,
    humidity: environment.humidity,
    co2: environment.co2,
    noise: environment.noise,
  }

  return (
    <TouchableOpacity
      style={[styles.envCard, {
        backgroundColor: currentColors.bgCard,
        borderColor: currentColors.borderColor,
        borderLeftColor: statusColor,
      }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Card top: icon + info + status pill */}
      <View style={styles.cardTop}>
        <View style={[styles.cardIcon, { backgroundColor: `${statusColor}18` }]}>
          <Ionicons name="business-outline" size={18} color={statusColor} />
        </View>

        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: currentColors.textPrimary }]} numberOfLines={1}>
            {environment.name}
          </Text>
          <View style={styles.cardMeta}>
            <Ionicons name="location-outline" size={11} color={currentColors.textMuted} />
            <Text style={[styles.cardMetaTxt, { color: currentColors.textMuted }]}>{environment.location}</Text>
            <Ionicons name="people-outline" size={11} color={currentColors.textMuted} style={{ marginLeft: 6 }} />
            <Text style={[styles.cardMetaTxt, { color: currentColors.textMuted }]}>{environment.capacity} p.</Text>
          </View>
        </View>

        <View style={[styles.statusPill, {
          backgroundColor: `${statusColor}18`,
          borderColor: statusColor,
        }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusTxt, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      {/* Metrics row — igual que web */}
      <View style={[styles.metricsRow, { borderTopColor: currentColors.borderColor }]}>
        {metrics.map((m) => {
          const color = getMetricColor(m.key, raws[m.key])
          return (
            <View key={m.key} style={styles.metricCell}>
              <Text style={styles.metricIcon}>{m.icon}</Text>
              <Text style={[styles.metricValue, { color }]}>{m.value}</Text>
              <Text style={[styles.metricLabel, { color: currentColors.textMuted }]}>{m.label}</Text>
            </View>
          )
        })}
      </View>

      {/* Actions */}
      <View style={[styles.cardActions, { borderTopColor: currentColors.borderColor }]}>
        <TouchableOpacity
          style={[styles.editBtn, { borderRightColor: currentColors.borderColor }]}
          onPress={(e) => { onEdit(environment) }}
        >
          <Ionicons name="create-outline" size={14} color={currentColors.accent} />
          <Text style={[styles.editBtnTxt, { color: currentColors.accent }]}>{t('common.edit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(environment)}>
          <Ionicons name="trash-outline" size={14} color={currentColors.error} />
          <Text style={[styles.deleteBtnTxt, { color: currentColors.error }]}>{t('common.delete')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', capacity: '', location: '' }

export default function EnvironmentManagementScreen({ navigation }) {
  const { darkMode, currentColors, loaded } = useTheme()
  const { environments, addEnvironment, editEnvironment, deleteEnvironment } = useEnvironments()
  const { t } = useLanguage()

  // ── Filtros (igual que web) ───────────────────────────────────
  const [search, setSearch]             = useState('')
  const [activeFilter, setActiveFilter] = useState('all')   // all | normal | warning | alert

  // ── Modal ─────────────────────────────────────────────────────
  const [modal, setModal] = useState({ open: false, mode: 'add', env: null })
  const [form, setForm]   = useState(EMPTY_FORM)

  // ── Stats (igual que web) ─────────────────────────────────────
  const stats = useMemo(() => ({
    total:    environments.length,
    normals:  environments.filter(isNormal).length,
    warnings: environments.filter(isWarning).length,
    alerts:   environments.filter(isAlert).length,
  }), [environments])

  // ── Filtered + sorted list (igual que web) ────────────────────
  const filtered = useMemo(() => {
    let list = environments.filter((env) => {
      const q = search.toLowerCase()
      const matchSearch = !q || env.name.toLowerCase().includes(q) || env.location.toLowerCase().includes(q)
      const matchFilter =
        activeFilter === 'all'
        || (activeFilter === 'normal'  && isNormal(env))
        || (activeFilter === 'warning' && isWarning(env))
        || (activeFilter === 'alert'   && isAlert(env))
      return matchSearch && matchFilter
    })

    list = [...list].sort((a, b) => {
      return a.name.localeCompare(b.name)
    })

    return list
  }, [environments, search, activeFilter])

  // ── Handlers ──────────────────────────────────────────────────
  const openAdd  = () => { setForm(EMPTY_FORM); setModal({ open: true, mode: 'add', env: null }) }
  const openEdit = (env) => {
    setForm({ name: env.name, capacity: String(env.capacity), location: env.location })
    setModal({ open: true, mode: 'edit', env })
  }
  const closeModal = () => setModal({ open: false, mode: 'add', env: null })

  const handleSave = () => {
    if (!form.name.trim()) {
      Alert.alert(t('management.requiredTitle'), t('management.requiredName'))
      return
    }
    if (modal.mode === 'add') {
      addEnvironment({
        name: form.name.trim(),
        capacity: Number(form.capacity) || 0,
        location: form.location.trim() || t('management.noLocation'),
      })
    } else {
      editEnvironment(modal.env.id, {
        name: form.name.trim(),
        capacity: Number(form.capacity) || 0,
        location: form.location.trim(),
      })
    }
    closeModal()
  }

  const confirmDelete = (env) => {
    Alert.alert(
      t('management.deleteTitle'),
      t('management.deleteQuestion', { name: env.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => deleteEnvironment(env.id) },
      ]
    )
  }

  const clearAll = () => {
    setSearch(''); setActiveFilter('all')
  }

  if (!loaded) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: currentColors.textMuted }}>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <View style={[styles.header, { borderBottomColor: currentColors.borderColor }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="grid-outline" size={20} color={currentColors.accent} />
          <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>
            {t('management.title')}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: currentColors.accent }]}
          onPress={openAdd}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color={currentColors.bgBody} />
          <Text style={[styles.addBtnTxt, { color: currentColors.bgBody }]}>{t('management.add')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Summary cards (NUEVO — igual que web) ──────────── */}
        <View style={styles.summaryRow}>
          <SummaryCard
            label={t('dashboard.total')}  value={stats.total}    emoji="🏫"
            accent={currentColors.accent}
            active={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
            currentColors={currentColors}
          />
          <SummaryCard
            label={t('status.normal')}  value={stats.normals}  emoji="✅"
            accent="#4CAF50"
            active={activeFilter === 'normal'}
            onPress={() => setActiveFilter('normal')}
            currentColors={currentColors}
          />
          <SummaryCard
            label={t('management.warning')} value={stats.warnings} emoji="🔔"
            accent="#FFC107"
            active={activeFilter === 'warning'}
            onPress={() => setActiveFilter('warning')}
            currentColors={currentColors}
          />
          <SummaryCard
            label={t('status.alert')} value={stats.alerts}   emoji="⚠️"
            accent="#F44336"
            active={activeFilter === 'alert'}
            onPress={() => setActiveFilter('alert')}
            currentColors={currentColors}
          />
        </View>

        {/* ── Buscador ────────────────────────────────────────── */}
        <View style={[styles.searchBar, {
          backgroundColor: currentColors.bgCard,
          borderColor: currentColors.borderColor,
        }]}>
          <Ionicons name="search-outline" size={16} color={currentColors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: currentColors.textPrimary }]}
            placeholder={t('management.searchPlaceholder')}
            placeholderTextColor={currentColors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={currentColors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Contador de resultados (NUEVO — igual que web) ──── */}
        <View style={styles.resultsInfo}>
          <Text style={[styles.resultsCount, { color: currentColors.textMuted }]}>
            {t('management.showing', { shown: filtered.length, total: stats.total })}
          </Text>
          {(search || activeFilter !== 'all') && (
            <TouchableOpacity onPress={clearAll}>
              <Text style={[styles.clearTxt, { color: currentColors.accent }]}>{t('management.clear')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Lista ───────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏫</Text>
            <Text style={[styles.emptyTitle, { color: currentColors.textPrimary }]}>
              {search || activeFilter !== 'all' ? t('management.noResults') : t('management.noEnvironments')}
            </Text>
            <Text style={[styles.emptyText, { color: currentColors.textMuted }]}>
              {search || activeFilter !== 'all'
                ? t('management.tryAnother')
                : t('management.startMonitoring')}
            </Text>
            {(search || activeFilter !== 'all') ? (
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: currentColors.accent }]}
                onPress={clearAll}
              >
                <Text style={[styles.emptyBtnTxt, { color: currentColors.bgBody }]}>{t('management.clearSearch')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: currentColors.accent }]}
                onPress={openAdd}
              >
                <Text style={[styles.emptyBtnTxt, { color: currentColors.bgBody }]}>{t('management.addEnvironment')}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map((env) => (
            <EnvironmentCard
              key={env.id}
              environment={env}
              currentColors={currentColors}
              onEdit={openEdit}
              onDelete={confirmDelete}
              onPress={() => navigation.navigate('EnvironmentDetail', { envId: env.id })}
              t={t}
            />
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Add / Edit modal ─────────────────────────────────── */}
      <Modal visible={modal.open} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: currentColors.bgCard }]}>
            <View style={styles.modalHeader}>
              <Ionicons
                name={modal.mode === 'add' ? 'add-circle-outline' : 'create-outline'}
                size={22}
                color={currentColors.accent}
              />
              <Text style={[styles.modalTitle, { color: currentColors.textPrimary }]}>
                {modal.mode === 'add' ? t('management.newEnvironment') : t('management.editEnvironment')}
              </Text>
              <TouchableOpacity onPress={closeModal} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={22} color={currentColors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              <FormField
                label={t('management.name')}
                value={form.name}
                onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
                placeholder="Ej: Aula 301"
                currentColors={currentColors}
              />
              <FormField
                label={t('management.capacity')}
                value={form.capacity}
                onChangeText={(v) => setForm((p) => ({ ...p, capacity: v }))}
                placeholder="Ej: 30"
                keyboardType="numeric"
                currentColors={currentColors}
              />
              <FormField
                label={t('management.location')}
                value={form.location}
                onChangeText={(v) => setForm((p) => ({ ...p, location: v }))}
                placeholder="Ej: Bloque A"
                currentColors={currentColors}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: currentColors.borderColor }]}
                onPress={closeModal}
              >
                <Text style={[styles.cancelBtnTxt, { color: currentColors.textSecondary }]}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: currentColors.accent }]}
                onPress={handleSave}
              >
                <Text style={[styles.saveBtnTxt, { color: currentColors.bgBody }]}>
                  {modal.mode === 'add' ? t('common.add') : t('common.save')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:          { flex: 1 },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 10, paddingHorizontal: 13, paddingVertical: 8,
  },
  addBtnTxt: { fontSize: 13, fontWeight: '700' },

  // Summary cards
  summaryRow: {
    flexDirection: 'row', gap: 8, marginBottom: 14,
  },
  summaryCard: {
    flex: 1, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4,
    borderRadius: 12, borderWidth: 1.5,
  },
  summaryEmoji: { fontSize: 16, marginBottom: 2 },
  summaryValue: { fontSize: 18, fontWeight: '900', lineHeight: 22 },
  summaryLabel: { fontSize: 9.5, fontWeight: '600', marginTop: 1, textAlign: 'center' },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },

  // Controls: capacity + sort
  controlsRow: { flexDirection: 'row', gap: 8, marginBottom: 10, alignItems: 'center' },
  capacityGroup: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8,
  },
  controlLabel: { fontSize: 12, fontWeight: '600' },
  capInput: {
    flex: 1, fontSize: 13, borderWidth: 1, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 5, textAlign: 'center',
    minWidth: 42,
  },
  controlSep: { fontSize: 12 },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 10, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 10,
  },
  sortBtnTxt: { fontSize: 12, fontWeight: '600' },

  // Results info
  resultsInfo: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultsCount: { fontSize: 12 },
  clearTxt:     { fontSize: 12, fontWeight: '700' },

  // Environment card
  envCard: {
    borderRadius: 14, borderWidth: 1.5, borderLeftWidth: 4,
    overflow: 'hidden', marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 11,
  },
  cardIcon: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo:    { flex: 1 },
  cardName:    { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  cardMeta:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardMetaTxt: { fontSize: 11 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 20, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusTxt:  { fontSize: 10, fontWeight: '700' },

  // Metrics row (NUEVO)
  metricsRow: {
    flexDirection: 'row', borderTopWidth: 1,
  },
  metricCell: {
    flex: 1, alignItems: 'center', paddingVertical: 10, gap: 2,
  },
  metricIcon:  { fontSize: 14 },
  metricValue: { fontSize: 13, fontWeight: '800', lineHeight: 17 },
  metricLabel: { fontSize: 9.5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },

  // Card actions
  cardActions: {
    flexDirection: 'row', borderTopWidth: 1,
  },
  editBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 11, borderRightWidth: 1,
  },
  editBtnTxt:   { fontSize: 13, fontWeight: '600' },
  deleteBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 11,
  },
  deleteBtnTxt: { fontSize: 13, fontWeight: '600' },

  // Empty state
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyIcon:    { fontSize: 52 },
  emptyTitle:   { fontSize: 17, fontWeight: '800' },
  emptyText:    { fontSize: 13, textAlign: 'center', lineHeight: 19 },
  emptyBtn:     { borderRadius: 12, paddingHorizontal: 20, paddingVertical: 11, marginTop: 6 },
  emptyBtnTxt:  { fontSize: 14, fontWeight: '700' },

  // Sort picker
  sortOverlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sortSheet: {
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    paddingTop: 20, paddingHorizontal: 20, paddingBottom: 36,
  },
  sortSheetTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 10 },
  sortOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4,
  },
  sortOptionTxt: { fontSize: 15 },

  // Add/Edit modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20,
  },
  modalTitle: { flex: 1, fontSize: 17, fontWeight: '800' },

  fieldGroup:  { marginBottom: 16 },
  fieldLabel:  { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  fieldInput: {
    borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15,
  },

  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1, borderRadius: 12, borderWidth: 1,
    paddingVertical: 13, alignItems: 'center',
  },
  cancelBtnTxt: { fontWeight: '600', fontSize: 15 },
  saveBtn: {
    flex: 1, borderRadius: 12,
    paddingVertical: 13, alignItems: 'center',
  },
  saveBtnTxt: { fontWeight: '800', fontSize: 15 },
})
