import React, { useState, useRef, useEffect } from "react";

export default function VoiceSearch() {
  const [record, setRecord] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef(null);
  const [results, setResults] = useState([]);
  const idioma = "es-PE";
  const runingRef = useRef(false);

  // Crear y configurar reconocimiento
  const createRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta el reconocimiento de voz, usa Chrome");
      return null;
    }

    const temp = new SpeechRecognition();
    temp.lang = idioma;
    temp.interimResults = false;
    temp.maxAlternatives = 1;

    temp.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      console.log("Texto reconocido:", transcript);
      setText(transcript);
    };

    temp.onstart = () => {
      console.log("speechRecognition onstart");
    };

    temp.onend = () => {
      console.log("speechRecognition ended");
      runingRef.current = false;
      setRecord(false);
    };

    temp.onerror = (e) => {
      console.error("speechRecognition", e);
      runingRef.current = false;
      setRecord(false);
    };

    return temp;
  };

  const iniciar = () => {
    if (runingRef.current) {
      console.log("ya estas grabando, sin problemas");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
      if (!recognitionRef.current) {
        console.log("reconocimiento no disponible en este navegador");
        return;
      }
    }

    try {
      recognitionRef.current.start();
      runingRef.current = true;
      setRecord(true);
      console.log("reconocimiento iniciado");
    } catch (err) {
      console.error("Error al iniciar reconocimiento:", err);
    }
  };

  const detener = () => {
    if (recognitionRef.current && runingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Error al detener recognition", e);
      }
      runingRef.current = false;
      setRecord(false);
    }
    console.log("reconocimiento detenido");
  };

  const toggleRecord = () => {
    if (record) detener();
    else iniciar();
  };

  const handleSearch = () => {
    if (!text.trim()) return;

    const mockResults = [
      { id: 1, name: "Arequipa", type: "Ciudad", description: "Conocida como la Ciudad Blanca." },
      { id: 2, name: "Cusco", type: "Ciudad", description: "Capital del Imperio Inca." },
      { id: 3, name: "Lima", type: "Ciudad", description: "Capital del Perú y centro gastronómico." }
    ];

    const filtrados = mockResults.filter(r =>
      r.name.toLowerCase().includes(text.toLowerCase())
    );

    setResults(filtrados);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }
      runingRef.current = false;
    };
  }, []);

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={toggleRecord}>
          {record ? "Detener grabación" : "🎤 Iniciar grabación"}
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe o usa el micrófono..."
          style={{ flex: 1, padding: 6 }}
        />

        <button onClick={handleSearch}>Buscar</button>
      </div>

      <div>
        <h4>Resultados</h4>
        {results.length === 0 ? (
          <p>No hay resultados.</p>
        ) : (
          <ul>
            {results.map((element) => (
              <li key={element.id}>
                <strong>{element.name}</strong> — {element.type}
                <div>{element.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
