"use client";

import React from "react";
import { useParams } from "next/navigation";
import { destinos } from "@/data/destinos";
import "@/components/SectionDestino.css";

export default function PageDestino() {
  const { id } = useParams();
  const destino = destinos.find((d) => d.id === id);

  const handleVolver = () => {
    sessionStorage.setItem("returnFromFicha", "true");
    window.location.href = "/";
  };

  const handleAgregarPlan = () => {
    // Leer planes guardados (usar la misma clave que MisPlanes.jsx)
    const reservasExistentes = JSON.parse(localStorage.getItem("reservas")) || [];

    // Crear tarjeta personalizada del destino
    const nuevaReserva = {
      id: destino.id,
      destino: destino.nombre,
      ubicacion: destino.ubicacion,
      imagen: destino.imagen,
      precio: destino.precio,
      tipo: destino.tipo,
      fechaCreacion: new Date().toLocaleDateString(),
      estado: "borrador",
    };

    // Evitar duplicados
    const existe = reservasExistentes.some((r) => r.id === nuevaReserva.id);
    if (!existe) {
      reservasExistentes.push(nuevaReserva);
      localStorage.setItem("reservas", JSON.stringify(reservasExistentes));
    }

    // Redirigir a Mis Planes
    window.location.href = "/mis-planes";
  };

  if (!destino) {
    return (
      <section id="ficha-destino">
        <h2>Destino no encontrado 😕</h2>
        <button className="btn-volver-naranja" onClick={handleVolver}>
          Regresar
        </button>
      </section>
    );
  }

  return (
    <section id="ficha-destino">
      {/* ---------- Encabezado ---------- */}
      <div className="destino-header">
        <div>
          <div className="destino-titulo">{destino.nombre}</div>
          <div className="destino-info">{destino.ubicacion}</div>
        </div>
        <div className="destino-info">Actualizado: Hoy</div>
      </div>

      <div className="destino-layout">
        {/* ---------- ASIDE IZQUIERDO ---------- */}
        <aside className="destino-aside">
          <img src={destino.imagen} alt={destino.nombre} />
          <h3>{destino.nombre}</h3>
          <div className="subinfo">Ideal para: {destino.tipo}</div>

          <div className="botones-aside">
            <button className="primary" onClick={handleAgregarPlan}>
              Agregar a plan
            </button>
          </div>

          <div className="resumen">
            <strong>Resumen rápido</strong>
            <ul>
              <li>Duración: {destino.duracion}</li>
              <li>Precio estimado: S/ {destino.precio}</li>
              <li>Presupuesto: {destino.presupuesto}</li>
            </ul>
          </div>

          <button className="btn-volver-naranja" onClick={handleVolver}>
            Regresar
          </button>
        </aside>

        {/* ---------- CONTENIDO PRINCIPAL ---------- */}
        <main className="destino-main">
          <h2>Descubre {destino.nombre}</h2>
          <p className="intro">{destino.descripcion}</p>

          <div className="mapa-contenedor">
            <div className="mapa-placeholder">🗺️ Mapa en desarrollo</div>
            <div className="recomendaciones">
              <h4>Recomendaciones</h4>
              <ol>
                <li>Lleva ropa cómoda y protector solar.</li>
                <li>Reserva entradas con anticipación.</li>
                <li>Ideal visitar entre mayo y octubre.</li>
              </ol>
            </div>
          </div>

          <h3>Experiencias destacadas</h3>
          <div className="experiencias-grid">
            <div className="card">
              <h4>Tour clásico</h4>
              <p>Incluye guía, transporte y entradas.</p>
              <div className="card-footer">
                <span>S/ {parseInt(destino.precio) + 80}</span>
                <button className="primary">Ver</button>
              </div>
            </div>

            <div className="card">
              <h4>Fotografía y caminata</h4>
              <p>Para amantes del paisaje y aventura.</p>
              <div className="card-footer">
                <span>S/ {parseInt(destino.precio) + 150}</span>
                <button className="primary">Ver</button>
              </div>
            </div>

            <div className="card">
              <h4>Full experiencia local</h4>
              <p>Incluye hospedaje y gastronomía regional.</p>
              <div className="card-footer">
                <span>S/ {parseInt(destino.precio) + 250}</span>
                <button className="primary">Ver</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
