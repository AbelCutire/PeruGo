export async function playTTS(text) {
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      console.error("Error en TTS, usando fallback local");
      return null;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    audio.play();
  } catch (err) {
    console.error("❌ Error al reproducir TTS:", err);
  }
}
