"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { speakText } from "@/functions/speakText";
import { Volume2 } from "lucide-react";

const STORAGE_KEY = "perugo_chat";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const typingRef = useRef(false);
  const scrollRef = useRef(null);

  const pushChat = useCallback((text, sender = "assistant") => {
    setMessages((prev) => [...prev, { sender, text, time: Date.now() }]);
  }, []);

  const fetchReplyFromBackend = useCallback(async (text) => {
    try {
      const res = await fetch(
        "https://perugo-backend-production.up.railway.app/process",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      const data = await res.json();
      let reply = "No se obtuvo respuesta.";

      if (typeof data.text_response === "object" && data.text_response !== null) {
        reply = data.text_response.reply || JSON.stringify(data.text_response);
      } else if (typeof data.text_response === "string") {
        try {
          const parsed = JSON.parse(data.text_response);
          reply = parsed.reply || data.text_response;
        } catch {
          reply = data.text_response;
        }
      }

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

  const assistantReply = useCallback(
    async (toText) => {
      if (typingRef.current) return;
      typingRef.current = true;

      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Escribiendo…", time: Date.now() },
      ]);

      try {
        const reply = await fetchReplyFromBackend(toText);
        setMessages((prev) => {
          const copy = [...prev];
          const i = copy.findIndex(
            (m) => m.sender === "assistant" && m.text === "Escribiendo…"
          );
          if (i >= 0) copy.splice(i, 1);
          copy.push({ sender: "assistant", text: String(reply), time: Date.now() });
          return copy;
        });
      } finally {
        typingRef.current = false;
      }
    },
    [fetchReplyFromBackend]
  );

  const handleSend = useCallback(() => {
    const v = input.trim();
    if (!v) return;
    pushChat(v, "user");
    setInput("");
    assistantReply(v);
  }, [input, pushChat, assistantReply]);

  const handleSpeak = useCallback(async () => {
    const assistantMsgs = messages.filter(
      (m) => m.sender === "assistant" && m.text !== "Escribiendo…"
    );
    if (!assistantMsgs.length) return;
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Error guardando chat:", e);
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const handleKeyToggle = (e) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyToggle);
    return () => window.removeEventListener("keydown", handleKeyToggle);
  }, []);

  const toggleOpen = useCallback(() => setIsOpen((o) => !o), []);

  // estilos calculados
  const panelMaxHeight = isOpen ? "70vh" : "0";
  const panelPaddingTop = isOpen ? undefined : 0;

  return (
    /* WRAPPER: centrado y con overflow visible para que el botón no se recorte */
    <div
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 0,
        width: "min(840px, calc(100% - 32px))",
        zIndex: 9998,
        // permitir que el botón sobresalga del panel sin ser recortado
        overflow: "visible",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none", // evitar capturar eventos fuera del panel; los hijos individuales permitirán eventos cuando corresponda
      }}
    >
      {/* BOTÓN: absoluto respecto al wrapper, centrado en el borde superior del panel */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleOpen();
        }}
        aria-label={isOpen ? "Ocultar chat" : "Abrir chat"}
        style={{
          pointerEvents: "auto",
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "none",
          background: isOpen
            ? "linear-gradient(135deg,#2b6cf6,#0ea5e9)"
            : "linear-gradient(135deg,#444,#000)",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
          zIndex: 10000,
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title={isOpen ? "Cerrar" : "Abrir chat"}
      >
        {isOpen ? "–" : "/"}
      </button>

      {/* PANEL: el panel real — overflow hidden para colapsar y animar */}
      <div
        role="dialog"
        aria-label="Asistente de viaje"
        style={{
          pointerEvents: "auto",
          marginTop: 24, // separar del botón para que no colisionen visualmente
          width: "100%",
          maxWidth: 840,
          background: "#f9fbfd",
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -6px 30px rgba(0,0,0,0.12)",
          overflow: "hidden", // mantiene header oculto cuando closed
          transition: "max-height 400ms ease, box-shadow 200ms ease",
          maxHeight: panelMaxHeight,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER (queda dentro del panel y por tanto desaparecerá cuando maxHeight = 0) */}
        <header
          style={{
            background:
              "linear-gradient(90deg,var(--accent,#007aff),#00cfe8)",
            color: "white",
            padding: "12px 16px",
            fontWeight: 700,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontWeight: 800 }}>PerúGo</div>
            <div style={{ fontSize: 13, opacity: 0.95 }}>Asistente</div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div id="chatStatus" style={{ fontSize: 13, opacity: 0.95 }}>
              En línea
            </div>
          </div>
        </header>

        {/* Mensajes */}
        <div
          className="messages"
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 12,
            background: "#fff",
            minHeight: "120px",
            // en mobile ajusta altura para que no ocupe todo el viewport
            height: isOpen ? "50vh" : 0,
          }}
        >
          {messages.map((msg, i) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    background: isUser
                      ? "linear-gradient(90deg,var(--accent),#00cfe8)"
                      : "#eef6fb",
                    color: isUser ? "#fff" : "#06202b",
                    padding: 10,
                    borderRadius: 10,
                    maxWidth: "80%",
                    fontSize: 14,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex",
            padding: 12,
            borderTop: "1px solid #e0e6eb",
            background: "#f7fbff",
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
              border: "1px solid #ccd9e3",
            }}
            aria-label="Entrada de chat"
          />

          <button
            onClick={handleSpeak}
            title="Reproducir último mensaje"
            style={{
              marginLeft: 8,
              borderRadius: "50%",
              background: isSpeaking
                ? "linear-gradient(135deg,#34d399,#059669)"
                : "linear-gradient(135deg,#3b82f6,#2563eb)",
              border: "none",
              color: "white",
              boxShadow: isSpeaking
                ? "0 0 12px rgba(52,211,153,0.8)"
                : "0 0 10px rgba(59,130,246,0.6)",
              padding: 10,
              cursor: "pointer",
            }}
          >
            <Volume2 size={20} />
          </button>

          <button
            className="primary"
            onClick={() => handleSend()}
            style={{
              marginLeft: 8,
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
    </div>
  );
}
