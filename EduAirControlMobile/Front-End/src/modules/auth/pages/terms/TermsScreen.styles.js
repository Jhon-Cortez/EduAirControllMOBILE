import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  container: { padding: 20, paddingBottom: 40 },
  intro: { fontSize: 14, lineHeight: 21, marginBottom: 16 },
  section: { borderWidth: 1, borderRadius: 16, padding: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  paragraph: { fontSize: 14, lineHeight: 21, marginBottom: 6 },
  listItem: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  note: { fontSize: 12, fontStyle: 'italic', marginTop: 4 },
})
