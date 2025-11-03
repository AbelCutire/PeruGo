"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useVoiceSearch from "@/components/funciones/VoiceSearch"; // ✅ ruta corregida
import "./Header.css";

export default function Header({
  isLogged = false,
  onLogout = () => {},
  user = null,
  onOpenPerfil = () => {},
}) {
  
  const goToLogin = () => { setMenuOpen(false); router.push("/login"); };
const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // ✅ Integrar micrófono igual que en Hero
  const { record, text, toggleRecord } = useVoiceSearch();

  // 🔥 Cuando termina de grabar y hay texto, enviarlo al Chat
  useEffect(() => {
    if (!record && text && text.trim()) {
      window.dispatchEvent(
        new CustomEvent("chatMessage", { detail: { text } })
      );
    }
  }, [record, text]);

  // 🔒 Manejo del menú del perfil
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

  return (
    <header className="header-fijo header-amplio">
      <div className="header-contenido header-contenido-amplio">
        {/* LOGO */}
        <div
          className="logo-header"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <span className="logo-principal">PerúGo</span>
          <span className="logo-secundario">El Perú te habla</span>
        </div>

        <nav className="nav-header" aria-label="Navegación principal">
          {/* 🔹 Botón Mis Planes */}
          <button
            className="btn-icono"
            title="Mis planes"
            aria-label="Mis planes"
            onClick={() => router.push("/mis-planes")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M21 3l-6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 21l6-6 3 3-6 6-3-3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 7l10-4-4 10-4-4-2-2z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 🔹 Micrófono (igual que el del Hero) */}
          <button
            className={`btn-icono mic-btn ${record ? "mic-active" : ""}`}
            title="Hablar con el asistente"
            aria-label="Micrófono"
            onClick={toggleRecord}
          >
            🎤
          </button>

          {/* 🔹 Configuración */}
          <button
            className="btn-icono"
            title="Configuración"
            aria-label="Configuración"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 3.7 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.7 0 1.27-.45 1.51-1a1.65 1.65 0 0 0-.33-1.82L4.3 3.7A2 2 0 1 1 7.13.87l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V1a2 2 0 1 1 4 0v.09c0 .595.41 1.115 1 1.51h.01c.64.41 1.4.22 1.8-.17l.06-.06A2 2 0 1 1 20.3 7.13l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.23.56.81 1 1.5 1H21a2 2 0 1 1 0 4h-.1c-.59 0-1.09.47-1.5 1z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 🔹 Perfil */}
          <div className="profile-wrapper" ref={menuRef}>
            <button
              className="btn-icono"
              title="Perfil"
              aria-label="Perfil"
              onClick={() => setMenuOpen((s) => !s)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Menú desplegable del perfil */}
            {menuOpen && (
              <div className="profile-menu">
                {isLogged ? (
                  <>
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
                  </>
                ) : (
                  <div className="profile-actions">
                    <button className="btn-opcion" onClick={goToLogin}>
                      Iniciar sesión
                    </button>
                  </div>
                )}
    </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
