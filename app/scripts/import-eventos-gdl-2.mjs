// ONE-TIME import script: creates the 21 avisos transcribed from the
// "Eventos_GDL_2.pptx" deck (text baked into images, read/transcribed by
// Claude) as new pages in the Notion database, with Estado = "No publicado"
// so they go through the normal review queue before appearing on the site.
//
// Run manually via GitHub Actions (workflow_dispatch) — see
// .github/workflows/import-eventos-gdl-2.yml. Not meant to run again; once
// these pages exist in Notion this script (and its workflow) can be
// deleted.
//
// Required env vars: NOTION_TOKEN (needs "Insert content" capability),
// NOTION_DATABASE_ID.

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.error('Faltan NOTION_TOKEN y/o NOTION_DATABASE_ID.');
  process.exit(1);
}

// Must match COLUMNS in fetch-notion.mjs — same database, same schema.
const COLUMNS = {
  title: 'Nombre del Evento',
  campus: 'Campus',
  insignias: 'Insignias de la escuela',
  fecha: 'Fecha del evento',
  descripcion: 'Descripción',
  estudiantes: 'Equipo involucrado',
  socios: 'Socios Formadores',
  image: 'Imágenes',
  tipo: 'Tipo de evento',
  estado: 'Estado',
};

const IMG_BASE =
  'https://raw.githubusercontent.com/ethnac-Tec/portal-eaad-avisos/main/project/uploads/eventos-gdl-2026-2';

