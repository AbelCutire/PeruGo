"use client";

import React from "react";
import "./SectionPerfil.css"; // 👈 Importamos los estilos externos

export default function SectionPerfil() {
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
          <input id="name" placeholder="Ej: Juan Pérez" />

          <label htmlFor="city">Ciudad de origen</label>
          <input id="city" placeholder="Ej: Lima" />

          <h3>Preferencias de viaje</h3>

          <label htmlFor="budget">Presupuesto aproximado por día (S/)</label>
          <input id="budget" type="number" placeholder="Ej: 200" />

          <label htmlFor="traveler">Tipo de viajero</label>
          <select id="traveler">
            <option>Mochilero</option>
            <option>Turista</option>
            <option>Viaje de lujo</option>
          </select>

          <label htmlFor="diet">Alergias / Restricciones alimentarias</label>
          <input id="diet" placeholder="Ej: Sin gluten" />

          <div className="perfil-botones">
            <button
              className="primary"
              onClick={() => window.saveProfile && window.saveProfile()}
            >
              Guardar
            </button>
            <button
              className="ghost"
              onClick={() => window.resetProfile && window.resetProfile()}
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
