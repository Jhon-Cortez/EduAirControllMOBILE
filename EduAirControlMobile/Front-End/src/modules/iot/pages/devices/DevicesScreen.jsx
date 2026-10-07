import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../../context/ThemeContext.jsx'
import { useTranslation } from 'react-i18next'
import { useDevicesVM } from '../../viewmodels/useDevicesVM.js'
import Modal from '../../../../shared/components/Modal/Modal.jsx'
import Input from '../../../../shared/components/Input/Input.jsx'
import Button from '../../../../shared/components/Button/Button.jsx'
import { useToast } from '../../../../shared/components/Toast/Toast.jsx'
import { styles } from './DevicesScreen.styles'

const STATUS_META = {
  conectado: { key: 'devices.status.connected', color: 'success' },
  pendiente: { key: 'devices.status.pending', color: 'warning' },
  offline: { key: 'devices.status.offline', color: 'textMuted' },
  error: { key: 'devices.status.error', color: 'error' },
}

const TYPES = ['esp32', 'esp32s3', 'esp8266', 'otro']

function Chip({ label, active, color, onPress, currentColors }) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { borderColor: currentColors.borderColor, backgroundColor: currentColors.bgCard },
        active && { borderColor: color, backgroundColor: `${color}1F` },
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

function StatCell({ label, value, color, currentColors }) {
  return (
    <View style={[styles.statCell, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: currentColors.textMuted }]} numberOfLines={1}>{label}</Text>
    </View>
  )
}

