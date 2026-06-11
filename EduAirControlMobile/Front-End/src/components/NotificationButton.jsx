import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../hooks/useNotifications'

export default function NotificationButton() {
  const navigation = useNavigation()
  const { currentColors } = useTheme()
  const { unreadCount } = useNotifications()

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: currentColors.bgCard, borderColor: currentColors.borderColor }]}
      onPress={() => navigation.navigate('NotificationsPanel')}
      activeOpacity={0.85}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="notifications-outline" size={21} color={currentColors.textPrimary} />
      {unreadCount > 0 && (
        <Text style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: '#ff6b6b',
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 18,
  },
})
