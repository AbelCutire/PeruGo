"use client";

import React, { useEffect, useState } from "react";
import "./SectionReservas.css";
import { destinos } from "@/data/destinos";
import { createReview } from "@/services/planes"; // ✅ Importar servicio
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#9ca3af"];

export default function SectionReservas({ 
  plan, 
  onActualizar, 
  onEliminar, 
  validarSolapamiento,
  modo = "tarjeta"
}) {
  const [destino, setDestino] = useState(null);
  
  // Modales
  const [modalPago, setModalPago] = useState(false);
  const [modalFecha, setModalFecha] = useState(false);
  const [modalResena, setModalResena] = useState(false);
  
  // Estados de formularios
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");

  if (!plan || !plan.destino_id) return null;

  useEffect(() => {
    // Aquí podrías incluso hacer un fetch al backend si 'destinos' estuviera en DB
    // Por ahora seguimos usando el catálogo local para imágenes y descripciones estáticas
    const encontrado = destinos.find((d) => d.id === plan.destino_id);
    setDestino(encontrado);
  }, [plan.destino_id]);

  if (!destino) return null;

  // --- LÓGICA ---

  const calcularFechaFin = (fechaInicio) => {
    // Si la duración viene del backend como string "4 días", parseamos.
    // Si viene como número, usamos directo.
    const dias = typeof plan.duracion === 'number' ? plan.duracion : parseInt(plan.duracion?.match(/\d+/)?.[0] || "1");
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0];
  };

  const confirmarPlanConFecha = () => {
    if (!fechaSeleccionada) {
      alert("Debes seleccionar una fecha de partida");
      return;
    }
    const fechaFin = calcularFechaFin(fechaSeleccionada);
    const validacion = validarSolapamiento(fechaSeleccionada, fechaFin, plan.id);
    
    if (validacion.conflicto) {
      alert(`⚠️ Conflicto con: ${validacion.planConflictivo.destino}`);
      return;
    }
    
    // Llamamos a la función del padre que conecta con el API
    onActualizar(plan.id, {
      estado: "pendiente",
      fecha_inicio: fechaSeleccionada,
      fecha_fin: fechaFin
    });
    setModalFecha(false);
  };

  const procesarPago = async () => {
    setProcesandoPago(true);
    // Simulación de pasarela
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // Actualizamos en backend vía padre
    onActualizar(plan.id, { estado: "confirmado" });
    setProcesandoPago(false);
    setModalPago(false);
    alert("✅ ¡Pago procesado!");
  };

  const abrirModalResena = () => {
    // Nota: Como el backend actual no devuelve el texto de la reseña, 
    // siempre abrimos el modal limpio o permitimos crear una nueva.
    setEstrellas(5);
    setComentario("");
    setModalResena(true);
  };

  const guardarResena = async () => {
    if (!comentario.trim()) {
      alert("Escribe un comentario.");
      return;
    }

    try {
      // 1. Enviar al Backend
      await createReview({
        plan_id: plan.id,
        destino_id: plan.destino_id,
        estrellas: estrellas,
        comentario: comentario
      });

      // 2. Actualizar estado del plan en Backend (marcar review_completed)
      onActualizar(plan.id, { resena_completada: true });
      
      setModalResena(false);
      alert("✅ Reseña guardada en la nube.");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar tu reseña.");
    }
  };

  const cancelarPlan = () => {
    if (confirm("¿Cancelar plan?")) {
      onActualizar(plan.id, { estado: "cancelado" });
    }
  };

  // --- RENDERIZADO ---

  const coloresBorde = {
    borrador: "#9ca3af",
    pendiente: "#fbbf24",
    confirmado: "#22c55e",
    cancelado: "#ef4444",
    completado: "#3b82f6"
  };

  const datosGrafico = (plan.gastos && (plan.estado === "confirmado" || plan.estado === "completado")) 
    ? Object.entries(plan.gastos).map(([cat, val]) => ({ name: cat, value: val }))
    : [];

  // MODO GRÁFICO
  if (modo === "grafico") {
    if (datosGrafico.length === 0) return null;
    const total = datosGrafico.reduce((acc, el) => acc + el.value, 0);

    return (
      <div className="card-grafico">
        <div className="header-grafico">
          <strong>{plan.destino}</strong> {/* Usamos plan.destino si el backend lo guarda, o destino.nombre local */}
          <span className="badge-total">Total: S/ {total}</span>
        </div>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={datosGrafico}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {datosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `S/ ${val}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="leyenda-grafico">
          {datosGrafico.map((g, i) => (
            <div key={i} className="item-leyenda">
              <span className="dot" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
              <span className="cat-nombre">{g.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MODO TARJETA
  return (
    <>
      <div 
        className="card-plan"
        style={{ borderLeft: `6px solid ${coloresBorde[plan.estado]}` }}
      >
        <div className="card-header">
           <span className={`badge-estado ${plan.estado}`}>
             {plan.estado?.toUpperCase()}
           </span>
           <button className="btn-close" onClick={() => onEliminar(plan.id)} title="Eliminar Plan">
             ×
           </button>
        </div>

        <div className="card-body">
          <img src={destino.imagen} alt={destino.nombre} className="img-plan" />
          <div className="info-plan">
            <h3>{destino.nombre}</h3>
            <p className="subinfo">{plan.tour}</p>
            <p className="precio">S/ {plan.precio}</p>
            {plan.fecha_inicio && (
               <p className="fechas">
                 📅 {new Date(plan.fecha_inicio).toLocaleDateString()} - {new Date(plan.fecha_fin).toLocaleDateString()}
               </p>
            )}
          </div>
        </div>

        <div className="card-actions">
          {plan.estado === "borrador" && (
            <button className="btn-action primary" onClick={() => setModalFecha(true)}>
              Planificar Fechas
            </button>
          )}
          {plan.estado === "pendiente" && (
            <>
              <button className="btn-action primary" onClick={() => setModalPago(true)}>
                Pagar Ahora
              </button>
              <button className="btn-action danger" onClick={cancelarPlan}>
                Cancelar
              </button>
            </>
          )}
          {plan.estado === "confirmado" && (
            <button className="btn-action secondary" onClick={() => window.location.href=`/destino/${plan.destino_id}`}>
              Ver Detalles
            </button>
          )}
          {plan.estado === "cancelado" && (
            <button className="btn-action secondary" onClick={() => setModalFecha(true)}>
              Reagendar
            </button>
          )}
          {plan.estado === "completado" && (
            <button className="btn-action primary" onClick={abrirModalResena}>
              {plan.resena_completada ? "Enviar otra reseña" : "Dejar Reseña"}
            </button>
          )}
        </div>
      </div>

      {/* --- MODALES --- */}
      
      {/* Modal FECHA */}
      {modalFecha && (
        <div className="modal-overlay" onClick={() => setModalFecha(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Planificar Viaje</h3>
            <p>Duración estimada: {plan.duracion || "Varios días"}</p>
            <label style={{display:'block', marginTop:'10px'}}>Fecha de inicio:</label>
            <input 
              type="date" 
              className="input-modal"
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
            <div className="modal-btns">
              <button className="btn-confirm" onClick={confirmarPlanConFecha}>Guardar</button>
              <button className="btn-cancel" onClick={() => setModalFecha(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PAGO */}
      {modalPago && (
        <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={() => !procesandoPago && setModalPago(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Procesar pago</h3>
            
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ marginBottom: "10px" }}>Desglose de gastos:</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {plan.gastos && Object.entries(plan.gastos).map(([key, value]) => (
                  <li key={key} style={{ padding: "8px 0", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ textTransform: "capitalize" }}>{key}</span>
                    <span style={{ fontWeight: "600" }}>S/ {value}</span>
                  </li>
                ))}
                <li style={{ padding: "12px 0", fontWeight: "700", fontSize: "1.1rem", display: "flex", justifyContent: "space-between" }}>
                  <span>Total:</span>
                  <span style={{ color: "#3b82f6" }}>S/ {plan.precio}</span>
                </li>
              </ul>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#475569" }}>
                Número de tarjeta
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                disabled={procesandoPago}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#475569" }}>
                  Fecha vencimiento
                </label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  disabled={procesandoPago}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1"
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#475569" }}>
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength="3"
                  disabled={procesandoPago}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1"
                  }}
                />
              </div>
            </div>

            <button 
              onClick={procesarPago}
              disabled={procesandoPago}
              style={{
                width: "100%",
                background: procesandoPago ? "#94a3b8" : "#22c55e",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "8px",
                cursor: procesandoPago ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "600"
              }}
            >
              {procesandoPago ? "Procesando..." : "Pagar"}
            </button>
          </div>
        </div>
      )}

      {/* Modal RESEÑA */}
      {modalResena && (
        <div className="modal-overlay" onClick={() => setModalResena(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>{plan.resena_completada ? "Nueva Reseña" : "Tu Experiencia"}</h3>
            <div className="estrellas-selector">
              {[1,2,3,4,5].map(s => (
                <span key={s} onClick={() => setEstrellas(s)} style={{color: s <= estrellas ? "#fbbf24" : "#ccc"}}>★</span>
              ))}
            </div>
            <textarea 
              className="input-modal" 
              rows="4" 
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              placeholder="Cuéntanos qué tal te pareció..."
            />
            <div className="modal-btns">
              <button className="btn-confirm" onClick={guardarResena}>Publicar</button>
              <button className="btn-cancel" onClick={() => setModalResena(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

