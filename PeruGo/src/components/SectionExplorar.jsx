"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./SectionExplorar.css";
import { getUser } from "@/services/auth";

const PROFILE_STORAGE_PREFIX = "perugo_profile_";

export default function SectionExplorar() {
  const router = typeof window !== "undefined" ? useRouter() : null;
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileBudgetInfo, setProfileBudgetInfo] = useState(null);

  const [filtros, setFiltros] = useState({
    tipo: [],
    duracion: "",
    presupuesto: "",
  });

  // 🔹 Obtener destinos desde la API o desde data/destinos.js (fallback)
  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        let data = [];

        // 1️⃣ Intentar obtener desde la API
        const res = await fetch("/api/destinos");
        if (res.ok) {
          data = await res.json();
        } else {
          console.warn("⚠️ API no disponible, usando data local");
          const mod = await import("@/data/destinos.js");
          data = mod.destinos || [];
        }

        setDestinos(data);
      } catch (error) {
        console.error("❌ Error al cargar destinos desde API:", error);
        try {
          // 2️⃣ Cargar desde data/destinos.js si falla la API
          const mod = await import("@/data/destinos.js");
          setDestinos(mod.destinos || []);
        } catch (err) {
          console.error("❌ Error cargando data local:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDestinos();
  }, []);

  // 🔹 Cargar preferencias de perfil (presupuesto) y aplicarlas al filtro
  useEffect(() => {
    try {
      const user = getUser();
      const id = user?.email || user?.id || "guest";
      const storageKey = `${PROFILE_STORAGE_PREFIX}${id}`;
      const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (!raw) return;

      const data = JSON.parse(raw);
      const b = Number(data.budget);
      if (!b || Number.isNaN(b)) return;

      let category = "";
      if (b <= 150) category = "Económico";
      else if (b <= 300) category = "Medio";
      else category = "Alto";

      setFiltros((prev) => ({
        ...prev,
        presupuesto: prev.presupuesto || category,
      }));

      setProfileBudgetInfo({ budget: b, category });
    } catch (e) {
      console.error("Error cargando preferencias de perfil para filtros", e);
    }
  }, []);

  if (loading) return <p>Cargando destinos...</p>;

  // 🔹 Filtro de búsqueda
  const destinosFiltrados = destinos.filter((d) => {
    const tipoOK =
      filtros.tipo.length === 0 ||
      filtros.tipo.some((t) =>
        d.tipo?.toLowerCase().includes(t.toLowerCase())
      );

    const duracionNum = parseInt(d.duracion);
    const duracionOK =
      !filtros.duracion ||
      (filtros.duracion === "1-3 días" && duracionNum <= 3) ||
      (filtros.duracion === "4-7 días" &&
        duracionNum >= 4 &&
        duracionNum <= 7) ||
      (filtros.duracion === "8+ días" && duracionNum >= 8);

    const presupuestoOK =
      !filtros.presupuesto ||
      d.presupuesto?.toLowerCase() === filtros.presupuesto.toLowerCase();

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
            {profileBudgetInfo && (
              <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.8 }}>
                (Usando tu presupuesto diario aprox. S/ {profileBudgetInfo.budget} – {profileBudgetInfo.category})
              </span>
            )}
          </div>

          <div className="cards-grid">
            {destinosFiltrados.map((d) => (
              <article key={d.id} className="cardAlt">
                <img src={d.imagen} alt={d.nombre} />
                <div className="card-content">
                  <h3>{d.nombre}</h3>
                  <p>{d.descripcion}</p>
                  <p className="dias">{d.duracion}</p>
                  <div className="card-footer">
                    <div className="precio">Desde S/ {d.precio}</div>

                    {/* ✅ Usa d.id (por ejemplo: "cusco", "paracas", etc.) */}
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
              {[
                "Aventura",
                "Cultural",
                "Naturaleza",
                "Playa",
                "Gastronómico",
              ].map((t) => (
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
                      presupuesto:
                        filtros.presupuesto === p ? "" : p,
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
