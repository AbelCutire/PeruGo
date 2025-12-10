"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { destinos } from "@/data/destinos";
import "@/components/SectionDestino.css";
// ✅ IMPORTAR SERVICIOS
import { createPlan, createReview } from "@/services/planes";
import { getCurrentUser } from "@/services/auth";

export default function PageDestino() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter(); // ✅ Usar router de Next.js
  const destino = destinos.find((d) => d.id === id);
  
  const [tourSeleccionado, setTourSeleccionado] = useState(null);
  const [tourActivo, setTourActivo] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [modalResena, setModalResena] = useState(false);
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [guardando, setGuardando] = useState(false); // Estado para feedback visual

  // Cargar reseñas locales (Idealmente esto vendría de una API GET /reviews/destino/:id)
  useEffect(() => {
    if (tourSeleccionado) {
      // Por ahora mantenemos la lectura local de reseñas para no romper la vista
      // hasta que tengas el endpoint de "obtener reseñas por destino"
      const todasResenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");
      const resenasPlan = todasResenas.filter(r => r.plan_id === tourSeleccionado.id);
      setResenas(resenasPlan);
    }
  }, [tourSeleccionado]);

  // Abrir modal de reseña si viene del parámetro
  useEffect(() => {
    if (searchParams.get("resenar") === "1") {
      const planId = searchParams.get("plan");
      if (planId) {
        setModalResena(true);
      }
    }
  }, [searchParams]);

  const handleVolver = () => {
    router.push("/");
  };

  // ✅ NUEVA LÓGICA: Guardar Plan en Base de Datos
  const handleAgregarPlan = async () => {
    if (!tourSeleccionado) {
      alert("❌ Debes seleccionar un plan primero");
      return;
    }

    // 1. Verificar Sesión
    const user = getCurrentUser();
    if (!user) {
      // Guardar url para volver después del login
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push("/login");
      return;
    }

    setGuardando(true);

    try {
      // 2. Preparar datos para el Backend
      const nuevoPlan = {
        destino_id: destino.id,
        tour: tourSeleccionado.nombre,
        precio: tourSeleccionado.precio,
        gastos: tourSeleccionado.gastos,
        estado: "borrador"
        // No enviamos ID, el backend lo genera (UUID)
      };

      // 3. Enviar a la API
      await createPlan(nuevoPlan);

      // 4. Redirigir
      router.push("/mis-planes");

    } catch (error) {
      console.error("Error al guardar plan:", error);
      alert("❌ Hubo un error al conectar con el servidor. Intenta nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  // ✅ NUEVA LÓGICA: Guardar Reseña en Base de Datos
  const guardarResena = async () => {
    if (!comentario.trim()) {
      alert("❌ Debes escribir un comentario");
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      alert("❌ Debes iniciar sesión");
      router.push("/login");
      return;
    }

    try {
      const planId = searchParams.get("plan"); // Si venimos de "Mis Planes"

      await createReview({
        plan_id: planId, // Puede ser null si es una reseña general del destino
        destino_id: destino.id,
        estrellas: estrellas,
        comentario: comentario
      });

      setModalResena(false);
      setComentario("");
      alert("✅ ¡Gracias por tu reseña! Se ha guardado en la nube.");
      
      // Si venimos de un plan específico, volver a mis planes
      if (planId) {
        router.push("/mis-planes");
      }

    } catch (error) {
      console.error("Error al guardar reseña:", error);
      alert("❌ No se pudo guardar la reseña.");
    }
  };

  const calcularPromedioEstrellas = (planId) => {
    const todasResenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");
    const resenasPlan = todasResenas.filter(r => r.plan_id === planId);
    if (resenasPlan.length === 0) return 0;
    
    const suma = resenasPlan.reduce((acc, r) => acc + r.estrellas, 0);
    return (suma / resenasPlan.length).toFixed(1);
  };

  const handleVerRDF = () => {
    if (!destino) return;
    const slug = destino.id;
    // Asegúrate de que esta URL coincida con tu backend desplegado
    const url = `https://perugo-backend-production.up.railway.app/rdf/destino/${encodeURIComponent(slug)}`;
    window.open(url, "_blank");
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
      <div className="destino-header">
        <div>
          <div className="destino-titulo">{destino.nombre}</div>
          <div className="destino-info">{destino.ubicacion}</div>
        </div>
        <div className="destino-info">Actualizado: Hoy</div>
      </div>

      <div className="destino-layout">
        <aside className="destino-aside">
          <img src={destino.imagen} alt={destino.nombre} />
          <h3>{destino.nombre}</h3>
          <div className="subinfo">Ideal para: {destino.tipo}</div>

          {tourSeleccionado && (
            <div className="tour-seleccionado">
              <strong>Plan elegido:</strong>
              <p>{tourSeleccionado.nombre}</p>
              <p className="precio">S/ {tourSeleccionado.precio}</p>
              <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Duración: {tourSeleccionado.duracion || destino.duracion}
              </p>
            </div>
          )}

          <div className="botones-aside">
            <button 
              className="primary" 
              onClick={handleAgregarPlan}
              disabled={!tourSeleccionado || guardando}
              style={{
                opacity: tourSeleccionado && !guardando ? 1 : 0.5,
                cursor: tourSeleccionado && !guardando ? "pointer" : "not-allowed"
              }}
            >
              {guardando 
                ? "Guardando..." 
                : (tourSeleccionado ? "Agregar a mis planes" : "Selecciona un plan")}
            </button>
            <button
              className="btn-rdf-destino"
              type="button"
              onClick={handleVerRDF}
            >
              Ver RDF de este destino
            </button>
          </div>

          <div className="resumen">
            <strong>Resumen rápido</strong>
            <ul>
              <li>Duración: {destino.duracion}</li>
              <li>Precio desde: S/ {destino.precio}</li>
              <li>Presupuesto: {destino.presupuesto}</li>
            </ul>
          </div>

          <button className="btn-volver-naranja" onClick={handleVolver}>
            Regresar
          </button>
        </aside>

        <main className="destino-main">
          <h2>Descubre {destino.nombre}</h2>
          <p className="intro">{destino.descripcion}</p>

          <div className="mapa-contenedor">
            <iframe
              title={`Mapa de ${destino.nombre}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                destino.nombre + " " + destino.ubicacion
              )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: "12px", marginBottom: "20px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="recomendaciones">
              <h4>Recomendaciones</h4>
              <ol>
                <li>Lleva ropa cómoda y protector solar.</li>
                <li>Reserva entradas con anticipación.</li>
                <li>Ideal visitar entre mayo y octubre.</li>
              </ol>
            </div>
          </div>

          {destino.tours && destino.tours.length > 0 && (
            <>
              <h3>Planes disponibles</h3>
              <p style={{ color: "#64748b", marginBottom: "20px" }}>
                Selecciona el plan que mejor se adapte a tu viaje
              </p>
              <div className="experiencias-grid">
                {destino.tours.map((tour, index) => {
                  const planId = tour.id || `${destino.id}-${tour.nombre}`;
                  const promedio = calcularPromedioEstrellas(planId);
                  const todasResenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");
                  const cantidadResenas = todasResenas.filter(r => r.plan_id === planId).length;

                  return (
                    <div
                      key={index}
                      className={`card ${
                        tourSeleccionado?.nombre === tour.nombre ? "seleccionado" : ""
                      }`}
                    >
                      <h4>{tour.nombre}</h4>
                      <p>{tour.descripcion}</p>
                      <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "8px" }}>
                        📅 {tour.duracion || destino.duracion}
                      </p>
                      
                      {cantidadResenas > 0 && (
                        <div style={{ margin: "10px 0", color: "#fbbf24" }}>
                          <span style={{ fontSize: "1.2rem" }}>
                            {"★".repeat(Math.round(promedio))}{"☆".repeat(5 - Math.round(promedio))}
                          </span>
                          <span style={{ marginLeft: "10px", color: "#64748b", fontSize: "0.9rem" }}>
                            {promedio} ({cantidadResenas} reseña{cantidadResenas !== 1 ? "s" : ""})
                          </span>
                        </div>
                      )}

                      <div className="card-footer">
                        <span>S/ {tour.precio}</span>
                        <div className="tour-botones">
                          <button
                            className="secondary"
                            onClick={() => setTourActivo({ ...tour, id: planId })}
                          >
                            Ver detalles
                          </button>
                          <button
                            className="primary"
                            onClick={() => setTourSeleccionado({ ...tour, id: planId })}
                          >
                            {tourSeleccionado?.nombre === tour.nombre ? "✓ Elegido" : "Elegir"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sección de reseñas (Visualización local temporal) */}
              {tourSeleccionado && resenas.length > 0 && (
                <div style={{ marginTop: "40px" }}>
                  <h3>Reseñas: {tourSeleccionado.nombre}</h3>
                  <div style={{ marginTop: "20px" }}>
                    {resenas.map((resena) => (
                      <div
                        key={resena.id}
                        style={{
                          background: "#f8fafc",
                          padding: "20px",
                          borderRadius: "12px",
                          marginBottom: "15px",
                          border: "1px solid #e2e8f0"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <strong style={{ color: "#1e293b" }}>{resena.usuario_nombre}</strong>
                          <span style={{ color: "#fbbf24", fontSize: "1.1rem" }}>
                            {"★".repeat(resena.estrellas)}{"☆".repeat(5 - resena.estrellas)}
                          </span>
                        </div>
                        <p style={{ color: "#475569", lineHeight: "1.6" }}>{resena.comentario}</p>
                        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "10px" }}>
                          {new Date(resena.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {tourActivo && (
            <div className="modal-overlay" onClick={() => setTourActivo(null)}>
              <div className="modal-tour" onClick={(e) => e.stopPropagation()}>
                <h3>{tourActivo.nombre}</h3>
                <p>{tourActivo.descripcion}</p>
                <p><strong>Duración:</strong> {tourActivo.duracion || destino.duracion}</p>
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
                  Elegir este plan
                </button>
                <button className="btn-volver-naranja" onClick={() => setTourActivo(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {modalResena && (
            <div className="modal-overlay" onClick={() => setModalResena(false)}>
              <div className="modal-tour" onClick={(e) => e.stopPropagation()}>
                <h3>Deja tu reseña</h3>
                <p style={{ color: "#64748b", marginBottom: "20px" }}>
                  Comparte tu experiencia en {destino.nombre}
                </p>

                <div style={{ marginBottom: "20px", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setEstrellas(star)}
                        style={{
                          cursor: "pointer",
                          color: star <= estrellas ? "#fbbf24" : "#cbd5e1",
                          margin: "0 5px"
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Cuéntanos sobre tu viaje..."
                  rows="5"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    marginBottom: "20px",
                    resize: "vertical"
                  }}
                />

                <button className="primary" onClick={guardarResena}>
                  Enviar reseña
                </button>
                <button 
                  className="btn-volver-naranja" 
                  onClick={() => setModalResena(false)}
                  style={{ marginLeft: "10px" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
