import { useState, useEffect, useRef } from "react";
import { speakText } from "./textToSpeech"; // integración de TTS local

// Compatibilidad con navegadores
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function useQuickAssistant() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Inicialización del reconocimiento de voz
  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "es-ES";

      recognitionRef.current.onstart = () => setListening(true);
      recognitionRef.current.onend = () => setListening(false);

      // Cuando el usuario termina de hablar
      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript.trim();
        processSpeechInput(text);
      };
    } else {
      console.warn("⚠️ El navegador no soporta reconocimiento de voz.");
    }
  }, []);

  // --- Funciones principales ---

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      alert("Tu navegador no soporta reconocimiento de voz.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const processSpeechInput = (text) => {
    if (!text.trim()) return;
    setInputValue(text);
    handleSend(text);
  };

  const handleSend = (text = inputValue) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // Mensaje del usuario
    const userMessage = { sender: "user", text: trimmedText };
    // Respuesta automática
    const botResponse = generateResponse(trimmedText);

    // ✅ Actualizamos ambos mensajes
    setMessages((prev) => [...prev, userMessage, botResponse]);

    // 🗣️ Reproducir respuesta en voz
    speakText(botResponse.text);

    // Limpiamos el input
    setInputValue("");
  };

  // --- Respuestas automáticas simples ---
  const generateResponse = (text) => {
    const lower = text.toLowerCase();
    let response = "No entiendo bien eso, ¿podrías repetirlo?";

    if (lower.includes("hola"))
      response = "¡Hola! ¿Cómo estás? 😊";
    else if (lower.includes("arequipa"))
      response = "Arequipa es una hermosa ciudad del sur del Perú.";
    else if (lower.includes("cusco"))
      response = "Cusco fue la capital del Imperio Inca 🦙.";
    else if (lower.includes("lima"))
      response = "Lima es la capital del Perú, ubicada en la costa.";
    else if (lower.includes("adiós"))
      response = "¡Hasta pronto! 👋";

    return { sender: "bot", text: response };
  };

  return {
    inputValue,
    setInputValue,
    messages,
    handleSend,
    listening,
    startListening,
    stopListening,
  };
}
