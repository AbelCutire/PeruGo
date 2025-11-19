"use client";

import React, { useState } from "react";
import "./Register.css";
import { register } from "@/services/auth";

export default function Register({ onClose, onSuccess }) {
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!correo || !usuario || !contrasena || !confirmar) {
      alert("Complete todos los campos.");
      return;
    }

    if (contrasena !== confirmar) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register(correo, usuario, contrasena);
      alert("Registro exitoso. Ahora puede iniciar sesión.");
      onSuccess(); // normalmente abrir login
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="register-overlay">
      <div className="register-container">
        <div className="register-box">
          <button className="close-register" onClick={onClose}>✕</button>

          <div className="register-icon">
            <i className="fas fa-user-plus"></i>
          </div>

          <h2>Crear Cuenta</h2>

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

            <div className="input-group password-group">
              <i className="fas fa-lock"></i>
              <input
                type={mostrarContrasena ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />
            </div>

            <button type="submit" className="register-btn">
              REGISTRARSE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
