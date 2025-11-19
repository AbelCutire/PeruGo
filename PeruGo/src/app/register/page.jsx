"use client";

import React, { useState } from "react";
import "../styles/auth.css";

export default function PageRegister() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch("https://perugo-backend-production.up.railway.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, clave }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || "No se pudo registrar");
        return;
      }

      window.location.href = "/login";
    } catch (err) {
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div className="auth-container">
      <h2>Crear Cuenta</h2>

      <form className="auth-form" onSubmit={handleRegister}>
        <label>Nombre</label>
        <i className="fas fa-user-circle"></i>
        <input
          type="text"
          required
          placeholder="Nombre de usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

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

        <button type="submit" className="auth-submit">Registrarse</button>
      </form>

      <div className="auth-links">
        <a href="/login">¿Ya tienes cuenta? Iniciar sesión</a>
      </div>
    </div>
  );
}
