/**
 * ViewModel: useManagementVM
 * Lógica de la pantalla de gestión de ambientes.
 * Incluye filtrado por estado, búsqueda y ordenamiento.
 */

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useEnvironments } from '../../../context/EnvironmentContext'

export function useManagementVM() {
  const { t } = useTranslation()
  const { environments, addEnvironment, editEnvironment, deleteEnvironment } = useEnvironments()

  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editEnv, setEditEnv] = useState(null)
  const [deleteEnv, setDeleteEnv] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = useMemo(() => {
    // 1. Text filter (name only, using proper locale-aware display name)
    let result = environments.filter((env) => {
      if (!search.trim()) return true
      const name = env.nameKey ? t(env.nameKey) : env.name || ''
      return name.toLowerCase().includes(search.toLowerCase())
    })

    // 2. Status filter
    if (activeFilter !== 'all') {
      const keyMap = {
        normal: 'dashboard.statusNormal',
        warning: 'dashboard.statusWarning',
        alert: 'dashboard.statusAlert',
      }
      const target = keyMap[activeFilter]
      result = result.filter((env) => (env.statusKey || 'dashboard.statusNormal') === target)
    }

    // 3. Sort by name (locale-aware)
    result = [...result].sort((a, b) => {
      const nameA = a.nameKey ? t(a.nameKey) : a.name || ''
      const nameB = b.nameKey ? t(b.nameKey) : b.name || ''
      return nameA.localeCompare(nameB)
    })

    return result
  }, [environments, search, activeFilter, t])

  const stats = useMemo(
    () => ({
      total: environments.length,
      alerts: environments.filter((e) => e.statusKey === 'dashboard.statusAlert').length,
      warnings: environments.filter((e) => e.statusKey === 'dashboard.statusWarning').length,
      normals: environments.filter((e) => e.statusKey === 'dashboard.statusNormal' || !e.statusKey)
        .length,
    }),
    [environments]
  )

  const handleAdd = (data) => {
    addEnvironment(data)
    setShowAdd(false)
  }

  const handleEdit = (id, data) => {
    editEnvironment(id, data)
    setEditEnv(null)
  }

  const handleDelete = (id) => {
    deleteEnvironment(id)
    setDeleteEnv(null)
  }

  const openDelete = (id) => {
    setDeleteEnv(environments.find((e) => e.id === id) || null)
  }

  return {
    // state
    environments,
    filtered,
    stats,
    search,
    showAdd,
    editEnv,
    deleteEnv,
    activeFilter,
    // actions
    setSearch,
    setShowAdd,
    setEditEnv,
    openDelete,
    setDeleteEnv,
    handleAdd,
    handleEdit,
    handleDelete,
    setActiveFilter,
  }
}

export default useManagementVM