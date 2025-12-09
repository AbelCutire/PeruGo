"use client";

import React, { useEffect, useState } from "react";
import "./SectionReservas.css";
import { destinos } from "@/data/destinos";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#9ca3af"];

export default function SectionReservas({ plan, onActualizar, onEliminar, validarSolapamiento }) {
  const [destino, setDestino] = useState(null);
  const [modalPago, setModalPago] = useState(false);
  const [modalFecha, setModalFecha] = useState(false);
  const [modalResena, setModalResena] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [procesandoPago, setProcesandoPago] = useState(false);
  
  // Estados para la reseña
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [reviewGuardada, setReviewGuardada] = useState(null);

  if (!plan || !plan.destino_id) {
    return <p style={{ color: "#ef4444", padding: "20px" }}>Error: Plan no válido</p>;
  }

  // Cargar destino
  useEffect(() => {
    const encontrado = destinos.find((d) => d.id === plan.destino_id);
    setDestino(encontrado);
  }, [plan.destino_id]);

  // Cargar reseña guardada (si existe)
  useEffect(() => {
    if (plan.resena_completada) {
      const resenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");
      const review = resenas.find(r => r.plan_id === plan.id);
      if (review) setReviewGuardada(review);
    }
  }, [plan.resena_completada, plan.id]);

  if (!destino) return <p>Cargando destino...</p>;

  const calcularFechaFin = (fechaInicio) => {
    const dias = plan.duracion_dias || parseInt(plan.duracion?.match(/\d+/)?.[0] || "1");
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0];
  };

  const confirmarPlanConFecha = () => {
    if (!fechaSeleccionada) return alert("Selecciona una fecha");
    const fechaFin = calcularFechaFin(fechaSeleccionada);
    
    const validacion = validarSolapamiento(fechaSeleccionada, fechaFin, plan.id);
    if (validacion.conflicto) {
      return alert(`⚠️ Conflicto con viaje a ${validacion.planConflictivo.destino}`);
    }

    onActualizar(plan.id, { estado: "pendiente", fecha_inicio: fechaSeleccionada, fecha_fin: fechaFin });
    setModalFecha(false);
    setFechaSeleccionada("");
  };

  const procesarPago = async () => {
    setProcesandoPago(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try { const audio = new Audio("/success.mp3"); await audio.play(); } catch (e) {}

    onActualizar(plan.id, { estado: "confirmado" });
    setProcesandoPago(false);
    setModalPago(false);
    alert("✅ ¡Pago procesado exitosamente!");
  };

  const guardarResena = () => {
    if (!comentario.trim()) return alert("Escribe un comentario");
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return alert("Inicia sesión primero");

    const resenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");

    // Verificar duplicados
    if (resenas.some(r => r.plan_id === plan.id)) {
      return alert("Ya reseñaste este plan");
    }

    const nuevaResena = {
      id: Date.now(),
      plan_id: plan.id,
      destino_id: plan.destino_id, // <--- IMPORTANTE: Guardamos el ID del destino
      usuario_id: usuario.id,
      usuario_nombre: usuario.nombre || usuario.email.split('@')[0],
      estrellas,
      comentario,
      fecha: new Date().toISOString()
    };

    resenas.push(nuevaResena);
    localStorage.setItem("resenas_planes", JSON.stringify(resenas));
    
    setReviewGuardada(nuevaResena);
    onActualizar(plan.id, { resena_completada: true });
    setModalResena(false);
    setComentario("");
    alert("✅ ¡Gracias por tu reseña!");
  };

  // Datos Gráfico
  const prepararDatosGrafico = () => {
    if (!plan.gastos || plan.estado !== "confirmado") return [];
    return Object.entries(plan.gastos).map(([cat, val]) => ({ name: cat, value: val }));
  };
  const datosGrafico = prepararDatosGrafico();
  const coloresBorde = { borrador: "#9ca3af", pendiente: "#fbbf24", confirmado: "#22c55e", cancelado: "#ef4444", completado: "#3b82f6" };

  return (
    <section id="section-reservas">
      <div className="reservas-contenedor">
        {/* TARJETA */}
        <div className="tarjetas-contenedor">
          <div className="tarjeta activa" style={{ borderLeft: `8px solid ${coloresBorde[plan.estado]}` }}>
            <div className="burbuja">{plan.estado.toUpperCase()}</div>
            
            <div className="tarjeta-info">
              <img src={destino.imagen} alt={destino.nombre} className="miniatura" />
              <div>
                <h3>{destino.nombre}</h3>
                <p className="meta-info">{plan.tour} • S/ {plan.precio}</p>
                {plan.fecha_inicio && (
                  <p className="fecha-info">📅 {new Date(plan.fecha_inicio).toLocaleDateString()} - {new Date(plan.fecha_fin).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {/* BOTONES */}
            <div className="acciones">
              {plan.estado === "borrador" && <button onClick={() => setModalFecha(true)}>Confirmar Fechas</button>}
              {plan.estado === "pendiente" && (
                <>
                  <button onClick={() => setModalPago(true)}>Pagar</button>
                  <button className="btn-danger" onClick={() => { if(confirm("¿Cancelar?")) onActualizar(plan.id, {estado: "cancelado"}) }}>Cancelar</button>
                </>
              )}
              {plan.estado === "confirmado" && <button onClick={() => window.location.href = `/destino/${plan.destino_id}`}>Ver Detalles Destino</button>}
              {plan.estado === "cancelado" && <button onClick={() => setModalFecha(true)}>Reagendar</button>}
              {plan.estado === "completado" && !plan.resena_completada && <button onClick={() => setModalResena(true)}>Escribir Reseña</button>}
              
              {reviewGuardada && <span className="check-resena">✓ ¡Gracias por tu opinión!</span>}
            </div>
          </div>
        </div>

        {/* GRÁFICO (Solo confirmado) */}
        {plan.estado === "confirmado" && datosGrafico.length > 0 && (
          <div className="grafico-contenedor">
            <h3>Gastos</h3>
            <div style={{width: '100%', height: 200}}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={datosGrafico} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                    {datosGrafico.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="leyenda-simple">
              {datosGrafico.map((g, i) => <li key={i} style={{color: COLORS[i]}}>• {g.name}: S/{g.value}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* MODALES (Resumidos para brevedad, misma lógica) */}
      {modalFecha && (
        <div className="modal-overlay" onClick={() => setModalFecha(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Seleccionar Fecha</h3>
            <input type="date" className="input-fecha" onChange={e => setFechaSeleccionada(e.target.value)} />
            <div className="modal-actions">
              <button onClick={confirmarPlanConFecha}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {modalPago && (
        <div className="modal-overlay" onClick={() => !procesandoPago && setModalPago(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Pago Seguro</h3>
            <p>Total a pagar: <b>S/ {plan.precio}</b></p>
            <button className="btn-pagar" onClick={procesarPago} disabled={procesandoPago}>
              {procesandoPago ? "Procesando..." : "Pagar Ahora"}
            </button>
          </div>
        </div>
      )}

      {modalResena && (
        <div className="modal-overlay" onClick={() => setModalResena(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Tu experiencia en {destino.nombre}</h3>
            <div className="estrellas-selector">
              {[1,2,3,4,5].map(s => (
                <span key={s} onClick={() => setEstrellas(s)} style={{color: s <= estrellas ? "#fbbf24" : "#ccc"}}>★</span>
              ))}
            </div>
            <textarea placeholder="Cuéntanos qué tal fue..." rows={4} onChange={e => setComentario(e.target.value)}></textarea>
            <button onClick={guardarResena}>Publicar</button>
          </div>
        </div>
      )}
    </section>
  );
}
