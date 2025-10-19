// src/components/funciones/useVoiceRecognition.js
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useVoiceRecognition
 * - idioma: string, e.g. "es-PE"
 * - options: { interimResults:boolean, continuous:boolean, autoSendOnEnd:boolean }
 *
 * Devuelve:
 * { listening, start, stop, toggle, lastTranscript, error }
 *
 * También acepta un callback onResult(transcript, isFinal) si quieres manejar resultados parciales.
 */
export function useVoiceRecognition({
  idioma = "es-PE",
  interimResults = false,
  continuous = false,
  autoSendOnEnd = true,
  onResult = null, // function(transcript: string, isFinal: boolean)
} = {}) {
  const recognitionRef = useRef(null);
  const runningRef = useRef(false);
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [error, setError] = useState(null);

  const createRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(new Error("SpeechRecognition no soportado"));
      return null;
    }

    const recog = new SpeechRecognition();
    recog.lang = idioma;
    recog.interimResults = interimResults;
    recog.maxAlternatives = 1;
    recog.continuous = continuous;

    recog.onresult = (event) => {
      // arma transcript (puede contener solo el resultado final o parcia)
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setLastTranscript(transcript);
      if (typeof onResult === "function") {
        // si interimResults=true puede venir isFinal en event.results[*].isFinal,
        // pero para simplicidad enviamos isFinal = !interimResults
        onResult(transcript, !interimResults);
      }
    };

    recog.onstart = () => {
      // limpia errores previos
      setError(null);
    };

    recog.onend = () => {
      runningRef.current = false;
      setListening(false);
    };

    recog.onerror = (e) => {
      setError(e.error ? new Error(e.error) : e);
      runningRef.current = false;
      setListening(false);
    };

    return recog;
  }, [idioma, interimResults, continuous, onResult]);

  const start = useCallback(() => {
    if (runningRef.current) return;
    if (!recognitionRef.current) recognitionRef.current = createRecognition();
    if (!recognitionRef.current) {
      // no soportado
      return;
    }
    try {
      recognitionRef.current.start();
      runningRef.current = true;
      setListening(true);
    } catch (e) {
      setError(e);
      runningRef.current = false;
      setListening(false);
    }
  }, [createRecognition]);

  const stop = useCallback(() => {
    if (recognitionRef.current && runningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      runningRef.current = false;
      setListening(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  useEffect(() => {
    // cleanup on unmount
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
      runningRef.current = false;
    };
  }, []);

  return {
    listening,
    start,
    stop,
    toggle,
    lastTranscript,
    error,
  };
}
