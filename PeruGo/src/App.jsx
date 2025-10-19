import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SectionDestino from "./components/SectionDestino";
import SectionExplorar from "./components/SectionExplorar";
import SectionPerfil from "./components/SectionPerfil";
import SectionPlanificador from "./components/SectionPlanificador";
import SectionReservas from "./components/SectionReservas";
import Chat from "./components/Chat";
import Login from "./components/Login";
import "./App.css";

function App() {
  // Estado de autenticación
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Verificamos si hay una sesión activa guardada
    const sessionActive = sessionStorage.getItem("sessionActive");
    const remembered = localStorage.getItem("rememberedSession");
    if (sessionActive === "true" || remembered === "true") {
      setIsLogged(true);
    }
  }, []);

  const handleLogin = (recordar) => {
    // Al iniciar sesión
    setIsLogged(true);
    sessionStorage.setItem("sessionActive", "true");

    // Si el usuario marcó “Recordarme”, se guarda también en localStorage
    if (recordar) {
      localStorage.setItem("rememberedSession", "true");
    } else {
      localStorage.removeItem("rememberedSession");
    }
  };

  const handleLogout = () => {
    // Al cerrar sesión, se limpia todo
    setIsLogged(false);
    sessionStorage.removeItem("sessionActive");
    localStorage.removeItem("rememberedSession");
  };

  // Si no está autenticado, mostrar el login
  if (!isLogged) {
    return <Login onLogin={handleLogin} />;
  }

  // Si está logueado, mostrar contenido principal
  return (
    <div className="App">
      <Header onLogout={handleLogout} isLogged={isLogged} />

      <main className="main-content" style={{ paddingTop: 80 }}>
        <Hero />
        <SectionDestino />
        <SectionExplorar />
        <SectionPerfil />
        <SectionPlanificador />
        <SectionReservas />
        <Chat />
      </main>
    </div>
  );
}

export default App;
