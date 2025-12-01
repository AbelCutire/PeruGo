"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { destinos } from "@/data/destinos";
import "@/components/SectionDestino.css";

export default function PageDestino() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const destino = destinos.find((d) => d.id === id);
  
  const [tourSeleccionado, setTourSeleccionado] = useState(null);
  const [tourActivo, setTourActivo] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [modalResena, setModalResena] = useState(false);
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");

  // Cargar reseñas del plan seleccionado
  useEffect(() => {
    if (tourSeleccionado) {
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
    sessionStorage.setItem("returnFromFicha", "true");
    window.location.href = "/";
  };

  const handleAgregarPlan = () => {
    if (!tourSeleccionado) {
      alert("❌ Debes seleccionar un plan primero");
      return;
    }

    // Verificar si hay sesión iniciada usando tu sistema
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userEmail = sessionStorage.getItem("lastEmail");
    
    if (!isLoggedIn || !userEmail) {
      // No hay sesión, redirigir a login y guardar destino para volver
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login";
      return;
    }

    // Crear o recuperar usuario desde tu sistema
    let usuario = localStorage.getItem(`usuario_${userEmail}`);
    let usuarioObj;
    
    if (!usuario) {
      // Primera vez que agrega un plan, crear estructura de usuario
      usuarioObj = {
        id: `user_${Date.now()}`,
        email: userEmail,
        nombre: userEmail.split('@')[0] // Usar parte del email como nombre por defecto
      };
      localStorage.setItem(`usuario_${userEmail}`, JSON.stringify(usuarioObj));
    } else {
      usuarioObj = JSON.parse(usuario);
    }

    const planesExistentes = JSON.parse(localStorage.getItem(`planes_${usuarioObj.id}`)) || [];

    // Extraer duración en días
    const duracionMatch = tourSeleccionado.duracion?.match(/(\d+)\s*día/i);
    const duracionDias = duracionMatch ? parseInt(duracionMatch[1]) : 1;

    const nuevoPlan = {
      id: `${destino.id}-${tourSeleccionado.nombre.replace(/\s+/g, '-')}-${Date.now()}`,
      destino_id: destino.id,
      destino: destino.nombre,
      ubicacion: destino.ubicacion,
      imagen: destino.imagen,
      plan_id: tourSeleccionado.id,
      tour: tourSeleccionado.nombre,
      precio: tourSeleccionado.precio,
      duracion: tourSeleccionado.duracion || destino.duracion,
      duracion_dias: duracionDias,
      gastos: tourSeleccionado.gastos,
      estado: "borrador",
      fecha_inicio: null,
      fecha_fin: null,
      resena_completada: false
    };

    // Verificar si ya existe el mismo plan en borrador
    const existe = planesExistentes.some(
      p => p.destino_id === nuevoPlan.destino_id && 
           p.tour === nuevoPlan.tour && 
           p.estado === "borrador"
    );

    if (!existe) {
      planesExistentes.push(nuevoPlan);
      localStorage.setItem(`planes_${usuarioObj.id}`, JSON.stringify(planesExistentes));
    }
    
    // Redirigir directamente sin alert
    window.location.href = "/mis-planes";
  };

  const guardarResena = () => {
    if (!comentario.trim()) {
      alert("❌ Debes escribir un comentario");
      return;
    }

    // Usar tu sistema de autenticación
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userEmail = sessionStorage.getItem("lastEmail");
    
    if (!isLoggedIn || !userEmail) {
      alert("❌ Debes iniciar sesión");
      window.location.href = "/login";
      return;
    }

    // Recuperar datos del usuario
    const usuario = JSON.parse(localStorage.getItem(`usuario_${userEmail}`) || '{}');
    if (!usuario.id) {
      alert("❌ Error al obtener datos de usuario");
      return;
    }

    const resenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");
    const planId = searchParams.get("plan");

    // Verificar si ya dejó reseña
    const yaReseno = resenas.some(r => r.plan_id === planId && r.usuario_id === usuario.id);
    if (yaReseno) {
      alert("⚠️ Ya has dejado una reseña para este plan");
      return;
    }

    resenas.push({
      id: Date.now(),
      plan_id: planId,
      usuario_id: usuario.id,
      usuario_nombre: usuario.nombre,
      estrellas,
      comentario,
      fecha: new Date().toISOString()
    });

    localStorage.setItem("resenas_planes", JSON.stringify(resenas));
    setModalResena(false);
    alert("✅ ¡Gracias por tu reseña!");
    
    // Actualizar el plan como reseñado
    const planes = JSON.parse(localStorage.getItem(`planes_${usuario.id}`)) || [];
    const planActualizado = planes.map(p => 
      p.plan_id === planId ? { ...p, resena_completada: true } : p
    );
    localStorage.setItem(`planes_${usuario.id}`, JSON.stringify(planActualizado));

    window.location.href = "/mis-planes";
  };

  const calcularPromedioEstrellas = (planId) => {
    const todasResenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");
    const resenasPlan = todasResenas.filter(r => r.plan_id === planId);
    if (resenasPlan.length === 0) return 0;
    
    const suma = resenasPlan.reduce((acc, r) => acc + r.estrellas, 0);
    return (suma / resenasPlan.length).toFixed(1);
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
              disabled={!tourSeleccionado}
              style={{
                opacity: tourSeleccionado ? 1 : 0.5,
                cursor: tourSeleccionado ? "pointer" : "not-allowed"
              }}
            >
              {tourSeleccionado ? "Agregar a mis planes" : "Selecciona un plan"}
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

              {/* Sección de reseñas */}
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
