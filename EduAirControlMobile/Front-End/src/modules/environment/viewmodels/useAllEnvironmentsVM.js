import { useMemo, useState } from 'react'
import { useEnvironments } from '../../../context/EnvironmentContext'
import calculateEnvironmentScore from '../utils/calculateEnvironmentScore'

const STATUS_TO_KEY = {
  'dashboard.statusNormal': 'normal',
  'dashboard.statusWarning': 'warning',
  'dashboard.statusAlert': 'alert',
}

function getStatusKey(env) {
  return STATUS_TO_KEY[env.statusKey] || 'normal'
}

const INITIAL_FILTERS = {
  name: '',
  status: 'all',
  favorite: 'all',
  capacity: 'all',
  sortBy: 'name',
}

export function useAllEnvironmentsVM() {
  const { environments } = useEnvironments()

  const [filters, setFilters] = useState(INITIAL_FILTERS)

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const clearFilters = () => setFilters(INITIAL_FILTERS)

  const filtered = useMemo(() => {
    const q = filters.name.trim().toLowerCase()
    return environments
      .filter((env) => {
        const envStatus = getStatusKey(env)
        const cap = Number(env.capacity) || 0
        const matchSearch = !q || env.name.toLowerCase().includes(q) || String(env.location || '').toLowerCase().includes(q)
        const matchStatus = filters.status === 'all' || filters.status === envStatus
        const matchFavorite = filters.favorite === 'all' || env.isFavorite
        const matchCapacity =
          filters.capacity === 'all'
          || (filters.capacity === 'small' && cap <= 30)
          || (filters.capacity === 'medium' && cap > 30 && cap <= 50)
          || (filters.capacity === 'large' && cap > 50)
        return matchSearch && matchStatus && matchFavorite && matchCapacity
      })
      .sort((a, b) => {
        if (filters.sortBy === 'score') return calculateEnvironmentScore(b) - calculateEnvironmentScore(a)
        if (filters.sortBy === 'capacity') return (Number(b.capacity) || 0) - (Number(a.capacity) || 0)
        return a.name.localeCompare(b.name)
      })
  }, [environments, filters])

  const counts = useMemo(
    () => ({
      total: environments.length,
      favorites: environments.filter((e) => e.isFavorite).length,
      normal: environments.filter((e) => getStatusKey(e) === 'normal').length,
      warning: environments.filter((e) => getStatusKey(e) === 'warning').length,
      alert: environments.filter((e) => getStatusKey(e) === 'alert').length,
    }),
    [environments]
  )

  const activeCount = useMemo(
    () => [filters.status !== 'all', filters.favorite !== 'all', filters.capacity !== 'all', filters.sortBy !== 'name'].filter(Boolean).length,
    [filters]
  )

  return {
    environments,
    filtered,
    filters,
    setFilter,
    clearFilters,
    counts,
    activeCount,
  }
}

export default useAllEnvironmentsVM