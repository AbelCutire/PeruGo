import { Tabs } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { Colors } from '../../constants/theme'; // ✅ Importamos los colores oficiales

export default function TabsLayout() {
  const { theme } = useUiTheme();
  // Aseguramos que el tema sea válido ('light' o 'dark')
  const currentTheme = theme === 'dark' ? 'dark' : 'light';
  const colors = Colors[currentTheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Usamos los colores definidos en theme.ts
        tabBarActiveTintColor: colors.tint, // Rojo PeruGo
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background, // Se adapta (Blanco o Negro profundo)
          height: 60, // Un poco más de altura para comodidad
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 0, // Quitar sombra en Android para look plano/limpio
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'Poppins', // Usamos la fuente oficial
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => <Feather name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="mis-planes"
        options={{
          title: 'Mis planes',
          // Usamos 'map' o 'briefcase' que semánticamente encajan mejor con "Planes", 
          // pero si prefieres el avioncito de papel de la web, Feather tiene "send"
          tabBarIcon: ({ color, size }) => <Feather name="send" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="robot" color={color} size={size + 2} />
          ),
        }}
      />
      
      {/* Rutas ocultas en la barra de navegación */}
      <Tabs.Screen
        name="perfil"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index.styles"
        options={{
          href: null,
        }}
      />
      {/* Añade esto para evitar que tus estilos de otras pantallas aparezcan como tabs por error */}
      <Tabs.Screen
        name="exploreStyles"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="misPlanesStyles"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="perfilStyles"
        options={{ href: null }}
      />
    </Tabs>
  );
}