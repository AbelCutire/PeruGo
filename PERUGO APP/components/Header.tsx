import React, { useCallback, useState } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { styles } from './header.styles';
import { useUiTheme } from '../src/context/UiThemeContext';
import { useAuth } from '../src/context/AuthContext';
import { useChat } from '../src/context/ChatContext';
import * as FileSystem from "expo-file-system";

export function Header() {
  const { theme, toggleTheme } = useUiTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { addGeneratedConversation } = useChat(); // Usamos la nueva función
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const isRecording = !!recording;

  const headerBackground = theme === 'light' ? '#8d1116' : '#4b0b0e';
  const themeIconName = theme === 'light' ? 'sun' : 'moon';
  const themeIconColor = theme === 'light' ? '#111827' : '#e5e7eb';

  const STT_URL = 'https://perugobackend-flask-production.up.railway.app/sts';

  const toggleHeaderRecording = useCallback(async () => {
    try {
      if (!recording) {
        const perm = await Audio.requestPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permiso denegado', 'Necesitamos acceso al micrófono.');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const rec = new Audio.Recording();
        
        await rec.prepareToRecordAsync({
          android: {
            extension: '.amr',
            outputFormat: Audio.AndroidOutputFormat.AMR_WB,
            audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            outputFormat: Audio.IOSOutputFormat.LINEARPCM,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        });
        
        await rec.startAsync();
        setRecording(rec);
      } else {
        const current = recording;
        setRecording(null);
        
        try {
          await current.stopAndUnloadAsync();
          const uri = current.getURI();
          
          if (!uri) {
            Alert.alert('Error', 'No se pudo obtener el audio grabado.');
            return;
          }

          // Usamos JSON/Base64 para consistencia con index.tsx
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log('📤 Enviando audio (Header)...');

          const response = await fetch(STT_URL, {
            method: 'POST',
            body: JSON.stringify({
              audio_base64: base64,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
          }

          const data = await response.json();
          console.log('✅ Respuesta Header:', data);

          // LÓGICA CORREGIDA:
          if (data.stt_text && data.llm_response) {
            // Usuario -> stt_text | IA -> llm_response
            addGeneratedConversation(data.stt_text, data.llm_response);
            router.push('/(tabs)/chat');
          } else {
            Alert.alert('No se detectó voz', 'Intenta hablar más fuerte.');
          }

        } catch (error) {
          console.error('❌ Error procesando audio:', error);
          Alert.alert('Error', 'No se pudo procesar el audio.');
        }
      }
    } catch (error) {
      console.error('❌ Error en grabación:', error);
      if (recording) {
        try { await recording.stopAndUnloadAsync(); } catch (e) {}
        setRecording(null);
      }
    }
  }, [recording, router, addGeneratedConversation]);

  return (
    <View style={[styles.header, { backgroundColor: headerBackground }]}>
      <View style={styles.headerLeft}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/images/perugo-logo.png')}
            style={styles.logoImage}
          />
        </View>
        <View>
          <Text style={styles.headerLogo}>PeruGo</Text>
          <Text style={styles.headerSubtitle}>El Perú te habla</Text>
        </View>
      </View>

      <View style={styles.headerButtonsRow}>
        <Pressable style={styles.iconButton} onPress={toggleHeaderRecording}>
          <Feather name="mic" size={20} color={isRecording ? '#b91c1c' : '#111827'} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={toggleTheme}>
          <Feather name={themeIconName} size={20} color={themeIconColor} />
        </Pressable>

        {user ? (
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/perfil')}
          >
            <Feather name="user" size={20} color="#111827" />
          </Pressable>
        ) : (
          <>
            <Pressable
              style={styles.authButtonPrimary}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.authButtonPrimaryText}>Iniciar sesión</Text>
            </Pressable>
            <Pressable
              style={styles.authButtonSecondary}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.authButtonSecondaryText}>Registrarse</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
