import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Auth screens
import LoginScreen from './src/screens/auth/LoginScreen'
import SignUpScreen from './src/screens/auth/SignUpScreen'
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen'
import VerifyCodeScreen from './src/screens/auth/VerifyCodeScreen'
import ChangePasswordScreen from './src/screens/auth/ChangePasswordScreen'
import TermsScreen from './src/screens/auth/TermsScreen'

// App navigator (bottom tabs + stacks)
import AppNavigator from './src/navigation/AppNavigator'

// Context
import { EnvironmentsProvider } from './src/context/EnvironmentsContext'
import { ThemeProvider } from './src/context/ThemeContext'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <ThemeProvider>
      <EnvironmentsProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            {/* Auth */}
            <Stack.Screen name="Login"          component={LoginScreen} />
            <Stack.Screen name="SignUp"          component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword"  component={ForgotPasswordScreen} />
            <Stack.Screen name="VerifyCode"      component={VerifyCodeScreen} />
            <Stack.Screen name="ChangePassword"  component={ChangePasswordScreen} />
            <Stack.Screen name="Terms"           component={TermsScreen} />

            {/* App (bottom tabs) */}
            <Stack.Screen name="App" component={AppNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </EnvironmentsProvider>
    </ThemeProvider>
  )
}