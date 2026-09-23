import { useState, useEffect, useCallback } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { useTranslation } from 'react-i18next'
import profileService from '../services/profileService'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024

/**
 * Port RN de useProfileVM.
 * - useNavigate se reemplaza por la prop `onLogout` inyectada desde la pantalla.
 * - FileReader / input file se reemplazan por expo-image-picker.
 */
export function useProfileVM({ onLogout } = {}) {
  const { t } = useTranslation()
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    title: '',
    phone: '',
    location: '',
    avatar: null,
  })
  const [form, setForm] = useState({ fullName: '', email: '', title: '', phone: '', location: '', avatar: null })
  const [avatar, setAvatar] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarError, setAvatarError] = useState(null)

  useEffect(() => {
    profileService.get().then((data) => {
      setProfile(data)
      setForm(data)
      setAvatar(data.avatar || null)
    })
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarChange = useCallback(async (asset) => {
    if (!asset) return
    setAvatarError(null)

    if ((asset.fileSize ?? 0) > MAX_IMAGE_SIZE) {
      setAvatarError(t('profile.avatarSizeError'))
      return
    }

    try {
      setAvatarLoading(true)
      const base64 = asset.base64 || null
      setAvatar(base64 ? `data:${asset.mimeType || 'image/jpeg'};base64,${base64}` : asset.uri)
    } catch {
      setAvatarError(t('profile.avatarReadError'))
    } finally {
      setAvatarLoading(false)
    }
  }, [t])

  const openAvatarPicker = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      setAvatarError(t('profile.avatarPermissionError'))
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    })
    if (!result.canceled && result.assets?.[0]) {
      handleAvatarChange(result.assets[0])
    }
  }, [handleAvatarChange])

  const handleRemoveAvatar = () => {
    setAvatar(null)
    setAvatarError(null)
  }

  const handleSave = () => {
    const updated = { ...form, avatar }
    setProfile(updated)
    profileService.save(updated)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setForm(profile)
    setAvatar(profile.avatar || null)
    setIsEditing(false)
    setAvatarError(null)
  }

  const handleLogout = () => {
    setLogoutModal(false)
    onLogout?.()
  }

  return {
    profile,
    form,
    avatar,
    isEditing,
    logoutModal,
    avatarLoading,
    avatarError,
    setIsEditing,
    setLogoutModal,
    handleChange,
    handleAvatarChange,
    handleRemoveAvatar,
    handleSave,
    handleCancel,
    handleLogout,
    openAvatarPicker,
  }
}

export default useProfileVM