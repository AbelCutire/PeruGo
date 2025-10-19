// src/components/funciones/VoiceSearch.jsx
"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useVoiceSearch - hook que conserva tus nombres originales.
 */
export default function useVoiceSearch({
  initialIdioma = "es-PE",
  mockResults = null,
} = {}) {
  const [record, setRecord] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);
  const [results, setResults] = useState([]);
  const idioma = initialIdioma;
  const runingRef = useRef(false);

  const createRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const temp = new SpeechRecognition();
    temp.lang = idioma;
    temp.interimResults = false;
    temp.maxAlternatives = 1;
    temp.continuous = false;

    temp.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    temp.onstart = () => {};
    temp.onend = () => {
      runingRef.current = false;
      setRecord(false);
    };
    temp.onerror = (e) => {
      console.warn("Error de reconocimiento de voz, intenta nuevamente.");
      runingRef.current = false;
      setRecord(false);
    };

    return temp;
  }, [idioma]);

  const iniciar = useCallback(() => {
    if (runingRef.current) return;
    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
      if (!recognitionRef.current) return;
    }
    try {
      recognitionRef.current.start();
      runingRef.current = true;
      setRecord(true);
    } catch (err) {
      console.error("Error al iniciar reconocimiento:", err);
      runingRef.current = false;
      setRecord(false);
    }
  }, [createRecognition]);

  const detener = useCallback(() => {
    if (recognitionRef.current && runingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Error al detener recognition", e);
      }
      runingRef.current = false;
      setRecord(false);
    }
  }, []);

  const toggleRecord = useCallback(() => {
    if (record) detener();
    else iniciar();
  }, [record, iniciar, detener]);

  const handleSearch = useCallback(() => {
    const mock = mockResults || [
      { id: 1, name: "Arequipa", type: "Ciudad", description: "Conocida como la Ciudad Blanca." },
      { id: 2, name: "Cusco", type: "Ciudad", description: "Capital del Imperio Inca." },
      { id: 3, name: "Lima", type: "Ciudad", description: "Capital del Perú y centro gastronómico." },
    ];
    const filtrados = mock.filter((r) => (r.name || "").toLowerCase().includes((text || "").toLowerCase()));
    setResults(filtrados);
  }, [text, mockResults]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    return () => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort && recognitionRef.current.abort();
        }
      } catch (e) {}
      recognitionRef.current = null;
      runingRef.current = false;
    };
  }, []);

  return {
    record,
    setRecord,
    text,
    setText,
    recognitionRef,
    results,
    setResults,
    idioma,
    runingRef,
    iniciar,
    detener,
    toggleRecord,
    handleSearch,
    handleKeyDown,
  };
}
