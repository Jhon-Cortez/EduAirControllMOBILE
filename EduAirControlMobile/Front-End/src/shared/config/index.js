import Constants from 'expo-constants'
import { Platform } from 'react-native'

// En desarrollo se usa el host del servidor Metro (dev machine).
// Android emulator -> 10.0.2.2 · iOS simulator -> localhost · Expo Go físico -> IP LAN automática.
function getDevHost() {
  const hostUri = Constants.expoConfig?.hostUri
  if (hostUri) return hostUri.split(':')[0]
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
}

const DEV_HOST = getDevHost()

// Override manual: EXPO_PUBLIC_API_URL=http://192.168.1.x:8080 (útil si Metro
// corre en modo tunnel o el host detectado no es alcanzable desde el dispositivo).
export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ||
  (__DEV__ ? `http://${DEV_HOST}:8080` : 'https://api.eduaircontrol.com')
export const DB_BASE = __DEV__ ? `http://${DEV_HOST}:3001` : 'https://db.eduaircontrol.com'