"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useVoiceSearch from "@/components/funciones/VoiceSearch";
import "./Header.css";

/* Importar imágenes desde la carpeta local ./icons */
import logo from "./icons/logo.png";
import logoAlt from "./icons/logo_alt.png";

import explore from "./icons/explore.png";
import exploreAlt from "./icons/explore_alt.png";

import mic from "./icons/mic.png";
import micAlt from "./icons/mic_alt.png";

import mode from "./icons/mode.png";
import modeAlt from "./icons/mode_alt.png";

import user from "./icons/user.png";
import userAlt from "./icons/user_alt.png";

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

  // Voz
  const { record, text, toggleRecord } = useVoiceSearch();
  useEffect(() => {
    if (!record && text && text.trim()) {
      window.dispatchEvent(new CustomEvent("chatMessage", { detail: { text } }));
    }
  }, [record, text]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const userData = user || {
    nombre: "Usuario ejemplo",
    correo: "usuario@correo.com",
  };

  // Modo: solo cambia íconos (no tocar color del header)
  const toggleMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const pick = (normal, alt) => (isDarkMode ? alt : normal);

  return (
    <header className="header-fijo header-amplio">
      <div className="header-contenido header-contenido-amplio">
        {/* LOGO + TEXTO */}
        <div
          className="logo-header"
          onClick={() => router.push("/")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/")}
          aria-label="Ir al inicio"
        >
          <div className="logo-img-container" aria-hidden>
            <img src={pick(logo, logoAlt)} alt="PeruGo" className="logo-img" draggable="false" />
          </div>

          <div className="logo-text">
            <span className="logo-principal">PeruGo</span>
            <span className="logo-secundario">El Perú te habla</span>
          </div>
        </div>

        {/* NAV */}
        <nav className="nav-header" aria-label="Navegación principal">
          {/* Mis Planes (explorar) */}
          <button
            className="btn-icono"
            title="Mis planes"
            aria-label="Mis planes"
            onClick={() => router.push("/mis-planes")}
          >
            <img src={pick(explore, exploreAlt)} alt="Explorar" className="icon-img" draggable="false" />
          </button>

          {/* Micrófono */}
          <button
            className={`btn-icono mic-btn ${record ? "mic-active" : ""}`}
            title="Hablar con el asistente"
            aria-label={record ? "Detener grabación" : "Iniciar grabación"}
            onClick={toggleRecord}
          >
            <img src={pick(mic, micAlt)} alt="Micrófono" className="icon-img" draggable="false" />
          </button>

          {/* Modo (mode.png / mode_alt.png) */}
          <button
            className="btn-icono"
            title="Cambiar modo visual"
            aria-label="Cambiar modo visual"
            onClick={toggleMode}
          >
            <img src={pick(mode, modeAlt)} alt="Cambiar modo" className="icon-img" draggable="false" />
          </button>

          {/* Perfil */}
          <div className="profile-wrapper" ref={menuRef}>
            <button
              className="btn-icono"
              title="Perfil"
              aria-label="Abrir perfil"
              onClick={() => setMenuOpen((s) => !s)}
            >
              <img src={pick(user, userAlt)} alt="Perfil" className="icon-img" draggable="false" />
            </button>

            {menuOpen && (
              <div className="profile-menu" role="menu" aria-label="Menú de usuario">
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


