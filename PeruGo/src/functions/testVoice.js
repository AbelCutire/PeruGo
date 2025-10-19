import { playTTS } from "./playTTS";

export async function testVoice() {
  console.log("🔊 Probando Google Cloud Text-to-Speech...");
  await playTTS("Hola, soy el asistente de PerúGo. Esta es una prueba de voz generada con Google Cloud.");
  console.log("✅ Si escuchaste la voz, la configuración es correcta.");
}
