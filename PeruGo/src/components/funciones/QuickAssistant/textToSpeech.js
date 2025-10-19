/**
 * textToSpeech.js
 * Convierte texto a voz usando la API Web Speech (nativa del navegador).
 * ------------------------------------------
 * Uso:
 *   import { speakText } from './textToSpeech';
 *   await speakText("Hola, bienvenido a PeruGo!");
 */

export async function speakText(text, voiceLang = "es-ES") {
  try {
    if (!text || !window.speechSynthesis) {
      console.warn("❌ El navegador no soporta síntesis de voz (speechSynthesis).");
      return;
    }

    // Crear el objeto de voz
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.rate = 1; // velocidad normal
    utterance.pitch = 1; // tono normal
    utterance.volume = 1; // volumen máximo

    // Intentar seleccionar una voz en español si existe
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find((v) => v.lang.includes("es")) ||
      voices.find((v) => v.lang.includes("en")) ||
      null;

    if (selectedVoice) utterance.voice = selectedVoice;

    // Reproducir el audio
    window.speechSynthesis.cancel(); // detener cualquier voz anterior
    window.speechSynthesis.speak(utterance);

    console.log("🔊 Reproduciendo voz:", text);
  } catch (err) {
    console.error("Error en speakText:", err);
  }
}
