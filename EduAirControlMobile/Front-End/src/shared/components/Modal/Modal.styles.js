import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    maxHeight: '92%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  closeBtn: { position: 'absolute', top: 14, right: 14, zIndex: 1 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16, marginRight: 32 },
  body: { flexShrink: 1 },
})
