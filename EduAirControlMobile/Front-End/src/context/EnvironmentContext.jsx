import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import environmentService from '../modules/environment/services/environmentService'

const EnvironmentContext = createContext()

export function EnvironmentProvider({ children }) {
  const [environments, setEnvironments] = useState([])
  const [loading, setLoading] = useState(true)

  const refreshEnvironments = useCallback(() => {
    return environmentService
      .getAll()
      .then(setEnvironments)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refreshEnvironments()
  }, [refreshEnvironments])

  const toggleFavorite = useCallback(
    (id, favorite) => {
      environmentService.toggleFavorite(id)
      setEnvironments((prev) =>
        prev.map((env) => (env.id === id ? { ...env, isFavorite: favorite } : env))
      )
    },
    []
  )

  const addEnvironment = useCallback((data) => {
    environmentService.create(data).then((newEnv) => {
      setEnvironments((prev) => [...prev, newEnv])
    })
  }, [])

  const editEnvironment = useCallback((id, data) => {
    environmentService.update(id, data)
    setEnvironments((prev) =>
      prev.map((env) => (env.id === id ? { ...env, ...data } : env))
    )
  }, [])

  const deleteEnvironment = useCallback((id) => {
    environmentService.delete(id)
    setEnvironments((prev) => prev.filter((env) => env.id !== id))
  }, [])

  return (
    <EnvironmentContext.Provider
      value={{
        environments,
        loading,
        toggleFavorite,
        addEnvironment,
        editEnvironment,
        deleteEnvironment,
        refreshEnvironments,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironment() {
  return useContext(EnvironmentContext)
}

export const useEnvironments = useEnvironment