"use client";

import React, { useState } from "react";
import "../styles/auth.css";

export default function PageLogin() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch("https://perugo-backend-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || "Credenciales incorrectas");
        return;
      }

      // Guardar token
      localStorage.setItem("token", data.token);

      // Redirigir
      window.location.href = "/";
    } catch (err) {
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>

      <form className="auth-form" onSubmit={handleLogin}>
        <label>Correo electrónico</label>
        <i className="fas fa-envelope"></i>
        <input
          type="email"
          required
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label>Contraseña</label>
        <i className="fas fa-lock"></i>
        <input
          type="password"
          required
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />

        {mensaje && <div className="auth-error">{mensaje}</div>}

        <button type="submit" className="auth-submit">Ingresar</button>
      </form>

      <div className="auth-links">
        <a href="/recover">¿Olvidaste tu contraseña?</a>
        <a href="/register">Crear cuenta nueva</a>
      </div>
    </div>
  );
}