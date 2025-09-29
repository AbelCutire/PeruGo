import React from "react";

export default function SectionPerfil() {
  return (
    <section id="perfil">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 20 }}>Perfil y Preferencias</div>
        <div style={{ color: "var(--muted)" }}>Datos que PerúGo usa para personalizar recomendaciones</div>
      </header>

      <div style={{ display: "flex", gap: 20 }}>
        <main style={{ flex: 1, background: "#fff", padding: 18, borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Información básica</h3>

          <label htmlFor="name">Nombre</label>
          <input id="name" placeholder="Ej: Juan Pérez" />

          <label htmlFor="city" style={{ marginTop: 8 }}>Ciudad de origen</label>
          <input id="city" placeholder="Ej: Lima" />

          <h3 style={{ marginTop: 12 }}>Preferencias de viaje</h3>

          <label htmlFor="budget">Presupuesto aproximado por día (S/)</label>
          <input id="budget" type="number" placeholder="Ej: 200" />

          <label htmlFor="traveler" style={{ marginTop: 8 }}>Tipo de viajero</label>
          <select id="traveler">
            <option>Mochilero</option>
            <option>Turista</option>
            <option>Viaje de lujo</option>
          </select>

          <label htmlFor="diet" style={{ marginTop: 8 }}>Alergias / Restricciones alimentarias</label>
          <input id="diet" placeholder="Ej: Sin gluten" />

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button className="primary" onClick={() => window.saveProfile && window.saveProfile()}>Guardar</button>
            <button className="ghost" onClick={() => window.resetProfile && window.resetProfile()}>Restablecer preferencias</button>
          </div>
        </main>

        <aside style={{ width: 320, background: "#fff", padding: 14, borderRadius: 10 }}>
          <h4 style={{ marginTop: 0 }}>Cómo usamos estos datos</h4>
          <p style={{ color: "var(--muted)", fontSize: "0.95em" }}>
            PerúGo utiliza tus preferencias para personalizar itinerarios y estimaciones. Solo usamos datos con tu consentimiento.
            Puedes borrar cualquier dato en cualquier momento.
          </p>

          <hr style={{ margin: "12px 0" }} />

          <h4 style={{ margin: "6px 0" }}>Preferencias destacadas</h4>
          <ul style={{ color: "var(--muted)", paddingLeft: 18, margin: "8px 0 0" }}>
            <li>Intereses: Aventura, Gastronómico</li>
            <li>Ritmo: Moderado</li>
            <li>Presupuesto por día: S/ 200</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
