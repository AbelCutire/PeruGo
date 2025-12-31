import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: '#8d1116',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    maxWidth: '55%',
  },
  logoWrapper: {
    marginRight: 10,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerLogo: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#fde68a',
    fontSize: 12,
    marginTop: 2,
  },
  headerButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
    flexShrink: 0,
    maxWidth: '100%',
    marginTop: 8,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  authButtonPrimary: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.35)',
    backgroundColor: 'rgba(255,255,255,0.0)',
    marginLeft: 6,
  },
  authButtonPrimaryText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '500',
  },
  authButtonSecondary: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  authButtonSecondaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
});
