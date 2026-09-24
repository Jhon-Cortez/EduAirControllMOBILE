import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 55, paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSub: { fontSize: 12, marginTop: 1 },
  badge: {
    borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3,
    minWidth: 24, alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  markReadRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1,
  },
  markReadText: { fontSize: 13, fontWeight: '700' },
  filterScroll: { marginTop: 12, maxHeight: 58, flexGrow: 0 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 4 },
  filterChip: {
    paddingHorizontal: 18, paddingVertical: 11, borderRadius: 24, borderWidth: 1.5,
    backgroundColor: 'transparent', minHeight: 48, justifyContent: 'center',
  },
  filterChipText: { fontSize: 14, fontWeight: '800' },
  list: { flex: 1 },
  listContent: { padding: 16 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, borderWidth: 1.5, padding: 14, marginBottom: 10,
  },
  iconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  itemMsg: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  itemTime: { fontSize: 11 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold' },
  emptyText: { fontSize: 13, textAlign: 'center', maxWidth: 280 },
})
