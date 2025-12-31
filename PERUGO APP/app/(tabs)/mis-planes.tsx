import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePlanes, Plan } from '../../src/context/PlanesContext';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { styles } from './misPlanesStyles';

// Helper para convertir fecha DD/MM/AAAA a objeto Date
const parseFecha = (fechaStr?: string | null) => {
  if (!fechaStr) return null;
  const [dia, mes, anio] = fechaStr.split('/').map(Number);
  return new Date(anio, mes - 1, dia); // Mes es 0-indexado
};

export default function MisPlanesScreen() {
  const router = useRouter();
  const { planes, loading, recargarPlanes, actualizarPlan } = usePlanes();
  const { theme } = useUiTheme();
  
  const isDark = theme === 'dark';
  const containerBg = isDark ? '#020617' : '#f8fafc';
  const textTitle = isDark ? '#f9fafb' : '#0f172a';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textSub = isDark ? '#9ca3af' : '#64748b';
  const chipBg = isDark ? '#334155' : '#e2e8f0';
  const chipActive = '#f97316';
  const chipText = isDark ? '#f1f5f9' : '#475569';

  const [filtro, setFiltro] = useState<'fecha' | 'prioridad'>('fecha');
  const [refreshing, setRefreshing] = useState(false);

  // 1. Lógica: Recargar y Verificar Completados al enfocar
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        await recargarPlanes();
      };
      init();
    }, [])
  );

  // 2. Lógica: Verificar si algún plan confirmado ya terminó
  useEffect(() => {
    if (planes.length > 0) {
      verificarPlanesCompletados();
    }
  }, [planes]);

  const verificarPlanesCompletados = async () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (const plan of planes) {
      if (plan.estado === 'confirmado' && plan.fecha_fin) {
        const fechaFin = parseFecha(plan.fecha_fin);
        if (fechaFin && fechaFin < hoy) {
          // Si la fecha ya pasó, actualizamos en backend silenciosamente
          console.log(`Marcando plan ${plan.destino} como completado`);
          await actualizarPlan(plan.id, { estado: 'completado' });
        }
      }
    }
  };

  // 3. Lógica: Ordenamiento
  const getPlanesOrdenados = () => {
    const copia = [...planes];
    if (filtro === 'prioridad') {
      const peso: Record<string, number> = {
        borrador: 1,
        pendiente: 2,
        confirmado: 3,
        cancelado: 4,
        completado: 5,
      };
      return copia.sort((a, b) => (peso[a.estado] || 99) - (peso[b.estado] || 99));
    }
    // Por defecto fecha (asumiendo que el backend los manda cronológicos o por creación)
    // Si quisieras ordenar por fecha de viaje:
    return copia.sort((a, b) => {
      const fa = parseFecha(a.fecha_inicio) || new Date(0);
      const fb = parseFecha(b.fecha_inicio) || new Date(0);
      return fb.getTime() - fa.getTime(); // Más recientes primero
    });
  };

  const planesVisibles = getPlanesOrdenados();

  const onRefresh = async () => {
    setRefreshing(true);
    await recargarPlanes();
    setRefreshing(false);
  };

  const estadoColor: Record<string, string> = {
    borrador: '#9ca3af',
    pendiente: '#facc15',
    confirmado: '#22c55e',
    cancelado: '#ef4444',
    completado: '#3b82f6',
  };

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textTitle }]}>Mis planes</Text>
        
        {/* Filtros de Ordenamiento */}
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterChip, { backgroundColor: filtro === 'fecha' ? chipActive : chipBg }]}
            onPress={() => setFiltro('fecha')}
          >
            <Text style={[styles.filterText, { color: filtro === 'fecha' ? '#fff' : chipText }]}>Fecha</Text>
          </Pressable>
          <Pressable
            style={[styles.filterChip, { backgroundColor: filtro === 'prioridad' ? chipActive : chipBg }]}
            onPress={() => setFiltro('prioridad')}
          >
            <Text style={[styles.filterText, { color: filtro === 'prioridad' ? '#fff' : chipText }]}>Prioridad</Text>
          </Pressable>
        </View>
      </View>

      {loading && planes.length === 0 ? (
        <ActivityIndicator size="large" color="#f97316" style={{ marginTop: 50 }} />
      ) : planes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="map-outline" size={64} color={textSub} style={{ opacity: 0.5 }} />
          <Text style={[styles.subtitle, { color: textSub, marginTop: 16 }]}>
            Aún no tienes planes guardados.
          </Text>
          <Pressable style={styles.exploreButton} onPress={() => router.push('/(tabs)/explore')}>
            <Text style={styles.exploreText}>Explorar destinos</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={planesVisibles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/reserva/${item.id}`)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: cardBg,
                  opacity: pressed ? 0.95 : 1,
                  borderLeftWidth: 5,
                  borderLeftColor: estadoColor[item.estado] || '#9ca3af',
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View style={styles.cardHeader}>
                {item.imagen && (
                  <Image source={{ uri: item.imagen }} style={styles.cardImage} />
                )}
                <View style={styles.cardInfo}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={[styles.cardTitle, { color: textTitle, flex: 1 }]} numberOfLines={1}>{item.destino}</Text>
                    {item.estado === 'completado' && !item.resena_completada && (
                      <View style={{ backgroundColor: '#fbbf24', borderRadius: 4, width: 8, height: 8 }} />
                    )}
                  </View>
                  
                  <Text style={[styles.cardSubtitle, { color: textSub }]} numberOfLines={1}>{item.tour}</Text>
                  
                  <View style={styles.cardFooter}>
                    <View style={[styles.statusBadge, { backgroundColor: estadoColor[item.estado] + '20' }]}>
                      <Text style={[styles.statusText, { color: estadoColor[item.estado] }]}>
                        {item.estado.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.cardPrice, { color: isDark ? '#fff' : '#0f172a' }]}>
                      S/ {item.precio}
                    </Text>
                  </View>
                </View>
              </View>
              
              {item.fecha_inicio && (
                <View style={[styles.dateRow, { borderTopColor: isDark ? '#334155' : '#f1f5f9' }]}>
                  <Ionicons name="calendar-outline" size={14} color="#64748b" />
                  <Text style={styles.dateText}>
                    {item.fecha_inicio} - {item.fecha_fin}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}