"use client";

import React, { useState, useEffect } from "react";
import SectionReservas from "./SectionReservas";
import { getPlanes, updatePlan as apiUpdatePlan, deletePlan as apiDeletePlan } from "@/services/planes";
import { getCurrentUser } from "@/services/auth";
import "./MisPlanes.css";

export default function MisPlanes() {
  const [planes, setPlanes] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("fecha"); // 'fecha' | 'prioridad'

  // 🔐 Verificar sesión y cargar datos
  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      window.location.href = "/login";
      return;
    }
    
    setUsuario(user);
    cargarPlanesBackend();
  }, []);

  // 📥 Función para cargar planes desde el API
  const cargarPlanesBackend = async () => {
    try {
      setCargando(true);
      const data = await getPlanes();
      setPlanes(data);
      // Verificar completados una vez cargados
      verificarPlanesCompletados(data);
    } catch (error) {
      console.error("Error cargando planes:", error);
    } finally {
      setCargando(false);
    }
  };

  // 🔄 Actualizar estado de un plan (Conexión API)
  const actualizarPlan = async (planId, cambios) => {
    try {
      // 1. Actualización optimista en UI (opcional, para que se sienta rápido)
      setPlanes(prev => prev.map(p => p.id === planId ? { ...p, ...cambios } : p));

      // 2. Llamada al Backend
      await apiUpdatePlan(planId, cambios);
      
      // Opcional: Recargar datos reales para asegurar sincronía
      // cargarPlanesBackend(); 
    } catch (error) {
      alert("Error al actualizar el plan. Intenta nuevamente.");
      // Revertir cambios si falla (aquí podrías volver a cargar del backend)
      cargarPlanesBackend();
    }
  };

  // ❌ Eliminar plan (Conexión API)
  const eliminarPlan = async (planId) => {
    if (confirm("¿Estás seguro de eliminar este plan?")) {
      try {
        // UI Optimista
        setPlanes(prev => prev.filter(p => p.id !== planId));
        
        // Backend
        await apiDeletePlan(planId);
      } catch (error) {
        alert("No se pudo eliminar el plan");
        cargarPlanesBackend();
      }
    }
  };

  // 📅 Validar solapamiento (Usa el estado local 'planes' que ya viene del backend)
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

  // ⏰ Verificar completados (Lógica de negocio en cliente para actualizar estado)
  const verificarPlanesCompletados = (listaPlanes) => {
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    listaPlanes.forEach(async (plan) => {
      if (plan.estado === "confirmado" && plan.fecha_fin) {
        const fechaFin = new Date(plan.fecha_fin);
        fechaFin.setHours(0, 0, 0, 0);
        
        // Si ya pasó la fecha y sigue "confirmado", lo pasamos a "completado" en el backend
        if (fechaFin < ahora) {
          await apiUpdatePlan(plan.id, { estado: "completado" });
          // Actualizamos localmente también
          setPlanes(prev => prev.map(p => p.id === plan.id ? { ...p, estado: "completado" } : p));
        }
      }
    });
  };

  // 📊 Lógica de Ordenamiento (Igual que antes)
  const getPlanesOrdenados = () => {
    const copia = [...planes];

    if (filtro === "fecha") {
      // El backend ya suele devolver ordenado por fecha, pero aseguramos
      return copia; // O copia.reverse() si el backend los manda antiguos primero
    }

    if (filtro === "prioridad") {
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
        <div className="loading-container">
          <p>Cargando tus aventuras...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="mis-planes">
      <div className="header-planes">
        <h1>Mis Planes</h1>
        
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
          <p className="titulo-empty">Aún no tienes planes guardados en la nube.</p>
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
