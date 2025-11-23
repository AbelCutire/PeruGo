"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./SectionPerfil.css"; // 👈 Importamos los estilos externos
import { getUser } from "@/services/auth";

const STORAGE_PREFIX = "perugo_profile_";

export default function SectionPerfil() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [traveler, setTraveler] = useState("Mochilero");
  const [diet, setDiet] = useState("");
  const [loaded, setLoaded] = useState(false);

  const storageKey = useMemo(() => {
    const user = getUser();
    const id = user?.email || user?.id || "guest";
    return `${STORAGE_PREFIX}${id}`;
  }, []);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (!raw) {
        setLoaded(true);
        return;
      }
      const data = JSON.parse(raw);
      if (data.name) setName(data.name);
      if (data.city) setCity(data.city);
      if (data.budget !== undefined && data.budget !== null) setBudget(String(data.budget));
      if (data.traveler) setTraveler(data.traveler);
      if (data.diet) setDiet(data.diet);
    } catch (e) {
      console.error("Error cargando perfil desde localStorage", e);
    } finally {
      setLoaded(true);
    }
  }, [storageKey]);

  const handleSave = () => {
    try {
      const payload = {
        name: name.trim(),
        city: city.trim(),
        budget: budget ? Number(budget) : null,
        traveler,
        diet: diet.trim(),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      console.log("✅ Perfil guardado", payload);
      alert("Perfil y preferencias guardados localmente.");
    } catch (e) {
      console.error("Error guardando perfil", e);
      alert("No se pudo guardar el perfil.");
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setName("");
    setCity("");
    setBudget("");
    setTraveler("Mochilero");
    setDiet("");
  };

  if (!loaded) return null;

  return (
    <section id="perfil" className="perfil-section">
      <header className="perfil-header">
        <div className="perfil-titulo">Perfil y Preferencias</div>
        <div className="perfil-subtitulo">
          Datos que PerúGo usa para personalizar recomendaciones
        </div>
      </header>

      <div className="perfil-contenido">
        <main className="perfil-main">
          <h3>Información básica</h3>

          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            placeholder="Ej: Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="city">Ciudad de origen</label>
          <input
            id="city"
            placeholder="Ej: Lima"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <h3>Preferencias de viaje</h3>

          <label htmlFor="budget">Presupuesto aproximado por día (S/)</label>
          <input
            id="budget"
            type="number"
            placeholder="Ej: 200"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <label htmlFor="traveler">Tipo de viajero</label>
          <select
            id="traveler"
            value={traveler}
            onChange={(e) => setTraveler(e.target.value)}
          >
            <option value="Mochilero">Mochilero</option>
            <option value="Turista">Turista</option>
            <option value="Viaje de lujo">Viaje de lujo</option>
          </select>

          <label htmlFor="diet">Alergias / Restricciones alimentarias</label>
          <input
            id="diet"
            placeholder="Ej: Sin gluten"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          />

          <div className="perfil-botones">
            <button
              className="primary"
              onClick={handleSave}
            >
              Guardar
            </button>
            <button
              className="ghost"
              onClick={handleReset}
            >
              Restablecer preferencias
            </button>
          </div>
        </main>

        <aside className="perfil-aside">
          <h4>Cómo usamos estos datos</h4>
          <p>
            PerúGo utiliza tus preferencias para personalizar itinerarios y
            estimaciones. Solo usamos datos con tu consentimiento. Puedes borrar
            cualquier dato en cualquier momento.
          </p>

          <hr />

          <h4>Preferencias destacadas</h4>
          <ul>
            <li>Intereses: Aventura, Gastronómico</li>
            <li>Ritmo: Moderado</li>
            <li>Presupuesto por día: S/ 200</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
