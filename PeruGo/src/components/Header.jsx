"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useVoiceSearch from "@/components/funciones/VoiceSearch";
import ExploreIcon from "@/public/icons/explore.svg";
import "./Header.css";

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
            <img
              src={imgPath("logo")}
              alt="PeruGo"
              className="logo-img"
              draggable="false"
            />
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
            <ExploreIcon className = "explore-svg"/>
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

          {/* --- Modo claro/oscuro --- */}
          <button className="btn-icono" title="Cambiar modo" onClick={toggleMode}>
            <img
              src={imgPath("mode")}
              alt="Modo"
              className="icon-img"
              draggable="false"
            />
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
          )}
        </nav>
      </div>
    </header>
  );
}



