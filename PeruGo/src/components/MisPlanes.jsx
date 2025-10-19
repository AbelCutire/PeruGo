"use client";

import React, { useState, useEffect } from "react";
import SectionReservas from "./SectionReservas";
import "./MisPlanes.css";

export default function MisPlanes() {
  const [reservas, setReservas] = useState([]);

  // 🧠 Cargar reservas desde localStorage
  useEffect(() => {
    const guardadas = localStorage.getItem("reservas");
    if (guardadas) {
      setReservas(JSON.parse(guardadas));
    }
  }, []);

  // 💾 Guardar cambios cuando cambien las reservas
  useEffect(() => {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }, [reservas]);

  // ❌ Eliminar una reserva
  const eliminarReserva = (id) => {
    const filtradas = reservas.filter((r) => r.id !== id);
    setReservas(filtradas);
    localStorage.setItem("reservas", JSON.stringify(filtradas));
  };

  return (
    <section id="mis-planes">
      <h1>Mis Planes</h1>
      <p className="subtexto">
        Aquí se muestran todas tus reservas activas y en progreso. Cada tarjeta representa un destino con su propio estado.
      </p>

      {reservas.length === 0 ? (
        <p style={{ color: "#64748b", fontStyle: "italic" }}>
          Aún no has agregado ningún destino a tus planes.
        </p>
      ) : (
        <div className="lista-reservas">
          {reservas.map((r) => (
            <div key={r.id} className="bloque-reserva">
              <div className="reserva-header">
                <h2 className="reserva-titulo">{r.destino}</h2>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarReserva(r.id)}
                >
                  ✖
                </button>
              </div>

              <SectionReservas destinoSeleccionado={r.destino} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
