import { useEffect, useState } from 'react'
import storage from '../storage/storage'

const listeners = new Set()

function emitDateFormatChanged(fmt) {
  listeners.forEach((cb) => {
    try {
      cb(fmt)
    } catch (e) {
      console.warn('dateFormat listener error:', e)
    }
  })
}

/**
 * Lee el formato de fecha del storage y formatea un Date acorde.
 */
export function formatDate(date, formatStr) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = String(date.getFullYear())

  return (formatStr || 'DD/MM/YYYY')
    .replace('DD', dd)
    .replace('MM', mm)
    .replace('YYYY', yyyy)
}

export function getDateFormat() {
  return storage.getItem('dateFormat') || 'DD/MM/YYYY'
}

export function saveDateFormat(fmt) {
  storage.setItem('dateFormat', fmt)
  emitDateFormatChanged(fmt)
}

export function useDateFormat() {
  const [format, setFormat] = useState(() => getDateFormat())

  useEffect(() => {
    const off = (listeners.add(setFormat), () => listeners.delete(setFormat))
    return off
  }, [])

  return format
}