export default function DevicesScreen({ navigation }) {
  const { darkMode, currentColors: c } = useTheme()
  const { t } = useTranslation()
  const toast = useToast()
  const vm = useDevicesVM()
  const [saving, setSaving] = useState(false)

  const openAdd = () => {
    vm.setForm({ macAddress: '', nombre: '', tipo: 'esp32', idAula: '' })
    vm.setShowAdd(true)
  }

  const submitAdd = async () => {
    if (!vm.form.macAddress.trim()) {
      toast.error(t('devices.errors.mac'))
      return
    }
    setSaving(true)
    try {
      await vm.addDevice({
        macAddress: vm.form.macAddress.trim().toUpperCase(),
        nombre: vm.form.nombre.trim() || null,
        tipo: vm.form.tipo,
        idAula: vm.form.idAula ? Number(vm.form.idAula) : null,
        estado: 'pendiente',
      })
      toast.success(t('devices.added'))
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!vm.deleteTarget) return
    try {
      await vm.removeDevice(vm.deleteTarget)
      toast.success(t('devices.deleted'))
    } catch (e) {
      toast.error(e.message)
    }
  }

  const statusOf = (device) => STATUS_META[device.estado] || STATUS_META.pendiente

  const hasFilters = Boolean(vm.search) || vm.statusFilter !== 'all'

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={c.bgBody} />

      <View
        style={[
          styles.header,
          {
            backgroundColor: c.accent,
            paddingTop: (StatusBar.currentHeight || 0) + 10,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#fff' }]}>{t('devices.title')}</Text>
        <TouchableOpacity style={[styles.addBtn, { backgroundColor: 'rgba(255,255,255,0.25)' }]} onPress={openAdd} activeOpacity={0.85}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12.5, fontWeight: '700' }}>{t('management.addBtn')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[styles.intro, { color: c.textSecondary }]}>{t('devices.subtitle')}</Text>

        <View style={styles.statRow}>
          <StatCell label={t('devices.summaryTotal')} value={vm.stats.total} color={c.textPrimary} currentColors={c} />
          <StatCell label={t('devices.summaryConnected')} value={vm.stats.connected} color={c.success} currentColors={c} />
          <StatCell label={t('devices.summaryPending')} value={vm.stats.pending} color={c.warning} currentColors={c} />
          <StatCell label={t('devices.summaryOffline')} value={vm.stats.offline} color={c.error} currentColors={c} />
        </View>

        <View style={[styles.searchBar, { backgroundColor: c.bgCard, borderColor: c.borderColor }]}>
          <Ionicons name="search-outline" size={16} color={c.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: c.textPrimary }]}
            placeholder={t('devices.searchPlaceholder')}
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

        <View style={styles.chipRow}>
          <Chip label={t('filters.all')} active={vm.statusFilter === 'all'} color={c.accent} onPress={() => vm.setStatusFilter('all')} currentColors={c} />
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <Chip
              key={key}
              label={t(meta.key)}
              active={vm.statusFilter === key}
              color={meta.color === 'textMuted' ? c.textMuted : c[meta.color]}
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
              <Text style={styles.emptyBtnTxt}>{t('devices.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : vm.filtered.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: c.bgCard, borderColor: c.borderColor }]}>
            <Ionicons name="hardware-chip-outline" size={26} color={c.textMuted} />
            <Text style={[styles.emptyTitle, { color: c.textPrimary }]}>
              {vm.devices.length === 0 ? t('devices.empty') : t('devices.emptyFiltered')}
            </Text>
            <View style={styles.chipRow}>
              {hasFilters && (
                <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: c.accent }]} onPress={vm.resetFilters}>
                  <Text style={styles.emptyBtnTxt}>{t('filters.clear')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: c.accent }]} onPress={openAdd}>
                <Text style={styles.emptyBtnTxt}>{t('devices.addBtn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          vm.filtered.map((device) => {
            const status = statusOf(device)
            const statusColor = status.color === 'textMuted' ? c.textMuted : c[status.color]
            return (
              <View key={device.id} style={[styles.card, { backgroundColor: c.bgCard, borderColor: c.borderColor, borderLeftColor: statusColor }]}>
                <View style={styles.cardTop}>
                  <View style={[styles.cardIcon, { backgroundColor: `${statusColor}1F` }]}>
                    <Ionicons name="hardware-chip-outline" size={18} color={statusColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.mac, { color: c.textPrimary }]} numberOfLines={1}>{device.macAddress}</Text>
                    <Text style={[styles.deviceName, { color: c.textMuted }]} numberOfLines={1}>
                      {device.nombre || t('devices.noName')} · {device.tipo}
                    </Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: `${statusColor}1F`, borderColor: statusColor }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>{t(status.key)}</Text>
                  </View>
                </View>

                <View style={styles.cardMeta}>
                  <Ionicons name="wifi-outline" size={13} color={c.textMuted} />
                  <Text style={[styles.cardMetaTxt, { color: c.textMuted }]}>
                    {device.ssid || t('devices.noSsid')}
                  </Text>
                  {device.firmwareVersion ? (
                    <Text style={[styles.cardMetaTxt, { color: c.textMuted }]}>· v{device.firmwareVersion}</Text>
                  ) : null}
                </View>

                <View style={[styles.cardActions, { borderTopColor: c.borderColor }]}>
                  <TouchableOpacity
                    style={[styles.primaryAction, { backgroundColor: c.accentDim }]}
                    onPress={() => navigation.navigate('Provisioning', { device })}
                  >
                    <Ionicons name="bluetooth-outline" size={15} color={c.accent} />
                    <Text style={[styles.primaryActionTxt, { color: c.accent }]}>{t('devices.provisionBtn')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconAction} onPress={() => vm.setDeleteTarget(device)}>
                    <Ionicons name="trash-outline" size={16} color={c.error} />
                  </TouchableOpacity>
                </View>
              </View>
            )
          })
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      <Modal isOpen={vm.showAdd} onClose={() => vm.setShowAdd(false)} title={t('devices.addTitle')}>
        <Input
          label={t('devices.macLabel')}
          value={vm.form.macAddress}
          onChangeText={(v) => vm.setForm((p) => ({ ...p, macAddress: v }))}
          placeholder={t('devices.macPlaceholder')}
          autoCapitalize="characters"
        />
        <Input
          label={t('devices.nameLabel')}
          value={vm.form.nombre}
          onChangeText={(v) => vm.setForm((p) => ({ ...p, nombre: v }))}
          placeholder={t('devices.namePlaceholder')}
        />
        <Text style={[styles.fieldLabel, { color: c.textMuted }]}>{t('devices.typeLabel')}</Text>
        <View style={styles.chipRow}>
          {TYPES.map((type) => (
            <Chip
              key={type}
              label={type}
              active={vm.form.tipo === type}
              color={c.accent}
              onPress={() => vm.setForm((p) => ({ ...p, tipo: type }))}
              currentColors={c}
            />
          ))}
        </View>
        <View style={styles.modalActions}>
          <Button variant="outline" onPress={() => vm.setShowAdd(false)}>{t('common.cancel', 'Cancelar')}</Button>
          <Button onPress={submitAdd} loading={saving}>{t('devices.saveBtn')}</Button>
        </View>
      </Modal>

      <Modal isOpen={Boolean(vm.deleteTarget)} onClose={() => vm.setDeleteTarget(null)} title={t('devices.deleteTitle')} size="sm">
        <Text style={[styles.deleteMsg, { color: c.textSecondary }]}>
          {t('devices.deleteMsg', { mac: vm.deleteTarget?.macAddress })}
        </Text>
        <View style={styles.modalActions}>
          <Button variant="outline" onPress={() => vm.setDeleteTarget(null)}>{t('common.cancel', 'Cancelar')}</Button>
          <Button variant="danger" onPress={confirmDelete}>{t('common.delete', 'Eliminar')}</Button>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
