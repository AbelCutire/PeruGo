import React from "react";

export default function SectionExplorar() {
  return (
    <section id="explorar">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 20 }}>PerúGo</div>
        <nav>
          <a href="#perfil">Perfil</a>
          <a href="#reservas" style={{ marginLeft: 12 }}>Mis Planes</a>
        </nav>
      </header>

      <div className="layout">
        {/* ASIDE: filtros */}
        <aside>
          <h3 style={{ marginTop: 0 }}>Filtros</h3>

          <div style={{ marginBottom: 10 }}>
            <strong>Tipo</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label><input type="checkbox" /> <button className="ghost" onClick={() => window.pref && window.pref("Aventura")}>Aventura</button></label>
            <label><input type="checkbox" /> <button className="ghost" onClick={() => window.pref && window.pref("Cultural")}>Cultural</button></label>
            <label><input type="checkbox" /> <button className="ghost" onClick={() => window.pref && window.pref("Relax")}>Relax</button></label>
            <label><input type="checkbox" /> <button className="ghost" onClick={() => window.pref && window.pref("Gastronómico")}>Gastronómico</button></label>
          </div>

          <hr style={{ margin: "14px 0", borderColor: "rgba(2,6,12,0.03)" }} />

          <div style={{ marginBottom: 8 }}>
            <strong>Duración</strong>
          </div>
          <select aria-label="Duración">
            <option>1-3 días</option>
            <option>4-7 días</option>
            <option>8+ días</option>
          </select>

          <hr style={{ margin: "14px 0", borderColor: "rgba(2,6,12,0.03)" }} />

          <div style={{ marginBottom: 8 }}>
            <strong>Presupuesto</strong>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="ghost" onClick={() => window.pref && window.pref("Económico")}>Económico</button>
            <button className="ghost" onClick={() => window.pref && window.pref("Medio")}>Medio</button>
            <button className="ghost" onClick={() => window.pref && window.pref("Alto")}>Alto</button>
          </div>
        </aside>

        {/* MAIN: resultados */}
        <main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0 }}>Explorar / Inspiración</h2>
            <div style={{ fontSize: "0.95em", color: "var(--muted)" }}>Mostrando 12 resultados • Ordenar por: Popularidad</div>
          </div>

          <div className="cards-grid">
            {/* Card 1 */}
            <article className="card">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop"
                alt="Lima gastronomica"
              />
              <h3>Itinerario: Lima Gastronómica (3 días)</h3>
              <p>Rutas y recomendaciones para degustar la mejor cocina limeña.</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ fontWeight: 700, color: "#ff6b6b" }}>Desde S/ 450 • 3 días</div>
                <div>
                  <button className="ghost" onClick={() => window.suggest && window.suggest("Abrir Lima Gastronómica")}>Abrir</button>
                  <button className="primary" onClick={() => window.suggest && window.suggest("Añadir Lima Gastronómica")} style={{ marginLeft: 8 }}>Añadir a plan</button>
                </div>
              </div>
            </article>

            {/* Card 2 */}
            <article className="card">
              <img
                src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1400&auto=format&fit=crop"
                alt="Machu Picchu"
              />
              <h3>Cusco y Machu Picchu (3 días)</h3>
              <p>Historia, cultura y paisajes andinos.</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ fontWeight: 700, color: "#06b6d4" }}>Desde S/ 950 • 3 días</div>
                <div>
                  <button className="ghost" onClick={() => window.suggest && window.suggest("Abrir Cusco")}>Abrir</button>
                  <button className="primary" onClick={() => window.suggest && window.suggest("Añadir Cusco")} style={{ marginLeft: 8 }}>Añadir</button>
                </div>
              </div>
            </article>

            {/* Card 3 */}
            <article className="card">
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop"
                alt="Arequipa"
              />
              <h3>Arequipa y Colca (4 días)</h3>
              <p>Volcanes, cañones y miradores.</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <div style={{ fontWeight: 700, color: "#ff6b6b" }}>Desde S/ 780 • 4 días</div>
                <div>
                  <button className="ghost" onClick={() => window.suggest && window.suggest("Abrir Arequipa")}>Abrir</button>
                  <button className="primary" onClick={() => window.suggest && window.suggest("Añadir Arequipa")} style={{ marginLeft: 8 }}>Añadir</button>
                </div>
              </div>
            </article>

            {/* Puedes replicar más <article className="card"> aquí */}
          </div>
        </main>
      </div>
    </section>
  );
}
