import React from "react";

export default function SectionReservas() {
  return (
    <section id="section-reservas">
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
        <div style={{fontWeight:800,fontSize:"20px"}}>Reservas / Mis Planes</div>
        <div style={{color:"var(--muted)"}}>Accede a tus viajes guardados y estados de reserva</div>
      </header>

      <div style={{display:"flex",gap:"18px"}}>
        <main style={{flex:1}}>
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <div className="plan-item">
              <div>
                <h4 style={{margin:"0 0 6px"}}>Cusco — Machu Picchu (Borrador)</h4>
                <div style={{color:"var(--muted)",fontSize:"0.95em"}}>3 días • Creado: 02/05/2025</div>
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <button className="ghost" onClick={()=>window.suggest("Editar Cusco")}>Editar</button>
                <button className="primary" onClick={()=>window.suggest("Reservar Cusco")}>Reservar</button>
              </div>
            </div>

            <div className="plan-item" style={{borderLeft:"4px solid #28a745"}}>
              <div>
                <h4 style={{margin:"0 0 6px"}}>Lima Gastronómica (Confirmado)</h4>
                <div style={{color:"var(--muted)",fontSize:"0.95em"}}>2 noches • 15/07/2025 • Reservado</div>
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <button className="ghost" onClick={()=>window.suggest("Ver Lima")}>Ver</button>
                <button className="ghost" onClick={()=>window.suggest("Compartir Lima")}>Compartir</button>
              </div>
            </div>

            <div className="plan-item" style={{borderLeft:"4px solid #ffc107"}}>
              <div>
                <h4 style={{margin:"0 0 6px"}}>Huaraz — Trek (Pendiente pago)</h4>
                <div style={{color:"var(--muted)",fontSize:"0.95em"}}>4 días • 01/08/2025 • Pago pendiente</div>
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                <button className="ghost" onClick={()=>window.suggest("Pagar Huaraz")}>Pagar</button>
                <button className="ghost" onClick={()=>window.suggest("Contactar Huaraz")}>Contactar</button>
              </div>
            </div>
          </div>
        </main>

        <aside style={{width:"340px",background:"#fafafa",padding:"16px",borderRadius:"10px"}}>
          <h4 style={{marginTop:0}}>Resumen de gastos</h4>
          <div style={{color:"var(--muted)"}}>Total estimado en planes: <strong>S/ 3,740</strong></div>
          <hr style={{margin:"12px 0"}} />
          <h4 style={{margin:"6px 0"}}>Acceso rápido</h4>
          <div style={{display:"flex",flexDirection:"column",gap:"8px",marginTop:"8px"}}>
            <button className="ghost" onClick={()=>window.suggest("Conversación")}>Conversación con asistente</button>
            <button className="ghost" onClick={()=>window.suggest("Ver facturas")}>Ver facturas</button>
          </div>
        </aside>
      </div>
    </section>
  );
}
