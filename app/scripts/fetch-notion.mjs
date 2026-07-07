// Fetches avisos from the EAAD Notion database at build time and writes
// src/data.js in the exact shape the app already consumes. Run this before
// `npm run build` in the deploy pipeline: `npm run fetch:notion && npm run build`.
//
// Required env vars (see .env.example):
//   NOTION_TOKEN            — internal integration token, must have the
//                              database shared with it in Notion
//   NOTION_DATABASE_ID      — the database ID (from its URL)
//
// Optional env vars:
//   NOTION_STATUS_VALUE     — status value that means "ready to publish"
//                              (default: Publicado)

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const STATUS_VALUE = process.env.NOTION_STATUS_VALUE || 'Publicado';

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.error(
    'Faltan NOTION_TOKEN y/o NOTION_DATABASE_ID. Define ambos (ver app/.env.example) antes de correr este script.'
  );
  process.exit(1);
}

// Field name used by the app -> real Notion column name.
// Edit the right-hand side if a column gets renamed in Notion.
// (Confirmed against the actual database on 2026-07 — see the
// "Columnas reales detectadas" log line if this ever drifts again.)
const COLUMNS = {
  title: 'Nombre del Evento',
  autor: 'Nombre',
  campus: 'Campus',
  depto: 'Departamento o Iniciativa (selecciona todas las que apliquen)',
  fecha: 'Fecha del evento',
  descripcion: 'Descripción',
  // Assumption: "Estudiantes Involucrados" is the one meant for public
  // display (vs. "Equipo involucrado", which reads more like internal
  // staff/faculty). Flag if this should be the other one instead.
  estudiantes: 'Estudiantes Involucrados',
  socios: 'Socios Formadores',
  image: 'Imágenes',
  tipo: 'Tipo de evento',
  estado: 'Estado',
};

// Carrera isn't its own Notion column — we infer it from the
// "Departamento o Iniciativa" multi-select by matching one of these
// keywords against the selected tags. Falls back to null (no carrera
// badge/color) if nothing matches.
const CARRERAS = ['Arquitectura', 'Arte Digital', 'Diseño', 'Urbanismo'];

export const COLORS = {
  Arquitectura: '#c0562b',
  'Arte Digital': '#2f6f8f',
  Diseño: '#9a7a1f',
  Urbanismo: '#3f7a4f',
};

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function inferCarrera(deptoText) {
  const norm = normalize(deptoText);
  return CARRERAS.find((c) => norm.includes(normalize(c))) || null;
}

const FECHA_FMT = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

function plainText(richTextArray) {
  return (richTextArray || []).map((t) => t.plain_text).join('');
}

// Reads a Notion property using its *actual* type from the API response
// (not a guess), so this keeps working even if a column's type changes.
function readProperty(page, field) {
  const columnName = COLUMNS[field];
  const prop = page.properties[columnName];
  if (!prop) return null;

  switch (prop.type) {
    case 'title':
      return plainText(prop.title);
    case 'rich_text':
      return plainText(prop.rich_text);
    case 'select':
      return prop.select?.name ?? null;
    case 'multi_select':
      return (prop.multi_select || []).map((o) => o.name).join(', ');
    case 'status':
      return prop.status?.name ?? null;
    case 'date':
      return prop.date?.start ? FECHA_FMT.format(new Date(prop.date.start)) : null;
    case 'checkbox':
      return !!prop.checkbox;
    case 'files':
      return prop.files?.[0]?.file?.url || prop.files?.[0]?.external?.url || null;
    case 'email':
      return prop.email ?? null;
    case 'people':
      return (prop.people || []).map((p) => p.name).join(', ');
    default:
      return null;
  }
}

function slugify(title, fallbackId) {
  const base = normalize(title || fallbackId)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base || fallbackId;
}

async function queryDatabase() {
  const results = [];
  let cursor = undefined;

  do {
    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_cursor: cursor,
        filter: {
          property: COLUMNS.estado,
          status: { equals: STATUS_VALUE },
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Notion API error ${res.status}: ${errText}`);
    }

    const json = await res.json();
    results.push(...json.results);
    cursor = json.has_more ? json.next_cursor : undefined;
  } while (cursor);

  return results;
}

function splitDescripcion(descripcion) {
  const blocks = (descripcion || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const summary = blocks[0] || '';
  const body = blocks.slice(1);
  return { summary, body };
}

function mapPage(page) {
  const title = readProperty(page, 'title') || 'Sin título';
  const depto = readProperty(page, 'depto') || '';
  const { summary, body } = splitDescripcion(readProperty(page, 'descripcion'));

  return {
    id: slugify(title, page.id),
    carrera: inferCarrera(depto),
    tipo: readProperty(page, 'tipo') || '',
    title,
    image: readProperty(page, 'image') || '',
    summary,
    autor: readProperty(page, 'autor') || '',
    autorRol: '',
    campus: readProperty(page, 'campus') || '',
    fecha: readProperty(page, 'fecha') || '',
    depto,
    socios: readProperty(page, 'socios') || '',
    estudiantes: readProperty(page, 'estudiantes') || '',
    featured: false,
    body,
  };
}

function toModuleSource(avisos) {
  return `// GENERATED by scripts/fetch-notion.mjs — do not edit by hand.
// Re-run \`npm run fetch:notion\` to refresh from Notion.

export const CARRERAS = ['Todas', 'Arquitectura', 'Arte Digital', 'Diseño', 'Urbanismo'];

export const COLORS = {
  Arquitectura: '#c0562b',
  'Arte Digital': '#2f6f8f',
  Diseño: '#9a7a1f',
  Urbanismo: '#3f7a4f',
};

export const AVISOS = ${JSON.stringify(avisos, null, 2)};
`;
}

async function main() {
  console.log(`Consultando Notion (Estado = "${STATUS_VALUE}")...`);
  const pages = await queryDatabase();
  console.log(`${pages.length} aviso(s) publicado(s) encontrados.`);

  if (pages.length) {
    console.log('Columnas reales detectadas en Notion (nombre exacto → tipo):');
    for (const [name, prop] of Object.entries(pages[0].properties)) {
      console.log(`  - "${name}" -> ${prop.type}`);
    }
    console.log('Si algún campo salió vacío/"Sin título" abajo, compara contra COLUMNS en este script.');
  }

  const avisos = pages.map(mapPage);

  const sinCarrera = avisos.filter((a) => !a.carrera);
  if (sinCarrera.length) {
    console.warn(
      `Aviso: ${sinCarrera.length} aviso(s) sin carrera detectable en "Departamento o iniciativa": ` +
        sinCarrera.map((a) => `"${a.title}"`).join(', ')
    );
  }

  const source = toModuleSource(avisos);
  const outPath = path.join(__dirname, '..', 'src', 'data.js');
  await writeFile(outPath, source, 'utf8');

  console.log(`Escrito en ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