const AVISOS = [
  {
    titulo: 'LAD Watch Party: Jorge R. Gutiérrez — Creative Leaders',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-03-24',
    tipo: 'Watch party',
    descripcion:
      'Jorge R. Gutiérrez, director ganador de tres premios Emmy, participó a través de Live Tec en una charla en la que compartió su proceso creativo, los proyectos que ha desarrollado y los elementos clave de su trayectoria de éxito profesional e internacional. La sesión incluyó consejos dirigidos a jóvenes artistas que inician su carrera, destacó la importancia del fracaso como parte fundamental del camino hacia el éxito y transmitió un mensaje de optimismo sobre el futuro de los animadores mexicanos. Se prepararon snacks para el disfrute de esta watch party.',
    estudiantes: '',
    socios: '',
    imagen: `${IMG_BASE}/lad-watch-party-jorge-gutierrez.jpg`,
  },
  {
    titulo: 'Charla con EXATEC LAD — Diana Galvez: "Enfrentando el panorama actual en la animación"',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-03-02',
    tipo: 'Charla',
    descripcion:
      'Diana Galvez, productora en Bardel Canadá y EXATEC LAD, compartió una plática sobre el panorama de la animación y cómo ejercer en Norteamérica, por invitación del grupo estudiantil LAD "Fantasmagoria". Compartió consejos sobre el pipeline de producción, cómo dar el brinco a la industria y su experiencia personal organizando proyectos audiovisuales masivos. Realizada en el Future Design Lab EIAD.',
    estudiantes: 'Grupo estudiantil Fantasmagoria (LiFE)',
    socios: '',
    imagen: `${IMG_BASE}/charla-exatec-diana-galvez.jpg`,
  },
  {
    titulo: 'Introducción a la Vida Profesional — Video Juegos (Martín Meléndrez)',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-03-25',
    tipo: 'Charla',
    descripcion:
      'Iniciaron las Charlas de Introducción a la Vida Profesional con la colaboración del Maestro Martín Meléndrez Olivera, profesional distinguido en la industria del desarrollo de videojuegos en México, actualmente Director de Desarrollo de Negocios en HyperBeard Games. Compartió la charla "¿A poco también puedo trabajar haciendo eso?". Inauguró estos espacios semanales en los que los alumnos a punto de graduar conocen más sobre el mundo laboral y la industria a la que pertenecerán al salir de la universidad.',
    estudiantes: '',
    socios: '',
    imagen: `${IMG_BASE}/intro-vida-profesional-videojuegos.jpg`,
  },
  {
    titulo: 'Introducción a la Vida Profesional — Premiere "PROMETEO -2052-"',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-04-15',
    tipo: 'Proyección',
    descripcion:
      'Como parte de las Charlas de Introducción a la Vida Profesional, se llevó a cabo la premiere de la película "PROMETEO -2052-" en el Auditorio del CARD. Acompañó el equipo de Demente Animation Studio, realizadores de la película, en un diálogo sobre los detalles de la producción de esta historia original. Asistieron egresados LAD que participaron en este, su primer largometraje.',
    estudiantes: 'Egresados LAD participantes en la producción',
    socios: 'Demente Animation Studio',
    imagen: `${IMG_BASE}/intro-vida-profesional-prometeo.jpg`,
  },
  {
    titulo: 'Cómo Llegué a Trabajar en Dragon Ball y Fundar un Estudio en Japón — Alex Torres',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-05-13',
    tipo: 'Charla',
    descripcion:
      'Alex Torres, animador dentro de la industria japonesa del anime y fundador de Kaiser Animation, visitó para impartir una charla sobre su proceso de formación como artista, las dificultades y retos que enfrentó, y consejos y motivación sobre el camino hacia el éxito en la industria de la animación. Ofreció una mirada al detrás de cámaras del pipeline de producción japonés. Ha participado en producciones como One Piece, Jujutsu Kaisen y Dragon Ball Daima, destacando por su trabajo en escenas de acción, Layout y Genga. Realizada en Centro de Congresos, Auditorio 1.',
    estudiantes: '',
    socios: 'Kaiser Animation',
    imagen: `${IMG_BASE}/dragon-ball-alex-torres.jpg`,
  },
  {
    titulo: 'Introducción a la Vida Profesional — Sony Pictures Imageworks (Rosa María Castillo)',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-05-20',
    tipo: 'Charla',
    descripcion:
      'Charla en modalidad híbrida con la artista digital Rosa María Castillo de Sony Pictures Imageworks, titulada "K-POP DEMON HUNTERS: Mi experiencia trabajando en series y películas en Canadá". Recorrido por su trayectoria laboral, las diferencias de trabajar en México y Canadá, trámites de migración, diferencias culturales y la presencia de la comunidad latina. Sesión de preguntas y respuestas al final. Dirigida a alumnos de 8vo semestre (Animación y videojuegos), Auditorio CARD.',
    estudiantes: '',
    socios: 'Sony Pictures Imageworks',
    imagen: `${IMG_BASE}/intro-vida-profesional-sony-pictures.jpg`,
  },
  {
    titulo: 'Charla con Egresados — Legacy EXALAD',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-04-27',
    tipo: 'Panel',
    descripcion:
      'El evento Legacy EXALAD reunió a egresados y docentes de la Licenciatura en Arte Digital en un panel centrado en compartir trayectorias profesionales dentro de la industria creativa, con la participación de Nora Félix (Production Coordinator en Netflix Animation Studios), Luis Medrano (fundador y director creativo de Colorama) y Travis Blaise (Faculty of Excellence, 20 años en The Walt Disney Company). Ofrecieron a los estudiantes una visión más clara y realista de las oportunidades y exigencias del entorno creativo actual. Centro de Congresos, Auditorio 1, Campus Guadalajara.',
    estudiantes: '',
    socios: 'Netflix Animation Studios, Colorama, The Walt Disney Company',
    imagen: `${IMG_BASE}/legacy-exalad.jpg`,
  },
  {
    titulo: 'Proyecto de Game Jam — Ingenia x Tec',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-05-15',
    tipo: 'Game Jam',
    descripcion:
      'Durante el fin de semana del evento (15 al 17 de mayo), jóvenes de entre 14 y 18 años desarrollaron un videojuego en equipos, acompañados y guiados por estudiantes de sexto semestre del área de videojuegos de LAD. Se puso a prueba la creatividad de los participantes y su capacidad para desarrollar proyectos en periodos cortos de tiempo, demostrando el potencial de las nuevas generaciones en experiencias interactivas. Los resultados se presentaron a través de un "pitch".',
    estudiantes: 'Estudiantes de 6to semestre, área de videojuegos LAD',
    socios: 'Ingenia Play Lab',
    imagen: `${IMG_BASE}/game-jam-ingenia-x-tec.jpg`,
  },
  {
    titulo: 'Corto Stop Motion "Celina" seleccionado para el Festival de Cannes',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-05-26',
    tipo: 'Reconocimiento',
    descripcion:
      'Se anunció que el cortometraje de stop motion "Celina", dirigido por Angela Jannet Castañeda Arizaga, fue seleccionado para participar en el Festival de Cannes. Producido por Máximo Yael Herrera Pérez, con dirección de fotografía de Valery Sánchez, postproducción de Natalia Díaz Bojórquez, arte de Gaby Cortés Aguas, animación de Mao González Gómez, Fati Chavalín y Lucero Gutiérrez Olmos, y música original de Alberto Isaac Meneses Gallardo. Realizado en colaboración con Taller del Chucho.',
    estudiantes:
      'Máximo Yael Herrera Pérez, Valery Sánchez, Natalia Díaz Bojórquez, Angela Jannet Castañeda Arizaga, Gaby Cortés Aguas, Mao González Gómez, Fati Chavalín, Lucero Gutiérrez Olmos, Alberto Isaac Meneses Gallardo',
    socios: 'Taller del Chucho',
    imagen: `${IMG_BASE}/celina-cannes.jpg`,
  },
  {
    titulo: 'Expo Mueble Internacional — LDI + Grupo Requiez',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '2026-02-01',
    tipo: 'Expo',
    descripcion:
      'Grupo Requiez, socio formador del bloque de Modularidad y Optimización en el semestre agosto-diciembre 2025, dedicó una parte de su pabellón para presentar 2 de las colecciones diseñadas y fabricadas por estudiantes en Expo Mueble Internacional 2026. El objetivo del reto fue aportar al próximo lanzamiento de la línea residencial de Grupo Requiez. Las estudiantes recibieron una compensación económica por su destacado trabajo. Profesoras participantes: Gladys Gómez, Cristina Robles.',
    estudiantes: 'Valeria Donato, Paulina Márquez, Paulina López, Renata Vega, Danna Ortiz, Luciana Camarena',
    socios: 'Grupo Requiez',
    imagen: `${IMG_BASE}/expo-mueble-ldi-requiez.jpg`,
  },
  {
    titulo: 'Eliminación del Cartón — Grupo Bimbo',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '2026-03-01',
    tipo: 'Proyecto con socio formador',
    descripcion:
      'En el bloque multidisciplinar DL3007B "Aplicaciones del diseño a proyectos de emprendimiento", los estudiantes presentaron propuestas para la eliminación del cartón en la cadena de distribución de Grupo Bimbo. Con el reto propuesto por el área de innovación y en conjunto con la división de pan congelado, los estudiantes propusieron innovaciones que redujeran o eliminaran el uso de cartón en esta categoría de producto. Proceso desde el análisis del sistema hasta el desarrollo de intervenciones. Resultado: 6 propuestas de intervención. Profesores: Ruth León, Juan Ignacio Michel y Oscar Jiménez. 32 estudiantes de 8vo semestre LDI.',
    estudiantes: '32 estudiantes de 8vo semestre LDI',
    socios: 'Grupo Bimbo',
    imagen: `${IMG_BASE}/eliminacion-carton-bimbo.jpg`,
  },
  {
    titulo: 'Diseño de Experiencia Digital — MESON',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '2026-03-01',
    tipo: 'Proyecto con socio formador',
    descripcion:
      'En el bloque DL3017B "Diseño de Producto de Base Tecnológica y Emprendimiento", los estudiantes atendieron un reto propuesto por Mesón AC, asociación civil dedicada a atender y acompañar a personas que viven con VIH (reconocida en 2025 como la Asociación Civil de mayor impacto en el Estado de Jalisco). Los estudiantes propusieron sistemas físico-digitales que promovieran las donaciones a la asociación, en especial entre jóvenes de 20 y 30 años. Resultado: 4 propuestas de experiencia física y digital (llavero y sitio web informativo; kit de salud sexual y sitio de suscripción; juego y sitio de agenda de citas; instalación interactiva y sitio de galería). Profesores: Hosana Morales, Christiam Mendoza. 16 estudiantes de 6to semestre LDI.',
    estudiantes: '16 estudiantes de 6to semestre LDI',
    socios: 'Mesón AC',
    imagen: `${IMG_BASE}/diseno-experiencia-digital-meson.jpg`,
  },
  {
    titulo: 'Diálogos de UX|UI — Visita Estudiantil a Oracle',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '2026-04-28',
    tipo: 'Visita',
    descripcion:
      'La más reciente edición de Diálogos de UX Design se llevó a cabo como una experiencia que conectó directamente el entorno académico con la práctica profesional: estudiantes de diseño visitaron las instalaciones de Oracle en un foro abierto donde UX Designers de Oracle compartieron de manera honesta y cercana sus trayectorias profesionales, desde la perspectiva como estudiantes hasta la transición a roles profesionales. La conversación profundizó en aspectos esenciales del ejercicio del diseño de experiencia de usuario, la empatía como eje central, herramientas como Figma, y lo que implica diseñar dentro de una organización global.',
    estudiantes: '',
    socios: 'Oracle',
    imagen: `${IMG_BASE}/dialogos-ux-ui-oracle.jpg`,
  },
  {
    titulo: 'Movilidad Zapopan — Diseño para la Movilidad y el Bienestar Social',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '2026-04-01',
    tipo: 'Proyecto con socio formador',
    descripcion:
      'En los bloques DL2003B "Pensamiento y proceso creativo" y DL2004B "Especificación de productos y servicios", 50 estudiantes trabajaron con la Dirección de Movilidad del Gobierno de Zapopan para beneficiar la movilidad y el bienestar de la vecina colonia de San Juan de Ocotán. Se recibió información y retroalimentación de asociaciones ciudadanas de la colonia y de la Dirección de Construcción de Comunidad. Proceso: visitas a la colonia, entrevistas a integrantes de la comunidad, conocer rutas de movilidad y transporte, idear y prototipar alternativas de solución. Resultado: 12 propuestas de mobiliario público con modelo o maqueta detallada, planos de fabricación e instrucciones de ensamble y montaje. Profesores: Gladys Gómez, Jorge Sánchez, Zita González, Marcos Gallardo, Alan García. 50 estudiantes de 4to semestre LDI.',
    estudiantes: '50 estudiantes de 4to semestre LDI',
    socios: 'Gobierno de Zapopan',
    imagen: `${IMG_BASE}/movilidad-zapopan.jpg`,
  },
  {
    titulo: 'The Design Day — Fashion Revolution',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '2026-03-24',
    tipo: 'Charla',
    descripcion:
      'Fashion Revolution & Design Day fue una jornada que reunió a estudiantes, docentes y profesionales para reflexionar sobre el papel del diseño en la transformación de la industria de la moda hacia prácticas más sustentables. A través de charlas impartidas por invitados como Carolina Sáenz, Ada Paulina Gómez Jolly, Daniel Alejandro Andrade Torres y Cynthia López, se abordaron temas como la sostenibilidad, la creatividad en la era de la inteligencia artificial y el diseño sin desperdicio, generando un espacio de diálogo crítico sobre los procesos de producción y el impacto de nuestras decisiones dentro del sistema de la moda.',
    estudiantes: '',
    socios: 'Fashion Revolution México',
    imagen: `${IMG_BASE}/design-day-fashion-revolution.jpg`,
  },
  {
    titulo: 'Exposición de Joyería en Nueva York — Echoes of Nature',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '2025-11-17',
    tipo: 'Exposición',
    descripcion:
      'Exhibición presentada en el marco de NYC Jewelry Week 2025 a partir del proyecto "Echoes of Nature", una exploración del vínculo entre naturaleza, memoria e identidad desde el contexto mexicano. A través de 21 colecciones de joyería, la propuesta retoma elementos orgánicos y simbólicos del entorno para reinterpretarlos desde el diseño contemporáneo, integrando procesos artesanales y materiales que dialogan con la riqueza natural y cultural del país.',
    estudiantes: '',
    socios: '',
    imagen: `${IMG_BASE}/echoes-of-nature-ny.jpg`,
  },
  {
    titulo: 'Congreso Trasforma DI Integra — Hope for the Future',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '2026-04-16',
    tipo: 'Congreso',
    descripcion:
      '"Hope for the Future" es un taller de futuros que invita a los participantes a explorar su propia postura frente al futuro y a reconocer su capacidad como agentes de cambio, a través de herramientas de diseño prospectivo y especulativo, desde la reflexión crítica hasta la creación de escenarios y artefactos que materializan nuevas posibilidades. El Consejo Promotor de Innovación y Diseño, en colaboración con el ITESO, postularon ante la Asociación de Escuelas de Diseño Industrial (DI-Integra) a Guadalajara como sede del 6to Congreso Internacional de Diseño Industrial TRASFORMA, que propone ampliar los límites del diseño y activar su capacidad transformadora a partir de las realidades, necesidades y potencialidades del Sur Global.',
    estudiantes: '',
    socios: 'ITESO, DI-Integra',
    imagen: `${IMG_BASE}/hope-for-the-future.jpg`,
  },
  {
    titulo: 'Salone Satellite Milan Design Week — Dulcería Salone',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '2026-04-21',
    tipo: 'Exposición',
    descripcion:
      'Dulcería Salone es una colección de 12 objetos que reinterpretan la piñata mexicana desde el diseño contemporáneo, retomando su simbolismo de celebración y colectividad. Las piezas integran manufactura artesanal de distintas regiones del país, generando un diálogo entre tradición e identidad actual. La propuesta invita a una experiencia interactiva, transformando el acto de descubrir dulces en un ritual íntimo y sensorial. Presentada en Salone Satellite, Milan Design Week.',
    estudiantes: '',
    socios: '',
    imagen: `${IMG_BASE}/dulceria-salone-milan.jpg`,
  },
  {
    titulo: 'Pitch & Connect ARQ — Entrevista',
    campus: 'Guadalajara',
    carrera: 'Arquitectura',
    fecha: '2026-04-10',
    tipo: 'Networking',
    descripcion:
      'Un espacio donde estudiantes de último semestre de arquitectura pudieron conectar con arquitectos y arquitectas EXATEC a través de entrevistas rápidas, conversaciones y revisión de portafolios. La dinámica buscó acercar a distintas generaciones de la comunidad para compartir experiencias, consejos y perspectivas sobre el mundo profesional. A cada estudiante se le solicitó asistir a dos sesiones previas sobre cómo hacer su portafolio y formular un pitch. Resultado: 32 estudiantes lograron tener una entrevista rápida con 8 exatecs (primera edición). Organizado con el Centro de Vinculación y Desarrollo Profesional.',
    estudiantes: '32 alumnos de Arquitectura, 8vo semestre',
    socios: 'Centro de Vinculación y Desarrollo Profesional',
    imagen: `${IMG_BASE}/pitch-connect-arq.jpg`,
  },
  {
    titulo: 'Pitch & Connect LAD — Evento de Networking',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-05-21',
    tipo: 'Networking',
    descripcion:
      'Durante el evento Pitch & Connect, los estudiantes tuvieron la oportunidad de dialogar con representantes de distintas compañías y profesionales independientes de la industria del arte. Pudieron presentar y revisar sus portafolios, recibir retroalimentación especializada y consultar oportunidades laborales. Representó un importante primer acercamiento de los alumnos al ámbito del networking, permitiéndoles establecer nuevos contactos dentro de la industria. Edificio Hábitat de Negocios, 3er piso, Campus Guadalajara.',
    estudiantes: '',
    socios: '',
    imagen: `${IMG_BASE}/pitch-connect-lad-networking.jpg`,
  },
  {
    titulo: 'Pitch & Connect LDI',
    campus: 'Guadalajara',
    carrera: 'Diseño',
    fecha: '',
    tipo: 'Taller',
    descripcion:
      'De la mano del CVDP (Centro de Vinculación y Desarrollo Profesional) y a lo largo de 3 sesiones, los estudiantes de LDI prepararon y desarrollaron elementos clave para su futura empleabilidad: revisión de CV, revisión de LinkedIn, retroalimentación de portafolios, preparación de casos de estudio y preparación para entrevistas. Resultado: CV revisado, presencia en LinkedIn, portafolios revisados, caso de estudio preparado y pitch personal. 34 estudiantes de 8vo semestre LDI. (Evento de abril 2026, sin día exacto especificado.)',
    estudiantes: '34 estudiantes de 8vo semestre LDI',
    socios: 'Centro de Vinculación y Desarrollo Profesional',
    imagen: `${IMG_BASE}/pitch-connect-ldi.jpg`,
  },
];

