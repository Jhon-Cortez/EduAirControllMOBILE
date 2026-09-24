import { StyleSheet } from 'react-native'

export const srStyles = StyleSheet.create({
  ring: { borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  num: { fontWeight: 'bold' },
})

export const pdStyles = StyleSheet.create({
  card: {
    alignItems: 'center', borderRadius: 14, borderWidth: 2,
    paddingHorizontal: 8, paddingTop: 12, paddingBottom: 42, gap: 5,
    overflow: 'visible',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  rank1: { width: 132, height: 300, marginTop: 5, zIndex: 2 },
  rank23: { width: 120, height: 260, marginTop: 24 },
  crown: { fontSize: 21, position: 'absolute', top: -20, zIndex: 3 },
  bubble: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  bubbleWinner: { width: 46, height: 46, borderRadius: 23 },
  name: { textAlign: 'center', fontWeight: '800', fontSize: 11.5, lineHeight: 14, minHeight: 30, maxWidth: '100%' },
  nameWinner: { fontSize: 13, lineHeight: 16, minHeight: 34 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  loc: { fontSize: 10, maxWidth: 82 },
  stand: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: 34, alignItems: 'center', justifyContent: 'center',
    borderBottomLeftRadius: 11, borderBottomRightRadius: 11,
  },
  standWinner: { height: 38 },
  standN: { color: '#fff', fontWeight: '900', fontSize: 16 },
  standWinnerN: { fontSize: 18 },
})

export const rrStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  rank: { fontSize: 13, fontWeight: '700', width: 28 },
  name: { fontSize: 14, fontWeight: '600' },
  loc: { fontSize: 11, marginTop: 1 },
  pills: { flexDirection: 'row', gap: 4 },
  pill: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  pillTxt: { fontSize: 10, fontWeight: '600' },
})

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 55, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSub: { fontSize: 12, marginTop: 1 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  filterScroll: { marginBottom: 16, maxHeight: 58, flexGrow: 0 },
  filterRow: { flexDirection: 'row', gap: 10, paddingRight: 8 },
  filterBtn: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 24, borderWidth: 1, minHeight: 48, justifyContent: 'center' },
  filterTxt: { fontSize: 14, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyTxt: { fontSize: 14 },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginBottom: 24, paddingTop: 20 },
  listSection: { marginTop: 4 },
  listTitle: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  legend: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  legendTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  legendItem: { fontSize: 12 },
})
