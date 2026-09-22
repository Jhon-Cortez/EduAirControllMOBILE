/**
 * Lista de métricas de un ambiente.
 * Cada una define su ícono (por nombre, mapeado a la paleta de
 * iconos de cada plataforma en shared/constants/iconMap), su texto
 * y cómo leer el valor desde el objeto "environment".
 *
 * Así cualquier componente puede mostrar temperatura, humedad, CO2
 * y ruido recorriendo este arreglo sin repetir JSX.
 */

export const METRIC_DEFINITIONS = [
  {
    key: 'temp',
    statusType: 'temp',
    iconKey: 'temp',
    labelKey: 'dashboard.temperature',
    getValue: (env) => `${env.temp} °C`,
    getRaw: (env) => env.temp,
  },
  {
    key: 'humidity',
    statusType: 'humidity',
    iconKey: 'humidity',
    labelKey: 'dashboard.humidity',
    getValue: (env) => `${env.humidity}%`,
    getRaw: (env) => env.humidity,
  },
  {
    key: 'co2',
    statusType: 'co2',
    iconKey: 'co2',
    labelKey: 'allEnvironments.co2',
    getValue: (env) => `${env.co2} ppm`,
    getRaw: (env) => env.co2,
  },
  {
    key: 'noise',
    statusType: 'noise',
    iconKey: 'noise',
    labelKey: 'dashboard.noise',
    getValue: (env) => `${env.noise} dB`,
    getRaw: (env) => env.noise,
  },
]

export default METRIC_DEFINITIONS