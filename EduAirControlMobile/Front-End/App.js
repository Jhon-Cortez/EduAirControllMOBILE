import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// Auth screens (módulo reestructurado, conectado a servicio + schemas + i18n)
// Auth screens
import LoginScreen from './src/modules/auth/pages/login/LoginScreen';
import SignUpScreen from './src/modules/auth/pages/signUp/SignUpScreen';
import ForgotPasswordScreen from './src/modules/auth/pages/forgotPassword/ForgotPasswordScreen';
import VerifyCodeScreen from './src/modules/auth/pages/verifyCode/VerifyCodeScreen';
import ChangePasswordScreen from './src/modules/auth/pages/changePassword/ChangePasswordScreen';
import TermsScreen from './src/modules/auth/pages/terms/TermsScreen';

// App navigator (bottom tabs + stacks)
import AppNavigator from './src/navigation/AppNavigator'

// Context
import { EnvironmentProvider } from './src/context/EnvironmentContext'
import { ThemeProvider } from './src/context/ThemeContext'
import { ToastProvider } from './src/shared/components/Toast/Toast'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ToastProvider>
          <EnvironmentProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
              >
                {/* Auth */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
                <Stack.Screen name="Terms" component={TermsScreen} />

                {/* App (bottom tabs) */}
                <Stack.Screen name="App" component={AppNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </EnvironmentProvider>
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}