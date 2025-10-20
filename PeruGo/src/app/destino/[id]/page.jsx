"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { destinos } from "@/data/destinos";
import "@/components/SectionDestino.css";

export default function PageDestino() {
  const { id } = useParams();
  const destino = destinos.find((d) => d.id === id);
  const [tourSeleccionado, setTourSeleccionado] = useState(null);
  const [tourActivo, setTourActivo] = useState(null);

  const handleVolver = () => {
    sessionStorage.setItem("returnFromFicha", "true");
    window.location.href = "/";
  };

  const handleAgregarPlan = () => {
    const reservasExistentes = JSON.parse(localStorage.getItem("reservas")) || [];

    const nuevaReserva = {
      id: `${destino.id}-${tourSeleccionado ? tourSeleccionado.nombre : "general"}`,
      destino: destino.nombre,
      ubicacion: destino.ubicacion,
      imagen: destino.imagen,
      precio: tourSeleccionado ? tourSeleccionado.precio : destino.precio,
      tipo: destino.tipo,
      tour: tourSeleccionado ? tourSeleccionado.nombre : null,
      gastos: tourSeleccionado ? tourSeleccionado.gastos : destino.gastos,
      fechaCreacion: new Date().toLocaleDateString(),
      estado: "borrador",
    };

    // Evita duplicados
    const existe = reservasExistentes.some((r) => r.id === nuevaReserva.id);
    if (!existe) {
      reservasExistentes.push(nuevaReserva);
      localStorage.setItem("reservas", JSON.stringify(reservasExistentes));
    }

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

          {tourSeleccionado && (
            <div className="tour-seleccionado">
              <strong>Tour elegido:</strong>
              <p>{tourSeleccionado.nombre}</p>
              <p className="precio">S/ {tourSeleccionado.precio}</p>
            </div>
          )}

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

          {/* ---------- TOURS DINÁMICOS ---------- */}
          {destino.tours && destino.tours.length > 0 && (
            <>
              <h3>Experiencias destacadas</h3>
              <div className="experiencias-grid">
                {destino.tours.map((tour, index) => (
                  <div
                    key={index}
                    className={`card ${
                      tourSeleccionado?.nombre === tour.nombre ? "seleccionado" : ""
                    }`}
                  >
                    <h4>{tour.nombre}</h4>
                    <p>{tour.descripcion}</p>
                    <div className="card-footer">
                      <span>S/ {tour.precio}</span>
                      <div className="tour-botones">
                        <button
                          className="secondary"
                          onClick={() => setTourActivo(tour)}
                        >
                          Ver detalles
                        </button>
                        <button
                          className="primary"
                          onClick={() => setTourSeleccionado(tour)}
                        >
                          Elegir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ---------- MODAL DE TOUR DETALLE ---------- */}
          {tourActivo && (
            <div className="modal-overlay" onClick={() => setTourActivo(null)}>
              <div
                className="modal-tour"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>{tourActivo.nombre}</h3>
                <p>{tourActivo.descripcion}</p>
                {tourActivo.incluye && (
                  <>
                    <h4>Incluye:</h4>
                    <ul>
                      {tourActivo.incluye.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="precio">Precio: S/ {tourActivo.precio}</p>
                <button
                  className="primary"
                  onClick={() => {
                    setTourSeleccionado(tourActivo);
                    setTourActivo(null);
                  }}
                >
                  Elegir este tour
                </button>
                <button
                  className="btn-volver-naranja"
                  onClick={() => setTourActivo(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
