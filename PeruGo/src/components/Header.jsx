"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
// Íconos SVG ahora se usan como imágenes desde /public/icons


import "./Header.css";
import useVoiceSearch from "./funciones/VoiceSearch";

export default function Header({
  isLogged = true,
  onLogout = () => {},
  user = null,
  onOpenPerfil = () => {},
  onOpenLogin = () => {}, // Prop que activará el login
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const { record, text, toggleRecord } = useVoiceSearch();

  // Detecta cuando se deja de hablar
  useEffect(() => {
    if (!record && text && text.trim()) {
      window.dispatchEvent(new CustomEvent("chatMessage", { detail: { text } }));
    }
  }, [record, text]);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Opcional: Limpieza al desmontar el componente
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [isDarkMode]); // Se ejecuta cada vez que 'isDarkMode' cambia
  
  const userData = user || {
    nombre: "Usuario ejemplo",
    correo: "usuario@correo.com",
  };

  const toggleMode = () => setIsDarkMode((prev) => !prev);
  const imgPath = (name) => `/icons/${isDarkMode ? `${name}_alt.png` : `${name}.png`}`;
  
  return (
    <header className="header-fijo header-amplio">
      <div className="header-contenido header-contenido-amplio">
        {/* LOGO */}
        <div
          className="logo-header"
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="logo-img-container">
            <img src="/icons/logo.svg" className="logo-svg" alt="Logo" />
          </div>
          <div className="logo-text">
            <span className="logo-principal">PeruGo</span>
            <span className="logo-secundario">El Perú te habla</span>
          </div>
        </div>

        {/* NAV */}
        <nav className="nav-header" aria-label="Navegación principal">
          {/* --- Mis Planes --- */}
          <button
            className="btn-icono"
            title="Explorar"
            onClick={() => router.push("/mis-planes")}
          >
            <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_30_48)">
            <path d="M20.7782 3.32233L13 21L10.7298 13.3707L3.10051 11.1005L20.7782 3.32233Z" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_30_48">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
            </svg>
          </button>

          {/* --- Micrófono --- */}
          <button
            className={`btn-icono mic-btn ${record ? "mic-active" : ""}`}
            title="Hablar con el asistente"
            onClick={toggleRecord}
          >
            <img src="/icons/mic.svg" className="icon-svg" alt="Micrófono" />
          </button>

          {/* --- Modo claro/oscuro --- */}
          <button className="btn-icono" title="Cambiar modo" onClick={toggleMode}>
            {isDarkMode ? (
              <img src="/icons/moon.svg" className="icon-svg" alt="Luna" />
            ) : (
              <img src="/icons/sun.svg" className="icon-svg" alt="Sol" />
            )}
          </button>

          {/* --- Iniciar sesión (solo texto, visible solo si no hay sesión) --- */}
          {!isLogged && (
            <button className="btn-iniciar-sesion" onClick={onOpenLogin}>
              Iniciar sesión
            </button>
          )}

          {/* --- Perfil (si hay sesión) --- */}
          {isLogged && (
            <div className="profile-wrapper" ref={menuRef}>
              <button
                className="btn-icono"
                title="Perfil"
                onClick={() => setMenuOpen((s) => !s)}
              >
                <img src="/icons/user.svg" className="icon-svg" alt="Usuario" />
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
          )}
        </nav>
      </div>
    </header>
  );
}



