// src/components/Chat.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";

const STORAGE_KEY = "perugo_chat";

export default function Chat() {
  const [messages, setMessages] = useState([]); // { sender: 'user'|'assistant', text, time }
  const [input, setInput] = useState("");
  const typingRef = useRef(false);
  const scrollRef = useRef(null);

  // pushChat estable (useCallback)
  const pushChat = useCallback((text, sender = "assistant") => {
    setMessages((prev) => {
      const next = [...prev, { sender, text, time: Date.now() }];
      return next;
    });
  }, []);

  // Cargar mensajes desde localStorage al montar
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(stored) && stored.length) {
        setMessages(stored);
      } else {
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

    // Exponer window.suggest para compatibilidad con otras secciones
    window.suggest = function (text) {
      if (!text) return;
      pushChat(text, "user");
      assistantReply(text);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // pushChat y assistantReply son estables por useCallback

  // Persistir mensajes en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Error guardando chat:", e);
    }
  }, [messages]);

  // Scroll hacia abajo cuando cambian mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Generador simple de respuesta (simulado)
  const generateReply = useCallback((inputText) => {
    const text = String(inputText || "").toLowerCase();
    if (!text) return "¿En qué puedo ayudarte?";
    if (text.includes("hotel") || text.includes("alojamiento"))
      return "Puedo mostrarte hoteles cerca del destino: ¿Quieres filtrar por precio, estrellas o ubicación?";
    if (text.includes("restaurante") || text.includes("comida"))
      return "¿Prefieres comida tradicional peruana, mariscos o alguna restricción alimentaria?";
    if (text.includes("vuelo") || text.includes("aeropuerto"))
      return "¿Priorizar precio o duración? Puedo buscar conexiones y comparar tarifas.";
    if (text.includes("plan") || text.includes("itinerario"))
      return "Te propongo un itinerario base: Día 1 llegada y city tour, Día 2 actividad principal, Día 3 retorno. ¿Lo adapto?";
    if (text.includes("precio") || text.includes("costo"))
      return "Estimación rápida: alojamiento S/120–350/noche, comida S/40–80/día, tours S/150–600 según actividad.";
    if (text.includes("gracias") || text.includes("perfecto")) return "¡De nada! ¿Quieres que lo guarde en Mis Planes?";
    if (text.includes("mostrar") || text.includes("opciones")) return "Aquí te muestro algunas opciones (simulado).";
    return "Entiendo. ¿Qué quieres hacer primero: buscar hoteles, ver itinerarios o estimar precios?";
  }, []);

  // assistantReply estable
  const assistantReply = useCallback(
    (toText) => {
      if (typingRef.current) return;
      typingRef.current = true;

      // insertar indicador de "Escribiendo…" como mensaje temporal
      setMessages((prev) => [...prev, { sender: "assistant", text: "Escribiendo…", time: Date.now() }]);

      const delay = 600 + Math.random() * 900;
      setTimeout(() => {
        const reply = generateReply(toText);

        setMessages((prev) => {
          // quitar el último "Escribiendo…"
          const copy = [...prev];
          // buscar desde atrás el último mensaje de assistant con texto "Escribiendo…"
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].sender === "assistant" && copy[i].text === "Escribiendo…") {
              copy.splice(i, 1);
              break;
            }
          }
          // agregar respuesta real
          copy.push({ sender: "assistant", text: String(reply), time: Date.now() });
          return copy;
        });

        typingRef.current = false;
      }, delay);
    },
    [generateReply]
  );

  // Enviar mensaje (desde input)
  const handleSend = () => {
    const v = input.trim();
    if (!v) return;
    pushChat(v, "user");
    setInput("");
    assistantReply(v);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
          <button className="ghost" style={{ background: "transparent", border: 0, color: "#fff", padding: "6px 8px", borderRadius: 8 }}>
            _
          </button>
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
              }}
            >
              {/* avatar izquierdo para assistant */}
              {!isUser && (
                <span className="avatar" aria-hidden="true" style={{ width: 36, height: 36, borderRadius: 999, overflow: "hidden", flexShrink: 0 }}>
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=0e7a8c1b6a6d5e9c"
                    alt="assistant"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </span>
              )}

              {/* burbuja */}
              <div className="bubble" style={{ padding: 8, borderRadius: 8, background: isUser ? "linear-gradient(90deg,var(--accent),#00cfe8)" : "#fff", color: isUser ? "#fff" : "#06202b" }}>
                <div style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>{msg.text}</div>
              </div>

              {/* avatar derecho para user */}
              {isUser && (
                <span className="avatar" aria-hidden="true" style={{ width: 36, height: 36, borderRadius: 999, overflow: "hidden", flexShrink: 0 }}>
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=8f3b9a2e6b1f7c3d"
                    alt="user"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="input" style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eef6fb", background: "linear-gradient(180deg,#fff,#f7fbff)" }}>
        <input
          id="chatInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe aquí..."
          style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid #eef6fb" }}
          aria-label="Entrada de chat"
        />
        <button className="primary" id="chatSend" onClick={handleSend} style={{ padding: "10px 14px", borderRadius: 10 }}>
          Enviar
        </button>
      </div>
    </div>
  );
}
