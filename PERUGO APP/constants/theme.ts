/**
 * Colores y Tipografía de PeruGo.
 * Se define la paleta rojo/cian y la fuente Poppins.
 */

import { Platform } from 'react-native';

// Colores de identidad (Rojo PeruGo)
const primaryRed = 'rgb(255, 0, 0)';
const primaryRedDark = '#ef4444'; // Un rojo más suave para modo oscuro
const accentCyan = '#06b6d4';

export const Colors = {
  light: {
    text: '#0f172a',        // Slate 900
    background: '#f8fafc',  // Slate 50
    tint: primaryRed,       // Color de selección (Tabs, botones activos)
    icon: '#64748b',        // Slate 500
    tabIconDefault: '#94a3b8',
    tabIconSelected: primaryRed,
    
    // Variables semánticas extra para nuestros componentes
    cardBackground: '#ffffff',
    border: '#e2e8f0',
    primary: primaryRed,
    secondary: '#f1f5f9',
    danger: '#ef4444',
    success: '#22c55e',
  },
  dark: {
    text: '#f8fafc',        // Slate 50
    background: '#020617',  // Slate 950
    tint: primaryRedDark,
    icon: '#9ca3af',
    tabIconDefault: '#475569',
    tabIconSelected: primaryRedDark,
    
    // Variables semánticas extra
    cardBackground: '#1e293b', // Slate 800
    border: '#334155',
    primary: primaryRedDark,
    secondary: '#334155',
    danger: '#f87171',
    success: '#4ade80',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Poppins', 
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  android: {
    sans: 'Poppins', // En Android necesita coincidir con el nombre del archivo (Poppins-Regular) o el nombre cargado
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  default: {
    sans: 'Poppins',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});