"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { speakText } from "@/functions/speakText"; // ✅ TTS nativo
import { Volume2 } from "lucide-react"; // 🔊 icono de parlante

const STORAGE_KEY = "perugo_chat";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const typingRef = useRef(false);
  const scrollRef = useRef(null);

  // --- enviar mensaje al historial ---
  const pushChat = useCallback((text, sender = "assistant") => {
    setMessages((prev) => [...prev, { sender, text, time: Date.now() }]);
  }, []);

    // ✅ nueva función que llama al backend Flask
  const fetchReplyFromBackend = useCallback(async (text) => {
  try {
    const res = await fetch("https://perugo-backend-production.up.railway.app/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    // ✅ Prioriza el campo "reply" si viene en formato JSON dentro de text_response
    let reply = "No se obtuvo respuesta.";
    if (typeof data.text_response === "string") {
      try {
        const parsed = JSON.parse(data.text_response);
        reply = parsed.reply || data.text_response;
      } catch {
        reply = data.text_response;
      }
    }

    // ✅ Si viene audio, reproducirlo
    if (data.audio_base64) {
      const audio = new Audio("data:audio/mp3;base64," + data.audio_base64);
      audio.play();
    }

    return reply;
  } catch (err) {
    console.error("Error comunicando con backend:", err);
    return "Error al conectar con el servidor.";
  }
}, []);



  // --- generar respuesta automática ---
  /*const generateReply = useCallback((inputText) => {
    const text = String(inputText || "").toLowerCase();
    if (!text) return "¿En qué puedo ayudarte?";
    if (text.includes("hotel") || text.includes("alojamiento"))
      return "Puedo mostrarte hoteles cerca del destino. ¿Quieres filtrar por precio, estrellas o ubicación?";
    if (text.includes("restaurante") || text.includes("comida"))
      return "¿Prefieres comida tradicional peruana, mariscos o alguna restricción alimentaria?";
    if (text.includes("vuelo") || text.includes("aeropuerto"))
      return "¿Deseas priorizar el precio o la duración del vuelo?";
    if (text.includes("plan") || text.includes("itinerario"))
      return "Te propongo un itinerario base: Día 1 llegada y city tour, Día 2 actividad principal, Día 3 retorno. ¿Lo adapto?";
    if (text.includes("precio") || text.includes("costo"))
      return "Estimación rápida: alojamiento S/120–350/noche, comida S/40–80/día, tours S/150–600 según actividad.";
    if (text.includes("gracias") || text.includes("perfecto"))
      return "¡De nada! ¿Quieres que lo guarde en Mis Planes?";
    if (text.includes("mostrar") || text.includes("opciones"))
      return "Aquí te muestro algunas opciones simuladas.";
    return "Entiendo. ¿Qué quieres hacer primero: buscar hoteles, ver itinerarios o estimar precios?";
  }, []); */

  const assistantReply = useCallback(
    async (toText) => {
      if (typingRef.current) return;
      typingRef.current = true;

      // Mensaje temporal "Escribiendo..."
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Escribiendo…", time: Date.now() },
      ]);

      try {
        const reply = await fetchReplyFromBackend(toText);

        setMessages((prev) => {
          const copy = [...prev];
          // eliminar "Escribiendo..."
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].sender === "assistant" && copy[i].text === "Escribiendo…") {
              copy.splice(i, 1);
              break;
            }
          }
          copy.push({ sender: "assistant", text: String(reply), time: Date.now() });
          return copy;
        });
      } finally {
        typingRef.current = false;
      }
    },
    [fetchReplyFromBackend]
  );


  // --- enviar mensaje del usuario ---
  const handleSend = useCallback(
    (externalText = null) => {
      const v = (externalText ? externalText : input).trim();
      if (!v) return;
      pushChat(v, "user");
      setInput("");
      assistantReply(v);
    },
    [input, pushChat, assistantReply]
  );


  // --- reproducir último mensaje del asistente ---
  const handleSpeak = useCallback(async () => {
    const assistantMsgs = messages.filter(
      (m) => m.sender === "assistant" && m.text !== "Escribiendo…"
    );
    if (assistantMsgs.length === 0) return;
    const last = assistantMsgs[assistantMsgs.length - 1];
    try {
      setIsSpeaking(true);
      await speakText(last.text);
    } catch (e) {
      console.error("Error reproduciendo mensaje:", e);
    } finally {
      setIsSpeaking(false);
    }
  }, [messages]);

  // --- cargar mensajes guardados ---
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(stored) && stored.length) setMessages(stored);
      else {
        const welcome = [
          {
            sender: "assistant",
            text: "Hola 👋 soy tu asistente PerúGo. ¿En qué puedo ayudarte hoy?",
            time: Date.now(),
          },
        ];
        setMessages(welcome);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(welcome));
      }
    } catch (e) {
      console.error("Error leyendo chat:", e);
    }

    const suggestFn = (text) => {
      if (!text) return;
      pushChat(text, "user");
      assistantReply(text);
    };
    window.suggest = suggestFn;

    const onQuickSuggest = (e) => {
      const txt = e && e.detail ? e.detail : null;
      if (txt) suggestFn(txt);
    };
    window.addEventListener("perugo.quickSuggest", onQuickSuggest);

    return () => {
      window.removeEventListener("perugo.quickSuggest", onQuickSuggest);
      try {
        if (window.suggest === suggestFn) delete window.suggest;
      } catch {}
    };
  }, [pushChat, assistantReply]);

  // --- 🔥 NUEVO: escuchar mensajes desde Hero o Header ---
  useEffect(() => {
    const onChatMessage = (e) => {
      const txt = e?.detail?.text;
      if (txt && txt.trim()) {
        pushChat(txt, "user");
        assistantReply(txt);
      }
    };
    window.addEventListener("chatMessage", onChatMessage);
    return () => window.removeEventListener("chatMessage", onChatMessage);
  }, [pushChat, assistantReply]);

  // --- guardar historial ---
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Error guardando chat:", e);
    }
  }, [messages]);

  // --- autoscroll ---
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  
  // Mostrar/Ocultar chat
  const toggleOpen = useCallback(() => setIsOpen(o => !o), []);
