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
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userEmail = sessionStorage.getItem("lastEmail");
    
    if (!isLoggedIn || !userEmail) {
      window.location.href = "/login";
      return;
    }

    let usuarioData = localStorage.getItem(`usuario_${userEmail}`);
    let usuarioObj;
    
    if (!usuarioData) {
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
      verificarPlanesCompletados(planesCargados);
    }
  }, [usuario]);

  // 📝 Guardar cambios
  const guardarPlanes = (nuevosPlanes) => {
    setPlanes(nuevosPlanes);
    if (usuario) {
      localStorage.setItem(`planes_${usuario.id}`, JSON.stringify(nuevosPlanes));
    }
  };

  // 🔄 Actualizar estado
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

  // 📅 Validar solapamiento
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

      if (inicio <= planFin && fin >= planInicio) {
        return {
          conflicto: true,
          planConflictivo: plan
        };
      }
    }

    return { conflicto: false };
  };

  // ⏰ Verificar completados
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

  // 📊 Lógica de Ordenamiento y Filtrado
  const getPlanesOrdenados = () => {
    // Creamos una copia para no mutar el estado directamente al ordenar
    const copia = [...planes];

    if (filtro === "fecha") {
      // Orden por defecto (asumimos que el ID o el orden del array es cronológico)
      // Si quieres lo más nuevo primero, invertimos.
      return copia.reverse();
    }

    if (filtro === "prioridad") {
      // Orden personalizado por estado
      const prioridad = {
        borrador: 1,
        pendiente: 2,
        confirmado: 3,
        cancelado: 4,
        completado: 5
      };
      return copia.sort((a, b) => {
        const pesoA = prioridad[a.estado] || 99;
        const pesoB = prioridad[b.estado] || 99;
        return pesoA - pesoB;
      });
    }

    return copia;
  };

  const planesVisibles = getPlanesOrdenados();

  if (cargando) {
    return (
      <section id="mis-planes">
        <p>Cargando...</p>
      </section>
    );
  }

  return (
    <section id="mis-planes">
      <div className="header-planes">
        <h1>Mis Planes</h1>
        
        {/* FILTROS */}
        <div className="filtros">
          <span>Ordenar por:</span>
          <button 
            className={filtro === "fecha" ? "activo" : ""} 
            onClick={() => setFiltro("fecha")}
          >
            Fecha
          </button>
          <button 
            className={filtro === "prioridad" ? "activo" : ""} 
            onClick={() => setFiltro("prioridad")}
          >
            Prioridad
          </button>
        </div>
      </div>

      <p className="subtexto">
        Gestiona tus aventuras. A la izquierda verás tus planes y a la derecha el desglose de gastos de tus viajes confirmados.
      </p>

      {planes.length === 0 ? (
        <div className="empty-state">
          <p className="titulo-empty">Aún no has agregado ningún plan.</p>
          <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
            Explora destinos y comienza a planificar tu próxima aventura.
          </p>
          <button 
            className="btn-explorar"
            onClick={() => window.location.href = "/explorar"}
          >
            Explorar destinos
          </button>
        </div>
      ) : (
        <div className="layout-split">
          
          {/* COLUMNA IZQUIERDA: TARJETAS */}
          <div className="section-tarjetas">
            <h3 className="titulo-seccion">Tus Planes</h3>
            <div className="tarjetas-grid">
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
            <h3 className="titulo-seccion">Resumen de Gastos</h3>
            <div className="graficos-grid">
              {/* Filtramos solo los que tienen sentido mostrar gráfico */}
              {planesVisibles.filter(p => p.estado === "confirmado" || p.estado === "completado").length === 0 && (
                <div className="placeholder-graficos">
                  <p>Confirma un plan para ver aquí el desglose de tus gastos.</p>
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

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          className="btn-secundario"
          onClick={() => window.location.href = "/explorar"}
        >
          Explorar más destinos
        </button>
      </div>
    </section>
  );
}
