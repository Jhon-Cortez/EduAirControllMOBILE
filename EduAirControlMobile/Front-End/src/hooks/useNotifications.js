/**
 * useNotifications — móvil
 * Equivalente a hooks/useNotifications.js de la web.
 * Genera notificaciones derivadas del estado de ambientes.
 */
import { useMemo } from 'react'
import { useEnvironments } from '../context/EnvironmentsContext'

export function useNotifications() {
  const { environments } = useEnvironments()

  const notifications = useMemo(() => {
    const list = []
    let alerts   = 0
    let warnings = 0

    environments.forEach((env) => {
      // CO2 alto
      if (env.co2 > 1000) {
        alerts++
        list.push({
          id:      `co2-${env.id}`,
          type:    'danger',
          title:   'CO₂ elevado',
          message: `${env.name}: ${env.co2} ppm (máx recomendado: 1000 ppm)`,
          envId:   env.id,
          time:    new Date(),
        })
      }

      // Temperatura alta
      if (env.temp > 28) {
        alerts++
        list.push({
          id:      `temp-${env.id}`,
          type:    'danger',
          title:   'Temperatura alta',
          message: `${env.name}: ${env.temp}°C (máx recomendado: 24°C)`,
          envId:   env.id,
          time:    new Date(),
        })
      }

      // Ruido alto
      if (env.noise > 70) {
        warnings++
        list.push({
          id:      `noise-${env.id}`,
          type:    'warning',
          title:   'Ruido elevado',
          message: `${env.name}: ${env.noise} dB (máx recomendado: 50 dB)`,
          envId:   env.id,
          time:    new Date(),
        })
      }

      // Humedad fuera de rango
      if (env.humidity < 30 || env.humidity > 70) {
        warnings++
        list.push({
          id:      `hum-${env.id}`,
          type:    'warning',
          title:   'Humedad fuera de rango',
          message: `${env.name}: ${env.humidity}% (ideal: 40–60%)`,
          envId:   env.id,
          time:    new Date(),
        })
      }
    })

    // Resumen diario
    list.push({
      id:      'summary',
      type:    'info',
      title:   'Resumen del día',
      message: `${alerts} alertas · ${warnings} advertencias en ${environments.length} ambientes`,
      envId:   null,
      time:    new Date(),
    })

    return list
  }, [environments])

  const unreadCount = notifications.filter((n) => n.type === 'danger').length

  return { notifications, unreadCount }
}
