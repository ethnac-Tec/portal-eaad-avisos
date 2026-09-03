// Sample data shaped to mirror the fields captured in the professor
// submission form and the Notion database: titulo, cuerpo,
// categoria/carrera, tipo, campus, fecha, autor, depto/iniciativa, socios,
// estudiantes, imagen, and estado ("Publicado" = full note, "Programado" =
// save-the-date placeholder from the short scheduling form, calendar-only).
// This module is overwritten by `npm run fetch:notion` with real data.

export const CARRERAS = ['Todas', 'Arquitectura', 'Arte Digital', 'Diseño', 'Urbanismo'];

export const COLORS = {
  EAAD: '#6D28D9',
  Arquitectura: '#00A3AD',
  'Arte Digital': '#B23A82',
  Diseño: '#B8860B',
  Urbanismo: '#6B8E23',
};

export const AVISOS = [
  {
    id: 'arq-sust',
    estado: 'Publicado',
    carrera: 'Arquitectura',
    tipo: 'Congreso / Simposio',
    title: 'Semana de la Arquitectura Sustentable',
    image:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1100&q=80&auto=format&fit=crop',
    summary:
      'Jornada de conferencias y talleres enfocados en diseño paramétrico y el uso de biomateriales en la construcción vertical, con participación de despachos internacionales.',
    autor: 'Dr. Roberto Silva',
    autorRol: 'Depto. de Arquitectura',
    campus: 'Monterrey',
    fecha: '15 ago 2026',
    fechaISO: '2026-08-15',
    depto: 'Arquitectura · Ruta Azul',
    socios: 'Cemex, Municipio de Monterrey',
    estudiantes: 'Alumnos de 7.º semestre, Taller de Proyectos',
    featured: true,
    body: [
      'Durante cinco días, el campus se convierte en un laboratorio abierto donde estudiantes y profesionales exploran las nuevas fronteras de la construcción sustentable. El eje de esta edición es el diseño paramétrico aplicado a envolventes de alto desempeño térmico.',
      'Los talleres prácticos incluyen prototipado con biomateriales de base local y sesiones de modelado con herramientas de simulación ambiental. Cada equipo presentará una propuesta de fachada evaluada por un jurado de despachos invitados.',
      'La semana cierra con una mesa redonda sobre política pública y vivienda, en colaboración con el Municipio de Monterrey.',
    ],
  },
  {
    id: 'diseno-ecos',
    estado: 'Publicado',
    carrera: 'Diseño',
    tipo: 'Exposición',
    title: 'Ecos del Diseño: ergonomía inclusiva',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1100&q=80&auto=format&fit=crop',
    summary:
      'Muestra inmersiva de proyectos de diseño industrial centrados en la ergonomía inclusiva y el mobiliario urbano para personas con discapacidad.',
    autor: 'Mtra. Elena Garza',
    autorRol: 'Depto. de Diseño',
    campus: 'Ciudad de México',
    fecha: '02 sep 2026',
    fechaISO: '2026-09-02',
    depto: 'Diseño · Impacto Social',
    socios: 'DIF Nacional, Herman Miller',
    estudiantes: 'Sociedad de Alumnos de Diseño (SALDI)',
    body: [
      'La exposición reúne dieciocho proyectos desarrollados a lo largo de dos semestres, todos partiendo de una premisa: el diseño como herramienta de inclusión. Los objetos van desde utensilios adaptados hasta sistemas de mobiliario urbano.',
      'Cada pieza se acompaña de la investigación de campo que la originó, incluyendo entrevistas con usuarios y prototipos funcionales que los visitantes pueden probar.',
      'La muestra permanecerá abierta al público durante todo septiembre en la galería del campus.',
    ],
  },
  {
    id: 'arte-generativo',
    estado: 'Publicado',
    carrera: 'Arte Digital',
    tipo: 'Taller',
    title: 'Residencia de arte generativo y datos',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1100&q=80&auto=format&fit=crop',
    summary:
      'Cuatro semanas de residencia donde estudiantes traducen conjuntos de datos ambientales en instalaciones audiovisuales en tiempo real.',
    autor: 'Mtro. Diego Fuentes',
    autorRol: 'Depto. de Arte Digital',
    campus: 'Guadalajara',
    fecha: '20 sep 2026',
    fechaISO: '2026-09-20',
    depto: 'Arte Digital · Innovación',
    socios: 'Estudio Lumen, CONAGUA',
    estudiantes: 'Colectivo Pixel EAAD',
    body: [
      'La residencia invita a repensar la relación entre dato y experiencia sensorial. Los participantes trabajan con sensores de calidad del aire instalados en el campus, transformando lecturas en composiciones visuales y sonoras.',
      'Además de las herramientas de programación creativa, la residencia incluye mentorías con artistas de medios y una sesión abierta de código en vivo.',
      'El resultado será una instalación permanente en el vestíbulo del edificio de innovación.',
    ],
  },
  {
    id: 'urb-foro',
    estado: 'Publicado',
    carrera: 'Urbanismo',
    tipo: 'Foro',
    title: 'Foro Ciudad Futura: movilidad y espacio público',
    image:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1100&q=80&auto=format&fit=crop',
    summary:
      'Encuentro entre academia, gobierno y ciudadanía para repensar el espacio público y la movilidad activa en el área metropolitana.',
    autor: 'Dra. Ana Robles',
    autorRol: 'Depto. de Urbanismo',
    campus: 'Monterrey',
    fecha: '08 oct 2026',
    fechaISO: '2026-10-08',
    depto: 'Urbanismo · Impacto Social',
    socios: 'IMPLAN, ONU-Hábitat',
    estudiantes: 'Taller de Análisis Urbano',
    body: [
      'El foro reúne a especialistas en movilidad, planeación y participación ciudadana para discutir el rediseño de corredores estratégicos de la ciudad. La jornada combina ponencias con mesas de trabajo por sector.',
      'Los estudiantes presentan un diagnóstico cartográfico elaborado durante el semestre, con propuestas de intervención de bajo costo y alto impacto.',
      'Las conclusiones se entregarán como recomendaciones a las autoridades locales de planeación.',
    ],
  },
  {
    id: 'arq-vivienda',
    estado: 'Publicado',
    carrera: 'Arquitectura',
    tipo: 'Concurso',
    title: 'Concurso de vivienda social progresiva',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1100&q=80&auto=format&fit=crop',
    summary:
      'Estudiantes de tercer año presentan prototipos de vivienda adaptable y de bajo costo para contextos de crecimiento informal.',
    autor: 'Arq. Laura Méndez',
    autorRol: 'Depto. de Arquitectura',
    campus: 'Puebla',
    fecha: '14 oct 2026',
    fechaISO: '2026-10-14',
    depto: 'Arquitectura · Ruta Azul',
    socios: 'INFONAVIT, Hábitat para la Humanidad',
    estudiantes: 'Alumnos de 3.º año',
    body: [
      'El concurso reta a los equipos a diseñar una vivienda que crezca con la familia que la habita, partiendo de un núcleo mínimo habitable y un sistema constructivo replicable.',
      'Los proyectos se evalúan por su viabilidad económica, su desempeño ambiental y su sensibilidad al contexto social.',
      'El proyecto ganador será desarrollado a escala 1:1 como parte de un programa piloto.',
    ],
  },
  {
    id: 'arte-motion',
    estado: 'Publicado',
    carrera: 'Arte Digital',
    tipo: 'Muestra',
    title: 'Muestra anual de animación y motion',
    image:
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1100&q=80&auto=format&fit=crop',
    summary:
      'Proyección de los cortometrajes y piezas de motion graphics realizados por estudiantes durante el ciclo, con votación del público.',
    autor: 'Mtra. Sofía León',
    autorRol: 'Depto. de Arte Digital',
    campus: 'Monterrey',
    fecha: '28 oct 2026',
    fechaISO: '2026-10-28',
    depto: 'Arte Digital · Innovación',
    socios: 'Pixelatl, Canal 22',
    estudiantes: 'Sociedad de Animación EAAD',
    body: [
      'La muestra celebra el trabajo del año en animación 2D, 3D y motion graphics. Cada pieza se proyecta en formato de festival, con introducción de sus autores.',
      'Este año se incorpora una categoría de narrativa interactiva, con obras que el público puede influir en tiempo real.',
      'El público asistente vota por su pieza favorita, que recibe una mención en el festival Pixelatl.',
    ],
  },
  {
    // "Programado" — a save-the-date placeholder a professor submitted
    // through the short Tally form, before the full note exists. Shows on
    // the calendar as upcoming, never in the feed/detail/related lists.
    id: 'urb-proximo-simposio',
    estado: 'Programado',
    carrera: 'Urbanismo',
    tipo: 'Simposio',
    title: 'Simposio de Movilidad Activa (próximamente)',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1100&q=80&auto=format&fit=crop',
    summary: '',
    autor: '',
    autorRol: '',
    campus: 'Monterrey',
    fecha: '20 nov 2026',
    fechaISO: '2026-11-20',
    depto: '',
    socios: '',
    estudiantes: '',
    body: [],
  },
];

// Solo notas completas y aprobadas — lo que debe usarse en el feed, el
// detalle, "más avisos" y la lista de campus.
export const PUBLICADOS = AVISOS.filter((a) => a.estado === 'Publicado');
