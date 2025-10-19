"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { speakText } from "@/functions/speakText"; // ✅ usamos tu TTS nativo

const STORAGE_KEY = "perugo_chat";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const typingRef = useRef(false);
  const scrollRef = useRef(null);

  // --- enviar mensaje al historial ---
  const pushChat = useCallback((text, sender = "assistant") => {
    setMessages((prev) => [...prev, { sender, text, time: Date.now() }]);
  }, []);

  // --- generar respuesta automática ---
  const generateReply = useCallback((inputText) => {
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
  }, []);

  // --- respuesta del asistente ---
  const assistantReply = useCallback(
    (toText) => {
      if (typingRef.current) return;
      typingRef.current = true;

      // Mensaje temporal "Escribiendo..."
      setMessages((prev) => [...prev, { sender: "assistant", text: "Escribiendo…", time: Date.now() }]);

      const delay = 600 + Math.random() * 900;
      setTimeout(() => {
        const reply = generateReply(toText);
        setMessages((prev) => {
          const copy = [...prev];
          // Eliminar "Escribiendo..."
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].sender === "assistant" && copy[i].text === "Escribiendo…") {
              copy.splice(i, 1);
              break;
            }
          }
          const newMsg = { sender: "assistant", text: String(reply), time: Date.now() };
          copy.push(newMsg);
          // 🗣️ Reproducir voz al responder
          speakText(newMsg.text);
          return copy;
        });
        typingRef.current = false;
      }, delay);
    },
    [generateReply]
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
        // 🗣️ voz inicial
        speakText(welcome[0].text);
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
      } catch (e) {}
    };
  }, [pushChat, assistantReply]);

  // --- mensajes desde Hero ---
  useEffect(() => {
    const handleChatEvent = (e) => {
      const message = e.detail.text;
      if (message && typeof handleSend === "function") {
        handleSend(message);
      }
    };
    window.addEventListener("chatMessage", handleChatEvent);
    return () => window.removeEventListener("chatMessage", handleChatEvent);
  }, [handleSend]);

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
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // --- render ---
  return (
    <div id="chat" role="dialog" aria-label="Asistente de viaje">
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

      <div className="messages" ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: 12 }}>
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
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                }}
              >
                <div style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>{msg.text}</div>
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
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
          className="primary"
          onClick={() => handleSend()}
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
