"use client";
import React from "react";
import "./Hero.css";
import useVoiceSearch from "./funciones/VoiceSearch";

export default function Hero() {
  const {
    text,
    setText,
    record,
    toggleRecord,
    handleSearch,
  } = useVoiceSearch();

  // 🔥 Enviar texto al Chat (evento global)
  const sendToChat = (message) => {
    if (message && message.trim()) {
      window.dispatchEvent(
        new CustomEvent("chatMessage", { detail: { text: message } })
      );
    }
  };

  // 🔍 Ejecutar búsqueda + enviar al Chat
  const onSearchClick = () => {
    handleSearch();
    sendToChat(text);
    setText("");
  };

  // ⚡ Enviar con Enter
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // evita recargar la página
      onSearchClick(); // ejecuta la misma acción que la lupa
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        {/* Título principal */}
        <h1 className="hero-title">PerúGo</h1>
        <h2 className="hero-subtitle">El Perú te habla</h2>

        {/* Micrófono principal */}
        <button
          className={`mic-grande ${record ? "grabando" : ""}`}
          onClick={toggleRecord}
          title="Hablar"
        >
          🎤
        </button>

        {/* Barra de búsqueda */}
        <div className="hero-busqueda">
          <input
            type="text"
            className="hero-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyPress} // 👈 Detecta Enter
            placeholder="Busca un destino o di algo..."
          />
          <button
            className="btn-search"
            onClick={onSearchClick}
            title="Buscar"
          >
            🔍
          </button>
        </div>


      </div>
    </section>
  );
}
