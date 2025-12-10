"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, logout, isAuthenticated } from "@/services/auth";
import "./Header.css";
import useVoiceSearch from "./funciones/VoiceSearch";

export default function Header({
  isLogged = true,
  onLogout = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [effectiveLogged, setEffectiveLogged] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const { record, text, toggleRecord } = useVoiceSearch();

  // Verificar sesión al montar
  useEffect(() => {
    const checkSession = () => {
      // Intentar recuperar del servicio o sessionStorage
      const currentUser = getCurrentUser();
      const sessionFlag = typeof window !== "undefined" ? sessionStorage.getItem("isLoggedIn") === "true" : false;
      const logged = isAuthenticated() || sessionFlag;
      
      setEffectiveLogged(logged);
      if (currentUser) setUser(currentUser);
    };

    checkSession();
    // Escuchar cambios en storage por si se loguea en otra pestaña/componente
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  // Detecta cuando se deja de hablar en búsqueda por voz
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

  // Modo oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    return () => document.body.classList.remove("dark-mode");
  }, [isDarkMode]);

  const userData = user
    ? {
        nombre: user.username || user.name || (user.email ? user.email.split("@")[0] : "Viajero"),
        correo: user.email || "",
      }
    : {
        nombre: "Invitado",
        correo: "",
      };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    setEffectiveLogged(false);
    setUser(null);
    onLogout?.();
    router.push("/");
  };

  const toggleMode = () => setIsDarkMode((prev) => !prev);

  // Helper para saber si un enlace está activo
  const isActive = (path) => pathname === path;

  return (
    <header className="header-fijo header-amplio">
      <div className="header-contenido header-contenido-amplio">
        
        {/* LOGO (Enlace al inicio) */}
        <Link href="/" className="logo-header" style={{ cursor: "pointer", textDecoration: "none" }}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="34px" height="42px" viewBox="-20 0 200 450">
             {/* ... Tu SVG original del logo ... */}
             <path fill="currentColor" d="M0 0 C1.2 0.3 1.2 0.3 2.5 0.6 C42.2 10.4 78.3 37 99.5 72 C101.8 76 103.9 80 106 84 C106.3 84.6 106.6 85.2 107 85.9 C126.3 123.9 128.9 168.1 116.1 208.7 C102.3 250 73.4 285 45.1 317.4 C42.2 320.8 39.3 324.2 36.4 327.6 C31.2 333.8 25.8 340 20.5 346.2 C18 349.2 15.5 352.1 13 355 C12 356.2 11 357.3 10 358.5 C9.3 359.4 9.3 359.4 8.5 360.3 C4 365.5 4 365.5 2.5 367.3 C1.5 368.4 0.5 369.6 -0.5 370.7 C-3 373.7 -5.5 376.6 -8 379.5 C-8.5 380.1 -9 380.7 -9.6 381.3 C-10.6 382.5 -11.6 383.6 -12.6 384.8 C-15 387.7 -17.5 390.6 -20 393.6 C-32 408.1 -32 408.1 -38.5 410.1 C-43.2 410 -47 408.8 -50.5 405.6 C-52.1 404 -53.5 402.3 -54.9 400.5 C-55.4 399.9 -55.9 399.2 -56.4 398.6 C-58 396.7 -59.5 394.9 -61 393 C-62.5 391.2 -64 389.3 -65.5 387.5 C-66.2 386.6 -66.9 385.7 -67.7 384.8 C-70.4 381.5 -73.2 378.2 -76.1 374.9 C-79.4 371 -82.7 367.1 -85.9 363.1 C-89.9 358.1 -94 353.4 -98.1 348.6 C-101.4 344.9 -104.6 341.1 -107.8 337.2 C-110.6 333.7 -113.5 330.3 -116.5 327 C-120.4 322.7 -124 318.4 -127.6 313.9 C-129.7 311.4 -131.8 308.9 -133.9 306.5 C-140.4 298.9 -146.4 291 -152.5 283 C-153.9 281.2 -155.3 279.4 -156.7 277.6 C-187.5 238.3 -208.9 192.4 -203.5 141.5 C-198.9 104.5 -183.1 70.7 -157 44 C-156.1 43.1 -155.3 42.2 -154.4 41.2 C-133.2 19 -105.4 6.2 -76 -1 C-75.3 -1.2 -74.6 -1.4 -73.9 -1.5 C-50.9 -7.3 -22.8 -5.9 0 0 Z" transform="translate(21,0.75) scale(0.1)"/>
          </svg>
          <div className="logo-text">
            <span className="logo-principal">PeruGo</span>
            <span className="logo-secundario">El Perú te habla</span>
          </div>
        </Link>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="nav-header" aria-label="Navegación principal">
          
          {/* 1. Botón EXPLORAR (Brújula) */}
          <Link href="/explorar">
            <button
              className={`btn-icono ${isActive("/explorar") ? "activo" : ""}`}
              title="Explorar Destinos"
            >
              <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
            </button>
          </Link>

          {/* 2. Botón MIS PLANES (Avión de papel) */}
          <Link href="/mis-planes">
            <button
              className={`btn-icono ${isActive("/mis-planes") ? "activo" : ""}`}
              title="Mis Planes"
            >
              <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.7782 3.32233L13 21L10.7298 13.3707L3.10051 11.1005L20.7782 3.32233Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>

          {/* 3. Micrófono */}
          <button
            className={`btn-icono mic-btn ${record ? "mic-active" : ""}`}
            title="Hablar con el asistente"
            onClick={toggleRecord}
          >
             <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 4. Modo Oscuro */}
          <button className="btn-icono" title="Cambiar modo" onClick={toggleMode}>
            {isDarkMode ? (
              <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.39703 11.6315C3.39703 16.602 7.42647 20.6315 12.397 20.6315C15.6858 20.6315 18.5656 18.8664 20.1358 16.23C16.7285 17.3289 12.6922 16.7548 9.98282 14.0455C7.25201 11.3146 6.72603 7.28415 7.86703 3.89293C5.20697 5.47927 3.39703 8.38932 3.39703 11.6315ZM21.187 13.5851C22.0125 13.1021 23.255 13.6488 23 14.5706C21.7144 19.2187 17.4543 22.6315 12.397 22.6315C6.3219 22.6315 1.39703 17.7066 1.39703 11.6315C1.39703 6.58874 4.93533 2.25845 9.61528 0.999986C10.5393 0.751502 11.0645 1.99378 10.5641 2.80935C8.70026 5.84656 8.83194 10.0661 11.397 12.6312C13.9319 15.1662 18.1365 15.3702 21.187 13.5851Z" fill="#ffffff"/>
              </svg>
            ) : (
              <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 2V4M12 20V22M4 12L2 12M22 12L20 12M19.7778 4.22266L17.5558 6.25424M4.22217 4.22266L6.44418 6.25424M6.44434 17.5557L4.22211 19.7779M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          {/* 5. Autenticación / Perfil */}
          {!effectiveLogged ? (
            <div className="auth-buttons-desktop">
              <Link href="/login">
                <button className="btn-iniciar-sesion">Iniciar sesión</button>
              </Link>
              <Link href="/register">
                <button className="btn-iniciar-sesion" style={{ marginLeft: "6px" }}>Registrarse</button>
              </Link>
            </div>
          ) : (
            <div className="profile-wrapper" ref={menuRef}>
              <button
                className="btn-icono"
                title="Perfil"
                onClick={() => setMenuOpen((s) => !s)}
              >
                <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {menuOpen && (
                <div className="profile-menu">
                  <div className="profile-info">
                    <div className="profile-name">{userData.nombre}</div>
                    <div className="profile-email">{userData.correo}</div>
                  </div>
                  <div className="profile-actions">
                    <Link href="/mis-planes" onClick={() => setMenuOpen(false)}>
                      <button className="btn-opcion">Mis Planes</button>
                    </Link>
                    <button className="btn-opcion-cerrar" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Menú Móvil Hamburguesa */}
          <button 
            className="menu-movil-btn" 
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          >
            ☰
          </button>
        </nav>
      </div>

      {/* PANEL MÓVIL */}
      <div className={`menu-movil-panel ${menuMovilAbierto ? "active" : ""}`}>
        {!effectiveLogged && (
          <>
            <Link href="/login" onClick={() => setMenuMovilAbierto(false)}>
              <button className="btn-iniciar-sesion">Iniciar sesión</button>
            </Link>
            <Link href="/register" onClick={() => setMenuMovilAbierto(false)}>
              <button className="btn-iniciar-sesion">Registrarse</button>
            </Link>
          </>
        )}
        <Link href="/explorar" onClick={() => setMenuMovilAbierto(false)}>
            <button className="btn-opcion">Explorar Destinos</button>
        </Link>
        <Link href="/mis-planes" onClick={() => setMenuMovilAbierto(false)}>
            <button className="btn-opcion">Mis Planes</button>
        </Link>
      </div>
    </header>
  );
}
