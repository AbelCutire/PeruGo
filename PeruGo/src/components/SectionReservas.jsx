"use client";

import React, { useEffect, useState } from "react";
import "./SectionReservas.css";
import { destinos } from "@/data/destinos";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#9ca3af"];

export default function SectionReservas({ 
  plan, 
  onActualizar, 
  onEliminar, 
  validarSolapamiento,
  modo = "tarjeta" // 'tarjeta' | 'grafico'
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

  // Validar plan
  if (!plan || !plan.destino_id) return null;

  useEffect(() => {
    const encontrado = destinos.find((d) => d.id === plan.destino_id);
    setDestino(encontrado);
  }, [plan.destino_id]);

  if (!destino) return null;

  // --- LÓGICA DE ACCIONES ---

  const calcularFechaFin = (fechaInicio) => {
    const dias = plan.duracion_dias || parseInt(plan.duracion?.match(/\d+/)?.[0] || "1");
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
    onActualizar(plan.id, {
      estado: "pendiente",
      fecha_inicio: fechaSeleccionada,
      fecha_fin: fechaFin
    });
    setModalFecha(false);
  };

  const procesarPago = async () => {
    setProcesandoPago(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
    onActualizar(plan.id, { estado: "confirmado" });
    setProcesandoPago(false);
    setModalPago(false);
    alert("✅ ¡Pago procesado!");
  };

  const abrirModalResena = () => {
    // Si ya existe una reseña, la cargamos para editar
    if (plan.resena_completada) {
       const resenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");
       // Buscamos la reseña asociada a este plan específico
       const miResena = resenas.find(r => r.plan_id === plan.plan_id); 
       if (miResena) {
         setEstrellas(miResena.estrellas);
         setComentario(miResena.comentario);
       }
    } else {
      // Limpiar si es nueva
      setEstrellas(5);
      setComentario("");
    }
    setModalResena(true);
  };

  const guardarResena = () => {
    if (!comentario.trim()) {
      alert("Escribe un comentario.");
      return;
    }
    // Recuperar usuario
    const userEmail = sessionStorage.getItem("lastEmail");
    const usuario = JSON.parse(localStorage.getItem(`usuario_${userEmail}`));
    if (!usuario) return;

    let resenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");

    // Eliminar reseña anterior de este plan si existe (para reemplazarla)
    resenas = resenas.filter(r => r.plan_id !== plan.plan_id);

    resenas.push({
      id: Date.now(),
      plan_id: plan.plan_id,
      usuario_id: usuario.id,
      usuario_nombre: usuario.nombre,
      estrellas,
      comentario,
      fecha: new Date().toISOString()
    });

    localStorage.setItem("resenas_planes", JSON.stringify(resenas));
    onActualizar(plan.id, { resena_completada: true });
    setModalResena(false);
    alert("✅ Reseña guardada.");
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

  // === MODO GRÁFICO (Columna Derecha) ===
  if (modo === "grafico") {
    // Si no hay datos o no está confirmado, no renderizamos nada en la columna derecha
    if (datosGrafico.length === 0) return null;

    const total = datosGrafico.reduce((acc, el) => acc + el.value, 0);

    return (
      <div className="card-grafico">
        <div className="header-grafico">
          <strong>{plan.destino}</strong>
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

  // === MODO TARJETA (Columna Izquierda) ===
  return (
    <>
      <div 
        className="card-plan"
        style={{ borderLeft: `6px solid ${coloresBorde[plan.estado]}` }}
      >
        <div className="card-header">
           <span className={`badge-estado ${plan.estado}`}>
             {plan.estado.toUpperCase()}
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
              {plan.resena_completada ? "Editar Reseña" : "Dejar Reseña"}
            </button>
          )}
        </div>
      </div>

      {/* --- MODALES (Solo se renderizan si estamos en modo tarjeta) --- */}
      
      {/* Modal FECHA */}
      {modalFecha && (
        <div className="modal-overlay" onClick={() => setModalFecha(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Planificar Viaje</h3>
            <p>Duración: {plan.duracion}</p>
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

      {/* Modal PAGO */}
      {modalPago && (
        <div className="modal-overlay" onClick={() => !procesandoPago && setModalPago(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Realizar Pago</h3>
            <p style={{marginBottom: '15px'}}>Total a pagar: <strong>S/ {plan.precio}</strong></p>
            <input type="text" placeholder="Número de Tarjeta" className="input-modal" disabled />
            <div style={{display:'flex', gap:'10px'}}>
               <input type="text" placeholder="MM/AA" className="input-modal" disabled />
               <input type="text" placeholder="CVC" className="input-modal" disabled />
            </div>
            <button className="btn-confirm" onClick={procesarPago} disabled={procesandoPago} style={{marginTop:'10px'}}>
              {procesandoPago ? "Procesando..." : "Pagar S/ " + plan.precio}
            </button>
          </div>
        </div>
      )}

      {/* Modal RESEÑA */}
      {modalResena && (
        <div className="modal-overlay" onClick={() => setModalResena(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>{plan.resena_completada ? "Editar Reseña" : "Tu Experiencia"}</h3>
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
