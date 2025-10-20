export const destinos = [
  {
    id: "cusco",
    nombre: "Cusco",
    ubicacion: "Cusco, Perú",
    tipo: "Cultural / Aventura",
    precio: 500,
    duracion: "4 días / 3 noches",
    presupuesto: "Medio",
    imagen:
      "https://images.unsplash.com/photo-1603899122634-b2a3a3d2a1c1?q=80&w=1200&auto=format&fit=crop",
    descripcion:
      "La antigua capital del Imperio Inca, Cusco, combina historia, cultura y paisajes andinos únicos. Es el punto de partida ideal para visitar Machu Picchu y el Valle Sagrado.",
    gastos: {
      alojamiento: 200,
      transporte: 100,
      alimentacion: 120,
      entradas: 80,
    },
    tours: [
      {
        nombre: "Tour clásico Machu Picchu",
        descripcion:
          "Incluye tren, guía y entrada al santuario histórico de Machu Picchu. Perfecto para quienes desean vivir la experiencia tradicional sin complicaciones.",
        precio: 580,
        incluye: ["Tren turístico", "Guía profesional", "Entrada a Machu Picchu"],
        gastos: {
          alojamiento: 180,
          transporte: 200,
          alimentacion: 100,
          entradas: 100,
        },
      },
      {
        nombre: "Tour Aventura Valle Sagrado",
        descripcion:
          "Explora Pisac, Ollantaytambo y Moray. Disfruta actividades al aire libre y paisajes impresionantes en los Andes peruanos.",
        precio: 620,
        incluye: ["Transporte", "Almuerzo buffet", "Actividades de aventura"],
        gastos: {
          alojamiento: 150,
          transporte: 250,
          alimentacion: 120,
          entradas: 100,
        },
      },
      {
        nombre: "Tour Cusco Gastronómico",
        descripcion:
          "Descubre los sabores andinos con un recorrido por los mejores restaurantes y mercados locales.",
        precio: 560,
        incluye: ["Degustaciones", "Chef guía", "Transporte local"],
        gastos: {
          alojamiento: 140,
          transporte: 120,
          alimentacion: 250,
          entradas: 50,
        },
      },
    ],
  },
  {
    id: "paracas",
    nombre: "Paracas",
    ubicacion: "Ica, Perú",
    tipo: "Playa / Naturaleza",
    precio: 350,
    duracion: "2 días / 1 noche",
    presupuesto: "Económico",
    imagen:
      "https://images.unsplash.com/photo-1612128475857-7b7b3a3b6f59?q=80&w=1200&auto=format&fit=crop",
    descripcion:
      "Paracas ofrece playas hermosas, fauna marina y las impresionantes Islas Ballestas. Un destino ideal para relajarse y disfrutar del océano Pacífico.",
    gastos: {
      alojamiento: 150,
      transporte: 100,
      alimentacion: 70,
      entradas: 30,
    },
    tours: [
      {
        nombre: "Tour Islas Ballestas",
        descripcion:
          "Paseo en lancha donde podrás observar lobos marinos, pingüinos de Humboldt y el famoso geoglifo del Candelabro.",
        precio: 380,
        incluye: ["Paseo en lancha", "Guía local", "Chaleco salvavidas"],
        gastos: {
          alojamiento: 120,
          transporte: 150,
          alimentacion: 70,
          entradas: 40,
        },
      },
      {
        nombre: "Tour Reserva Nacional de Paracas",
        descripcion:
          "Explora el desierto costero, las playas rojas y la biodiversidad marina única de la reserva.",
        precio: 400,
        incluye: ["Transporte 4x4", "Guía", "Entrada a la reserva"],
        gastos: {
          alojamiento: 130,
          transporte: 160,
          alimentacion: 80,
          entradas: 30,
        },
      },
      {
        nombre: "Tour Paracas Full Experiencia",
        descripcion:
          "Una experiencia completa con actividades acuáticas, visita al museo de sitio y degustación gastronómica.",
        precio: 450,
        incluye: [
          "Kayak o paddle",
          "Museo de Paracas",
          "Almuerzo marino",
          "Guía bilingüe",
        ],
        gastos: {
          alojamiento: 140,
          transporte: 170,
          alimentacion: 100,
          entradas: 40,
        },
      },
    ],
  },
  {
    id: "arequipa",
    nombre: "Arequipa y Cañón del Colca",
    ubicacion: "Arequipa, Perú",
    tipo: "Aventura / Cultura",
    precio: 420,
    duracion: "3 días / 2 noches",
    presupuesto: "Medio",
    imagen:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop",
    descripcion:
      "Explora la ‘Ciudad Blanca’ y contempla el vuelo del cóndor en el Cañón del Colca. Un destino que combina arquitectura colonial, naturaleza y tradición.",
    gastos: {
      alojamiento: 160,
      transporte: 120,
      alimentacion: 100,
      entradas: 40,
    },
    tours: [
      {
        nombre: "Tour Cañón del Colca",
        descripcion:
          "Observa el vuelo del cóndor y disfruta de los baños termales en Chivay.",
        precio: 460,
        incluye: ["Transporte", "Guía", "Almuerzo", "Entradas a termales"],
        gastos: {
          alojamiento: 130,
          transporte: 150,
          alimentacion: 120,
          entradas: 60,
        },
      },
      {
        nombre: "Tour Ciudad Blanca",
        descripcion:
          "Recorrido histórico por los puntos más emblemáticos de Arequipa.",
        precio: 430,
        incluye: ["Guía local", "Transporte", "Entradas a museos"],
        gastos: {
          alojamiento: 120,
          transporte: 100,
          alimentacion: 100,
          entradas: 50,
        },
      },
    ],
  },
];
