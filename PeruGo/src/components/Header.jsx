// src/components/Header.jsx
export default function Header() {
  return (
    <header>
      <div className="logo">
        <div className="mark">PG</div>
        <div>
          <div>PerúGo</div>
          <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
            Asistente de viajes
          </div>
        </div>
      </div>
      <nav>
        <a href="#perfil">Perfil</a>
        <a href="#section-reservas">Mis Planes</a>
      </nav>
    </header>
  );
}
