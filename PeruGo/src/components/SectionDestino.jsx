"use client";

import React, { useEffect, useState } from "react";
import "./SectionDestino.css";

export default function SectionDestino({ destino }) {
  const [reviews, setReviews] = useState([]);

  // 📥 Cargar reseñas específicas de ESTE destino
  useEffect(() => {
    if (!destino) return;
    
    const todasLasResenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");
    
    // Filtramos las reseñas que coincidan con el ID del destino actual
    const reseñasDeEsteDestino = todasLasResenas.filter(
      (r) => r.destino_id === destino.id
    );
    
    // Ordenar por fecha (las más recientes primero)
    reseñasDeEsteDestino.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    setReviews(reseñasDeEsteDestino);
  }, [destino]);

  if (!destino) return <div>Cargando información del destino...</div>;

  return (
    <section className="detalle-destino">
      {/* 1. ENCABEZADO Y DETALLES PRINCIPALES */}
      <div className="destino-hero">
        <div className="imagen-wrapper">
          <img src={destino.imagen} alt={destino.nombre} />
        </div>
        <div className="info-principal">
          <h1>{destino.nombre}</h1>
          <p className="ubicacion">📍 {destino.ubicacion}</p>
          <p className="descripcion">{destino.descripcion}</p>
          
          <div className="badges">
            <span className="badge tipo">{destino.tipo}</span>
            <span className="badge precio">Desde S/ {destino.precio}</span>
            <span className="badge duracion">🕒 {destino.duracion}</span>
          </div>
        </div>
      </div>

      <div className="contenido-grid">
        {/* COLUMNA IZQUIERDA: TOURS Y MAPA */}
        <div className="col-izq">
          
          {/* SECCIÓN TOURS (Existente) */}
          <div className="seccion-bloque">
            <h2>Tours Disponibles</h2>
            <div className="lista-tours">
              {destino.tours && destino.tours.map((tour) => (
                <div key={tour.id} className="card-tour">
                  <h4>{tour.nombre}</h4>
                  <p>{tour.descripcion}</p>
                  <div className="tour-footer">
                    <span>S/ {tour.precio}</span>
                    <button className="btn-reservar" onClick={() => alert(`Añadir ${tour.nombre} al carrito (Lógica pendiente)`)}>
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🗺️ SECCIÓN MAPA (Reemplazando el placeholder) */}
          <div className="seccion-bloque" id="mapa-destino">
            <h2>Ubicación</h2>
            <div className="mapa-container">
              <iframe
                title={`Mapa de ${destino.nombre}`}
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(destino.nombre + " " + destino.ubicacion)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESEÑAS */}
        <div className="col-der">
          <div className="seccion-bloque reseñas-bloque">
            <h2>Reseñas de viajeros</h2>
            
            {reviews.length === 0 ? (
              <div className="empty-reviews">
                <p>Aún no hay reseñas para este destino.</p>
                <small>¡Sé el primero en viajar y contarnos tu experiencia!</small>
              </div>
            ) : (
              <div className="lista-reviews">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="avatar-placeholder">
                        {review.usuario_nombre ? review.usuario_nombre[0].toUpperCase() : "U"}
                      </div>
                      <div className="review-meta">
                        <span className="usuario-nombre">
                          {review.usuario_nombre || "Viajero Anónimo"}
                        </span>
                        <span className="fecha">
                          {new Date(review.fecha).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="estrellas">
                      {"★".repeat(review.estrellas)}
                      <span className="estrellas-vacías">
                        {"★".repeat(5 - review.estrellas)}
                      </span>
                    </div>
                    
                    <p className="review-comentario">"{review.comentario}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
