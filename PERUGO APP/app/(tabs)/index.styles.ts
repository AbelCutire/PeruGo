import React from 'react';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7e9d3',
  },
  heroBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    flex: 1,
  },
  heroOverlayLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  heroOverlayDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 4,
  },
  micButton: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 32,
  },
  micIcon: {
    fontSize: 32,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  searchIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
});

// Evitar que Expo Router trate este archivo de estilos como una ruta sin componente.
export default function StylesPlaceholder() {
  return null;
}
