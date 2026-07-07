# Portal EAAD · Avisos

Portal público de avisos para la Escuela de Arquitectura, Arte y Diseño (EAAD) del Tecnológico de Monterrey. Implementado a partir de la variación **"Índice"** diseñada en Claude Design (ver `project/` y `chats/` para el brief y el prototipo original).

## Estructura del repo

- `app/` — aplicación React + Vite (el sitio real)
- `chats/` — transcripción de la sesión de diseño
- `project/` — prototipo `.dc.html` original exportado de Claude Design (referencia visual, no se ejecuta en producción)
- `firebase.json`, `.firebaserc` — configuración de Firebase Hosting

## Desarrollo

```bash
cd app
npm install
npm run dev
```

## Build

```bash
cd app
npm run build
```

Genera `app/dist/`.

## Contenido desde Notion

Los avisos se traen de Notion **en build time** (no en cada visita): un script consulta la base de datos, filtra solo los avisos con Estado = "Publicado" (configurable) y regenera `app/src/data.js` con ese contenido antes de compilar. El token de Notion nunca llega al navegador. La carrera (Arquitectura/Arte Digital/Diseño/Urbanismo) se detecta automáticamente del texto de "Departamento o iniciativa" — no es una columna propia todavía.

1. Crea una integración interna en Notion (Settings → Connections → Develop or manage integrations) y comparte tu base de avisos con ella (menú "..." de la base → Connections).
2. `cd app && cp .env.example .env` y rellena `NOTION_TOKEN` y `NOTION_DATABASE_ID` (el ID está en la URL de la base).
3. Si tus columnas en Notion cambian de nombre, edítalas en `COLUMNS` al inicio de `app/scripts/fetch-notion.mjs`.
4. `npm run fetch:notion` — vuelve a escribir `src/data.js` con los avisos reales.

`.env` está en `.gitignore`; nunca se commitea. En CI (ver abajo) los mismos dos valores se guardan como *secrets* de GitHub Actions, no como archivo.

## GitHub Actions (`.github/workflows/preview.yml`)

Como este entorno de desarrollo no tiene salida a internet hacia Notion, el fetch real se prueba en GitHub Actions, que sí tiene acceso normal. El workflow corre en cada push a `main` (o manualmente) y hace: fetch de Notion → build de vista previa (un solo HTML) → build de producción → sube ambos como *artifacts* descargables desde la pestaña **Actions** del repo.

**Configurar los secrets (una sola vez):**
1. En el repo de GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
2. Crea `NOTION_TOKEN` con el token de la integración.
3. Crea `NOTION_DATABASE_ID` con el ID de la base.

**Correr el workflow y descargar la vista previa:**
1. Pestaña **Actions** del repo → workflow "Vista previa (fetch Notion + build)" → **Run workflow** (o simplemente espera a que corra solo después de un push).
2. Cuando termine (ícono verde ✓), entra a esa ejecución → hasta abajo, sección **Artifacts** → descarga `vista-previa` → descomprime → abre el `index.html` con doble clic, igual que antes pero con tus datos reales.

## Deploy a Firebase Hosting

1. Reemplaza `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID` en `.firebaserc` con el ID real de tu proyecto de Firebase.
2. `cd app && npm run build:notion` (fetch de Notion + build) — o `npm run build` si por ahora quieres quedarte con los datos de muestra.
3. Desde la raíz del repo: `firebase deploy --only hosting`

Como el contenido se congela en cada build, necesitas rebuildear y redeployar para que un aviso recién aprobado aparezca en el sitio. Si más adelante quieres que esto sea automático (p. ej. cada 15 min, o disparado cuando el administrador aprueba una nota), lo más simple es un GitHub Action con cron que corra los pasos 2–3 — puedo montarlo cuando tengas el repo en GitHub y el proyecto de Firebase listos.

## Estado actual

- Vista pública: feed con destacado, chips de filtro por carrera (Arquitectura, Arte Digital, Diseño, Urbanismo), grid de tarjetas y vista de detalle. URLs con React Router (`/`, `/aviso/:id`) para poder compartir enlaces directos a cada aviso.
- Integración con Notion vía `app/scripts/fetch-notion.mjs` (build-time, filtrada por estado). Datos de muestra en `app/src/data.js` mientras no se corra el fetch — mismo formato en ambos casos.
- Fuera de alcance por ahora (no diseñado todavía, ver `chats/chat1.md`): formulario de captura para profesores, cola de aprobación del administrador, lógica de revisión con IA.
