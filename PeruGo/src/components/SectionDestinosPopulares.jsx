import React, { useRef, useEffect, useState } from "react";
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
  const carruselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicamos el arreglo para crear el efecto de bucle
  const destinosDobles = [...destinos, ...destinos];

  // Desplazamiento continuo controlado por requestAnimationFrame
  useEffect(() => {
    const carrusel = carruselRef.current;
    let offset = 0;
    let animationFrameId;

    const deslizar = () => {
      if (!isPaused) {
        offset -= 0.5; // velocidad de desplazamiento
        if (Math.abs(offset) >= carrusel.scrollWidth / 2) {
          offset = 0; // reinicio invisible al llegar al medio
        }
        carrusel.style.transform = `translateX(${offset}px)`;
      }
      animationFrameId = requestAnimationFrame(deslizar);
    };

    animationFrameId = requestAnimationFrame(deslizar);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <section className="section-destinos-populares">
      <div className="barra-blanca">
        <h2 className="titulo-barra">Destinos más populares</h2>
      </div>

      <div
        className="carrusel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={carruselRef} className="carrusel-contenedor-infinito">
          {destinosDobles.map((destino, index) => (
            <div
              key={index}
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
      </div>
    </section>
  );
};

export default SectionDestinosPopulares;
