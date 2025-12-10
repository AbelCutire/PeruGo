"use client";

import React, { useState, useEffect } from "react";
import SectionReservas from "./SectionReservas";
import "./MisPlanes.css";

export default function MisPlanes() {
  const [planes, setPlanes] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("fecha"); // 'fecha' | 'prioridad'

  // 🔐 Verificar sesión
  useEffect(() => {
    // Intentar leer desde sessionStorage primero (para la sesión actual)
    // o localStorage (si el usuario marcó "recordarme" en tu lógica de auth)
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userEmail = sessionStorage.getItem("lastEmail");
    
    if (!isLoggedIn || !userEmail) {
      // No hay sesión, redirigir a login
      window.location.href = "/login";
      return;
    }

    // Recuperar o crear estructura de usuario
    let usuarioData = localStorage.getItem(`usuario_${userEmail}`);
    let usuarioObj;
    
    if (!usuarioData) {
      // Primera vez que accede a Mis Planes, crear estructura
      usuarioObj = {
        id: `user_${Date.now()}`,
        email: userEmail,
        nombre: userEmail.split('@')[0]
      };
      localStorage.setItem(`usuario_${userEmail}`, JSON.stringify(usuarioObj));
    } else {
      usuarioObj = JSON.parse(usuarioData);
    }
    
    setUsuario(usuarioObj);
    setCargando(false);
  }, []);

  // 📥 Cargar planes del usuario
  useEffect(() => {
    if (!usuario) return;
    
    const planesGuardados = localStorage.getItem(`planes_${usuario.id}`);
    if (planesGuardados) {
      const planesCargados = JSON.parse(planesGuardados);
      setPlanes(planesCargados);
      // Verificar planes completados automáticamente
      verificarPlanesCompletados(planesCargados);
    }
  }, [usuario]);

  // 📝 Guardar cambios en localStorage
  const guardarPlanes = (nuevosPlanes) => {
    setPlanes(nuevosPlanes);
    if (usuario) {
      localStorage.setItem(`planes_${usuario.id}`, JSON.stringify(nuevosPlanes));
    }
  };

  // 🔄 Actualizar estado de un plan
  const actualizarPlan = (planId, cambios) => {
    const nuevosPlanes = planes.map(plan => 
      plan.id === planId ? { ...plan, ...cambios } : plan
    );
    guardarPlanes(nuevosPlanes);
  };

  // ❌ Eliminar plan
  const eliminarPlan = (planId) => {
    if (confirm("¿Estás seguro de eliminar este plan?")) {
      const nuevosPlanes = planes.filter(p => p.id !== planId);
      guardarPlanes(nuevosPlanes);
    }
  };

  // 📅 Verificar solapamiento de fechas
  const validarSolapamiento = (fechaInicio, fechaFin, planActualId = null) => {
    const planesActivos = planes.filter(p => 
      p.id !== planActualId && 
      p.estado !== "borrador" &&
      p.estado !== "cancelado"
    );

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    for (const plan of planesActivos) {
      if (!plan.fecha_inicio || !plan.fecha_fin) continue;

      const planInicio = new Date(plan.fecha_inicio);
      const planFin = new Date(plan.fecha_fin);

      // Regla de solapamiento
      if (inicio <= planFin && fin >= planInicio) {
        return {
          conflicto: true,
          planConflictivo: plan
        };
      }
    }

    return { conflicto: false };
  };

  // ⏰ Verificar planes completados
  const verificarPlanesCompletados = (listaPLanes) => {
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    let cambios = false;
    const nuevosPlanes = listaPLanes.map(plan => {
      if (plan.estado === "confirmado" && plan.fecha_fin) {
        const fechaFin = new Date(plan.fecha_fin);
        fechaFin.setHours(0, 0, 0, 0);
        
        if (fechaFin < ahora) {
          cambios = true;
          return { ...plan, estado: "completado" };
        }
      }
      return plan;
    });

    if (cambios) {
      guardarPlanes(nuevosPlanes);
    }
  };

  // 📊 Lógica de Ordenamiento
  const getPlanesOrdenados = () => {
    const copiaPlanes = [...planes];
    
    if (filtro === "fecha") {
      // Ordenar por fecha de creación (ID tiene timestamp o asumimos orden de inserción invertido)
      // Asumimos que los más nuevos están al final del array original, así que invertimos
      return copiaPlanes.reverse(); 
    } 
    
    if (filtro === "prioridad") {
      const pesos = {
        borrador: 1,
        pendiente: 2,
        confirmado: 3,
        cancelado: 4,
        completado: 5
      };
      return copiaPlanes.sort((a, b) => {
        const pesoA = pesos[a.estado] || 99;
        const pesoB = pesos[b.estado] || 99;
        return pesoA - pesoB;
      });
    }

    return copiaPlanes;
  };

  const planesVisibles = getPlanesOrdenados();

  if (cargando) {
    return (
      <section id="mis-planes" style={{ paddingTop: "100px", textAlign: "center" }}>
        <p>Cargando tus aventuras...</p>
      </section>
    );
  }

  return (
    <section id="mis-planes">
      <div className="mis-planes-header">
        <h1>Mis Planes de Viaje</h1>
        
        {/* Filtros */}
        <div className="filtros-container">
          <label>Ordenar por:</label>
          <div className="botones-filtro">
            <button 
              className={filtro === "fecha" ? "active" : ""} 
              onClick={() => setFiltro("fecha")}
            >
              📅 Fecha
            </button>
            <button 
              className={filtro === "prioridad" ? "active" : ""} 
              onClick={() => setFiltro("prioridad")}
            >
              ⚡ Prioridad
            </button>
          </div>
        </div>
      </div>

      {planes.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">Aún no has agregado ningún plan.</p>
          <p className="empty-subtitle">Explora destinos y comienza a planificar tu próxima aventura.</p>
          <button 
            className="btn-explorar-empty"
            onClick={() => window.location.href = "/explorar"}
          >
            Explorar destinos
          </button>
        </div>
      ) : (
        <div className="mis-planes-layout">
          {/* COLUMNA IZQUIERDA: TARJETAS */}
          <div className="section-tarjetas">
            <h3 className="section-title">Tus Reservas</h3>
            <div className="tarjetas-contenedor">
              {planesVisibles.map((plan) => (
                <SectionReservas
                  key={plan.id}
                  plan={plan}
                  modo="tarjeta"
                  onActualizar={actualizarPlan}
                  onEliminar={eliminarPlan}
                  validarSolapamiento={validarSolapamiento}
                />
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: GRÁFICOS */}
          <div className="section-contenedor">
            <h3 className="section-title">Distribución de Gastos</h3>
            <div className="grafico-contenedor">
              {planesVisibles.filter(p => p.estado === "confirmado" || p.estado === "completado").length === 0 && (
                <div className="no-graficos">
                  <p>Confirma un plan para ver el desglose de gastos.</p>
                </div>
              )}
              
              {planesVisibles.map((plan) => (
                <SectionReservas
                  key={`grafico-${plan.id}`}
                  plan={plan}
                  modo="grafico"
                  onActualizar={actualizarPlan}
                  onEliminar={eliminarPlan}
                  validarSolapamiento={validarSolapamiento}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ESTILOS INTERNOS PARA EL LAYOUT NUEVO */}
      <style jsx>{`
        #mis-planes {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .mis-planes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .filtros-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 8px 16px;
          border-radius: 12px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .botones-filtro {
          display: flex;
          gap: 5px;
        }

        .botones-filtro button {
          border: none;
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          color: #64748b;
          font-weight: 500;
          transition: all 0.2s;
        }

        .botones-filtro button.active {
          background: #3b82f6;
          color: white;
        }

        .mis-planes-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .mis-planes-layout {
            grid-template-columns: 1fr;
          }
        }

        .section-title {
          font-size: 1.2rem;
          color: #334155;
          margin-bottom: 15px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 8px;
        }

        .tarjetas-contenedor, .grafico-contenedor {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .btn-explorar-empty {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .btn-explorar-empty:hover {
          background: #2563eb;
        }

        .no-graficos {
          padding: 40px;
          text-align: center;
          background: #f8fafc;
          border-radius: 12px;
          color: #94a3b8;
          border: 2px dashed #cbd5e1;
        }
      `}</style>
    </section>
  );
}
