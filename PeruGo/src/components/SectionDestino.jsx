import React from "react";

export default function SectionDestino() {
  return (
    <section id="ficha-destino">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: "20px" }}>Ficha de Destino</div>
        <div style={{ color: "var(--muted)" }}>
          Generada por: PerúGo • Última actualización: hoy
        </div>
      </header>

      <div style={{ display: "flex", gap: "20px" }}>
        <aside style={{ width: "420px", background: "#fff", padding: "16px", borderRadius: "10px" }}>
          <img
            src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b4f6b7d8f9a0b1c2d3e4f5a6b7c8d9e"
            alt="Machu Picchu"
            style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "8px" }}
          />
          <h3 style={{ margin: "12px 0 6px" }}>Machu Picchu — Cusco</h3>
          <div style={{ color: "var(--muted)", fontSize: "0.95em" }}>
            Alta montaña • Ideal para: Cultural, Fotografía
          </div>
          <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
            <button className="primary" onClick={() => window.suggest("Pedir adaptación Machu Picchu")}>
              Pedir adaptación
            </button>
            <button className="ghost" onClick={() => window.suggest("Agregar Machu Picchu")}>
              Agregar a plan
            </button>
          </div>
          <hr style={{ margin: "14px 0" }} />
          <div style={{ fontSize: "0.95em", color: "#06202b" }}>
            <strong>Resumen rápido</strong>
            <ul style={{ paddingLeft: "18px", margin: "8px 0 0", color: "var(--muted)" }}>
              <li>Tiempo recomendado: 2–3 días</li>
              <li>Precio estimado: S/ 800–1400</li>
              <li>Mejor época: Abril–Octubre</li>
            </ul>
          </div>
        </aside>

        <main style={{ flex: 1, background: "#fff", padding: "18px", borderRadius: "10px" }}>
          <h2 style={{ marginTop: 0 }}>Machu Picchu — Resumen y recomendaciones</h2>
          <p style={{ color: "var(--muted)" }}>
            PerúGo genera itinerarios adaptados a tu perfil. Aquí tienes un resumen accionable: rutas,
            tiempos, y actividades optimizadas según temporada y disponibilidad.
          </p>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <div
              style={{
                flex: 1,
                minHeight: "180px",
                borderRadius: "6px",
                border: "1px solid #eef6fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
              }}
            >
              Mapa (placeholder)
            </div>
            <div style={{ width: "300px", background: "#fafafa", padding: "12px", borderRadius: "6px" }}>
              <h4 style={{ margin: "0 0 8px" }}>Recomendaciones rápidas</h4>
              <ol style={{ margin: 0, color: "var(--muted)" }}>
                <li>Llegar con día de aclimatación en Cusco.</li>
                <li>Reservar entrada y transporte con antelación.</li>
                <li>Considerar guía local certificado.</li>
              </ol>
            </div>
          </div>

          <h3 style={{ marginTop: "18px" }}>Experiencias recomendadas</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginTop: "8px" }}>
            <div className="card">
              <h4 style={{ margin: "0 0 6px" }}>Tour clásico 2 días</h4>
              <p style={{ margin: 0, color: "var(--muted)" }}>Incluye transporte, entradas y guía.</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>S/ 950</span>
                <div>
                  <button className="ghost" onClick={() => window.suggest("Ver Tour clásico")}>Ver</button>
                  <button className="primary" onClick={() => window.suggest("Añadir Tour clásico")}>Añadir</button>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 style={{ margin: "0 0 6px" }}>Trek Salkantay 4 días</h4>
              <p style={{ margin: 0, color: "var(--muted)" }}>Alternativa menos masificada, nivel moderado.</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>S/ 1,500</span>
                <div>
                  <button className="ghost" onClick={() => window.suggest("Ver Salkantay")}>Ver</button>
                  <button className="primary" onClick={() => window.suggest("Añadir Salkantay")}>Añadir</button>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 style={{ margin: "0 0 6px" }}>Experiencia fotográfica al amanecer</h4>
              <p style={{ margin: 0, color: "var(--muted)" }}>Acceso temprano y guía fotográfico.</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>S/ 420</span>
                <div>
                  <button className="ghost" onClick={() => window.suggest("Ver Amanecer")}>Ver</button>
                  <button className="primary" onClick={() => window.suggest("Añadir Amanecer")}>Añadir</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
