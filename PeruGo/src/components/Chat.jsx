"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { speakText } from "@/functions/speakText";
import { Volume2 } from "lucide-react";
import "./chat.css";

const STORAGE_KEY = "perugo_chat";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
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

  const assistantReply = useCallback(async (toText) => {
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
  }, [fetchReplyFromBackend]);

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
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyToggle);
    return () => window.removeEventListener("keydown", handleKeyToggle);
  }, []);

  const toggleOpen = useCallback(() => setIsOpen((o) => !o), []);

  return (
    <>
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? "Ocultar chat" : "Abrir chat"}
        className="chat-toggle"
        title={isOpen ? "Ocultar" : "Chat"}
      >
        {isOpen ? "–" : "/"}
      </button>

      <div id="chat" role="dialog" aria-label="Asistente de viaje" className={isOpen ? "chat" : "hidden"}>
        <header className="chat-header">
          <div className="chat-title">
            <div className="chat-name">PerúGo</div>
            <div className="chat-role">Asistente</div>
          </div>
          <div className="chat-status">En línea</div>
        </header>

        <div className="messages" ref={scrollRef}>
          {messages.map((msg, i) => {
            const isUser = msg.sender === "user";
            return (
              <div key={i} className={`msg ${isUser ? "user" : "assistant"}`}>
                {!isUser && (
                  <span className="avatar">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
                      alt="assistant"
                    />
                  </span>
                )}

                <div className={`bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}>
                  <div>{msg.text}</div>
                </div>

                {isUser && (
                  <span className="avatar">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"
                      alt="user"
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="input">
          <input
            id="chatInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Escribe aquí..."
            aria-label="Entrada de chat"
          />

          <button
            onClick={handleSpeak}
            title="Reproducir último mensaje"
            className={`speak-btn ${isSpeaking ? "speaking" : ""}`}
          >
            <Volume2 size={20} />
          </button>

          <button className="primary" onClick={() => handleSend()}>
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}
