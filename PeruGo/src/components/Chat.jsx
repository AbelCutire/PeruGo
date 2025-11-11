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
      const res = await fetch("https://perugo-backend-production.up.railway.app/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
  
      if (!res.ok) return { reply: "Error al conectar con el servidor.", audio: null };
  
      const data = await res.json();
      let reply = "No se obtuvo respuesta.";
  
      if (typeof data.text_response === "object" && data.text_response !== null)
        reply = data.text_response.reply || JSON.stringify(data.text_response);
      else if (typeof data.text_response === "string") {
        try {
          const parsed = JSON.parse(data.text_response);
          reply = parsed.reply || data.text_response;
        } catch {
          reply = data.text_response;
        }
      }
  
      const audio = data.audio_base64 ? "data:audio/mp3;base64," + data.audio_base64 : null;
  
      // reproducir automáticamente
      if (audio) {
        try {
          const a = new Audio(audio);
          a.play().catch(() => console.warn("Autoplay bloqueado por navegador"));
        } catch (e) {
          console.error("Error al reproducir audio:", e);
        }
      }
  
      return { reply, audio };
    } catch {
      return { reply: "Error al conectar con el servidor.", audio: null };
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
          const i = copy.findIndex((m) => m.sender === "assistant" && m.text === "Escribiendo…");
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
    setIsSpeaking(true);
    await speakText(last.text);
    setIsSpeaking(false);
  }, [messages]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (stored.length) setMessages(stored);
    else {
      const welcome = [
        { sender: "assistant", text: "Hola 👋 soy tu asistente PerúGo. ¿En qué puedo ayudarte hoy?", time: Date.now() },
      ];
      setMessages(welcome);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(welcome));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
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

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          #chat-wrapper {
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
            width: calc(100% - 24px) !important;
          }
        }
      `}</style>

      <div
        id="chat-wrapper"
        style={{
          position: "fixed",
          right: 32,
          bottom: 0,
          width: 340,
          zIndex: 9998,
          overflow: "visible",
        }}
      >
        {/* Botón centrado sobre el header */}
        <button
          onClick={toggleOpen}
          aria-label={isOpen ? "Ocultar chat" : "Abrir chat"}
          style={{
            position: "absolute",
            top: 25,
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
          }}
        >
          {isOpen ? "–" : "/"}
        </button>

        <div
          role="dialog"
          aria-label="Asistente de viaje"
          style={{
            marginTop: 25,
            width: "100%",
            background: "#f9fbfd",
            borderRadius: "20px 20px 0 0",
            boxShadow: "0 -6px 30px rgba(0,0,0,0.12)",
            overflow: "hidden",
            transition: "max-height 0.4s ease-in-out",
            maxHeight: isOpen ? "70vh" : "0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <header
            style={{
              background: "linear-gradient(90deg,var(--accent,#007aff),#00cfe8)",
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
            <span>PerúGo Asistente</span>
            <span style={{ fontSize: 12 }}>En línea</span>
          </header>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 12,
              background: "#fff",
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
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              padding: 12,
              borderTop: "1px solid #e0e6eb",
              background: "#f7fbff",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe aquí..."
              style={{
                flex: 1,
                borderRadius: 8,
                border: "1px solid #ccd9e3",
                padding: 10,
              }}
            />
            <button
              onClick={handleSpeak}
              style={{
                marginLeft: 8,
                borderRadius: "50%",
                border: "none",
                background: isSpeaking
                  ? "linear-gradient(135deg,#34d399,#059669)"
                  : "linear-gradient(135deg,#3b82f6,#2563eb)",
                color: "#fff",
                padding: 10,
                cursor: "pointer",
              }}
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


