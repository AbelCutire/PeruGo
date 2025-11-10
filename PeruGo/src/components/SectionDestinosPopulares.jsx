import React, { useState, useEffect, useRef } from "react";
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
  const [indice, setIndice] = useState(0);
  const contenedorRef = useRef(null);

  // Duplicamos la lista para crear el efecto infinito
  const destinosDobles = [...destinos, ...destinos];

  // Desplazamiento automático continuo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => prev + 1);
    }, 50); // velocidad del movimiento
    return () => clearInterval(intervalo);
  }, []);

  // Reinicio imperceptible del bucle
  useEffect(() => {
    if (indice >= destinos.length * 100) {
      setIndice(0);
    }
  }, [indice]);

  // Flechas manuales
  const siguiente = () => {
    setIndice((prev) => prev + 100);
  };

  const anterior = () => {
    setIndice((prev) => (prev - 100 < 0 ? destinos.length * 100 : prev - 100));
  };

  return (
    <section className="section-destinos-populares">
      <div className="barra-blanca">
        <h2 className="titulo-barra">Destinos más populares</h2>
      </div>

      <div className="carrusel">
        <div
          ref={contenedorRef}
          className="carrusel-contenedor-infinito"
          style={{ transform: `translateX(-${indice / 100}%)` }}
        >
          {destinosDobles.map((destino, i) => (
            <div
              key={i}
              className="tarjeta-carrusel"
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

        <button className="flecha flecha-izquierda" onClick={anterior}>
          &#10094;
        </button>
        <button className="flecha flecha-derecha" onClick={siguiente}>
          &#10095;
        </button>
      </div>
    </section>
  );
};

export default SectionDestinosPopulares;
