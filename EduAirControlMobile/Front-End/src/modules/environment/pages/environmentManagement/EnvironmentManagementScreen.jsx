import { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../../context/ThemeContext.jsx'
import { useTranslation } from 'react-i18next'
import { useManagementVM } from '../../viewmodels/useManagementVM.js'
import { getEnvironmentStatus } from '../../utils/getEnvironmentStatus.js'
import authService from '../../../auth/services/authService.js'
import Button from '../../../../shared/components/Button/Button.jsx'
import Modal from '../../../../shared/components/Modal/Modal.jsx'
import Input from '../../../../shared/components/Input/Input.jsx'
import { useToast } from '../../../../shared/components/Toast/Toast.jsx'
import SensorVariablePanel from './SensorVariablePanel.jsx'
import { useSensorPanelVM } from '../../viewmodels/useSensorPanelVM.js'
import { styles } from './EnvironmentManagementScreen.styles'

const TABS = [
  { id: 'environments', key: 'management.tabEnvironments', icon: 'business-outline' },
  { id: 'sensors', key: 'management.tabSensors', icon: 'hardware-chip-outline' },
  { id: 'devices', key: 'management.tabDevices', icon: 'wifi-outline' },
]

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

function EnvironmentCard({ environment, onEdit, onDelete, currentColors, t }) {
  const status = getEnvironmentStatus(environment.statusKey, t)

  const metrics = [
    { key: 'temp', icon: '🌡️', label: t('dashboard.temperature'), value: `${environment.temp}°C` },
    { key: 'humidity', icon: '💧', label: t('dashboard.humidity'), value: `${environment.humidity}%` },
    { key: 'co2', icon: '☁️', label: t('allEnvironments.co2'), value: `${environment.co2}ppm` },
    { key: 'noise', icon: '🔊', label: t('dashboard.noise'), value: `${environment.noise}dB` },
  ]

  return (
    <View
      style={[
        styles.envCard,
        {
          backgroundColor: currentColors.bgCard,
          borderColor: currentColors.borderColor,
          borderLeftColor: status.color,
        },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.cardIcon, { backgroundColor: status.bg }]}>
          <Ionicons name="business-outline" size={18} color={status.color} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: currentColors.textPrimary }]} numberOfLines={1}>
            {environment.name}
          </Text>
          <View style={styles.cardMeta}>
            <Ionicons name="location-outline" size={11} color={currentColors.textMuted} />
            <Text style={[styles.cardMetaTxt, { color: currentColors.textMuted }]} numberOfLines={1}>
              {environment.location || '—'}
            </Text>
            <Ionicons name="people-outline" size={11} color={currentColors.textMuted} style={{ marginLeft: 6 }} />
            <Text style={[styles.cardMetaTxt, { color: currentColors.textMuted }]}>{environment.capacity} p.</Text>
          </View>
        </View>
        <View style={[styles.statusPill, { backgroundColor: status.bg, borderColor: status.color }]}>
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusTxt, { color: status.color }]}>{status.text}</Text>
        </View>
      </View>

      <View style={[styles.metricsRow, { borderTopColor: currentColors.borderColor }]}>
        {metrics.map((m) => (
          <View key={m.key} style={styles.metricCell}>
            <Text style={styles.metricIcon}>{m.icon}</Text>
            <Text style={[styles.metricValue, { color: currentColors.textPrimary }]}>{m.value}</Text>
            <Text style={[styles.metricLabel, { color: currentColors.textMuted }]}>{m.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.cardActions, { borderTopColor: currentColors.borderColor }]}>
        <TouchableOpacity style={[styles.editBtn, { borderRightColor: currentColors.borderColor }]} onPress={() => onEdit(environment)}>
          <Ionicons name="create-outline" size={14} color={currentColors.accent} />
          <Text style={[styles.editBtnTxt, { color: currentColors.accent }]}>{t('management.editBtn')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(environment.id)}>
          <Ionicons name="trash-outline" size={14} color={currentColors.error} />
          <Text style={[styles.deleteBtnTxt, { color: currentColors.error }]}>{t('management.deleteBtn')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function FilterBar({ vm, currentColors, t }) {
  const sorts = [
    { id: 'name', label: t('management.sortName') },
    { id: 'capacity', label: t('management.sortCapacity') },
    { id: 'status', label: t('management.sortStatus') },
  ]

  return (
    <View style={[styles.filterBar, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      <Text style={[styles.filterBarLabel, { color: currentColors.textMuted }]}>{t('filters.sortLabel')}</Text>
      <View style={styles.sortRow}>
        {sorts.map((sort) => {
          const active = vm.sortBy === sort.id
          return (
            <TouchableOpacity
              key={sort.id}
              style={[
                styles.sortChip,
                { borderColor: currentColors.borderColor, backgroundColor: currentColors.bgCard },
                active && { borderColor: currentColors.accent, backgroundColor: currentColors.accentDim },
              ]}
              onPress={() => vm.setSortBy(sort.id)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: active ? currentColors.accent : currentColors.textSecondary }}>
                {sort.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.capacityRow}>
        <Text style={[styles.filterBarLabel, { color: currentColors.textMuted }]}>{t('management.capacity')}</Text>
        <View style={[styles.capacityInput, { borderColor: currentColors.borderColor, backgroundColor: currentColors.bgInput }]}>
          <Text style={[styles.capacityPrefix, { color: currentColors.textMuted }]}>{t('management.min')}</Text>
          <TextInput
            style={[styles.capacityTextInput, { color: currentColors.textPrimary }]}
            keyboardType="numeric"
            value={vm.minCapacity}
            onChangeText={vm.setMinCapacity}
            placeholder="0"
            placeholderTextColor={currentColors.textMuted}
          />
        </View>
        <View style={[styles.capacityInput, { borderColor: currentColors.borderColor, backgroundColor: currentColors.bgInput }]}>
          <Text style={[styles.capacityPrefix, { color: currentColors.textMuted }]}>{t('management.max')}</Text>
          <TextInput
            style={[styles.capacityTextInput, { color: currentColors.textPrimary }]}
            keyboardType="numeric"
            value={vm.maxCapacity}
            onChangeText={vm.setMaxCapacity}
            placeholder="—"
            placeholderTextColor={currentColors.textMuted}
          />
        </View>
        <TouchableOpacity onPress={() => { vm.setMinCapacity(''); vm.setMaxCapacity(''); vm.setSortBy('name') }}>
          <Text style={[styles.clearTxt, { color: currentColors.accent }]}>{t('filters.clear')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const EMPTY_FORM = { name: '', capacity: '', location: '' }

export default function EnvironmentManagementScreen({ navigation }) {
  const { darkMode, currentColors } = useTheme()
  const { t } = useTranslation()
  const toast = useToast()
  const vm = useManagementVM()
  const sensorVM = useSensorPanelVM()

  const [form, setForm] = useState(EMPTY_FORM)
  const [isEdit, setIsEdit] = useState(false)
  const [tab, setTab] = useState('environments')

  useEffect(() => {
    if (!authService.isAdmin()) {
      Alert.alert(
        t('management.title'),
        t('management.noAdmin', 'No tienes permisos para acceder a esta sección'),
      )
      navigation.replace('DashboardHome')
    }
  }, [navigation, t])

  const openAdd = () => {
    setIsEdit(false)
    setForm(EMPTY_FORM)
    vm.setShowAdd(true)
  }

  const openEdit = (env) => {
    setIsEdit(true)
    setForm({ name: env.name, capacity: String(env.capacity ?? ''), location: env.location || '' })
    vm.setEditEnv(env)
  }

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error(t('management.requiredName', 'El nombre es obligatorio'))
      return
    }
    const data = {
      name: form.name.trim(),
      capacity: Number(form.capacity) || 0,
      location: form.location.trim() || t('management.locationPlaceholder'),
    }
    if (isEdit && vm.editEnv) vm.handleEdit(vm.editEnv.id, data)
    else vm.handleAdd(data)
    toast.success(isEdit ? t('management.edited', 'Ambiente actualizado') : t('management.added', 'Ambiente agregado'))
  }

  const confirmDelete = () => {
    if (!vm.deleteEnv) return
    vm.handleDelete(vm.deleteEnv.id)
    toast.success(t('management.deleted', 'Ambiente eliminado'))
  }

  const hasFilters = Boolean(vm.search) || vm.activeFilter !== 'all' || Boolean(vm.minCapacity) || Boolean(vm.maxCapacity)

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />

      <View
        style={[
          styles.header,
          {
            backgroundColor: currentColors.accent,
            paddingTop: (StatusBar.currentHeight || 0) + 10,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Ionicons name={tab === 'sensors' ? 'hardware-chip-outline' : 'grid-outline'} size={20} color="#fff" />
          <Text style={[styles.headerTitle, { color: '#fff' }]}>
            {tab === 'sensors' ? t('sensors.headerTitle') : t('management.title')}
          </Text>
        </View>

        {tab === 'environments' && (
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: 'rgba(255,255,255,0.25)' }]} onPress={openAdd} activeOpacity={0.85}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={[styles.addBtnTxt, { color: '#fff' }]}>{t('management.addBtn')}</Text>
          </TouchableOpacity>
        )}
        {tab === 'sensors' && (
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: 'rgba(255,255,255,0.25)' }]}
            onPress={() => {
              sensorVM.setForm({ sensorId: '', environmentId: sensorVM.environments[0]?.id ?? '', type: 'temperature', min: '', max: '' })
              sensorVM.setShowAdd(true)
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={[styles.addBtnTxt, { color: '#fff' }]}>{t('sensors.addBtn')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.tabBar, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
        {TABS.map((item) => {
          const active = tab === item.id
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.tabBtn, active && { backgroundColor: currentColors.accentDim, borderColor: currentColors.accent }]}
              onPress={() => {
                if (item.id === 'devices') {
                  navigation.navigate('Devices')
                  return
                }
                setTab(item.id)
              }}
              activeOpacity={0.85}
            >
              <Ionicons name={item.icon} size={15} color={active ? currentColors.accent : currentColors.textMuted} />
              <Text
                style={[styles.tabTxt, { color: active ? currentColors.accent : currentColors.textMuted }]}
              >
                {t(item.key)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {tab === 'sensors' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <SensorVariablePanel />
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.summaryRow}>
            <SummaryCard
              label={t('filterBar.all')} value={vm.stats.total} emoji="🏫"
              accent={currentColors.accent} active={vm.activeFilter === 'all'} onPress={() => vm.setActiveFilter('all')} currentColors={currentColors}
            />
            <SummaryCard
              label={t('status.normal')} value={vm.stats.normals} emoji="✅"
              accent="#4CAF50" active={vm.activeFilter === 'normal'} onPress={() => vm.setActiveFilter('normal')} currentColors={currentColors}
            />
            <SummaryCard
              label={t('status.warning')} value={vm.stats.warnings} emoji="🔔"
              accent="#FFC107" active={vm.activeFilter === 'warning'} onPress={() => vm.setActiveFilter('warning')} currentColors={currentColors}
            />
            <SummaryCard
              label={t('status.alert')} value={vm.stats.alerts} emoji="⚠️"
              accent="#F44336" active={vm.activeFilter === 'alert'} onPress={() => vm.setActiveFilter('alert')} currentColors={currentColors}
            />
          </View>

          <View style={[styles.searchBar, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
            <Ionicons name="search-outline" size={16} color={currentColors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: currentColors.textPrimary }]}
              placeholder={t('filters.searchEnvironment')}
              placeholderTextColor={currentColors.textMuted}
              value={vm.search}
              onChangeText={vm.setSearch}
            />
            {vm.search.length > 0 && (
              <TouchableOpacity onPress={() => vm.setSearch('')}>
                <Ionicons name="close-circle" size={16} color={currentColors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <FilterBar vm={vm} currentColors={currentColors} t={t} />

          <View style={styles.resultsInfo}>
            <Text style={[styles.resultsCount, { color: currentColors.textMuted }]}>
              {t('management.resultsCount')} {vm.filtered.length} {t('management.resultsOf')} {vm.stats.total}{' '}
              {t('management.resultsEnvironments')}
            </Text>
            {hasFilters && (
              <TouchableOpacity
                onPress={() => {
                  vm.setSearch('')
                  vm.setActiveFilter('all')
                  vm.setMinCapacity('')
                  vm.setMaxCapacity('')
                  vm.setSortBy('name')
                }}
              >
                <Text style={[styles.clearTxt, { color: currentColors.accent }]}>{t('filters.clear')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {vm.filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🏫</Text>
              <Text style={[styles.emptyTitle, { color: currentColors.textPrimary }]}>
                {vm.stats.total === 0 ? t('management.noResults') : t('management.noResultsSearch')}
              </Text>
              <Text style={[styles.emptySub, { color: currentColors.textMuted }]}>
                {vm.stats.total === 0 ? t('management.noResultsSub') : t('management.noResultsSearchSub')}
              </Text>
              {vm.stats.total === 0 ? (
                <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: currentColors.accent }]} onPress={openAdd}>
                  <Text style={[styles.emptyBtnTxt, { color: '#fff' }]}>{t('management.addBtn')}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.emptyBtn, { backgroundColor: currentColors.accent }]}
                  onPress={() => {
                    vm.setSearch('')
                    vm.setActiveFilter('all')
                    vm.setMinCapacity('')
                    vm.setMaxCapacity('')
                    vm.setSortBy('name')
                  }}
                >
                  <Text style={[styles.emptyBtnTxt, { color: '#fff' }]}>{t('management.clearSearch')}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : vm.filtered.map((env) => (
            <EnvironmentCard
              key={env.id}
              environment={env}
              currentColors={currentColors}
              onEdit={openEdit}
              onDelete={vm.openDelete}
              t={t}
            />
          ))}

          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      <Modal
        isOpen={vm.showAdd || Boolean(vm.editEnv)}
        onClose={() => { vm.setShowAdd(false); vm.setEditEnv(null) }}
        title={isEdit ? t('management.editTitle') : t('management.addTitle')}
      >
        <Input
          label={t('management.nameLabel')}
          value={form.name}
          onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
          placeholder={t('management.namePlaceholder')}
        />
        <Input
          label={t('management.capacityLabel')}
          value={form.capacity}
          onChangeText={(v) => setForm((p) => ({ ...p, capacity: v }))}
          placeholder={t('management.capacityPlaceholder')}
          keyboardType="numeric"
        />
        <Input
          label={t('management.locationLabel')}
          value={form.location}
          onChangeText={(v) => setForm((p) => ({ ...p, location: v }))}
          placeholder={t('management.locationPlaceholder')}
        />
        <View style={styles.modalActions}>
          <Button variant="outline" onPress={() => { vm.setShowAdd(false); vm.setEditEnv(null) }}>
            {t('management.cancelBtn')}
          </Button>
          <Button onPress={handleSave}>
            {isEdit ? t('management.saveBtn') : t('management.addConfirmBtn')}
          </Button>
        </View>
      </Modal>

      <Modal
        isOpen={Boolean(vm.deleteEnv)}
        onClose={() => vm.setDeleteEnv(null)}
        title={t('management.deleteTitle')}
        size="sm"
      >
        <Text style={[styles.deleteMsg, { color: currentColors.textSecondary }]}>
          {t('management.deleteMsg', { name: vm.deleteEnv?.name })}
        </Text>
        <View style={styles.modalActions}>
          <Button variant="outline" onPress={() => vm.setDeleteEnv(null)}>
            {t('management.cancelBtn')}
          </Button>
          <Button variant="danger" onPress={confirmDelete}>
            {t('management.deleteBtn')}
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
