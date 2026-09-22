import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Modal as RNModal,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useAllEnvironmentsVM } from '../viewmodels/useAllEnvironmentsVM'
import calculateEnvironmentScore from '../utils/calculateEnvironmentScore'
import { getEnvironmentStatus } from '../utils/getEnvironmentStatus'

function EnvironmentRow({ env, onPress, currentColors, t }) {
  const status = getEnvironmentStatus(env.statusKey, t)
  const score = calculateEnvironmentScore(env)

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: currentColors.bgCard,
          borderColor: currentColors.borderColor,
          borderLeftColor: status.color,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconBox, { backgroundColor: status.bg }]}>
        <Ionicons name="business-outline" size={20} color={status.color} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, { color: currentColors.textPrimary }]} numberOfLines={1}>
          {env.name}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={12} color={currentColors.textMuted} />
          <Text style={[styles.metaText, { color: currentColors.textMuted }]} numberOfLines={1}>
            {env.location || '—'}
          </Text>
          <Ionicons name="people-outline" size={12} color={currentColors.textMuted} />
          <Text style={[styles.metaText, { color: currentColors.textMuted }]}>
            {env.capacity || 0}
          </Text>
        </View>
      </View>
      <View style={styles.rightSide}>
        <View style={[styles.scorePill, { borderColor: status.color }]}>
          <Text style={[styles.scoreText, { color: status.color }]}>{score}</Text>
        </View>
        <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default function AllEnvironmentsScreen({ navigation }) {
  const { darkMode, currentColors } = useTheme()
  const { t } = useTranslation()
  const { filtered, filters, setFilter, clearFilters, counts, activeCount } = useAllEnvironmentsVM()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterSection, setFilterSection] = useState('status')

  const statusFilters = [
    { key: 'all', label: t('filters.all') },
    { key: 'normal', label: t('status.normal') },
    { key: 'warning', label: t('status.warning') },
    { key: 'alert', label: t('status.alert') },
  ]
  const favoriteFilters = [
    { key: 'all', label: t('filters.all') },
    { key: 'favorites', label: t('filters.favorites') },
  ]
  const capacityFilters = [
    { key: 'all', label: t('filters.all') },
    { key: 'small', label: t('filters.capacitySmall', '≤ 30') },
    { key: 'medium', label: t('filters.capacityMedium', '31 – 50') },
    { key: 'large', label: t('filters.capacityLarge', '> 50') },
  ]
  const sortFilters = [
    { key: 'name', label: t('filters.name') },
    { key: 'score', label: t('allEnvironments.environmentIndex') },
    { key: 'capacity', label: t('allEnvironments.capacity') },
  ]
  const filterSections = [
    { key: 'status', label: t('filters.statusLabel', 'Estado') },
    { key: 'favorite', label: t('filters.favorites') },
    { key: 'capacity', label: t('allEnvironments.capacity') },
    { key: 'sort', label: t('filters.sortLabel', 'Ordenar') },
  ]
  const filterGroups = {
    status: { title: t('filters.statusLabel', 'Estado'), items: statusFilters, active: filters.status, setActive: (v) => setFilter('status', v) },
    favorite: { title: t('filters.favorites'), items: favoriteFilters, active: filters.favorite, setActive: (v) => setFilter('favorite', v) },
    capacity: { title: t('allEnvironments.capacity'), items: capacityFilters, active: filters.capacity, setActive: (v) => setFilter('capacity', v) },
    sort: { title: t('filters.sortLabel', 'Ordenar'), items: sortFilters, active: filters.sortBy, setActive: (v) => setFilter('sortBy', v) },
  }
  const activeGroup = filterGroups[filterSection]

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      <View style={[styles.header, { backgroundColor: currentColors.bgCard, borderBottomColor: currentColors.borderColor }]}>
        <Ionicons name="business" size={24} color={currentColors.accent} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: currentColors.textPrimary }]}>{t('allEnvironments.title')}</Text>
          <Text style={[styles.headerSub, { color: currentColors.textMuted }]}>{t('allEnvironments.subtitle')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationsPanel')} style={[styles.iconBtn, { backgroundColor: currentColors.bgBody, borderColor: currentColors.borderColor }]} hitSlop={6}>
          <Ionicons name="notifications-outline" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={[styles.searchBar, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
          <Ionicons name="search-outline" size={17} color={currentColors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: currentColors.textPrimary }]}
            placeholder={t('filters.searchEnvironment')}
            placeholderTextColor={currentColors.textMuted}
            value={filters.name}
            onChangeText={(v) => setFilter('name', v)}
          />
          {filters.name.length > 0 && (
            <TouchableOpacity onPress={() => setFilter('name', '')}>
              <Ionicons name="close-circle" size={18} color={currentColors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}
            onPress={() => setFiltersOpen(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="options-outline" size={18} color={currentColors.accent} />
            <Text style={[styles.filterButtonText, { color: currentColors.textPrimary }]}>{t('filters.label', 'Filtros')}</Text>
            {activeCount > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: currentColors.accent }]}>
                <Text style={[styles.filterBadgeText, { color: '#fff' }]}>{activeCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickSortButton, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}
            onPress={() => { setFilterSection('sort'); setFiltersOpen(true) }}
            activeOpacity={0.85}
          >
            <Ionicons name="swap-vertical-outline" size={17} color={currentColors.textMuted} />
            <Text style={[styles.quickSortText, { color: currentColors.textSecondary }]}>
              {sortFilters.find((item) => item.key === filters.sortBy)?.label}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.resultCount, { color: currentColors.textMuted }]}>
          {t('allEnvironments.showing', 'Mostrando {{shown}} de {{total}}', { shown: filtered.length, total: counts.total })}
        </Text>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={56} color={currentColors.borderColor} />
            <Text style={[styles.emptyTitle, { color: currentColors.textPrimary }]}>{t('allEnvironments.noResults')}</Text>
            <TouchableOpacity
              style={[styles.emptyBtn, { backgroundColor: currentColors.accent }]}
              onPress={clearFilters}
            >
              <Text style={[styles.emptyBtnTxt, { color: '#fff' }]}>{t('filters.clear', 'Limpiar filtros')}</Text>
            </TouchableOpacity>
          </View>
        ) : filtered.map((env) => (
          <EnvironmentRow
            key={env.id}
            env={env}
            currentColors={currentColors}
            t={t}
            onPress={() => navigation.navigate('EnvironmentDetail', { envId: env.id })}
          />
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>

      <RNModal visible={filtersOpen} transparent animationType="fade" onRequestClose={() => setFiltersOpen(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setFiltersOpen(false)} />
          <View style={[styles.filterSheet, { backgroundColor: currentColors.bgBody }]}>
            <View style={styles.sheetBody}>
              <View style={[styles.sectionMenu, { backgroundColor: currentColors.bgCard, borderRightColor: currentColors.borderColor }]}>
                {filterSections.map((section) => (
                  <TouchableOpacity
                    key={section.key}
                    style={[
                      styles.sectionItem,
                      { borderBottomColor: currentColors.borderColor },
                      filterSection === section.key && { backgroundColor: currentColors.bgBody },
                    ]}
                    onPress={() => setFilterSection(section.key)}
                  >
                    {filterSection === section.key && <View style={[styles.sectionIndicator, { backgroundColor: currentColors.accent }]} />}
                    <Text style={[
                      styles.sectionText,
                      { color: filterSection === section.key ? currentColors.accent : currentColors.textSecondary },
                    ]}>
                      {section.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.optionsPane}>
                <Text style={[styles.optionsTitle, { color: currentColors.textPrimary }]}>{activeGroup.title}</Text>
                {activeGroup.items.map((item) => {
                  const selected = activeGroup.active === item.key
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[styles.optionRow, { borderBottomColor: currentColors.borderColor }]}
                      onPress={() => activeGroup.setActive(item.key)}
                      activeOpacity={0.85}
                    >
                      <View style={[styles.radio, { borderColor: selected ? currentColors.accent : currentColors.borderColor }]}>
                        {selected && <View style={[styles.radioDot, { backgroundColor: currentColors.accent }]} />}
                      </View>
                      <Text style={[styles.optionText, { color: currentColors.textPrimary }]}>{item.label}</Text>
                      {selected && <Ionicons name="checkmark" size={18} color={currentColors.accent} />}
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={[styles.sheetFooter, { backgroundColor: currentColors.bgCard, borderTopColor: currentColors.borderColor }]}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={[styles.clearButtonText, { color: currentColors.accent }]}>{t('filters.clear', 'Limpiar filtros')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.resultsButton, { backgroundColor: currentColors.accent }]}
                onPress={() => setFiltersOpen(false)}
              >
                <Text style={[styles.resultsButtonText, { color: '#fff' }]}>
                  {t('allEnvironments.seeResults', 'Ver {{count}} resultados', { count: filtered.length })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
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
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSub: { fontSize: 12, marginTop: 1 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { flex: 1 },
  content: { padding: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 13, paddingVertical: 11,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },
  controlsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  filterButton: {
    flex: 1.2, minHeight: 48, borderWidth: 1, borderRadius: 13,
    paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  filterButtonText: { fontSize: 14, fontWeight: '900' },
  filterBadge: {
    minWidth: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  filterBadgeText: { fontSize: 11, fontWeight: '900' },
  quickSortButton: {
    flex: 1, minHeight: 48, borderWidth: 1, borderRadius: 13,
    paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  quickSortText: { fontSize: 13, fontWeight: '800' },
  resultCount: { fontSize: 12, fontWeight: '700', marginBottom: 10, marginTop: 2 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 11,
    borderRadius: 14, borderWidth: 1.5, borderLeftWidth: 4,
    padding: 13, marginBottom: 10,
  },
  iconBox: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '800', marginBottom: 5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, maxWidth: 130 },
  rightSide: { alignItems: 'center', gap: 3 },
  scorePill: { width: 42, height: 42, borderRadius: 21, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  scoreText: { fontSize: 12, fontWeight: '900' },
  statusText: { fontSize: 10, fontWeight: '800' },
  empty: { alignItems: 'center', paddingTop: 52, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptyBtn: { borderRadius: 12, paddingHorizontal: 20, paddingVertical: 11 },
  emptyBtnTxt: { fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  filterSheet: { minHeight: '62%', maxHeight: '78%', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  sheetBody: { flex: 1, flexDirection: 'row' },
  sectionMenu: { width: 135, borderRightWidth: 1 },
  sectionItem: { minHeight: 74, borderBottomWidth: 1, justifyContent: 'center', paddingHorizontal: 16 },
  sectionIndicator: {
    position: 'absolute', left: 0, top: 14, bottom: 14, width: 3,
    borderTopRightRadius: 3, borderBottomRightRadius: 3,
  },
  sectionText: { fontSize: 14, fontWeight: '800', lineHeight: 18 },
  optionsPane: { flex: 1, paddingHorizontal: 22, paddingTop: 26 },
  optionsTitle: { fontSize: 22, fontWeight: '900', marginBottom: 14 },
  optionRow: { minHeight: 62, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  optionText: { flex: 1, fontSize: 17, fontWeight: '700' },
  sheetFooter: {
    borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 18,
    flexDirection: 'row', gap: 12,
  },
  clearButton: { flex: 1, minHeight: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  clearButtonText: { fontSize: 15, fontWeight: '900' },
  resultsButton: { flex: 1.5, minHeight: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resultsButtonText: { fontSize: 15, fontWeight: '900' },
})