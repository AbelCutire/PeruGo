import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { styles } from './loginStyles';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Ingresa tu correo y contraseña.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoRegister = () => {
    router.push('/register');
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
              <Text style={styles.title}>Iniciar sesión</Text>

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
                placeholder="Contraseña"
                placeholderTextColor="#6b7280"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
                <Text style={styles.primaryButtonText}>{loading ? 'Ingresando...' : 'Entrar'}</Text>
              </Pressable>

              <Pressable style={styles.linkButton} onPress={handleGoRegister}>
                <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}
