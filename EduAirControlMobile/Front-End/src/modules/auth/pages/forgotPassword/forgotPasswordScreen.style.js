import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  back: { position: 'absolute', top: 44, left: 20, zIndex: 2 },
  iconWrap: { alignItems: 'center', marginBottom: 16 },
  icon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 24 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fieldIcon: { marginRight: 10 },
  fieldInput: { flex: 1, fontSize: 15, padding: 0 },
  submit: { marginTop: 20 },
  successBox: { borderWidth: 1, borderRadius: 16, padding: 24, alignItems: 'center', gap: 10 },
  successTitle: { fontSize: 18, fontWeight: '700' },
  successText: { fontSize: 14, textAlign: 'center' },
  successBtn: { marginTop: 8 },
})
