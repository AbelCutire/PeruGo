"use client";

import React, { useState } from "react";
import { register } from "@/services/auth"; // Ajusta la ruta según tu estructura
import "../styles/auth.css";

export default function PageRegister() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegister = async (e) => {
  e.preventDefault();
  setMensaje("");
  setCargando(true);

  console.log("🔄 Iniciando registro...", { 
    correo, 
    nombre, 
    clave: '***', 
    confirmarClave: '***' 
  });

  // Validar que las contraseñas coincidan
  if (clave !== confirmarClave) {
    setMensaje("Las contraseñas no coinciden");
    setCargando(false);
    return;
  }

  // Validar longitud mínima de contraseña
  if (clave.length < 6) {
    setMensaje("La contraseña debe tener al menos 6 caracteres");
    setCargando(false);
    return;
  }

  try {
    console.log("📤 Enviando datos al backend...");

    // Usar la función register del servicio auth.js
    // Firma correcta: register(email, username, password)
    const data = await register(correo, nombre || null, clave);
    
    console.log("✅ Registro exitoso:", data);
    setMensaje("¡Cuenta creada exitosamente! Redirigiendo...");
    
    // Redireccionar al login después de un breve delay
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
    
  } catch (err) {
    console.error("❌ Error completo en registro:", err);
    console.error("❌ Mensaje de error:", err.message);
    console.error("❌ Stack:", err.stack);
    setMensaje("Error: " + err.message);
  } finally {
    setCargando(false);
  }
};

  return (
    <div className="auth-container">
      <h2>Crear Cuenta</h2>

      <form className="auth-form" onSubmit={handleRegister}>
        <label>Nombre de usuario (opcional)</label>
        <div className="input-group">
          <i className="fas fa-user-circle"></i>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={cargando}
          />
        </div>

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
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            disabled={cargando}
            minLength="6"
          />
        </div>

        <label>Confirmar Contraseña</label>
        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            required
            placeholder="Confirmar contraseña"
            value={confirmarClave}
            onChange={(e) => setConfirmarClave(e.target.value)}
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
          {cargando ? "Creando cuenta..." : "Registrarse"}
        </button>
      </form>

      <div className="auth-links">
        <a href="/login">¿Ya tienes cuenta? Iniciar sesión</a>
      </div>
    </div>
  );
}
