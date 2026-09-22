import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEnvironments } from '../../../context/EnvironmentContext'

const THRESHOLDS = {
  co2High: 1000,
  tempHigh: 28,
  noiseHigh: 70,
  humidityMin: 30,
  humidityMax: 70,
}

export function useNotificationsVM() {
  const { environments } = useEnvironments()
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [readIds, setReadIds] = useState(new Set())

  const allNotifications = useMemo(() => {
    const list = []
    let alerts = 0
    let warnings = 0

    ;(environments || []).forEach((env) => {
      if (env.co2 > THRESHOLDS.co2High) {
        alerts++
        list.push({
          id: `co2-${env.id}`,
          type: 'danger',
          title: t('notifications.co2High'),
          message: t('notifications.co2Message', { name: env.name, value: env.co2 }),
          envId: env.id,
          time: new Date(),
        })
      }

      if (env.temp > THRESHOLDS.tempHigh) {
        alerts++
        list.push({
          id: `temp-${env.id}`,
          type: 'danger',
          title: t('notifications.tempHigh'),
          message: t('notifications.tempMessage', { name: env.name, value: env.temp }),
          envId: env.id,
          time: new Date(),
        })
      }

      if (env.noise > THRESHOLDS.noiseHigh) {
        warnings++
        list.push({
          id: `noise-${env.id}`,
          type: 'warning',
          title: t('notifications.warning'),
          message: t('notifications.warningMessage', { name: env.name }),
          envId: env.id,
          time: new Date(),
        })
      }

      if (env.humidity < THRESHOLDS.humidityMin || env.humidity > THRESHOLDS.humidityMax) {
        warnings++
        list.push({
          id: `hum-${env.id}`,
          type: 'warning',
          title: t('notifications.warning'),
          message: t('notifications.warningMessage', { name: env.name }),
          envId: env.id,
          time: new Date(),
        })
      }
    })

    list.push({
      id: 'summary',
      type: 'info',
      title: t('notifications.dailySummary'),
      message: t('notifications.summaryMessage', {
        alerts,
        warnings,
        count: (environments || []).length,
      }),
      envId: null,
      time: new Date(),
    })

    return list
  }, [environments, t])

  const filtered = useMemo(() => {
    if (filter === 'all') return allNotifications
    return allNotifications.filter((n) => n.type === filter)
  }, [filter, allNotifications])

  const unreadCount = allNotifications.filter((n) => n.type === 'danger' && !readIds.has(n.id)).length

  const markAllRead = () => {
    setReadIds(new Set(allNotifications.map((n) => n.id)))
  }

  return {
    all: allNotifications,
    notifications: filtered,
    unreadCount,
    filter,
    setFilter,
    markAllRead,
  }
}

export default useNotificationsVM