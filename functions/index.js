const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

const NOTION_TOKEN = defineSecret('NOTION_WRITE_TOKEN');

// Same database the public site reads from (app/scripts/fetch-notion.mjs).
const NOTION_DATABASE_ID = '3566fabe44f4807cad74d733e0d94d71';

const ALLOWED_DOMAIN = 'tec.mx';

// Keep these column names in sync with COLUMNS in app/scripts/fetch-notion.mjs
// — if a column gets renamed there, it needs to change here too.
const COLUMNS = {
  title: 'Nombre del Evento',
  autor: 'Nombre',
  correo: 'Correo',
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

// Must match the exact option label in the Notion "Estado" status property.
const DEFAULT_STATUS = 'No publicado';

function requireString(value, field, { optional = false } = {}) {
  if (typeof value !== 'string' || (!optional && !value.trim())) {
    throw new HttpsError('invalid-argument', `Falta el campo requerido: ${field}.`);
  }
  return value.trim();
}

exports.submitAviso = onCall({ secrets: [NOTION_TOKEN] }, async (request) => {
  const { auth, data } = request;

  // Never trust the client for identity — this comes from Firebase's own
  // verified ID token, not from anything the browser sent as form data.
  if (!auth || !auth.token?.email) {
    throw new HttpsError('unauthenticated', 'Necesitas iniciar sesión con tu correo institucional.');
  }
  const email = auth.token.email;
  if (!email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)) {
    throw new HttpsError('permission-denied', `Solo se aceptan correos @${ALLOWED_DOMAIN}.`);
  }

  const nombre = requireString(data.nombre, 'nombre');
  const titulo = requireString(data.titulo, 'título');
  const campus = requireString(data.campus, 'campus');
  const tipo = requireString(data.tipo, 'tipo de evento');
  const fecha = requireString(data.fecha, 'fecha del evento');
  const descripcion = requireString(data.descripcion, 'descripción');
  const socios = requireString(data.socios, 'socios', { optional: true });
  const estudiantes = requireString(data.estudiantes, 'estudiantes', { optional: true });
  const imagen = requireString(data.imagen, 'imagen', { optional: true });
  const carreras = Array.isArray(data.carreras) ? data.carreras.filter((c) => typeof c === 'string') : [];

  const properties = {
    [COLUMNS.title]: { title: [{ text: { content: titulo } }] },
    [COLUMNS.autor]: { rich_text: [{ text: { content: nombre } }] },
    [COLUMNS.correo]: { email },
    [COLUMNS.campus]: { multi_select: [{ name: campus }] },
    [COLUMNS.insignias]: { multi_select: carreras.map((c) => ({ name: c })) },
    [COLUMNS.fecha]: { date: { start: fecha } },
    [COLUMNS.descripcion]: { rich_text: [{ text: { content: descripcion } }] },
    [COLUMNS.tipo]: { multi_select: [{ name: tipo }] },
    [COLUMNS.estado]: { status: { name: DEFAULT_STATUS } },
  };
  if (socios) properties[COLUMNS.socios] = { rich_text: [{ text: { content: socios } }] };
  if (estudiantes) properties[COLUMNS.estudiantes] = { rich_text: [{ text: { content: estudiantes } }] };
  if (imagen) {
    properties[COLUMNS.image] = {
      files: [{ name: 'imagen', type: 'external', external: { url: imagen } }],
    };
  }

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN.value()}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Notion API error', res.status, errText);
    throw new HttpsError('internal', 'No se pudo guardar el aviso en Notion. Intenta de nuevo.');
  }

  return { ok: true };
});
