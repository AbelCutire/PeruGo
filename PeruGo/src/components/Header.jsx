"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useVoiceSearch from "@/components/funciones/VoiceSearch";
import "./Header.css";

export default function Header({
  isLogged = true,
  onLogout = () => {},
  user = null,
  onOpenPerfil = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // --- Voz ---
  const { record, text, toggleRecord } = useVoiceSearch();
  useEffect(() => {
    if (!record && text && text.trim()) {
      window.dispatchEvent(new CustomEvent("chatMessage", { detail: { text } }));
    }
  }, [record, text]);

  // --- Cerrar menú al hacer clic fuera ---
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // --- Usuario de ejemplo ---
  const userData = user || {
    nombre: "Usuario ejemplo",
    correo: "usuario@correo.com",
  };

  // --- Cambiar modo ---
  const toggleMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.body.classList.toggle("dark-mode", newMode);
      return newMode;
    });
  };

  // --- Rutas de imágenes según modo ---
  const imgPath = (name) => (isDarkMode ? `/${name}_alt.png` : `/${name}.png`);

  return (
    <header className={`header-fijo header-amplio ${isDarkMode ? "dark" : ""}`}>
      <div className="header-contenido header-contenido-amplio">
        {/* --- LOGO --- */}
        <div className="logo-container" onClick={() => router.push("/")}>
          <img
            src={imgPath("logo")}
            alt="PeruGo"
            className="logo-img"
            draggable="false"
          />
        </div>

        {/* --- NAV --- */}
        <nav className="nav-header" aria-label="Navegación principal">
          {/* --- Mis Planes --- */}
          <button
            className="btn-icono"
            title="Explorar"
            onClick={() => router.push("/mis-planes")}
          >
            <img
              src={imgPath("explore")}
              alt="Explorar"
              className="icon-img"
              draggable="false"
            />
          </button>

          {/* --- Micrófono --- */}
          <button
            className={`btn-icono mic-btn ${record ? "mic-active" : ""}`}
            title="Hablar con el asistente"
            onClick={toggleRecord}
          >
            <img
              src={imgPath("mic")}
              alt="Micrófono"
              className="icon-img"
              draggable="false"
            />
          </button>

          {/* --- Modo diurno/nocturno --- */}
          <button
            className="btn-icono"
            title="Cambiar modo"
            onClick={toggleMode}
          >
            <img
              src={imgPath("mode")}
              alt="Modo"
              className="icon-img"
              draggable="false"
            />
          </button>

          {/* --- Perfil --- */}
          <div className="profile-wrapper" ref={menuRef}>
            <button
              className="btn-icono"
              title="Perfil"
              onClick={() => setMenuOpen((s) => !s)}
            >
              <img
                src={imgPath("user")}
                alt="Perfil"
                className="icon-img"
                draggable="false"
              />
            </button>

            {menuOpen && (
              <div className="profile-menu">
                <div className="profile-info">
                  <div className="profile-name">{userData.nombre}</div>
                  <div className="profile-email">{userData.correo}</div>
                </div>
                <hr className="profile-separator" />
                <div className="profile-actions">
                  <button
                    className="btn-opcion"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPerfil();
                    }}
                  >
                    Ver perfil y preferencias
                  </button>
                  <button
                    className="btn-opcion cerrar"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout?.();
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
