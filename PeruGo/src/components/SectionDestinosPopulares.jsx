import React, { useEffect, useRef, useState } from "react";
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

const AUTO_ADVANCE_MS = 4500; // tiempo entre cambios automáticos (puedes ajustar)

const SectionDestinosPopulares = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoRef = useRef(null);
  const contenedorRef = useRef(null);

  const siguiente = () => {
    setIndex((prev) => (prev + 1) % destinos.length);
    resetAutoAdvance();
  };

  const anterior = () => {
    setIndex((prev) => (prev - 1 + destinos.length) % destinos.length);
    resetAutoAdvance();
  };

  // (Re)inicia el intervalo automático
  const resetAutoAdvance = () => {
    if (autoRef.current) {
      clearInterval(autoRef.current);
    }
    autoRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % destinos.length);
    }, AUTO_ADVANCE_MS);
  };

  // Inicializar intervalo
  useEffect(() => {
    resetAutoAdvance();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pausar al entrar y reanudar al salir
  useEffect(() => {
    if (isPaused) {
      if (autoRef.current) clearInterval(autoRef.current);
      return;
    }
    // si no está pausado, asegurar que el intervalo esté activo
    if (!autoRef.current) resetAutoAdvance();
  }, [isPaused]);

  // Navegación con teclado: flechas izquierda/derecha
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="section-destinos-populares">
      <div className="barra-blanca">
        <h2 className="titulo-barra">Destinos más populares</h2>
      </div>

      <div
        className="carrusel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-roledescription="carrusel de destinos"
      >
        <div
          className="carrusel-contenedor"
          ref={contenedorRef}
          style={{ transform: `translateX(-${index * 100}vw)` }}
        >
          {destinos.map((destino, i) => (
            <article
              key={i}
              className="tarjeta-carrusel"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${destinos.length}: ${destino.nombre}`}
              style={{ backgroundImage: `url(${destino.imagen})` }}
            >
              <div className="overlay">
                <h3>{destino.nombre}</h3>
                <p className="ubicacion">{destino.ubicacion}</p>
                <p className="ideal">Ideal para {destino.ideal}</p>
              </div>
            </article>
          ))}
        </div>

        <button
          className="flecha flecha-izquierda"
          onClick={anterior}
          aria-label="Anterior"
        >
          &#10094;
        </button>
        <button
          className="flecha flecha-derecha"
          onClick={siguiente}
          aria-label="Siguiente"
        >
          &#10095;
        </button>

        <div className="indicadores" aria-hidden>
          {destinos.map((_, i) => (
            <button
              key={i}
              className={`punto ${i === index ? "activo" : ""}`}
              onClick={() => {
                setIndex(i);
                resetAutoAdvance();
              }}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionDestinosPopulares;
