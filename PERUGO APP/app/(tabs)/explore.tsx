import React, { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, TextInput, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { destinos } from '../../src/data/destinos';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { Colors } from '../../constants/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const { theme } = useUiTheme();
  const isDark = theme === 'dark';
  const colors = Colors[theme === 'dark' ? 'dark' : 'light'];
  
  const [search, setSearch] = useState('');

  // Filtrar destinos
  const filteredDestinos = destinos.filter(d => 
    d.nombre.toLowerCase().includes(search.toLowerCase()) || 
    d.ubicacion.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: typeof destinos[0] }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.card, 
        { 
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        }
      ]}
      onPress={() => router.push(`/destino/${item.id}`)}
    >
      <Image source={{ uri: item.imagen }} style={styles.cardImage} />
      
      {/* Badge de Precio */}
      <View style={styles.priceBadge}>
        <Text style={styles.priceText}>S/ {item.precio}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
            {item.nombre}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={[styles.ratingText, { color: colors.icon }]}>4.8</Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={14} color={colors.primary} />
          <Text style={[styles.cardLocation, { color: colors.icon }]} numberOfLines={1}>
            {item.ubicacion}
          </Text>
        </View>

        <View style={styles.tagsRow}>
          <View style={[styles.tag, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
            <Text style={[styles.tagText, { color: colors.icon }]}>{item.duracion}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
            <Text style={[styles.tagText, { color: colors.icon }]}>{item.tipo.split(' / ')[0]}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header Personalizado */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Explorar Perú 🇵🇪</Text>
        <Text style={[styles.headerSubtitle, { color: colors.icon }]}>Encuentra tu próxima aventura</Text>
        
        {/* Barra de Búsqueda */}
        <View style={[styles.searchBar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.icon} style={{ marginRight: 8 }} />
          <TextInput 
            placeholder="Buscar destinos (ej. Cusco, Playa...)" 
            placeholderTextColor={colors.icon}
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.icon} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredDestinos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={64} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.icon }]}>No encontramos destinos con ese nombre.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60, // Ajuste para status bar
    paddingBottom: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  priceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
  },
  priceText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb', // Amarillo muy suave
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLocation: {
    fontSize: 14,
    marginLeft: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
});