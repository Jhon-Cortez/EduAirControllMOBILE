import { createContext, useContext, useState } from 'react'

const EnvironmentsContext = createContext()

const INITIAL_ENVIRONMENTS = [
  {
    id: 1,
    name: 'Aula 101',
    statusKey: 'warning',
    temp: 26.4,
    humidity: 32,
    co2: 1010,
    noise: 62,
    qualityKey: 'regular',
    capacity: 30,
    location: 'Bloque A',
    isFavorite: false,
  },
  {
    id: 2,
    name: 'Laboratorio de Sistemas',
    statusKey: 'alert',
    temp: 29.1,
    humidity: 28,
    co2: 1350,
    noise: 71,
    qualityKey: 'bad',
    capacity: 25,
    location: 'Bloque B',
    isFavorite: true,
  },
  {
    id: 3,
    name: 'Sala de Conferencias',
    statusKey: 'normal',
    temp: 22.0,
    humidity: 50,
    co2: 750,
    noise: 40,
    qualityKey: 'good',
    capacity: 40,
    location: 'Bloque C',
    isFavorite: false,
  },
  {
    id: 4,
    name: 'Biblioteca',
    statusKey: 'normal',
    temp: 21.5,
    humidity: 55,
    co2: 680,
    noise: 35,
    qualityKey: 'good',
    capacity: 60,
    location: 'Bloque D',
    isFavorite: false,
  },
  {
    id: 5,
    name: 'Aula 205',
    statusKey: 'warning',
    temp: 25.8,
    humidity: 38,
    co2: 920,
    noise: 58,
    qualityKey: 'regular',
    capacity: 35,
    location: 'Bloque A',
    isFavorite: false,
  },
]

export function EnvironmentsProvider({ children }) {
  const [environments, setEnvironments] = useState(INITIAL_ENVIRONMENTS)

  const toggleFavorite = (id, isFav) => {
    setEnvironments((prev) =>
      prev.map((env) => (env.id === id ? { ...env, isFavorite: isFav } : env))
    )
  }

  const addEnvironment = (env) => {
    setEnvironments((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: env.name,
        capacity: env.capacity,
        location: env.location,
        isFavorite: false,
        statusKey: 'normal',
        temp: 22,
        humidity: 49,
        co2: 700,
        noise: 39,
        qualityKey: 'good',
      },
    ])
  }

  const editEnvironment = (id, data) => {
    setEnvironments((prev) =>
      prev.map((env) => (env.id === id ? { ...env, ...data } : env))
    )
  }

  const deleteEnvironment = (id) => {
    setEnvironments((prev) => prev.filter((env) => env.id !== id))
  }

  return (
    <EnvironmentsContext.Provider
      value={{ environments, toggleFavorite, addEnvironment, editEnvironment, deleteEnvironment }}
    >
      {children}
    </EnvironmentsContext.Provider>
  )
}

export function useEnvironments() {
  return useContext(EnvironmentsContext)
}