// --- render ---
  return (
    <>
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? "Ocultar chat" : "Abrir chat"}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 9999,
          width: 48,
          height: 48,
          borderRadius: "9999px",
          border: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          background: isOpen ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#10b981,#059669)",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer"
        }}
        title={isOpen ? "Ocultar" : "Chat"}
      >
        {isOpen ? "–" : "💬"}
      </button>

      <div id="chat" role="dialog" aria-label="Asistente de viaje" style={isOpen ? {} : { display: "none" }}>
      <header>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontWeight: 800 }}>PerúGo</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Asistente</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div id="chatStatus" style={{ fontSize: 13, opacity: 0.9 }}>
            En línea
          </div>
        </div>
      </header>

      <div
        className="messages"
        ref={scrollRef}
        style={{ flex: 1, overflow: "auto", padding: 12 }}
      >
        {messages.map((msg, i) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={i}
              className={`msg ${isUser ? "user" : "assistant"}`}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "78%",
                display: "flex",
                gap: 8,
                alignItems: "flex-end",
                marginBottom: 8,
              }}
            >
              {!isUser && (
                <span
                  className="avatar"
                  aria-hidden="true"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
                    alt="assistant"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </span>
              )}

              <div
                className="bubble"
                style={{
                  padding: 8,
                  borderRadius: 8,
                  background: isUser
                    ? "linear-gradient(90deg,var(--accent),#00cfe8)"
                    : "#fff",
                  color: isUser ? "#fff" : "#06202b",
                  boxShadow: isUser
                    ? "0 2px 6px rgba(0,0,0,0.15)"
                    : "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
                  {msg.text}
                </div>
              </div>

              {isUser && (
                <span
                  className="avatar"
                  aria-hidden="true"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"
                    alt="user"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="input"
        style={{
          display: "flex",
          gap: 8,
          padding: 12,
          borderTop: "1px solid #eef6fb",
          background: "linear-gradient(180deg,#fff,#f7fbff)",
        }}
      >
        <input
          id="chatInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Escribe aquí..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #eef6fb",
          }}
          aria-label="Entrada de chat"
        />

        <button
          onClick={handleSpeak}
          title="Reproducir último mensaje"
          style={{
            padding: 10,
            borderRadius: "50%",
            background: isSpeaking
              ? "linear-gradient(135deg,#34d399,#059669)"
              : "linear-gradient(135deg,#3b82f6,#2563eb)",
            border: "none",
            color: "white",
            boxShadow: isSpeaking
              ? "0 0 12px rgba(52,211,153,0.8)"
              : "0 0 10px rgba(59,130,246,0.6)",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            transform: isSpeaking ? "scale(1.05)" : "scale(1)",
          }}
        >
          <Volume2 size={20} />
        </button>

        <button
          className="primary"
          onClick={() => handleSend()}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "linear-gradient(90deg,var(--accent),#00cfe8)",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            transition: "0.2s ease-in-out",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
    </>
  );
}


