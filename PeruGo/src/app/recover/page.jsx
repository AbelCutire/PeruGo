"use client";

import React, { useState } from "react";
import "../styles/auth.css";

export default function PageRecover() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRecover = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await fetch("https://perugo-backend-production.up.railway.app/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || "No se pudo enviar el correo");
        return;
      }

      setMensaje("Instrucciones enviadas a su correo");
    } catch (err) {
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div className="auth-container">
      <h2>Recuperar acceso</h2>

      <form className="auth-form" onSubmit={handleRecover}>
        <label>Correo</label>
        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            required
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        {mensaje && <div className="auth-error">{mensaje}</div>}

        <button type="submit" className="auth-submit">Enviar enlace</button>
      </form>

      <div className="auth-links">
        <a href="/login">Volver al inicio de sesión</a>
      </div>
    </div>
  );
}
