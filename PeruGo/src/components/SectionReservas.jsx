"use client";

import React, { useEffect, useState } from "react";
import "./SectionReservas.css";
import { destinos } from "@/data/destinos";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#9ca3af"];

export default function SectionReservas({ plan, onActualizar, onEliminar, validarSolapamiento }) {
  const [destino, setDestino] = useState(null);
  const [modalPago, setModalPago] = useState(false);
  const [modalFecha, setModalFecha] = useState(false);
  const [modalResena, setModalResena] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");

  // Validar que plan existe
  if (!plan || !plan.destino_id) {
    return <p style={{ color: "#ef4444", padding: "20px" }}>Error: Plan no válido</p>;
  }

  // Cargar destino
  useEffect(() => {
    const encontrado = destinos.find((d) => d.id === plan.destino_id);
    setDestino(encontrado);
  }, [plan.destino_id]);

  if (!destino) return <p>Cargando destino...</p>;

  // Calcular fecha fin
  const calcularFechaFin = (fechaInicio) => {
    const dias = plan.duracion_dias || parseInt(plan.duracion?.match(/\d+/)?.[0] || "1");
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().split('T')[0];
  };

  // Confirmar plan con fecha (de Borrador a Pendiente)
  const confirmarPlanConFecha = () => {
    if (!fechaSeleccionada) {
      alert("Debes seleccionar una fecha de partida");
      return;
    }

    const fechaFin = calcularFechaFin(fechaSeleccionada);
    
    // Validar solapamiento
    const validacion = validarSolapamiento(fechaSeleccionada, fechaFin, plan.id);
    
    if (validacion.conflicto) {
      alert(`⚠️ Este plan se solapa con tu viaje a ${validacion.planConflictivo.destino}\n\nFechas conflictivas:\n${validacion.planConflictivo.fecha_inicio} al ${validacion.planConflictivo.fecha_fin}`);
      return;
    }

    onActualizar(plan.id, {
      estado: "pendiente",
      fecha_inicio: fechaSeleccionada,
      fecha_fin: fechaFin
    });

    setModalFecha(false);
    setFechaSeleccionada("");
  };

  // Procesar pago (de Pendiente a Confirmado)
  const procesarPago = async () => {
    setProcesandoPago(true);

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reproducir sonido de éxito
    try {
      const audio = new Audio("/success.mp3");
      await audio.play();
    } catch (e) {
      console.log("No se pudo reproducir el audio");
    }

    onActualizar(plan.id, { estado: "confirmado" });
    setProcesandoPago(false);
    setModalPago(false);
    alert("✅ ¡Pago procesado exitosamente!");
  };

  // Cancelar plan
  const cancelarPlan = () => {
    if (confirm("¿Estás seguro de cancelar este plan?")) {
      onActualizar(plan.id, { estado: "cancelado" });
    }
  };

  // Reagendar (desde Cancelado)
  const reagendarPlan = () => {
    setModalFecha(true);
  };

  // Guardar reseña
  const guardarResena = () => {
    if (!comentario.trim()) {
      alert("Debes escribir un comentario");
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      alert("Debes iniciar sesión");
      return;
    }

    const resenas = JSON.parse(localStorage.getItem("resenas_planes") || "[]");

    // Verificar si ya dejó reseña
    const yaReseno = resenas.some(r => r.plan_id === plan.plan_id && r.usuario_id === usuario.id);
    if (yaReseno) {
      alert("Ya has dejado una reseña para este plan");
      return;
    }

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
    setComentario("");
    alert("✅ ¡Gracias por tu reseña!");
  };

  // Preparar datos para gráfico (solo si está confirmado)
  const prepararDatosGrafico = () => {
    if (!plan.gastos || plan.estado !== "confirmado") return [];

    return Object.entries(plan.gastos).map(([categoria, valor]) => ({
      name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      value: valor
    }));
  };

  const datosGrafico = prepararDatosGrafico();
  const totalGastos = datosGrafico.reduce((acc, g) => acc + g.value, 0);

  // Colores según estado
  const coloresBorde = {
    borrador: "#9ca3af",
    pendiente: "#fbbf24",
    confirmado: "#22c55e",
    cancelado: "#ef4444",
    completado: "#3b82f6"
  };

  return (
    <section id="section-reservas">
      <div className="reservas-contenedor">
        {/* TARJETA DEL PLAN */}
        <div className="tarjetas-contenedor">
          <div
            className="tarjeta activa"
            style={{ borderLeft: `8px solid ${coloresBorde[plan.estado]}` }}
          >
            <div className="burbuja">
              {plan.estado === "borrador" && "Borrador"}
              {plan.estado === "pendiente" && "Pendiente de pago"}
              {plan.estado === "confirmado" && "Confirmado"}
              {plan.estado === "cancelado" && "Cancelado"}
              {plan.estado === "completado" && "Completado"}
            </div>

            <div className="tarjeta-info">
              <img src={destino.imagen} alt={destino.nombre} className="miniatura" />
              <div>
                <h3>{destino.nombre}</h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "5px 0" }}>
                  {plan.tour} • S/ {plan.precio}
                </p>
                <p style={{ color: "#475569", fontSize: "0.85rem" }}>
                  Duración: {plan.duracion}
                </p>
                {plan.fecha_inicio && (
                  <p style={{ color: "#22c55e", fontSize: "0.85rem", fontWeight: "600", marginTop: "5px" }}>
                    📅 {new Date(plan.fecha_inicio).toLocaleDateString('es-ES')} al {new Date(plan.fecha_fin).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
            </div>

            {/* BOTONES SEGÚN ESTADO */}
            <div className="acciones">
              {/* Estado: BORRADOR */}
              {plan.estado === "borrador" && (
                <button onClick={() => setModalFecha(true)}>
                  Editar y Confirmar
                </button>
              )}

              {/* Estado: PENDIENTE */}
              {plan.estado === "pendiente" && (
                <>
                  <button onClick={() => setModalPago(true)}>
                    Pagar
                  </button>
                  <button 
                    onClick={cancelarPlan}
                    style={{ background: "#ef4444" }}
                  >
                    Cancelar
                  </button>
                </>
              )}

              {/* Estado: CONFIRMADO */}
              {plan.estado === "confirmado" && (
                <button onClick={() => window.location.href = `/destino/${plan.destino_id}`}>
                  Ver destino
                </button>
              )}

              {/* Estado: CANCELADO */}
              {plan.estado === "cancelado" && (
                <button onClick={reagendarPlan}>
                  Reagendar
                </button>
              )}

              {/* Estado: COMPLETADO */}
              {plan.estado === "completado" && !plan.resena_completada && (
                <button onClick={() => setModalResena(true)}>
                  Reseñar
                </button>
              )}

              {plan.estado === "completado" && plan.resena_completada && (
                <p style={{ color: "#22c55e", fontStyle: "italic", fontSize: "0.9rem" }}>
                  ✓ Reseña completada
                </p>
              )}
            </div>
          </div>
        </div>

        {/* GRÁFICO DE GASTOS (solo si está confirmado) */}
        {plan.estado === "confirmado" && datosGrafico.length > 0 && (
          <div className="grafico-contenedor">
            <h3>Desglose de gastos</h3>
            <p className="gasto-total" style={{ fontSize: "1.2rem", fontWeight: "600", color: "#1e293b", marginBottom: "15px" }}>
              Total: S/ {totalGastos}
            </p>

            <div className="grafico">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={datosGrafico}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: S/${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {datosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <ul className="leyenda">
                {datosGrafico.map((g, i) => (
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
        )}
      </div>

      {/* MODAL DE SELECCIÓN DE FECHA */}
      {modalFecha && (
        <div className="modal-overlay" onClick={() => setModalFecha(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Selecciona fecha de partida</h3>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              Duración del plan: {plan.duracion}
            </p>
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                marginBottom: "20px",
                fontSize: "1rem"
              }}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                className="btn-confirmar" 
                onClick={confirmarPlanConFecha}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                Confirmar
              </button>
              <button 
                className="btn-cancelar" 
                onClick={() => setModalFecha(false)}
                style={{
                  background: "#64748b",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                Cancelar
              </button>
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

      {/* MODAL DE RESEÑA */}
      {modalResena && (
        <div className="modal-overlay" onClick={() => setModalResena(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Deja tu reseña</h3>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              ¿Cómo fue tu experiencia en {destino.nombre}?
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
              placeholder="Comparte tu experiencia..."
              rows="5"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                marginBottom: "20px",
                resize: "vertical",
                fontSize: "1rem"
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={guardarResena}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                Enviar reseña
              </button>
              <button 
                onClick={() => setModalResena(false)}
                style={{
                  background: "#64748b",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 16px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          animation: modalFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-content h3 {
          margin: 0 0 15px 0;
          color: #1e293b;
          font-size: 1.5rem;
        }

        .modal-content h4 {
          color: #475569;
          font-size: 1.1rem;
        }
      `}</style>
    </section>
  );
}
