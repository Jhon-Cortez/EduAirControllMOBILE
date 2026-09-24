import { API_BASE, DB_BASE } from '../config'
import storage from '../storage/storage'
import i18n from '../i18n/i18n'

const PUBLIC_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/verify-code',
  '/auth/reset-password',
  '/auth/resend-code',
]

let onUnauthorized = null

export function setOnUnauthorized(handler) {
  onUnauthorized = handler
}

function getToken() {
  return storage.getItem('token')
}

async function request(endpoint, options = {}, baseUrl = API_BASE) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let response
  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error(i18n.t('errors.network'))
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))

    const isPublicAuth = PUBLIC_AUTH_ENDPOINTS.some((p) => endpoint.startsWith(p))
    if (response.status === 401 && !isPublicAuth) {
      await storage.removeItem('token')
      await storage.removeItem('user')
      onUnauthorized?.()
      throw new Error(error.message || i18n.t('errors.sessionExpired'))
    }

    throw new Error(error.message || `Error ${response.status}`)
  }

  if (response.status === 204) return null
  return response.json()
}

const apiClient = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
}

export const dbClient = {
  get: (endpoint) => request(endpoint, {}, DB_BASE),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }, DB_BASE),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }, DB_BASE),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }, DB_BASE),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }, DB_BASE),
}

export default apiClient
