import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  back: { position: 'absolute', top: 12, left: 20, zIndex: 2 },
  iconWrap: { alignItems: 'center', marginBottom: 16 },
  icon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 28 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  codeInput: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  resend: { alignSelf: 'center', marginTop: 18 },
  resendText: { fontSize: 14, fontWeight: '600' },
  submit: { marginTop: 24 },
})
