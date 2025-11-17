"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: 10 }}>
      <button onClick={() => alert("Abrir configuraciones")}>⚙️ Configuraciones</button>
      <button onClick={() => router.push('/login')}>🔑 Iniciar sesión</button>
      <button onClick={() => router.push('/register')}>📝 Registrarse</button>
    </nav>
  );
}
