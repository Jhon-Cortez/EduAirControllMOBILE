import { Ionicons } from '@expo/vector-icons'

// Mapa entre los iconKey de METRIC_DEFINITIONS y los Ionicons de la plataforma móvil.
export const METRIC_ICONS = {
  temp: 'thermometer-outline',
  humidity: 'water-outline',
  co2: 'cloud-outline',
  noise: 'volume-medium-outline',
}

export function getMetricIcon(key, size = 18, color = '#888') {
  return <Ionicons name={METRIC_ICONS[key] || 'help-circle-outline'} size={size} color={color} />
}