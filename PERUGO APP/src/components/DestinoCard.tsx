import React from 'react';
import { View, Text, Image } from 'react-native';
import type { Destino } from '../data/destinos';
import { useUiTheme } from '../context/UiThemeContext';
import { styles } from './DestinoCard.styles';

export function DestinoCard({ destino }: { destino: Destino }) {
  const { theme } = useUiTheme();
  const isDark = theme === 'dark';
  const cardBackground = isDark ? '#020617' : '#ffffff';
  const borderColor = isDark ? '#60a5fa' : '#e5e7eb';
  const titleColor = isDark ? '#f9fafb' : '#0f172a';
  const locationColor = isDark ? '#9ca3af' : '#64748b';
  const typeColor = isDark ? '#93c5fd' : '#0ea5e9';
  const descriptionColor = isDark ? '#cbd5f5' : '#475569';
  const durationColor = isDark ? '#e5e7eb' : '#0f172a';
  const priceColor = isDark ? '#22c55e' : '#16a34a';
  // Botón "Ver": azul más suave, no tan intenso
  const chipBackground = isDark ? '#3b82f6' : '#60a5fa';
  const chipTextColor = '#ffffff';

  return (
    <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
      {destino.imagen ? (
        <Image source={{ uri: destino.imagen }} style={styles.image} />
      ) : null}
      <View style={styles.content}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
          {destino.nombre}
        </Text>
        <Text style={[styles.location, { color: locationColor }]} numberOfLines={1}>
          {destino.ubicacion}
        </Text>
        <Text style={[styles.type, { color: typeColor }]} numberOfLines={1}>
          {destino.tipo}
        </Text>

        {destino.descripcion ? (
          <Text style={[styles.description, { color: descriptionColor }]} numberOfLines={1}>
            {destino.descripcion}
          </Text>
        ) : null}

        <Text style={[styles.duration, { color: durationColor }]}>{destino.duracion}</Text>

        <View style={styles.footerRow}>
          <Text style={[styles.price, { color: priceColor }]}>Desde S/ {destino.precio}</Text>
          <View style={[styles.viewChip, { backgroundColor: chipBackground }]}>
            <Text style={[styles.viewChipText, { color: chipTextColor }]}>Ver</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
