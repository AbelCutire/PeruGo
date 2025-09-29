// src/components/Hero.jsx
export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-left">
          <h1>Tu asistente de viajes en Perú</h1>
          <p>Pregúntame, planifico y reservo según tu tiempo y presupuesto</p>

          <div className="assistant-box" aria-live="polite">
            <div className="assistant-left">
              <input
                id="quickInput"
                type="text"
                placeholder="Ej: 3 días en Cusco con presupuesto medio"
                aria-label="Entrada rápida"
              />
              <div className="chips">
                <span className="chip" data-suggest="Ideas para fin de semana">
                  Ideas para fin de semana
                </span>
                <span className="chip" data-suggest="Viaje económico 4 días">
                  Viaje económico 4 días
                </span>
                <span className="chip" data-suggest="Comida típica cerca">
                  Comida típica cerca
                </span>
              </div>
            </div>
            <div className="assistant-controls">
              <button id="sendQuick">🎤</button>
            </div>
          </div>
        </div>

        {/* Lado derecho: ofertas destacadas */}
        <div className="hero-right">
          <div
            style={{
              width: "100%",
              background: "linear-gradient(180deg,#fff,#fbfbff)",
              padding: "12px",
              borderRadius: "12px",
              boxShadow: "0 8px 26px rgba(2,6,12,0.06)",
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3f8c0f0b5d5b39bdf61e2b4b1b6f4a7c"
                alt="playa"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>Ofertas destacadas</div>
              <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                Desde S/ 350 - Lima • Cusco • Arequipa
              </div>
            </div>
            <div>
              <button className="primary">Ver</button>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              background: "linear-gradient(180deg,#fff,#fbfbff)",
              padding: "12px",
              borderRadius: "12px",
              boxShadow: "0 8px 26px rgba(2,6,12,0.06)",
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6a0b9b1b8b3c4c0f0b1f8e3f6e5a5d1e"
                alt="comida"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>Gastronomía</div>
              <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                Rutas para foodies
              </div>
            </div>
            <div>
              <button className="primary">Explorar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
