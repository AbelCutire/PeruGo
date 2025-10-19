"use client";

import React from "react";

export default function SectionPlanificador() {
  return (
    <section id="planificador">
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
        <div style={{fontWeight:800,fontSize:"20px"}}>Planificador — PerúGo</div>
        <div style={{color:"var(--muted)"}}>
          Progreso: <strong id="progText">Paso 1 de 4</strong>
        </div>
      </header>

      <div className="layout">
        <aside>
          <div style={{height:"10px",background:"#eef2ff",borderRadius:"8px",overflow:"hidden",marginBottom:"12px"}}>
            <div
              id="progBar"
              style={{
                height:"100%",
                width:"25%",
                background:"linear-gradient(90deg,var(--accent),var(--accent2))",
                transition:"width .3s ease"
              }}
            ></div>
          </div>

          <div id="steps">
            <div id="step1">
              <h4>1. Fechas y origen</h4>
              <label>Ciudad de origen</label>
              <input id="origin" placeholder="Ej: Lima" />
              <label>Fecha de inicio</label>
              <input id="dateStart" type="date" />
              <label>Duración (días)</label>
              <input id="days" type="number" min="1" defaultValue="3" />
            </div>

            <div id="step2" style={{display:"none"}}>
              <h4>2. Preferencias</h4>
              <label>Intereses</label>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"8px"}}>
                <button className="ghost" onClick={() => window.pref("Aventura")}>Aventura</button>
                <button className="ghost" onClick={() => window.pref("Cultural")}>Cultural</button>
                <button className="ghost" onClick={() => window.pref("Gastronomía")}>Gastronomía</button>
              </div>
              <label style={{marginTop:"12px"}}>Ritmo de viaje</label>
              <select id="pace">
                <option>Relajado</option>
                <option>Moderado</option>
                <option>Activo</option>
              </select>
            </div>

            <div id="step3" style={{display:"none"}}>
              <h4>3. Alojamiento y transporte</h4>
              <label>Alojamiento</label>
              <select id="stay">
                <option>3 estrellas</option>
                <option>4 estrellas</option>
                <option>Hostal</option>
              </select>
              <label style={{marginTop:"12px"}}>Transporte</label>
              <select id="trans">
                <option>Bus</option>
                <option>Vuelo</option>
                <option>Tren</option>
              </select>
            </div>

            <div id="step4" style={{display:"none"}}>
              <h4>4. Confirmar y guardar</h4>
              <p style={{color:"var(--muted)"}}>Revisa el resumen del plan y guárdalo en Mis Planes.</p>
              <button className="primary" onClick={() => window.savePlan()}>Guardar plan</button>
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",marginTop:"12px"}}>
            <button id="prev" className="ghost" style={{display:"none"}}>Anterior</button>
            <button id="next" className="primary">Siguiente</button>
          </div>
        </aside>

        <main>
          <div style={{background:"#fff",padding:"18px",borderRadius:"10px"}}>
            <h3 style={{marginTop:0}}>Vista previa del itinerario</h3>
            <div id="itineraryPreview">
              <div style={{borderLeft:"3px solid #06b6d4",paddingLeft:"12px",marginTop:"10px"}}>
                <h4 style={{margin:"0 0 6px"}}>Día 1 — Llegada y city tour</h4>
                <p style={{margin:0,color:"var(--muted)"}}>Check-in, breve tour por la ciudad y cena local.</p>
              </div>
              <div style={{borderLeft:"3px solid #ff6b6b",paddingLeft:"12px",marginTop:"12px"}}>
                <h4 style={{margin:"0 0 6px"}}>Día 2 — Excursión principal</h4>
                <p style={{margin:0,color:"var(--muted)"}}>Actividad principal sugerida por el asistente.</p>
              </div>
            </div>
            <div style={{marginTop:"18px",display:"flex",gap:"12px"}}>
              <button className="ghost" onClick={() => window.share()}>Compartir</button>
              <button className="ghost" onClick={() => window.exportPDF()}>Exportar PDF</button>
              <button className="primary" onClick={() => window.reserve()}>Reservar</button>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
