"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { speakText } from "@/functions/speakText";
import { Volume2 } from "lucide-react";
import "./Chat.css";

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
    setIsSpeaking(true);
    await speakText(last.text);
    setIsSpeaking(false);
  }, [messages]);

  // 🔹 Inicializa mensajes del chat
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (stored.length) setMessages(stored);
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
  }, []);

  // 🔹 Guarda los mensajes nuevos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // 🔹 Escucha el evento global "chatMessage" desde Hero o Header
  useEffect(() => {
    const handleExternalChat = (e) => {
      const text = e.detail?.text;
      if (text && text.trim()) {
        pushChat(text, "user");
        assistantReply(text);
      }
    };

    window.addEventListener("chatMessage", handleExternalChat);
    return () => window.removeEventListener("chatMessage", handleExternalChat);
  }, [pushChat, assistantReply]);

  // 🔹 Toggle con tecla "/"
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
      <div
        id="chat-wrapper"
        className="chat-wrapper"
      >
        {/* Botón de abrir/cerrar chat */}
        <button
          onClick={toggleOpen}
          aria-label={isOpen ? "Ocultar chat" : "Abrir chat"}
          className={`chat-toggle ${isOpen ? "open" : ""}`}
        >
          {isOpen ? "▽" : "△"}
        </button>

        <div
          role="dialog"
          aria-label="Asistente de viaje"
          className={`chat-dialog ${isOpen ? "open" : ""}`}
        >
          <header className="chat-header">
            <span>PerúGo Asistente</span>
            <span style={{ fontSize: 12 }}>En línea</span>
          </header>

          <div
            ref={scrollRef}
            className="chat-body"
          >
            {messages.map((msg, i) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={i}
                  className={`message-row ${isUser ? "user" : "assistant"}`}
                >
                  <div className={`message-bubble ${isUser ? "user" : "assistant"}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chat-input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe aquí..."
              className="chat-input"
            />
            <button
              onClick={handleSpeak}
              className={`speak-btn ${isSpeaking ? "speaking" : ""}`}
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
