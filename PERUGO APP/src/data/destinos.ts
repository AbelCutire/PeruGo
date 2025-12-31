// Datos locales de destinos para usar como fallback cuando falle la API remota.
// Tipo alineado al modelo Prisma `Destino` (simplificando fechas como opcionales).

export type Destino = {
  id: string;
  slug?: string;
  nombre: string;
  ubicacion: string;
  tipo: string;
  precio: number;
  duracion: string;
  presupuesto: string;
  imagen: string;
  descripcion: string;
  gastos: {
    alojamiento: number;
    transporte: number;
    alimentacion: number;
    entradas: number;
  };
  tours: {
    nombre: string;
    descripcion: string;
    precio: number;
    duracion?: string; // <--- AGREGADO AQUÍ (Opcional)
    incluye: string[];
    gastos: {
      alojamiento: number;
      transporte: number;
      alimentacion: number;
      entradas: number;
    };
  }[];
  creadoEn?: string;
  actualizadoEn?: string;
};

export const destinos: Destino[] = [
  {
    id: 'cusco',
    nombre: 'Cusco',
    ubicacion: 'Cusco, Perú',
    tipo: 'Cultural / Aventura',
    precio: 500,
    duracion: '4 días / 3 noches',
    presupuesto: 'Medio',
    imagen:
      'https://www.filmingperu.com/wp-content/uploads/2020/06/014.jpg',
    descripcion:
      'La antigua capital del Imperio Inca, Cusco, combina historia, cultura y paisajes andinos únicos. Es el punto de partida ideal para visitar Machu Picchu y el Valle Sagrado.',
    gastos: {
      alojamiento: 200,
      transporte: 100,
      alimentacion: 120,
      entradas: 80,
    },
    tours: [
      {
        nombre: 'Tour clásico Machu Picchu',
        descripcion:
          'Incluye tren, guía y entrada al santuario histórico de Machu Picchu. Perfecto para quienes desean vivir la experiencia tradicional sin complicaciones.',
        precio: 580,
        incluye: ['Tren turístico', 'Guía profesional', 'Entrada a Machu Picchu'],
        gastos: {
          alojamiento: 180,
          transporte: 200,
          alimentacion: 100,
          entradas: 100,
        },
      },
      {
        nombre: 'Tour Aventura Valle Sagrado',
        descripcion:
          'Explora Pisac, Ollantaytambo y Moray. Disfruta actividades al aire libre y paisajes impresionantes en los Andes peruanos.',
        precio: 620,
        incluye: ['Transporte', 'Almuerzo buffet', 'Actividades de aventura'],
        gastos: {
          alojamiento: 150,
          transporte: 250,
          alimentacion: 120,
          entradas: 100,
        },
      },
      {
        nombre: 'Tour Cusco Gastronómico',
        descripcion:
          'Descubre los sabores andinos con un recorrido por los mejores restaurantes y mercados locales.',
        precio: 560,
        incluye: ['Degustaciones', 'Chef guía', 'Transporte local'],
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
    id: 'paracas',
    nombre: 'Paracas',
    ubicacion: 'Ica, Perú',
    tipo: 'Playa / Naturaleza',
    precio: 350,
    duracion: '2 días / 1 noche',
    presupuesto: 'Económico',
    imagen:
      'https://i.pinimg.com/originals/16/22/a9/1622a9445e54ccdef09214e2d5fb05ce.png',
    descripcion:
      'Paracas ofrece playas hermosas, fauna marina y las impresionantes Islas Ballestas. Un destino ideal para relajarse y disfrutar del océano Pacífico.',
    gastos: {
      alojamiento: 150,
      transporte: 100,
      alimentacion: 70,
      entradas: 30,
    },
    tours: [
      {
        nombre: 'Tour Islas Ballestas',
        descripcion:
          'Paseo en lancha donde podrás observar lobos marinos, pingüinos de Humboldt y el famoso geoglifo del Candelabro.',
        precio: 380,
        incluye: ['Paseo en lancha', 'Guía local', 'Chaleco salvavidas'],
        gastos: {
          alojamiento: 120,
          transporte: 150,
          alimentacion: 70,
          entradas: 40,
        },
      },
      {
        nombre: 'Tour Reserva Nacional de Paracas',
        descripcion:
          'Explora el desierto costero, las playas rojas y la biodiversidad marina única de la reserva.',
        precio: 400,
        incluye: ['Transporte 4x4', 'Guía', 'Entrada a la reserva'],
        gastos: {
          alojamiento: 130,
          transporte: 160,
          alimentacion: 80,
          entradas: 30,
        },
      },
      {
        nombre: 'Tour Paracas Full Experiencia',
        descripcion:
          'Una experiencia completa con actividades acuáticas, visita al museo de sitio y degustación gastronómica.',
        precio: 450,
        incluye: [
          'Kayak o paddle',
          'Museo de Paracas',
          'Almuerzo marino',
          'Guía bilingüe',
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
    id: 'arequipa',
    nombre: 'Arequipa y Cañón del Colca',
    ubicacion: 'Arequipa, Perú',
    tipo: 'Aventura / Cultura',
    precio: 420,
    duracion: '3 días / 2 noches',
    presupuesto: 'Medio',
    imagen:
      'https://lacasonadelolivo.com.pe/wp-content/uploads/2018/04/colca-arequipa.jpg',
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
        nombre: 'Tour Cañón del Colca',
        descripcion:
          'Observa el vuelo del cóndor y disfruta de los baños termales en Chivay.',
        precio: 460,
        incluye: ['Transporte', 'Guía', 'Almuerzo', 'Entradas a termales'],
        gastos: {
          alojamiento: 130,
          transporte: 150,
          alimentacion: 120,
          entradas: 60,
        },
      },
      {
        nombre: 'Tour Ciudad Blanca',
        descripcion:
          'Recorrido histórico por los puntos más emblemáticos de Arequipa.',
        precio: 430,
        incluye: ['Guía local', 'Transporte', 'Entradas a museos'],
        gastos: {
          alojamiento: 120,
          transporte: 100,
          alimentacion: 100,
          entradas: 50,
        },
      },
    ],
  },
  {
    id: 'puno',
    nombre: 'Puno y Lago Titicaca',
    ubicacion: 'Puno, Perú',
    tipo: 'Cultural / Naturaleza',
    precio: 380,
    duracion: '3 días / 2 noches',
    presupuesto: 'Medio',
    imagen:
      'https://andinoperu.b-cdn.net/wp-content/uploads/2024/03/andino-peru-tours-lago-titicaca-full-day-1.webp',
    descripcion:
      'Puno es la puerta al Lago Titicaca, el lago navegable más alto del mundo. Conoce las islas flotantes de los Uros y vive la hospitalidad de sus comunidades.',
    gastos: {
      alojamiento: 150,
      transporte: 120,
      alimentacion: 70,
      entradas: 40,
    },
    tours: [
      {
        nombre: 'Tour Islas Uros y Taquile',
        descripcion:
          'Visita las islas flotantes hechas de totora y conoce las costumbres de los pobladores locales.',
        precio: 400,
        incluye: ['Transporte en lancha', 'Guía local', 'Almuerzo típico'],
        gastos: {
          alojamiento: 140,
          transporte: 150,
          alimentacion: 80,
          entradas: 30,
        },
      },
      {
        nombre: 'Tour Aventura en el Titicaca',
        descripcion:
          'Experimenta el kayak sobre el lago y disfruta una noche con familias locales en Amantaní.',
        precio: 450,
        incluye: ['Kayak', 'Hospedaje rural', 'Comidas', 'Guía'],
        gastos: {
          alojamiento: 180,
          transporte: 150,
          alimentacion: 100,
          entradas: 20,
        },
      },
    ],
  },
  {
    id: 'huacachina',
    nombre: 'Huacachina',
    ubicacion: 'Ica, Perú',
    tipo: 'Aventura / Relajación',
    precio: 320,
    duracion: '2 días / 1 noche',
    presupuesto: 'Económico',
    imagen:
      'https://www.peru.travel/Contenido/General/Imagen/en/43/1.1/Huacachina.jpg',
    descripcion:
      'El oasis de Huacachina es famoso por sus dunas y deportes de aventura como el sandboard. Ideal para una escapada corta y divertida.',
    gastos: {
      alojamiento: 120,
      transporte: 100,
      alimentacion: 70,
      entradas: 30,
    },
    tours: [
      {
        nombre: 'Tour en Buggy y Sandboard',
        descripcion:
          'Vive la adrenalina recorriendo las dunas y deslízate por la arena en sandboard.',
        precio: 350,
        incluye: ['Buggy', 'Tabla de sandboard', 'Guía local'],
        gastos: {
          alojamiento: 100,
          transporte: 120,
          alimentacion: 80,
          entradas: 50,
        },
      },
      {
        nombre: 'Tour Viñedos y Cata de Vinos',
        descripcion:
          'Visita bodegas tradicionales y degusta piscos y vinos artesanales de Ica.',
        precio: 370,
        incluye: ['Transporte', 'Guía', 'Degustación'],
        gastos: {
          alojamiento: 120,
          transporte: 130,
          alimentacion: 70,
          entradas: 50,
        },
      },
    ],
  },
  {
    id: 'loreto',
    nombre: 'Iquitos y Amazonas',
    ubicacion: 'Loreto, Perú',
    tipo: 'Naturaleza / Aventura',
    precio: 680,
    duracion: '5 días / 4 noches',
    presupuesto: 'Alto',
    imagen:
      'https://amazoniantrails.com/wp-content/uploads/2017/10/iquitos.jpg',
    descripcion:
      'Navega por el majestuoso río Amazonas, conoce comunidades indígenas y explora la selva tropical en su máxima expresión.',
    gastos: {
      alojamiento: 300,
      transporte: 200,
      alimentacion: 120,
      entradas: 60,
    },
    tours: [
      {
        nombre: 'Tour Selva Amazónica',
        descripcion:
          'Incluye caminatas, avistamiento de fauna y visita a comunidades locales.',
        precio: 720,
        incluye: ['Guía selva', 'Lancha', 'Alojamiento en lodge', 'Comidas'],
        gastos: {
          alojamiento: 250,
          transporte: 250,
          alimentacion: 150,
          entradas: 70,
        },
      },
      {
        nombre: 'Tour Delfines Rosados',
        descripcion:
          'Recorrido por el Amazonas con avistamiento de delfines rosados y flora exótica.',
        precio: 700,
        incluye: ['Lancha', 'Guía especializado', 'Comidas'],
        gastos: {
          alojamiento: 240,
          transporte: 230,
          alimentacion: 160,
          entradas: 70,
        },
      },
    ],
  },
  {
    id: 'huaraz',
    nombre: 'Huaraz y Cordillera Blanca',
    ubicacion: 'Áncash, Perú',
    tipo: 'Aventura / Naturaleza',
    precio: 450,
    duracion: '4 días / 3 noches',
    presupuesto: 'Medio',
    imagen:
      'https://www.wamanadventures.com/blog/wp-content/uploads/2020/08/Laguna_Par%C3%B3n_waman_adventures.jpg',
    descripcion:
      'Rodeado de montañas nevadas, Huaraz es el destino perfecto para los amantes del trekking y los paisajes naturales.',
    gastos: {
      alojamiento: 180,
      transporte: 120,
      alimentacion: 100,
      entradas: 50,
    },
    tours: [
      {
        nombre: 'Laguna 69 Trek',
        descripcion:
          'Una caminata desafiante con vistas espectaculares a la Cordillera Blanca.',
        precio: 480,
        incluye: ['Transporte', 'Guía', 'Box lunch', 'Entradas al parque'],
        gastos: {
          alojamiento: 160,
          transporte: 150,
          alimentacion: 120,
          entradas: 50,
        },
      },
      {
        nombre: 'Nevado Pastoruri',
        descripcion:
          'Explora uno de los glaciares más impresionantes del Perú en una excursión de altura.',
        precio: 460,
        incluye: ['Transporte', 'Guía', 'Entradas'],
        gastos: {
          alojamiento: 140,
          transporte: 130,
          alimentacion: 120,
          entradas: 70,
        },
      },
    ],
  },
  {
    id: 'trujillo',
    nombre: 'Trujillo y Chan Chan',
    ubicacion: 'La Libertad, Perú',
    tipo: 'Cultural / Historia',
    precio: 360,
    duracion: '3 días / 2 noches',
    presupuesto: 'Económico',
    imagen:
      'https://img.panamericana.pe/noticia/2013/10/640-1381339332465.jpg.webp',
    descripcion:
      'Trujillo, la ciudad de la eterna primavera, ofrece historia, arqueología y tradición en cada esquina.',
    gastos: {
      alojamiento: 140,
      transporte: 100,
      alimentacion: 80,
      entradas: 40,
    },
    tours: [
      {
        nombre: 'Tour Chan Chan',
        descripcion:
          'Descubre la ciudad de barro más grande del mundo, capital del reino Chimú.',
        precio: 390,
        incluye: ['Transporte', 'Guía arqueológica', 'Entradas'],
        gastos: {
          alojamiento: 120,
          transporte: 110,
          alimentacion: 80,
          entradas: 60,
        },
      },
      {
        nombre: 'Tour Huanchaco y Gastronomía',
        descripcion:
          'Paseo por la playa, pesca artesanal en caballitos de totora y almuerzo típico norteño.',
        precio: 380,
        incluye: ['Transporte', 'Guía', 'Almuerzo marino'],
        gastos: {
          alojamiento: 100,
          transporte: 120,
          alimentacion: 100,
          entradas: 60,
        },
      },
    ],
  },
  {
    id: 'tarapoto',
    nombre: 'Tarapoto y Cataratas',
    ubicacion: 'San Martín, Perú',
    tipo: 'Naturaleza / Relajación',
    precio: 400,
    duracion: '3 días / 2 noches',
    presupuesto: 'Medio',
    imagen:
      'https://llanotourscolombia.com/wp-content/uploads/2020/09/UNA-AVETURA-CON-AMIGOS-7-1024x1024.jpg',
    descripcion:
      "Conocida como la ‘Ciudad de las Palmeras’, Tarapoto es un paraíso tropical con cascadas, lagunas y gastronomía selvática.",
    gastos: {
      alojamiento: 160,
      transporte: 100,
      alimentacion: 100,
      entradas: 40,
    },
    tours: [
      {
        nombre: 'Tour Catarata de Ahuashiyacu',
        descripcion:
          'Visita una de las cataratas más bellas de la selva peruana, ideal para relajarse y nadar.',
        precio: 420,
        incluye: ['Transporte', 'Guía local', 'Entradas'],
        gastos: {
          alojamiento: 150,
          transporte: 120,
          alimentacion: 100,
          entradas: 50,
        },
      },
      {
        nombre: 'Tour Laguna Azul',
        descripcion:
          'Paseo en bote, natación y gastronomía local en la hermosa laguna de Sauce.',
        precio: 440,
        incluye: ['Transporte', 'Almuerzo típico', 'Paseo en bote'],
        gastos: {
          alojamiento: 140,
          transporte: 130,
          alimentacion: 120,
          entradas: 50,
        },
      },
    ],
  },
];