function buildProperties(a) {
  const properties = {
    [COLUMNS.title]: { title: [{ text: { content: a.titulo } }] },
    [COLUMNS.campus]: { multi_select: [{ name: a.campus }] },
    [COLUMNS.insignias]: { multi_select: [{ name: a.carrera }] },
    [COLUMNS.descripcion]: { rich_text: [{ text: { content: a.descripcion } }] },
    [COLUMNS.tipo]: { multi_select: [{ name: a.tipo }] },
    [COLUMNS.estado]: { status: { name: 'No publicado' } },
    [COLUMNS.image]: { files: [{ name: 'imagen', type: 'external', external: { url: a.imagen } }] },
  };
  if (a.fecha) properties[COLUMNS.fecha] = { date: { start: a.fecha } };
  if (a.estudiantes) properties[COLUMNS.estudiantes] = { rich_text: [{ text: { content: a.estudiantes } }] };
  if (a.socios) properties[COLUMNS.socios] = { rich_text: [{ text: { content: a.socios } }] };
  return properties;
}

async function createPage(aviso) {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: buildProperties(aviso),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Notion API error ${res.status} para "${aviso.titulo}": ${errText}`);
  }
  return res.json();
}

async function main() {
  console.log(`Creando ${AVISOS.length} avisos en Notion (Estado = "No publicado")...`);
  for (const aviso of AVISOS) {
    try {
      const page = await createPage(aviso);
      console.log(`✓ "${aviso.titulo}" -> ${page.url}`);
    } catch (err) {
      console.error(`✗ "${aviso.titulo}": ${err.message}`);
    }
  }
  console.log('Listo. Revisa la base de Notion y aprueba (Estado = "Publicado") los que correspondan.');
}

main();
