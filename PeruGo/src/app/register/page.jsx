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
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label>Contraseña</label>
        <input
          type="password"
          required
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
