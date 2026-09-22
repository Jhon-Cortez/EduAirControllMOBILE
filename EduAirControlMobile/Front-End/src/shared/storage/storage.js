import AsyncStorage from '@react-native-async-storage/async-storage'

// Adapter que emula la API síncrona de localStorage sobre AsyncStorage.
// Mantiene un espejo en memoria para que getItem() pueda leerse de forma síncrona,
// igual que hace localStorage.getItem() en el web. init() debe llamarse al arrancar la app.

const cache = new Map()

const storage = {
  async init() {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const entries = await AsyncStorage.multiGet(keys)
      entries.forEach(([key, value]) => {
        if (value != null) cache.set(key, value)
      })
    } catch (e) {
      console.warn('storage.init failed:', e)
    }
  },

  getItem(key) {
    return cache.has(key) ? cache.get(key) : null
  },

  async setItem(key, value) {
    cache.set(key, value)
    return AsyncStorage.setItem(key, value)
  },

  async removeItem(key) {
    cache.delete(key)
    return AsyncStorage.removeItem(key)
  },

  async clear() {
    cache.clear()
    return AsyncStorage.clear()
  },
}

export default storage