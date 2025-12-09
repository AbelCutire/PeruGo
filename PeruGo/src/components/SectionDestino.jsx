"use client";

import React from "react";
import "./SectionDestino.css";
import { useRouter } from "next/navigation";

export default function SectionDestino() {
  const router = useRouter();

  const handleVolver = () => {
    sessionStorage.setItem("returnFromFicha", "true");
    window.location.href = "/";
  };

  const handleAgregarPlan = () => {
    try {
      // Obtener reservas previas del almacenamiento local
      const planesExistentes =
        JSON.parse(localStorage.getItem("misPlanes")) || [];

      // Definir el nuevo destino (tarjeta personalizada)
      const nuevoDestino = {
        id: Date.now(),
        nombre: "Machu Picchu",
        region: "Cusco",
        imagen:
          "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop",
        detalles: {
          transporte: 20,
          comidas: 15,
          guia: 10,
          hospedaje: 35,
          entradas: 10,
          otros: 10,
        },
        estado: "borrador",
        fechaCreacion: new Date().toLocaleDateString(),
      };

      // Evitar duplicados (por nombre)
      const existe = planesExistentes.some(
        (p) => p.nombre === nuevoDestino.nombre
      );
      if (!existe) {
        planesExistentes.push(nuevoDestino);
        localStorage.setItem("misPlanes", JSON.stringify(planesExistentes));
      }

      // Redirigir correctamente a /mis-planes
      router.push("/mis-planes");
    } catch (error) {
      console.error("Error al agregar plan:", error);
      alert("Hubo un problema al guardar tu plan. Inténtalo de nuevo.");
    }
  };

  return (
    <section id="ficha-destino">
      {/* ---------- Encabezado ---------- */}
      <header className="destino-header">
        <div className="destino-titulo">Ficha de Destino</div>
        <div className="destino-info">
          Generada por: PerúGo • Última actualización: hoy
        </div>
      </header>

      {/* ---------- Contenedor principal ---------- */}
      <div className="destino-layout">
        {/* ----- Aside izquierdo ----- */}
        <aside className="destino-aside">
          <img
            src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop"
            alt="Machu Picchu"
          />
          <h3>Machu Picchu — Cusco</h3>
          <div className="subinfo">
            Alta montaña • Ideal para: Cultural, Fotografía
          </div>

          {/* 🔥 Botón único */}
          <div className="botones-aside">
            <button className="primary" onClick={handleAgregarPlan}>
              Agregar a plan
            </button>
          </div>

          <hr />

          <div className="resumen">
            <strong>Resumen rápido</strong>
            <ul>
              <li>Tiempo recomendado: 2–3 días</li>
              <li>Precio estimado: S/ 800–1400</li>
              <li>Mejor época: Abril–Octubre</li>
            </ul>
          </div>

          <button className="btn-volver-naranja" onClick={handleVolver}>
            ← Volver a explorar
          </button>
        </aside>

        {/* ----- Contenido principal derecho ----- */}
        <main className="destino-main">
          <h2>Machu Picchu — Resumen y recomendaciones</h2>
          <p className="intro">
            PerúGo genera itinerarios adaptados a tu perfil. Aquí tienes un
            resumen accionable: rutas, tiempos y actividades optimizadas según
            temporada y disponibilidad.
          </p>

          <div className="mapa-contenedor">
            <div className="mapa-placeholder">Mapa (placeholder)</div>
            <div className="recomendaciones">
              <h4>Recomendaciones rápidas</h4>
              <ol>
                <li>Llegar con día de aclimatación en Cusco.</li>
                <li>Reservar entrada y transporte con antelación.</li>
                <li>Considerar guía local certificado.</li>
              </ol>
            </div>
          </div>

          {/* ----- Experiencias ----- */}
          <h3>Experiencias recomendadas</h3>
          <div className="experiencias-grid">
            {[
              {
                titulo: "Tour clásico 2 días",
                desc: "Incluye transporte, entradas y guía.",
                precio: "950",
              },
              {
                titulo: "Trek Salkantay 4 días",
                desc: "Alternativa menos masificada, nivel moderado.",
                precio: "1,500",
              },
              {
                titulo: "Experiencia fotográfica al amanecer",
                desc: "Acceso temprano y guía fotográfico.",
                precio: "420",
              },
            ].map((exp, i) => (
              <div key={i} className="card">
                <h4>{exp.titulo}</h4>
                <p>{exp.desc}</p>
                <div className="card-footer">
                  <span>S/ {exp.precio}</span>
                  <div>
                    <button className="ghost">Ver</button>
                    <button className="primary">Añadir</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}
