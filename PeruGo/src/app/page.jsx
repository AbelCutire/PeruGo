"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionExplorar from "@/components/SectionExplorar";
import SectionDestinosPopulares from "@/components/SectionDestinosPopulares";
import SectionDestino from "@/components/SectionDestino";
import SectionReservas from "@/components/SectionReservas";
import Chat from "@/components/Chat";
import Login from "@/components/Login";
import { checkAuth, logout, getUser } from "@/services/auth";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const auth = checkAuth();
    let logged = auth.isAuthenticated;
    let currentUser = auth.user || null;

    if (!logged) {
      const sessionFlag = typeof window !== "undefined"
        ? window.sessionStorage.getItem("isLoggedIn")
        : null;

      if (sessionFlag === "true") {
        logged = true;
        if (!currentUser) {
          currentUser = getUser();
          // Si tampoco hay usuario en localStorage, usar el último correo usado en login
          if (!currentUser && typeof window !== "undefined") {
            const lastEmail = window.sessionStorage.getItem("lastEmail");
            if (lastEmail) {
              currentUser = { email: lastEmail };
            }
          }
        }
      }
    }

    setIsLoggedIn(!!logged);
    setUser(currentUser || null);
    setCheckingSession(false);
  }, []);

  const handleLogin = () => {
    const auth = checkAuth();
    if (auth.isAuthenticated) {
      setIsLoggedIn(true);
      setUser(auth.user || null);
      setShowLogin(false);
      setJustLoggedIn(true);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("lastEmail");
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
        user={user}
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
