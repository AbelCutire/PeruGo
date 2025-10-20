import React from "react";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: 10 }}>
      <button onClick={() => alert("Abrir configuraciones")}>⚙️ Configuraciones</button>
      <button onClick={() => alert("Iniciar sesión")}>🔑 Iniciar sesión</button>
      <button onClick={() => alert("Registrarse")}>📝 Registrarse</button>
    </nav>
  );
}
