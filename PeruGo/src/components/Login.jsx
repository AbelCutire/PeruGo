"use client";

import React, { useState } from "react";
import { login, recover } from "@/services/auth";  // ← Ahí está el import
import Register from "@/components/Register";
import "./Login.css";

export default function Login({ onLogin, onClose }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState(""); // ← Eliminé el estado de usuario
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [modo, setModo] = useState("inicio");
  const [recordar, setRecordar] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      if (modo === "inicio") {
        // ✅ CORREGIDO: Solo correo y contraseña
        if (!correo || !contrasena) {
          alert("Por favor, completa todos los campos");
          return;
        }

        const data = await login(correo, contrasena); // ← Solo 2 parámetros

        if (recordar) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }

        onLogin(data.token);
        
      } else { // Modo recuperación
        if (!correo) {
          alert("Por favor, ingresa tu correo electrónico");
          return;
        }

        await recover(correo);
        alert("Se ha enviado un enlace a tu correo.");
        setModo("inicio");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <div className="login-box">
          <button className="close-login" onClick={onClose}>✕</button>

          <div className="login-icon">
            <i className="fas fa-user"></i>
          </div>

          {modo === "inicio" ? (
            <>
              <h2>Iniciar Sesión</h2>

              <form onSubmit={manejarEnvio}>
                <div className="input-group">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </div>

                {/* ❌ ELIMINADO: Campo de usuario no necesario para login */}
                
                <div className="input-group password-group">
                  <i className="fas fa-lock"></i>
                  <input
                    type={mostrarContrasena ? "text" : "password"}
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                  />
                  <i
                    className={`fas ${mostrarContrasena ? "fa-eye-slash" : "fa-eye"}`}
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  ></i>
                </div>

                <div className="options">
                  <label>
                    <input
                      type="checkbox"
                      checked={recordar}
                      onChange={() => setRecordar(!recordar)}
                    />
                    Recordarme
                  </label>

                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setModo("recuperar")}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={cargando}
                >
                  {cargando ? "CARGANDO..." : "INGRESAR"}
                </button>

                <button
                  type="button"
                  className="link-button"
                  onClick={() => setMostrarRegistro(true)}
                >
                  Crear cuenta nueva
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Recuperar Contraseña</h2>

              <form onSubmit={manejarEnvio}>
                <div className="input-group">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={cargando}
                >
                  {cargando ? "ENVIANDO..." : "Enviar enlace"}
                </button>

                <button
                  type="button"
                  className="link-button"
                  onClick={() => setModo("inicio")}
                >
                  ← Volver al inicio de sesión
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {mostrarRegistro && (
        <Register
          onClose={() => setMostrarRegistro(false)}
          onSuccess={() => {
            setMostrarRegistro(false);
            setModo("inicio");
          }}
        />
      )}
    </div>
  );
}