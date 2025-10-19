"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { destinos } from "@/data/destinos";
import "./SectionExplorar.css";

export default function SectionExplorar() {
  const router = typeof window !== "undefined" ? useRouter() : null;

  const [filtros, setFiltros] = useState({
    tipo: [],
    duracion: "",
    presupuesto: "",
  });

  // 🔹 Lógica de filtrado
  const destinosFiltrados = destinos.filter((d) => {
    const tipoOK = filtros.tipo.length === 0 || filtros.tipo.includes(d.tipo);
    const duracionOK = !filtros.duracion || d.duracion === filtros.duracion;
    const presupuestoOK =
      !filtros.presupuesto || d.presupuesto === filtros.presupuesto;
    return tipoOK && duracionOK && presupuestoOK;
  });

  const toggleTipo = (tipo) => {
    setFiltros((prev) => ({
      ...prev,
      tipo: prev.tipo.includes(tipo)
        ? prev.tipo.filter((t) => t !== tipo)
        : [...prev.tipo, tipo],
    }));
  };

  // ✅ Guardar posición de scroll antes de navegar
  const handleVer = (id) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("scrollPos", window.scrollY.toString());
    }

    try {
      if (router && typeof router.push === "function") {
        router.push(`/destino/${id}`);
        return;
      }
    } catch (e) {}

    window.location.href = `/destino/${id}`;
  };

  return (
    <section id="explorar">
      <header className="explorar-header">
        <div className="explorar-titulo">Explorar Destinos</div>
      </header>

      <div className="layout">
        <main className="resultados">
          <div className="resultados-info">
            Mostrando {destinosFiltrados.length} resultados
          </div>

          <div className="cards-grid">
            {destinosFiltrados.map((d) => (
              <article key={d.id} className="card">
                <img src={d.imagen} alt={d.nombre} />
                <div className="card-content">
                  <h3>{d.nombre}</h3>
                  <p>{d.descripcion}</p>
                  <p className="dias">Duración: {d.duracion}</p>
                  <div className="card-footer">
                    <div className="precio">Desde S/ {d.precio}</div>
                    <button className="btn-ver" onClick={() => handleVer(d.id)}>
                      Ver
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        <aside className="filtros">
          <h3>Filtros</h3>

          <div className="bloque-filtro">
            <strong>Tipo</strong>
            <div className="lista-tipos">
              {["Aventura", "Cultural", "Relax", "Gastronómico"].map((t) => (
                <label
                  key={t}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={filtros.tipo.includes(t)}
                    onChange={() => toggleTipo(t)}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="bloque-filtro">
            <strong>Duración</strong>
            <select
              value={filtros.duracion}
              onChange={(e) =>
                setFiltros({ ...filtros, duracion: e.target.value })
              }
            >
              <option value="">Todas</option>
              <option value="1-3 días">1-3 días</option>
              <option value="4-7 días">4-7 días</option>
              <option value="8+ días">8+ días</option>
            </select>
          </div>

          <div className="bloque-filtro">
            <strong>Presupuesto</strong>
            <div className="presupuesto-botones">
              {["Económico", "Medio", "Alto"].map((p) => (
                <button
                  key={p}
                  className={`ghost ${
                    filtros.presupuesto === p ? "active" : ""
                  }`}
                  onClick={() =>
                    setFiltros({
                      ...filtros,
                      presupuesto: filtros.presupuesto === p ? "" : p,
                    })
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
