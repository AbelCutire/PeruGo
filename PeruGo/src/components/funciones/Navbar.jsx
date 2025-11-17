"use client";

import React from "react";
import { MapPin, Mic, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/logo192.png"
            alt="PeruGo Logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-xl font-bold tracking-wide">PeruGo</h1>
        </div>

        {/* Íconos centrales */}
        <div className="flex items-center gap-6">
          <MapPin className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
          <Mic className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
          <Settings className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            className="px-4 py-1 rounded-md border border-gray-400 hover:bg-gray-700 transition"
            onClick={() => router.push('/login')}
          >
            Iniciar sesión
          </button>
          <button
            className="px-4 py-1 rounded-md bg-red-600 hover:bg-red-700 transition"
            onClick={() => router.push('/register')}
          >
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
