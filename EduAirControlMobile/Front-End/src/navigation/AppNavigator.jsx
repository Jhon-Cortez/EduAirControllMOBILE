import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'

import DashboardScreen from '../screens/app/DashboardScreen'
import EnvironmentDetailScreen from '../screens/app/EnvironmentDetailScreen'
import FavoritesScreen from '../screens/app/FavoritesScreen'
import NotificationsScreen from '../screens/app/NotificationsScreen'
import ProfileScreen from '../screens/app/ProfileScreen'
import EnvironmentManagementScreen from '../screens/app/EnvironmentManagementScreen'
import SettingsScreen from '../screens/app/SettingsScreen'
import { useNotifications } from '../hooks/useNotifications'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="EnvironmentDetail" component={EnvironmentDetailScreen} />
    </Stack.Navigator>
  )
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesHome" component={FavoritesScreen} />
      <Stack.Screen name="EnvironmentDetail" component={EnvironmentDetailScreen} />
    </Stack.Navigator>
  )
}

function ManagementStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManagementHome" component={EnvironmentManagementScreen} />
      <Stack.Screen name="EnvironmentDetail" component={EnvironmentDetailScreen} />
    </Stack.Navigator>
  )
}

function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationsHome" component={NotificationsScreen} />
      <Stack.Screen name="EnvironmentDetail" component={EnvironmentDetailScreen} />
    </Stack.Navigator>
  )
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  const { currentColors } = useTheme()
  const { unreadCount } = useNotifications()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentColors.bgCard,
          borderTopColor: currentColors.borderColor,
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: currentColors.accent,
        tabBarInactiveTintColor: currentColors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline'
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline'
          } else if (route.name === 'Management') {
            iconName = focused ? 'settings' : 'settings-outline'
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline'
          } else if (route.name === 'Settings') {
            iconName = focused ? 'options' : 'options-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={{ tabBarLabel: 'Favoritos' }}
      />
      <Tab.Screen
        name="Management"
        component={ManagementStack}
        options={{ tabBarLabel: 'Gestión' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsStack}
        options={{
          tabBarLabel: 'Alertas',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#ff6b6b', color: '#fff' },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  )
}
