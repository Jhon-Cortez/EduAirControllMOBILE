import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  disabled: { opacity: 0.6 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, paddingVertical: 12 },
  error: { fontSize: 12, marginTop: 4 },
})
