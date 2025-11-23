"use client";

import React, { useState } from "react";
import { login } from "@/services/auth"; // Ajusta la ruta según tu estructura
import "../styles/auth.css";

export default function PageLogin() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      // Usar la función login del servicio auth.js
      const data = await login(correo, clave);
      
      setMensaje("¡Inicio de sesión exitoso!");
      
      // Redireccionar después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      
    } catch (err) {
      setMensaje(err.message || "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>

      <form className="auth-form" onSubmit={handleLogin}>

        <label>Correo electrónico</label>
        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            required
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={cargando}
          />
        </div>

        <label>Contraseña</label>
        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            required
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            disabled={cargando}
            minLength="6"
          />
        </div>

        {mensaje && (
          <div className={`auth-message ${mensaje.includes("éxito") ? "auth-success" : "auth-error"}`}>
            {mensaje}
          </div>
        )}

        <button 
          type="submit" 
          className="auth-submit"
          disabled={cargando}
        >
          {cargando ? "Iniciando sesión..." : "Ingresar"}
        </button>
      </form>

      <div className="auth-links">
        <a href="/recover">¿Olvidaste tu contraseña?</a>
        <a href="/register">Crear cuenta nueva</a>
      </div>
    </div>
  );
}