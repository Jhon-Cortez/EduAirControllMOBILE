import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../../context/ThemeContext.jsx'
import { useTranslation } from 'react-i18next'
import { useSensorPanelVM } from '../../viewmodels/useSensorPanelVM.js'
import { VARIABLE_META, TONE_COLORS } from '../../services/sensorService.js'
import Modal from '../../../../shared/components/Modal/Modal.jsx'
import Input from '../../../../shared/components/Input/Input.jsx'
import Button from '../../../../shared/components/Button/Button.jsx'
import { useToast } from '../../../../shared/components/Toast/Toast.jsx'
import { styles } from './SensorVariablePanel.styles'

const STATUS_META = {
  active: { key: 'sensors.statusActive', color: 'success' },
  warning: { key: 'sensors.statusWarning', color: 'warning' },
  offline: { key: 'sensors.statusOffline', color: 'error' },
}

function Chip({ label, active, color, onPress, currentColors }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { borderColor: currentColors.borderColor, backgroundColor: currentColors.bgCard },
        active && { borderColor: color, backgroundColor: currentColors.accent === color ? currentColors.accentDim : `${color}1F` },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: 11.5, fontWeight: '700', color: active ? color : currentColors.textSecondary }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

function SummaryCell({ label, value, color, currentColors }) {
  return (
    <View style={[styles.summaryCell, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={[styles.summaryLabel, { color: currentColors.textMuted }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  )
}

export default function SensorVariablePanel() {
  const { currentColors: c } = useTheme()
  const { t } = useTranslation()
  const toast = useToast()
  const vm = useSensorPanelVM()

  const openAdd = () => {
    vm.setForm({
      sensorId: '',
      environmentId: vm.environments[0]?.id ?? '',
      type: 'temperature',
      min: '',
      max: '',
    })
    vm.setShowAdd(true)
  }

  const submitAdd = async () => {
    if (!String(vm.form.sensorId).trim()) {
      toast.error(t('sensors.requiredId'))
      return
    }
    if (!vm.form.environmentId) {
      toast.error(t('sensors.requiredEnvironment'))
      return
    }
    try {
      await vm.addSensor(vm.form)
      toast.success(t('sensors.added'))
    } catch (e) {
      toast.error(e.message)
    }
  }

  const submitEdit = async () => {
    if (!String(vm.editing.min).toString().trim() || !String(vm.editing.max).toString().trim()) {
      toast.error(t('sensors.requiredId'))
      return
    }
    try {
      await vm.saveSensor(vm.editing)
      toast.success(t('sensors.updated'))
    } catch (e) {
      toast.error(e.message)
    }
  }

  const doToggle = async (sensor) => {
    try {
      await vm.toggleSensor(sensor)
      toast.success(t('sensors.toggleDone'))
    } catch (e) {
      toast.error(e.message)
    }
  }

  const renderSensorCard = (sensor) => {
    const meta = VARIABLE_META[sensor.type] || {}
    const toneColor = TONE_COLORS[meta.tone] || c.accent
    const status = STATUS_META[sensor.status] || STATUS_META.active
    const statusColor = c[status.color]
    const reading = vm.getReading(sensor)

    return (
      <View key={sensor.id} style={[styles.sensorCard, { backgroundColor: c.bgCard, borderColor: c.borderColor, borderLeftColor: statusColor }]}>
        <View style={styles.sensorTop}>
          <View style={[styles.sensorIcon, { backgroundColor: `${toneColor}1F` }]}>
            <Ionicons name={meta.icon || 'hardware-chip-outline'} size={18} color={toneColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sensorId, { color: c.textPrimary }]} numberOfLines={1}>{sensor.sensorId}</Text>
            <Text style={[styles.sensorSync, { color: c.textMuted }]}>
              {sensor.lastSync ? t('sensors.synced', { time: sensor.lastSync }) : t('sensors.syncNow')}
            </Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: `${statusColor}1F`, borderColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{t(status.key)}</Text>
          </View>
        </View>

        <View style={styles.sensorGrid}>
          <View style={styles.sensorCell}>
            <Text style={[styles.cellLabel, { color: c.textMuted }]}>{t('sensors.colVariable')}</Text>
            <Text style={[styles.cellValue, { color: c.textPrimary }]}>
              {t(meta.labelKey)} <Text style={{ color: c.textMuted, fontSize: 11 }}>· {meta.unit}</Text>
            </Text>
          </View>
          <View style={styles.sensorCell}>
            <Text style={[styles.cellLabel, { color: c.textMuted }]}>{t('sensors.colEnvironment')}</Text>
            <Text style={[styles.cellValue, { color: c.textPrimary }]} numberOfLines={1}>
              {vm.getEnvironmentName(sensor.environmentId)}
            </Text>
          </View>
          <View style={styles.sensorCell}>
            <Text style={[styles.cellLabel, { color: c.textMuted }]}>{t('sensors.colReading')}</Text>
            <Text style={[styles.cellValue, { color: toneColor }]}>
              {reading ?? '—'} {meta.unit}
            </Text>
          </View>
          <View style={styles.sensorCell}>
            <Text style={[styles.cellLabel, { color: c.textMuted }]}>{t('sensors.colRange')}</Text>
            <Text style={[styles.cellValue, { color: c.textPrimary }]}>
              {sensor.min} – {sensor.max} {meta.unit}
            </Text>
          </View>
        </View>

        <View style={[styles.sensorActions, { borderTopColor: c.borderColor }]}>
          <TouchableOpacity style={styles.sensorActionBtn} onPress={() => vm.setEditing({ ...sensor })}>
            <Ionicons name="create-outline" size={15} color={c.accent} />
            <Text style={[styles.sensorActionTxt, { color: c.accent }]}>{t('sensors.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sensorActionBtn} onPress={() => doToggle(sensor)}>
            <Ionicons name="power-outline" size={15} color={sensor.status === 'offline' ? c.success : c.error} />
            <Text style={[styles.sensorActionTxt, { color: sensor.status === 'offline' ? c.success : c.error }]}>
              {sensor.status === 'offline' ? t('sensors.toggleOn') : t('sensors.toggleOff')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const hasFilters = vm.search.length > 0 || vm.statusFilter !== 'all' || vm.variableFilter !== 'all'

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.kicker, { color: c.accent }]}>{t('sensors.eyebrow')}</Text>
          <Text style={[styles.title, { color: c.textPrimary }]}>{t('sensors.title')}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{t('sensors.subtitle')}</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <SummaryCell label={t('sensors.summaryTotal')} value={vm.summary.total} color={c.textPrimary} currentColors={c} />
        <SummaryCell label={t('sensors.summaryActive')} value={vm.summary.active} color={c.success} currentColors={c} />
        <SummaryCell label={t('sensors.summaryWarning')} value={vm.summary.warning} color={c.warning} currentColors={c} />
        <SummaryCell label={t('sensors.summaryOffline')} value={vm.summary.offline} color={c.error} currentColors={c} />
      </View>

      <View style={[styles.searchBar, { backgroundColor: c.bgCard, borderColor: c.borderColor }]}>
        <Ionicons name="search-outline" size={16} color={c.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: c.textPrimary }]}
          placeholder={t('sensors.searchPlaceholder')}
          placeholderTextColor={c.textMuted}
          value={vm.search}
          onChangeText={vm.setSearch}
        />
        {vm.search.length > 0 && (
          <TouchableOpacity onPress={() => vm.setSearch('')}>
            <Ionicons name="close-circle" size={16} color={c.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.filterLabel, { color: c.textMuted }]}>{t('sensors.variableLabel')}</Text>
      <View style={styles.chipRow}>
        <Chip label={t('sensors.filterAllVariables')} active={vm.variableFilter === 'all'} color={c.accent} onPress={() => vm.setVariableFilter('all')} currentColors={c} />
        {Object.entries(VARIABLE_META).map(([key, meta]) => (
          <Chip
            key={key}
            label={t(meta.labelKey)}
            active={vm.variableFilter === key}
            color={TONE_COLORS[meta.tone]}
            onPress={() => vm.setVariableFilter(key)}
            currentColors={c}
          />
        ))}
      </View>

      <View style={styles.chipRow}>
        <Chip label={t('sensors.filterAllStatuses')} active={vm.statusFilter === 'all'} color={c.accent} onPress={() => vm.setStatusFilter('all')} currentColors={c} />
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <Chip
            key={key}
            label={t(meta.key)}
            active={vm.statusFilter === key}
            color={c[meta.color]}
            onPress={() => vm.setStatusFilter(key)}
            currentColors={c}
          />
        ))}
      </View>

      {vm.loading ? (
        <ActivityIndicator style={{ marginVertical: 30 }} color={c.accent} />
      ) : vm.error ? (
        <View style={[styles.empty, { backgroundColor: c.bgCard, borderColor: c.borderColor }]}>
          <Ionicons name="cloud-offline-outline" size={26} color={c.error} />
          <Text style={[styles.emptyTitle, { color: c.textPrimary }]}>{vm.error}</Text>
          <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: c.accent }]} onPress={vm.reload}>
            <Text style={styles.emptyBtnTxt}>{t('management.clearSearch')}</Text>
          </TouchableOpacity>
        </View>
      ) : vm.filtered.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: c.bgCard, borderColor: c.borderColor }]}>
          <Ionicons name="hardware-chip-outline" size={26} color={c.textMuted} />
          <Text style={[styles.emptyTitle, { color: c.textPrimary }]}>{t('sensors.empty')}</Text>
          {hasFilters && (
            <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: c.accent }]} onPress={vm.resetFilters}>
              <Text style={styles.emptyBtnTxt}>{t('filters.clear')}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        vm.filtered.map(renderSensorCard)
      )}

      <View style={[styles.variablesCard, { backgroundColor: c.bgCard, borderColor: c.borderColor }]}>
        <Text style={[styles.kicker, { color: c.accent }]}>{t('sensors.monitored')}</Text>
        <Text style={[styles.subtitle, { color: c.textPrimary, marginTop: 2 }]}>{t('sensors.monitoredHint')}</Text>
        <View style={styles.chipRow}>
          {Object.entries(VARIABLE_META).map(([key, meta]) => {
            const tone = TONE_COLORS[meta.tone]
            return (
              <View key={key} style={[styles.varChip, { borderColor: `${tone}55`, backgroundColor: `${tone}14` }]}>
                <Ionicons name={meta.icon} size={16} color={tone} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.varChipTitle, { color: c.textPrimary }]}>{t(meta.labelKey)}</Text>
                  <Text style={[styles.varChipSub, { color: c.textMuted }]}>{t('sensors.unitRange', { unit: meta.unit })}</Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>

      <Modal isOpen={vm.showAdd} onClose={() => vm.setShowAdd(false)} title={t('sensors.addTitle')}>
        <Text style={[styles.modalHint, { color: c.textMuted }]}>{t('sensors.newDevice')}</Text>
        <Input
          label={t('sensors.idLabel')}
          value={vm.form.sensorId}
          onChangeText={(v) => vm.setForm((p) => ({ ...p, sensorId: v }))}
          placeholder={t('sensors.idPlaceholder')}
          autoCapitalize="characters"
        />
        <Text style={[styles.fieldLabel, { color: c.textMuted }]}>{t('sensors.envLabel')}</Text>
        <View style={styles.chipRow}>
          {vm.environments.map((env) => (
            <Chip
              key={env.id}
              label={env.nameKey ? t(env.nameKey) : env.name}
              active={Number(vm.form.environmentId) === Number(env.id)}
              color={c.accent}
              onPress={() => vm.setForm((p) => ({ ...p, environmentId: env.id }))}
              currentColors={c}
            />
          ))}
        </View>
        <Text style={[styles.fieldLabel, { color: c.textMuted }]}>{t('sensors.variableLabel')}</Text>
        <View style={styles.chipRow}>
          {Object.entries(VARIABLE_META).map(([key, meta]) => (
            <Chip
              key={key}
              label={`${t(meta.labelKey)} (${meta.unit})`}
              active={vm.form.type === key}
              color={TONE_COLORS[meta.tone]}
              onPress={() => vm.setForm((p) => ({ ...p, type: key }))}
              currentColors={c}
            />
          ))}
        </View>
        <View style={styles.modalActions}>
          <Button variant="outline" onPress={() => vm.setShowAdd(false)}>{t('sensors.cancelBtn')}</Button>
          <Button onPress={submitAdd}>{t('sensors.saveSensor')}</Button>
        </View>
      </Modal>

      <Modal isOpen={Boolean(vm.editing)} onClose={() => vm.setEditing(null)} title={t('sensors.editTitle')} size="sm">
        {vm.editing && (
          <>
            <Text style={[styles.modalHint, { color: c.textPrimary, fontWeight: '800' }]}>{vm.editing.sensorId}</Text>
            <Text style={[styles.modalHint, { color: c.textMuted, marginTop: 4 }]}>{t('sensors.editSubtitle')}</Text>
            <Text style={[styles.fieldLabel, { color: c.textMuted, marginTop: 14 }]}>{t('sensors.variableLabel')}</Text>
            <View style={styles.chipRow}>
              {Object.entries(VARIABLE_META).map(([key, meta]) => (
                <Chip
                  key={key}
                  label={`${t(meta.labelKey)} (${meta.unit})`}
                  active={vm.editing.type === key}
                  color={TONE_COLORS[meta.tone]}
                  onPress={() => vm.setEditing((p) => ({ ...p, type: key }))}
                  currentColors={c}
                />
              ))}
            </View>
            <View style={styles.rangeRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label={t('sensors.minLabel')}
                  value={String(vm.editing.min ?? '')}
                  onChangeText={(v) => vm.setEditing((p) => ({ ...p, min: v }))}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label={t('sensors.maxLabel')}
                  value={String(vm.editing.max ?? '')}
                  onChangeText={(v) => vm.setEditing((p) => ({ ...p, max: v }))}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.modalActions}>
              <Button variant="outline" onPress={() => vm.setEditing(null)}>{t('sensors.cancelBtn')}</Button>
              <Button onPress={submitEdit}>{t('sensors.saveChanges')}</Button>
            </View>
          </>
        )}
      </Modal>
    </View>
  )
}
