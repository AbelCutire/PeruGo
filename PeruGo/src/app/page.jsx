"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionExplorar from "@/components/SectionExplorar";
import SectionDestinosPopulares from "@/components/SectionDestinosPopulares";
import SectionDestino from "@/components/SectionDestino";
import SectionPlanificador from "@/components/SectionPlanificador";
import SectionReservas from "@/components/SectionReservas";
import SectionPerfil from "@/components/SectionPerfil";
import Chat from "@/components/Chat";
import Login from "@/components/Login";


export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Comprobamos si ya hay sesión activa
  useEffect(() => {
    const session = sessionStorage.getItem("isLoggedIn");
    if (session === "true") {
      setIsLoggedIn(true);
    }
    setCheckingSession(false);
  }, []);

  // Al iniciar sesión
  const handleLogin = () => {
    setIsLoggedIn(true);
    setJustLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");

  };

  // Al cerrar sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("scrollY");
    sessionStorage.removeItem("returnFromFicha");
  };

  // Scroll a sección de perfil
  const handleOpenPerfil = () => {
    const perfilSection = document.getElementById("perfil");
    if (perfilSection) {
      perfilSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Guardar posición de scroll
  useEffect(() => {
    const saveScroll = () => {
      sessionStorage.setItem("scrollY", window.scrollY);
    };
    window.addEventListener("beforeunload", saveScroll);
    return () => window.removeEventListener("beforeunload", saveScroll);
  }, []);

  // Restaurar posición o comportamiento según contexto
  useEffect(() => {
    if (!isLoggedIn) return;

    const returnFromFicha = sessionStorage.getItem("returnFromFicha");
    const savedScroll = parseInt(sessionStorage.getItem("scrollY") || "0", 10);

    if (justLoggedIn) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setJustLoggedIn(false);
    } else if (returnFromFicha === "true") {
      const explorarSection = document.getElementById("explorar");
      if (explorarSection) {
        explorarSection.scrollIntoView({ behavior: "smooth" });
      }
      sessionStorage.removeItem("returnFromFicha");
    } else {
      window.scrollTo({ top: savedScroll, behavior: "auto" });
    }
  }, [isLoggedIn, justLoggedIn]);

  // Pantalla de carga mientras se verifica sesión
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
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {/* Header con perfil y logout */}
          <Header onLogout={handleLogout} onOpenPerfil={handleOpenPerfil} />
          <Hero />
          <SectionDestinosPopulares />
          <section id="explorar">
            <SectionExplorar />
          </section>
          <SectionPerfil />
          <Chat />
        </>
      )}
    </main>
  );
}
