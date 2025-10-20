import { useState } from "react";

export default function VoiceChat() {
  const [recording, setRecording] = useState(false);
  const [response, setResponse] = useState("");

  async function sendAudio(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "input.wav");

    const res = await fetch("http://localhost:5000/sts", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    setResponse(data.llm_response);

    // reproducir audio generado
    if (data.audio_base64) {
      const audio = new Audio("data:audio/mp3;base64," + data.audio_base64);
      audio.play();
    }

    // acción sugerida por el LLM
    if (data.action === "show_profile") {
      window.location.href = "/perfil";
    }
  }

  async function recordAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      await sendAudio(audioBlob);
    };

    if (!recording) {
      setRecording(true);
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 4000); // graba 4 segundos
    } else {
      setRecording(false);
      mediaRecorder.stop();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Asistente por voz - PerúGo</h1>
      <button onClick={recordAudio}>
        {recording ? "Detener grabación" : "Hablar"}
      </button>
      <p>Respuesta: {response}</p>
    </div>
  );
}
