import React from "react";
import "./SectionDestinosPopulares.css";

const destinos = [
  {
    nombre: "Machu Picchu",
    ubicacion: "Cusco",
    ideal: "Fotografías y caminatas",
    imagen:
      "https://whatatrip.pe/wp-content/uploads/2023/02/Machu-Picchu-reopen-1536x864.jpg",
  },
  {
    nombre: "Lago Titicaca",
    ubicacion: "Puno",
    ideal: "Paisajes y cultura local",
    imagen:
      "https://blog.viajesmachupicchu.travel/wp-content/uploads/2023/07/turismo-en-el-lago-titicaca-0.jpg",
  },
  {
    nombre: "Montaña de 7 Colores",
    ubicacion: "Cusco",
    ideal: "Aventura y senderismo",
    imagen:
      "https://trexperienceperu.com/sites/default/files/2022-09/raimbow-mountian-peru.jpg",
  },
];

const SectionDestinosPopulares = () => {
  return (
    <section className="section-destinos-populares">
      <div className="barra-blanca">
        <h2 className="section-titulo">Destinos más populares</h2>
      </div>

      <div className="triptico">
        {destinos.map((destino, i) => (
          <div
            key={i}
            className={`tarjeta-triptico tarjeta-${i}`}
            style={{ backgroundImage: `url(${destino.imagen})` }}
          >
            <div className="overlay">
              <h3>{destino.nombre}</h3>
              <p className="ubicacion">{destino.ubicacion}</p>
              <p className="ideal">Ideal para {destino.ideal}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionDestinosPopulares;
