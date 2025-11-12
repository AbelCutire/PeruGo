"use client";

import React, { useState } from "react";
import "./Login.css";

export default function Login({ onLogin, onClose }) {
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [modo, setModo] = useState("inicio");
  const [recordar, setRecordar] = useState(false);

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (modo === "inicio") {
      if (correo && usuario && contrasena) {
        onLogin(recordar);
      } else {
        alert("Por favor, completa todos los campos");
      }
    } else {
      if (correo) {
        alert("Se ha enviado un enlace de recuperación a tu correo electrónico.");
        setModo("inicio");
      } else {
        alert("Por favor, ingresa tu correo para continuar.");
      }
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
                  />
                </div>

                <div className="input-group">
                  <i className="fas fa-user-circle"></i>
                  <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>

                <div className="input-group password-group">
                  <i className="fas fa-lock"></i>
                  <input
                    type={mostrarContrasena ? "text" : "password"}
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
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

                <button type="submit" className="login-btn">
                  INGRESAR
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
                  />
                </div>

                <button type="submit" className="login-btn">
                  Enviar enlace
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
    </div>
  );
}
