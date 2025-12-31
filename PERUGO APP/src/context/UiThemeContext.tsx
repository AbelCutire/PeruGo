import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ColorSchemeName } from 'react-native';

export type UiThemeContextValue = {
  colorScheme: ColorSchemeName;
  setColorScheme: (scheme: ColorSchemeName) => void;
  theme: ColorSchemeName;
  toggleTheme: () => void;
};

const UiThemeContext = createContext<UiThemeContextValue | undefined>(undefined);

export function UiThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('light');

  const value: UiThemeContextValue = {
    colorScheme,
    setColorScheme,
    theme: colorScheme,
    toggleTheme: () => {
      setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    },
  };

  return <UiThemeContext.Provider value={value}>{children}</UiThemeContext.Provider>;
}

export function useUiTheme() {
  const ctx = useContext(UiThemeContext);
  if (!ctx) {
    throw new Error('useUiTheme debe usarse dentro de un UiThemeProvider');
  }
  return ctx;
}
