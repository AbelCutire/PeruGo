"use client";

import React, { useEffect, useState } from "react";
import "./SectionReservas.css";
import { destinos } from "@/data/destinos"; // ✅ importamos los datos locales
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#8b5cf6", "#f97316", "#9ca3af"];
const ETAPAS = ["borrador", "confirmado", "pendiente", "pagado", "finalizado"];

export default function SectionReservas({ destinoSeleccionado }) {
  const [destino, setDestino] = useState(null);
  const [nivel, setNivel] = useState(0);

  useEffect(() => {
    // ✅ Buscar el destino directamente en los datos locales
    const slug = destinoSeleccionado?.toLowerCase() || "cusco";
    const encontrado = destinos.find((d) => d.id === slug);
    setDestino(encontrado || destinos[0]);
  }, [destinoSeleccionado]);

  if (!destino) return <p>Cargando destino...</p>;

  const gastos = Object.entries(destino.gastos || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const totalGastos = gastos.reduce((acc, g) => acc + g.value, 0);

  const avanzar = () => nivel < ETAPAS.length - 1 && setNivel(nivel + 1);
  const retroceder = () => nivel > 0 && setNivel(nivel - 1);

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

        {activa && <div className="burbuja">Estás aquí</div>}

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
              <button onClick={() => alert("Reagendar destino")}>Reagendar</button>
              <button onClick={avanzar}>Seguir</button>
            </>
          )}
          {etapa === "finalizado" && (
            <button onClick={() => alert("Escribir reseña")}>Dejar reseña</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="section-reservas">
      <h2>Reserva</h2>

      <div className="reservas-contenedor">
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

        <div className="grafico-contenedor">
          <h3>Distribución de gastos: {destino.nombre}</h3>

          <p className="gasto-total">
            <strong>Gasto total:</strong> S/ {totalGastos}
          </p>

          <div className="grafico">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={gastos} dataKey="value" nameKey="name" outerRadius={100} label>
                  {gastos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  {g.name} — S/ {g.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
