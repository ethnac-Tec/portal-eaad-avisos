// ONE-TIME import script: creates the 6 avisos transcribed from the
// "Eventos_GDL.pptx" deck (images with baked-in text, read/transcribed by
// Claude) as new pages in the Notion database, with Estado = "No publicado"
// so they go through the normal review queue before appearing on the site.
//
// Run manually via GitHub Actions (workflow_dispatch) — see
// .github/workflows/import-eventos-gdl.yml. Not meant to run again; once
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
  'https://raw.githubusercontent.com/ethnac-Tec/portal-eaad-avisos/main/project/uploads/eventos-gdl-2026';

const AVISOS = [
  {
    titulo: 'Primera Piedra Campus Internacional OAK',
    campus: 'Guadalajara',
    carrera: 'Arquitectura',
    fecha: '2026-02-12',
    tipo: 'Evento',
    descripcion:
      'Evento de la primera piedra del nuevo campus de Oak Life — School of Orphan Care en Chapala, posible gracias a donativos a la organización. El proyecto, diseñado por las estudiantes Beatriz Alejandra Villanueva Andrade, Xinting Huang Xie y Ximena López Hernández (UF: Equipamiento comunitario, FJ2025) bajo la tutela de lxs profesores Marimar Varela e Ignacio Osuna, surge de un proceso participativo con lxs niñxs de la fundación. La ceremonia contó con la presencia de la directora del Sistema DIF Chapala.',
    estudiantes: 'Beatriz Alejandra Villanueva Andrade, Xinting Huang Xie, Ximena López Hernández',
    socios: 'Oak Life – School of Orphan Care, Sistema DIF Chapala',
    imagen: `${IMG_BASE}/primera-piedra-oak.jpg`,
  },
  {
    titulo: 'Análisis y Diagnóstico Multidisciplinar',
    campus: 'Guadalajara',
    carrera: 'Arquitectura',
    fecha: '2026-03-04',
    tipo: 'Plenaria',
    descripcion:
      'Plenaria en conjunto al programa de LRI, en aras de construir una visión territorial compartida del entorno del Campus GDL, integrando diagnóstico multidisciplinar y análisis prospectivo para definir escenarios y una estrategia territorial. En equipos multidisciplinares nuestros alumnos integraron en base de investigación del entorno al campus Guadalajara visiones de problemáticas y posibles futuros propuestos para polo de Innovación GDL. Temas: Seguridad, Medio ambiente, Economía, Movilidad y Vivienda.',
    estudiantes: '',
    socios: '',
    imagen: `${IMG_BASE}/diagnostico-multidisciplinar.jpg`,
  },
  {
    titulo: 'Taller Vertical ARQ',
    campus: 'Guadalajara',
    carrera: 'Arquitectura',
    fecha: '2026-02-15',
    tipo: 'Taller',
    descripcion:
      'Taller de trabajo colaborativo que reunió a todxs lxs estudiantes del programa de Arquitectura en equipos multigeneracionales (15, 16 y 17 de febrero 2026), con el objetivo de resolver en dos días intensivos el diseño de un micro-bosque nativo en campus Guadalajara. Bajo la guía del arquitecto colombiano Edgar (Global Visiting Faculty de ARQ Campus GDL), recién ganador del Holcim Foundation Award, se trabajaron retos basados en la arquitectura con naturaleza. La profesora Maria Elena de la Torre dará seguimiento a la propuesta ganadora para su implementación en campus.',
    estudiantes: 'Estudiantes del programa de Arquitectura (todos los semestres)',
    socios: '',
    imagen: `${IMG_BASE}/taller-vertical-arq.jpg`,
  },
  {
    titulo: 'Seguimiento del Micro-Bosque',
    campus: 'Guadalajara',
    carrera: 'Arquitectura',
    fecha: '2026-03-24',
    tipo: 'Reunión de seguimiento',
    descripcion:
      'Se realizó una reunión de seguimiento del Taller Vertical de arquitectura, enfocado en el diseño colaborativo de un micro-bosque nativo en campus Guadalajara. En esta sesión, doce estudiantes se integraron al equipo que dará continuidad al proceso de implementación del proyecto ganador. Asimismo, se presentaron los resultados del taller a representantes de Ruta Azul y Planta Física del campus, con el propósito de consolidar su viabilidad y ejecución dentro del entorno universitario.',
    estudiantes: '12 estudiantes de Arquitectura',
    socios: 'Ruta Azul, Planta Física',
    imagen: `${IMG_BASE}/seguimiento-microbosque.jpg`,
  },
  {
    titulo: 'Cátedra Luis Barragán — Sebastián Irarrázaval',
    campus: 'Guadalajara',
    carrera: 'Arquitectura',
    fecha: '2026-05-06',
    tipo: 'Conferencia',
    descripcion:
      'En la nueva edición de la Cátedra Luis Barragán y en el marco de los 80 años del programa de Arquitectura del Tecnológico de Monterrey, la Escuela de Arquitectura, Arte y Diseño presenta la conferencia de Sebastián Irarrázaval: "La gravedad de las cosas; Construir, sostener y habitar". Incluye evento con EXATECs, workshop exclusivo para estudiantes de Arquitectura, y keynote en LARVA con transmisión nacional.',
    estudiantes: '',
    socios: '',
    imagen: `${IMG_BASE}/catedra-luis-barragan.jpg`,
  },
  {
    titulo: 'Bloque Multidisciplinar — Visita a Socio Formador JAPI',
    campus: 'Guadalajara',
    carrera: 'Arte Digital',
    fecha: '2026-02-12',
    tipo: 'Visita',
    descripcion:
      'El pasado 12 de febrero, estudiantes de LAD (Licenciatura en Arte Digital) asistieron al Museo JAPI (Jalisco Paseo Interactivo), como parte de las actividades multidisciplinarias de alumnos de 8vo semestre junto con miembros de la LC. En el acto, se dieron cita maestros, alumnos y directivos del museo con el fin de establecer los objetivos a trabajar durante las siguientes 5 semanas de esta experiencia de colaboración.',
    estudiantes: 'Alumnos de 8vo semestre LAD',
    socios: 'JAPI (Jalisco Paseo Interactivo)',
    imagen: `${IMG_BASE}/visita-japi.jpg`,
  },
];

function buildProperties(a) {
  const properties = {
    [COLUMNS.title]: { title: [{ text: { content: a.titulo } }] },
    [COLUMNS.campus]: { multi_select: [{ name: a.campus }] },
    [COLUMNS.insignias]: { multi_select: [{ name: a.carrera }] },
    [COLUMNS.fecha]: { date: { start: a.fecha } },
    [COLUMNS.descripcion]: { rich_text: [{ text: { content: a.descripcion } }] },
    [COLUMNS.tipo]: { multi_select: [{ name: a.tipo }] },
    [COLUMNS.estado]: { status: { name: 'No publicado' } },
    [COLUMNS.image]: { files: [{ name: 'imagen', type: 'external', external: { url: a.imagen } }] },
  };
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
