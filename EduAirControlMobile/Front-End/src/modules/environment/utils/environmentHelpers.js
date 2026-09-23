/**
 * Helpers compartidos de ambiente.
 * Lógica pura — sin hooks, sin estado React.
 */

import calculateEnvironmentScore from './calculateEnvironmentScore'

export const calcScore = calculateEnvironmentScore

export function getMetricColor(key, value) {
  if (key === 'temp') return value > 25 ? '#f85149' : value > 23 ? '#d29922' : '#3fb950'
  if (key === 'humidity') return value > 65 ? '#f85149' : value < 35 ? '#d29922' : '#3fb950'
  if (key === 'co2') return value > 1200 ? '#f85149' : value > 1000 ? '#d29922' : '#3fb950'
  if (key === 'noise') return value > 60 ? '#d29922' : '#3fb950'
  return '#3fb950'
}

export function getDisplayName(env, t) {
  return env.nameKey ? t(env.nameKey) : env.name || ''
}