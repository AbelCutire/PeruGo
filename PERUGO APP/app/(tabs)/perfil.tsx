// app/(tabs)/perfil.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { styles } from './perfilStyles';

export default function PerfilScreen() {
  const { theme, toggleTheme } = useUiTheme();
  const { user, logout, updateUsername } = useAuth();
  const router = useRouter();

  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#020617' : '#f8fafc';
  const titleColor = isDark ? '#f9fafb' : '#0f172a';
  const subtitleColor = isDark ? '#cbd5f5' : '#64748b';
  const cardBackground = isDark ? '#020617' : '#ffffff';
  const cardBorderColor = isDark ? '#1f2937' : '#e2e8f0';
  const nameColor = isDark ? '#f9fafb' : '#0f172a';
  const emailColor = isDark ? '#9ca3af' : '#64748b';
  const infoLabelColor = isDark ? '#9ca3af' : '#64748b';
  const infoValueColor = isDark ? '#e5e7eb' : '#0f172a';
  const sectionTextColor = isDark ? '#cbd5f5' : '#334155';
  // Botón Editar perfil: menos llamativo, adaptado al fondo
  const primaryButtonBg = isDark ? '#1f2937' : '#e5e7eb';
  const primaryButtonTextColor = isDark ? '#e5e7eb' : '#111827';
  const secondaryBorder = isDark ? '#4b5563' : '#cbd5e1';
  const secondaryTextColor = '#ffffff';
  const dangerButtonBg = isDark ? '#dc2626' : '#ef4444';
  const dangerBorder = isDark ? '#b91c1c' : '#dc2626';

  // Si no hay usuario logueado, mostrar acciones de login/registro
  if (!user) {
    return (
      <ScrollView
        style={{ backgroundColor }}
        contentContainerStyle={[styles.container, { backgroundColor }]}
      >
        <Text style={[styles.title, { color: titleColor }]}>Mi perfil</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          Inicia sesión o crea una cuenta para guardar tus planes y preferencias de viaje.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, { borderColor: secondaryBorder, backgroundColor: isDark ? '#020617' : '#ffffff' }]}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.secondaryButtonText}>Crear cuenta</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // Datos básicos derivados del usuario logueado
  const nombre = user.username || 'Viajero PeruGo';
  const correo = user.email;
  const tipoViajero = 'Explorador de aventuras';

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(nombre);
  const [saving, setSaving] = useState(false);

  const handleStartEdit = () => {
    setNewName(nombre);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewName(nombre);
  };

  const handleSaveName = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      Alert.alert('Nombre vacío', 'Escribe un nombre para tu perfil.');
      return;
    }
    try {
      setSaving(true);
      await updateUsername(trimmed);
      setIsEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el nombre.';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor }}
      contentContainerStyle={[styles.container, { backgroundColor }]}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: titleColor }]}>Mi perfil</Text>
          <Text style={[styles.subtitle, { color: subtitleColor }]}>Gestiona tu información, preferencias y experiencia de viaje.</Text>
        </View>
        <View style={styles.themeSwitchRow}>
          <Text style={[styles.themeLabel, { color: subtitleColor }]}>{isDark ? 'Noche' : 'Día'}</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#d1d5db', true: '#4b5563' }}
            thumbColor={isDark ? '#f9fafb' : '#ffffff'}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: cardBackground, borderColor: cardBorderColor }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarCircle, { backgroundColor: isDark ? '#2563eb' : '#22c55e' }]}>
            <Text style={styles.avatarText}>{(nombre || correo).charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={[styles.name, { color: nameColor }]}>{nombre}</Text>
            <Text style={[styles.email, { color: emailColor }]}>{correo}</Text>
          </View>
        </View>

        {isEditing && (
          <View style={styles.editBlock}>
            <Text style={styles.editLabel}>Editar nombre</Text>
            <TextInput
              style={styles.editInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Tu nombre"
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.editButtonsRow}>
              <Pressable
                style={[styles.smallButton, styles.cancelButton]}
                onPress={handleCancelEdit}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.smallButton, styles.saveButton]}
                onPress={handleSaveName}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: infoLabelColor }]}>Tipo de viajero</Text>
          <Text style={[styles.infoValue, { color: infoValueColor }]}>{tipoViajero}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: infoLabelColor }]}>País base</Text>
          <Text style={[styles.infoValue, { color: infoValueColor }]}>Perú</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: cardBackground, borderColor: cardBorderColor }]}>
        <Text style={[styles.sectionTitle, { color: nameColor }]}>Preferencias de viaje</Text>
        <Text style={[styles.sectionText, { color: sectionTextColor }]}>
          · Prefiero viajes de 3 a 5 días{'\n'}
          · Presupuesto medio por viaje{'\n'}
          · Destinos con naturaleza y cultura
        </Text>
      </View>

      <Pressable style={[styles.primaryButton, { backgroundColor: primaryButtonBg }]} onPress={handleStartEdit}>
        <Text style={[styles.primaryButtonText, { color: primaryButtonTextColor }]}>Editar perfil</Text>
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, { backgroundColor: dangerButtonBg, borderColor: dangerBorder }]}
        onPress={() => {
          logout();
          router.replace('/login');
        }}
      >
        <Text style={[styles.secondaryButtonText, { color: secondaryTextColor }]}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}
