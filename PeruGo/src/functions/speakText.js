/**
 * speakText.js
 * Convierte texto en voz con pronunciación natural adaptada al español.
 */

function preprocessTextForSpeech(text) {
  if (!text) return "";

  return text
    // 💰 Monto tipo "S/120" → "120 soles"
    .replace(/S\/\.?\s*(\d+(?:[\.,]\d+)?)/gi, "$1 soles")

    // 💵 $20 → 20 dólares
    .replace(/\$\s*(\d+(?:[\.,]\d+)?)/g, "$1 dólares")

    // 💬 80% → 80 por ciento
    .replace(/(\d+)\s*%/g, "$1 por ciento")

    // 🕒 /noche, /día, /persona → "por noche", "por día", etc.
    .replace(/\/\s*noche/gi, " por noche")
    .replace(/\/\s*d[ií]a/gi, " por día")
    .replace(/\/\s*persona/gi, " por persona")
    .replace(/\/\s*semana/gi, " por semana")
    .replace(/\/\s*mes/gi, " por mes")

    // 🏷️ 120–350 → 120 a 350
    .replace(/–|-/g, " a ")

    // 🌡️ Unidades comunes
    .replace(/\bkm\b/gi, " kilómetros ")
    .replace(/\bm\/s\b/gi, " metros por segundo ")
    .replace(/°\s*C/gi, " grados Celsius ")
    .replace(/°\s*F/gi, " grados Fahrenheit ");
}

export async function speakText(text, voiceLang = "es-ES") {
  try {
    if (!text || !window.speechSynthesis) {
      console.warn("❌ El navegador no soporta síntesis de voz (speechSynthesis).");
      return;
    }

    // 🧠 Preprocesar texto antes de hablar
    text = preprocessTextForSpeech(text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // 🎙️ Seleccionar voz en español si existe
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find((v) => v.lang.includes("es")) ||
      voices.find((v) => v.lang.includes("en")) ||
      null;

    if (selectedVoice) utterance.voice = selectedVoice;

    // 🗣️ Reproducir
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    console.log("🔊 Reproduciendo voz:", text);
  } catch (err) {
    console.error("Error en speakText:", err);
  }
}
