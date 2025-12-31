import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { styles } from './registerStyles';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Campos incompletos', 'Completa correo y ambas contraseñas.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Contraseñas no coinciden', 'Asegúrate de que ambas contraseñas sean iguales.');
      return;
    }

    try {
      setLoading(true);
      await register(username, email, password);
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo registrar el usuario.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoLogin = () => {
    router.push('/login');
  };

  return (
    <ImageBackground
      source={require('../assets/images/home-hero.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.centerWrapper}>
            <View style={styles.card}>
              <Text style={styles.title}>Crear cuenta</Text>

              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario (opcional)"
                placeholderTextColor="#6b7280"
                value={username}
                onChangeText={setUsername}
              />

              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#6b7280"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Contraseña (mínimo 6 caracteres)"
                placeholderTextColor="#6b7280"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#6b7280"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <Pressable style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
                <Text style={styles.primaryButtonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
              </Pressable>

              <Pressable style={styles.linkButton} onPress={handleGoLogin}>
                <Text style={styles.linkText}>¿Ya tienes cuenta? Iniciar sesión</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
