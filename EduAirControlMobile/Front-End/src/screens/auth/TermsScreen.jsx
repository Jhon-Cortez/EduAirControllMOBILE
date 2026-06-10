import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'

export default function TermsScreen({ navigation }) {
  const { currentColors, darkMode } = useTheme()

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentColors.bgBody }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor={currentColors.bgBody} />
      <View style={[styles.card, { backgroundColor: currentColors.bgCard, borderColor: currentColors.accent }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={currentColors.accent} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentColors.textPrimary }]}>Términos y Condiciones</Text>
        </View>
        <Text style={[styles.sectionTitle, { color: currentColors.textPrimary }]}>1. Uso de la aplicación</Text>
        <Text style={[styles.sectionText, { color: currentColors.textSecondary }]}>
          EduAirControl es una herramienta educativa para monitorear la calidad del aire en ambientes académicos.
          Su uso está destinado exclusivamente a fines educativos e institucionales.
        </Text>
        <Text style={[styles.sectionTitle, { color: currentColors.textPrimary }]}>2. Privacidad de datos</Text>
        <Text style={[styles.sectionText, { color: currentColors.textSecondary }]}>
          Los datos recopilados se utilizan únicamente para mejorar la experiencia del usuario y el monitoreo
          ambiental. No se comparten con terceros sin consentimiento explícito.
        </Text>
        <Text style={[styles.sectionTitle, { color: currentColors.textPrimary }]}>3. Responsabilidades</Text>
        <Text style={[styles.sectionText, { color: currentColors.textSecondary }]}>
          El usuario es responsable del uso adecuado de la aplicación y de mantener sus credenciales seguras.
        </Text>
        <TouchableOpacity
          style={[styles.acceptBtn, { backgroundColor: currentColors.accent }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.acceptBtnText, { color: currentColors.bgBody }]}>Aceptar y continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  card: {
    borderRadius: 20, padding: 20, borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 10, padding: 4 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  sectionText: { fontSize: 14, lineHeight: 22, flexWrap: 'wrap' },
  acceptBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 30 },
  acceptBtnText: { fontSize: 16, fontWeight: 'bold' },
})