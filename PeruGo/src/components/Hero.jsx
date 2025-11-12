"use client";
import React from "react";
import "./Hero.css";
import useVoiceSearch from "./funciones/VoiceSearch";

export default function Hero() {
  const { text, setText, record, toggleRecord, handleSearch } = useVoiceSearch();

  const sendToChat = (message) => {
    if (message && message.trim()) {
      window.dispatchEvent(
        new CustomEvent("chatMessage", { detail: { text: message } })
      );
    }
  };

  const onSearchClick = () => {
    handleSearch();
    sendToChat(text);
    setText("");
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchClick();
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        {/* === TITULOS === */}
        <h1 className="hero-title">PeruGo</h1>
        <h2 className="hero-subtitle">El Perú te habla</h2>

        {/* === MICROFONO === */}
        <button
          className={`mic-grande ${record ? "grabando" : ""}`}
          onClick={toggleRecord}
          title="Hablar"
        >
          {/* Ícono SVG elegante */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>

        {/* === BUSCADOR === */}
        <div className="hero-busqueda">
          <input
            type="text"
            className="hero-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="Busca un destino o di algo..."
          />

          <button
            className="btn-search"
            onClick={onSearchClick}
            title="Buscar"
          >
            {/* Ícono de lupa SVG moderno */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

