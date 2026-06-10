import { useMemo } from 'react'
import { useEnvironments } from '../context/EnvironmentsContext'
import { useLanguage } from '../context/LanguageContext'

export function useNotifications() {
  const { environments } = useEnvironments()
  const { t } = useLanguage()

  const notifications = useMemo(() => {
    const list = []
    let alerts = 0
    let warnings = 0

    environments.forEach((env) => {
      if (env.co2 > 1000) {
        alerts++
        list.push({
          id: `co2-${env.id}`,
          type: 'danger',
          title: t('notifications.highCo2'),
          message: `${env.name}: ${env.co2} ppm (${t('notifications.maxRecommended')}: 1000 ppm)`,
          envId: env.id,
          time: new Date(),
        })
      }

      if (env.temp > 28) {
        alerts++
        list.push({
          id: `temp-${env.id}`,
          type: 'danger',
          title: t('notifications.highTemp'),
          message: `${env.name}: ${env.temp}C (${t('notifications.maxRecommended')}: 24C)`,
          envId: env.id,
          time: new Date(),
        })
      }

      if (env.noise > 70) {
        warnings++
        list.push({
          id: `noise-${env.id}`,
          type: 'warning',
          title: t('notifications.highNoise'),
          message: `${env.name}: ${env.noise} dB (${t('notifications.maxRecommended')}: 50 dB)`,
          envId: env.id,
          time: new Date(),
        })
      }

      if (env.humidity < 30 || env.humidity > 70) {
        warnings++
        list.push({
          id: `hum-${env.id}`,
          type: 'warning',
          title: t('notifications.humidityOut'),
          message: `${env.name}: ${env.humidity}% (ideal: 40-60%)`,
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
        count: environments.length,
      }),
      envId: null,
      time: new Date(),
    })

    return list
  }, [environments, t])

  const unreadCount = notifications.filter((n) => n.type === 'danger').length

  return { notifications, unreadCount }
}
