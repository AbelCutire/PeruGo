"use client";

import React, { useState, useEffect } from "react";
import SectionReservas from "./SectionReservas";
import "./MisPlanes.css";

export default function MisPlanes() {
  const [planes, setPlanes] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 🔐 Verificar sesión
  useEffect(() => {
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
      p.estado !== "borrador"
    );

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    for (const plan of planesActivos) {
      if (!plan.fecha_inicio || !plan.fecha_fin) continue;

      const planInicio = new Date(plan.fecha_inicio);
      const planFin = new Date(plan.fecha_fin);

      // Regla de solapamiento: fecha_inicio_nueva <= fecha_fin_existente Y fecha_fin_nueva >= fecha_inicio_existente
      if (inicio <= planFin && fin >= planInicio) {
        return {
          conflicto: true,
          planConflictivo: plan
        };
      }
    }

    return { conflicto: false };
  };

  // ⏰ Verificar planes completados (fecha pasada)
  const verificarPlanesCompletados = (listaPLanes) => {
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0); // Resetear a medianoche

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

  // ⏱️ Verificar planes completados cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      if (planes.length > 0) {
        verificarPlanesCompletados(planes);
      }
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, [planes]);

  if (cargando) {
    return (
      <section id="mis-planes">
        <p>Cargando...</p>
      </section>
    );
  }

  return (
    <section id="mis-planes">
      <h1>Mis Planes</h1>
      <p className="subtexto">
        Cada tarjeta representa un destino con su plan seleccionado. El estado se indica por el color del borde izquierdo.
      </p>

      {planes.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <p style={{ 
            color: "#64748b", 
            fontSize: "1.1rem",
            marginBottom: "20px"
          }}>
            Aún no has agregado ningún plan.
          </p>
          <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
            Explora destinos y comienza a planificar tu próxima aventura.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.background = "#2563eb"}
            onMouseOut={(e) => e.target.style.background = "#3b82f6"}
          >
            Explorar destinos
          </button>
        </div>
      ) : (
        <div className="lista-reservas">
          {planes.map((plan) => (
            <div key={plan.id} className="bloque-reserva">
              <div className="reserva-header">
                <h2 className="reserva-titulo">{plan.destino}</h2>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarPlan(plan.id)}
                  title="Eliminar plan"
                >
                  ✖
                </button>
              </div>

              <SectionReservas
                plan={plan}
                onActualizar={actualizarPlan}
                onEliminar={eliminarPlan}
                validarSolapamiento={validarSolapamiento}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={() => window.location.href = "/"}
          style={{
            background: "#64748b",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.background = "#475569"}
          onMouseOut={(e) => e.target.style.background = "#64748b"}
        >
          Explorar más destinos
        </button>
      </div>
    </section>
  );
}
