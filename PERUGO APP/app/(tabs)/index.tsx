import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, TextInput, ImageBackground, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { Header } from '../../components/Header';
import { styles } from './index.styles';
import { useUiTheme } from '../../src/context/UiThemeContext';
import { useChat } from '../../src/context/ChatContext';
import * as FileSystem from "expo-file-system";

export default function HomeScreen() {
  const { theme } = useUiTheme();
  const router = useRouter();
  const { setExternalUserMessage, addGeneratedConversation } = useChat();
  const [searchText, setSearchText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const isRecording = !!recording;
  const isDark = theme === 'dark';
  const micBackground = isDark ? '#111827' : '#ffffff';
  const micIconColor = isDark ? '#e5e7eb' : '#111827';
  const searchBackground = isDark ? '#111827' : '#ffffff';
  const searchInputColor = isDark ? '#e5e7eb' : '#111827';
  const searchPlaceholderColor = '#9ca3af';
  const brandTitleColor = isDark ? '#f9fafb' : undefined;
  const brandSubtitleColor = isDark ? '#e5e7eb' : undefined;

  const STT_URL = "https://perugobackend-flask-production.up.railway.app/sts";

  const handleSearchToChat = useCallback(async () => {
    const value = searchText.trim();
    if (!value) return;
    await setExternalUserMessage(value);
    router.push('/(tabs)/chat');
  }, [router, searchText, setExternalUserMessage]);

  const toggleHomeRecording = useCallback(async () => {
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

        // Configuración para Android (AMR) e iOS (WAV)
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

        await current.stopAndUnloadAsync();
        const uri = current.getURI();

        if (!uri) {
          Alert.alert("Error", "No se pudo obtener el audio grabado.");
          return;
        }

        // Leer archivo y enviar al backend
        try {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const response = await fetch(STT_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              audio_base64: base64,
            }),
          });

          const data = await response.json();
          console.log("Respuesta Index:", data);

          // LÓGICA CORREGIDA:
          // data.stt_text = Lo que dijo el usuario
          // data.llm_response = Lo que respondió la IA
          if (data.stt_text && data.llm_response) {
            // Inyectamos la conversación en el historial sin disparar otro fetch
            addGeneratedConversation(data.stt_text, data.llm_response);
            // Redirigimos al chat
            router.push('/(tabs)/chat');
          } else if (data.stt_text) {
            // Si solo hay texto de usuario, lo ponemos en el buscador
            setSearchText(data.stt_text);
          } else {
            Alert.alert("No se detectó voz", "Intenta hablar más fuerte.");
          }

        } catch (err) {
          console.error("Error enviando audio:", err);
          Alert.alert("Error", "No se pudo procesar el audio.");
        }
      }

    } catch (e) {
      console.error("Error en grabación:", e);
      setRecording(null);
    }
  }, [recording, addGeneratedConversation, router]);

  return (
    <View style={styles.screen}>
      <Header />
      <ImageBackground
        source={require('../../assets/images/home-hero.jpg')}
        style={styles.heroBackground}
        imageStyle={styles.heroImage}
      >
        <View style={[styles.heroOverlay, isDark ? styles.heroOverlayDark : styles.heroOverlayLight]}>
          <View style={styles.content}>
            <View style={styles.titleBlock}>
              <Text style={[styles.brandTitle, brandTitleColor ? { color: brandTitleColor } : null]}>PeruGo</Text>
              <Text style={[styles.brandSubtitle, brandSubtitleColor ? { color: brandSubtitleColor } : null]}>El Perú te habla</Text>
            </View>

            <Pressable
              style={[styles.micButton, { backgroundColor: micBackground }]}
              onPress={toggleHomeRecording}
            >
              <Feather
                name="mic"
                size={40}
                color={isRecording ? '#b91c1c' : micIconColor}
              />
            </Pressable>

            <View style={[styles.searchBox, { backgroundColor: searchBackground }]}>
              <TextInput
                placeholder="Busca un destino o di algo..."
                placeholderTextColor={searchPlaceholderColor}
                style={[styles.searchInput, { color: searchInputColor }]}
                value={searchText}
                onChangeText={setSearchText}
              />
              <Pressable onPress={handleSearchToChat}>
                <Feather name="search" size={20} color={searchInputColor} />
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
