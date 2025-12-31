import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    borderWidth: 1,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: 90,
    height: '100%',
    minHeight: 88,
  },
  content: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 2,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  location: {
    fontSize: 13,
  },
  type: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  duration: {
    fontSize: 12,
    marginTop: 2,
  },
  footerRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  viewChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
