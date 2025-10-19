"use client";

import React, { useState } from "react";
import "./SectionReservas.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { destinos } from "@/data/destinos";

// 🎨 Colores para categorías de gasto
const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#8b5cf6", "#f97316", "#9ca3af"];

// 🧭 Etapas del proceso de reserva
const ETAPAS = ["borrador", "confirmado", "pendiente", "pagado", "finalizado"];

export default function SectionReservas({ destinoSeleccionado }) {
  const [nivel, setNivel] = useState(0);

  // ✅ Usa el destino recibido o uno por defecto
  const destino =
    destinos.find((d) => d.nombre === destinoSeleccionado) || destinos[0];

  const gastos = Object.entries(destino.gastos).map(([name, value]) => ({
    name,
    value,
  }));

  // 🔹 Funciones de control
  const avanzar = () => {
    if (nivel < ETAPAS.length - 1) setNivel(nivel + 1);
  };

  const retroceder = () => {
    if (nivel > 0) setNivel(nivel - 1);
  };

  // 🔸 Render de cada tarjeta
  const renderTarjeta = (etapa, index) => {
    const activa = index === nivel;
    const bloqueada = index > nivel;

    const colores = {
      borrador: "#9ca3af",
      confirmado: "#22c55e",
      pendiente: "#facc15",
      pagado: "#ef4444",
      finalizado: "#3b82f6",
    };

    return (
      <div
        key={etapa}
        className={`tarjeta ${bloqueada ? "bloqueada" : activa ? "activa" : ""}`}
        style={{ borderLeft: `8px solid ${colores[etapa]}` }}
      >
        <div className="tarjeta-info">
          <img src={destino.imagen} alt={destino.nombre} className="miniatura" />
          <div>
            <h3>{destino.nombre}</h3>
            <p>
              Etapa: <strong>{etapa.toUpperCase()}</strong>
            </p>
          </div>
        </div>

        {/* 💬 Burbuja "Estás aquí" */}
        {activa && <div className="burbuja">Estás aquí</div>}

        {/* 🔘 Botones según etapa */}
        <div className="acciones">
          {etapa === "borrador" && <button onClick={avanzar}>Confirmar</button>}

          {etapa === "confirmado" && (
            <>
              <button onClick={() => alert("Ir a ficha técnica del destino")}>
                Ver destino
              </button>
              <button onClick={avanzar}>Seguir</button>
            </>
          )}

          {etapa === "pendiente" && (
            <>
              <button onClick={() => alert("Simular pago")}>Pagar</button>
              <button onClick={avanzar}>Confirmar pago</button>
            </>
          )}

          {etapa === "pagado" && (
            <>
              <button onClick={() => alert("Reagendar destino")}>
                Reagendar
              </button>
              <button onClick={avanzar}>Seguir</button>
            </>
          )}

          {etapa === "finalizado" && (
            <button onClick={() => alert("Escribir reseña")}>
              Dejar reseña
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="section-reservas">
      {/* 🔹 Solo se cambió esta línea */}
      <h2>Reserva</h2>

      <div className="reservas-contenedor">
        {/* 🧩 Tarjetas a la izquierda */}
        <div className="tarjetas-contenedor">
          {ETAPAS.map((etapa, index) => renderTarjeta(etapa, index))}

          <div className="navegacion">
            <button onClick={retroceder} disabled={nivel === 0}>
              ← Anterior
            </button>
            <button onClick={avanzar} disabled={nivel === ETAPAS.length - 1}>
              Siguiente →
            </button>
          </div>
        </div>

        {/* 🟢 Gráfico circular a la derecha */}
        <div className="grafico-contenedor">
          <h3>Distribución de gastos: {destino.nombre}</h3>
          <div className="grafico">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gastos}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {gastos.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <ul className="leyenda">
              {gastos.map((g, i) => (
                <li key={i}>
                  <span
                    className="color"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  ></span>
                  {g.name} — {g.value}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
