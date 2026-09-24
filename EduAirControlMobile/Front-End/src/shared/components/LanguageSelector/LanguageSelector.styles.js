import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buttonText: { fontSize: 14, fontWeight: '600' },
  buttonFlag: { fontSize: 18 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  optionFlag: { fontSize: 20 },
  optionText: { fontSize: 16 },
  optionSpacer: { flex: 1 },
})
