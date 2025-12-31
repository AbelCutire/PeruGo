import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { destinos } from '../../src/data/destinos';
import { styles } from './destinoStyles';
import { usePlanes } from '../../src/context/PlanesContext';
import { useAuth } from '../../src/context/AuthContext';

export default function DestinoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { agregarDestino } = usePlanes();
  const { token } = useAuth(); // Para verificar si está logueado

  // Buscar el destino en la data estática
  const destino = destinos.find((d) => d.id === id);
  const [tourSeleccionado, setTourSeleccionado] = useState<any>(null);
  const [guardando, setGuardando] = useState(false);

  if (!destino) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Destino no encontrado</Text>
      </View>
    );
  }

  const handleAgregarPlan = async () => {
    if (!tourSeleccionado) {
      Alert.alert('Atención', 'Selecciona un plan (tour) primero.');
      return;
    }

    if (!token) {
      Alert.alert('Inicia sesión', 'Debes estar logueado para guardar planes.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir al Login', onPress: () => router.push('/login') },
      ]);
      return;
    }

    try {
      setGuardando(true);
      // Extraer número de días aprox
      const duracionMatch = tourSeleccionado.duracion?.match(/(\d+)\s*día/i);
      const dias = duracionMatch ? parseInt(duracionMatch[1]) : 1;

      // Llamar al contexto (que llama a la API)
      await agregarDestino({
        destino_id: destino.id,
        destino: destino.nombre,
        tour: tourSeleccionado.nombre,
        precio: tourSeleccionado.precio,
        duracion: tourSeleccionado.duracion || destino.duracion,
        duracion_dias: dias,
        gastos: tourSeleccionado.gastos,
        estado: 'borrador',
      });

      Alert.alert('¡Éxito!', 'Plan guardado en la nube.', [
        { text: 'Seguir explorando', style: 'cancel' },
        { text: 'Ver mis planes', onPress: () => router.push('/(tabs)/mis-planes') },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el plan. Intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={{ uri: destino.imagen }} style={styles.heroImage} />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{destino.nombre}</Text>
        <Text style={styles.location}>📍 {destino.ubicacion}</Text>
        <Text style={styles.description}>{destino.descripcion}</Text>

        <Text style={styles.sectionTitle}>Planes Disponibles</Text>
        {destino.tours.map((tour, index) => {
          const isSelected = tourSeleccionado?.nombre === tour.nombre;
          return (
            <Pressable
              key={index}
              style={[styles.tourCard, isSelected && styles.tourCardSelected]}
              onPress={() => setTourSeleccionado(tour)}
            >
              <Text style={styles.tourName}>{tour.nombre}</Text>
              <Text style={styles.tourDesc}>{tour.descripcion}</Text>
              <View style={styles.tourFooter}>
                <Text style={styles.tourDuration}>⏱ {tour.duracion || destino.duracion}</Text>
                <Text style={styles.tourPrice}>S/ {tour.precio}</Text>
              </View>
              {isSelected && (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark-circle" size={24} color="#f97316" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.addButton,
            (!tourSeleccionado || guardando) && styles.addButtonDisabled,
          ]}
          onPress={handleAgregarPlan}
          disabled={!tourSeleccionado || guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>
              {tourSeleccionado ? 'Añadir a mis planes' : 'Selecciona un plan'}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}