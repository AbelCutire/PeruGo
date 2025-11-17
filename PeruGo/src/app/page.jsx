"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionExplorar from "@/components/SectionExplorar";
import SectionDestinosPopulares from "@/components/SectionDestinosPopulares";
import SectionDestino from "@/components/SectionDestino";
import SectionReservas from "@/components/SectionReservas";
import SectionPerfil from "@/components/SectionPerfil";
import Chat from "@/components/Chat";
import Login from "@/components/Login";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const session = sessionStorage.getItem("isLoggedIn");
    if (session === "true") setIsLoggedIn(true);
    setCheckingSession(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setJustLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("scrollY");
    sessionStorage.removeItem("returnFromFicha");
  };

  const handleOpenPerfil = () => {
    const perfilSection = document.getElementById("perfil");
    if (perfilSection)
      perfilSection.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenLogin = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);

  if (checkingSession) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="loader">Cargando...</div>
      </div>
    );
  }

  return (
    <main>
      {/* Header siempre visible */}
      <Header
        onLogout={handleLogout}
        onOpenPerfil={handleOpenPerfil}
        onOpenLogin={handleOpenLogin}
        isLogged={isLoggedIn}
      />

      {/* Mostrar login solo cuando se da clic en el botón */}
      {showLogin && !isLoggedIn && <Login onLogin={handleLogin} onClose={handleCloseLogin} />}

      {/* Página principal visible siempre */}
      <Hero />
      <SectionDestinosPopulares />
      <section id="explorar">
        <SectionExplorar />
      </section>
      
      <Chat />
    </main>
  );
}
