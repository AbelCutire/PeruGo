// app/_layout.tsx
import { Stack } from 'expo-router';
import { PlanesProvider } from '../src/context/PlanesContext';
import { UiThemeProvider } from '../src/context/UiThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { ChatProvider } from '../src/context/ChatContext';

export default function RootLayout() {
  return (
    <PlanesProvider>
      <AuthProvider>
        <UiThemeProvider>
          <ChatProvider>
            <Stack screenOptions={{ headerShown: false }}>
              {/* Grupo principal con tabs */}
              <Stack.Screen name="(tabs)" />
              {/* Pantalla de detalle de destino */}
              <Stack.Screen name="destino/[id]" />
            </Stack>
          </ChatProvider>
        </UiThemeProvider>
      </AuthProvider>
    </PlanesProvider>
  );
}
