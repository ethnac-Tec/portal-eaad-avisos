# Portal EAAD · Avisos

Portal público de avisos para la Escuela de Arquitectura, Arte y Diseño (EAAD) del Tecnológico de Monterrey. Implementado a partir de la variación **"Índice"** diseñada en Claude Design (ver `project/` y `chats/` para el brief y el prototipo original), con una segunda iteración de diseño (rebrand a blanco y negro, filtro por campus, vista de calendario) traída de vuelta desde Claude Design y adaptada al código real.

## Estructura del repo

- `app/` — aplicación React + Vite (el sitio real)
- `functions/` — Cloud Function que recibe el formulario de profesores y escribe a Notion
- `chats/` — transcripción de la sesión de diseño
- `project/` — prototipo `.dc.html` original exportado de Claude Design (referencia visual, no se ejecuta en producción)
- `firebase.json`, `.firebaserc` — configuración de Firebase Hosting + Functions

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

## GitHub Actions (`.github/workflows/deploy.yml`) — deploy automático

Como este entorno de desarrollo no tiene salida a internet hacia Notion ni Firebase, todo el fetch + build + deploy real corre en GitHub Actions. El workflow se dispara en cada push a `main`, manualmente, **y cada 20 minutos por cron** — así que un aviso marcado "Publicado" en Notion queda visible en el sitio en vivo en un máximo de ~20 minutos, sin que nadie tenga que tocar nada.

Cada corrida hace: fetch de Notion → build de vista previa (un solo HTML, como artifact descargable) → build de producción → **deploy a Firebase Hosting** (canal `live`, o sea la URL pública real).

**Configurar los secrets (una sola vez), en el repo de GitHub → Settings → Secrets and variables → Actions → New repository secret:**
1. `NOTION_TOKEN` — el token de la integración de Notion (lectura).
2. `NOTION_DATABASE_ID` — el ID de la base.
3. `FIREBASE_SERVICE_ACCOUNT` — el contenido completo del JSON de la cuenta de servicio (Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada).
4. `NOTION_WRITE_TOKEN` — token de Notion con permiso de **Insert content** habilitado (puede ser el mismo valor que `NOTION_TOKEN` si esa integración ya tiene esa capacidad activada). Lo usa el formulario de profesores para crear avisos nuevos.
5. `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` — la configuración de tu app web de Firebase (Console → Configuración del proyecto → General → "Tus apps"; si no tienes una app web todavía, créala ahí). No son secretos (van al navegador de cualquier visitante), pero igual se guardan como secret de GitHub por simplicidad.

**Correr el workflow manualmente / descargar la vista previa:**
1. Pestaña **Actions** del repo → workflow "Fetch Notion, build y deploy a Firebase Hosting" → **Run workflow** (o espera a que corra solo).
2. Para ver el sitio en vivo: `https://portal-eaad-noticias.web.app` (o `.firebaseapp.com`) una vez que una corrida termine en verde.
3. Para la vista previa de un solo archivo (además del sitio en vivo): entra a esa ejecución → sección **Artifacts** → descarga `vista-previa`.

## Formulario de profesores (`/enviar`)

Los profesores capturan avisos directo en el sitio, sin cuenta ni contraseña: escriben su correo institucional, reciben un enlace de un solo uso ("magic link"), y al abrirlo quedan verificados. El envío llega a la misma base de Notion con Estado = "No publicado" — tu flujo de aprobación en Notion sigue exactamente igual.

**Configuración única en Firebase (por consola, no requiere terminal):**
1. **Plan Blaze** — Firebase Console → engrane → Uso y facturación → cambia del plan Spark (gratis) a Blaze (pago por uso; Cloud Functions no corre en el plan gratuito, pero el uso de un formulario de este tamaño se queda dentro del nivel gratuito de Blaze).
2. **Authentication → Sign-in method** → habilita **"Email link (passwordless sign-in)"**.
3. **Notion**: en la integración que ya conectaste, confirma que **"Insert content"** esté habilitado en Capabilities (además de "Read content", que ya tenías).

Después de eso, todo se despliega solo vía GitHub Actions (ver secrets arriba) — no hay que correr nada manualmente.

El dominio permitido para el formulario es `tec.mx` (configurable con `VITE_ALLOWED_EMAIL_DOMAIN` en el build del sitio y `ALLOWED_DOMAIN` en `functions/index.js` — deben coincidir). La verificación real ocurre en la Cloud Function, usando el correo confirmado por Firebase, no lo que el navegador mande — así que aunque alguien manipule el formulario, no puede hacerse pasar por otro dominio.

**Nota de alcance:** por ahora la imagen del aviso se captura como un link a una imagen ya subida a otro lado (no hay subida de archivos todavía). Si esto es fricción para los profesores, es fácil sumar carga de archivos con Firebase Storage — dime cuando lo necesites.

## Estado actual

- Vista pública: feed con destacado, chips de filtro por carrera (Arquitectura, Arte Digital, Diseño, Urbanismo), grid de tarjetas y vista de detalle. URLs con React Router (`/`, `/aviso/:id`, `/calendario`) para poder compartir enlaces directos a cada aviso.
- Panel "Navegar" (filtro por Campus + acceso a Calendario + link a Carreras): columna fija en escritorio, menú colapsable en móvil. La lista de campus se arma sola a partir de los valores reales en los datos, no está hardcodeada.
- Vista de Calendario mensual con los avisos ubicados por fecha; clic en un evento abre un modal con resumen y link a la nota completa.
- Paleta monocromática (negro/blanco) y tipografía Arial/Helvetica, actualizada desde una segunda iteración en Claude Design.
- Integración con Notion vía `app/scripts/fetch-notion.mjs` (build-time, filtrada por estado). Datos de muestra en `app/src/data.js` mientras no se corra el fetch — mismo formato en ambos casos.
- Formulario de profesores en `/enviar`: login por magic-link restringido a `@tec.mx`, Cloud Function (`functions/`) que escribe a Notion con Estado = "No publicado".
- Cola de aprobación del administrador: resuelta directamente en Notion (columna Estado, "No publicado" → "Publicado"), sin vista propia en el sitio.
- Fuera de alcance por ahora: lógica de revisión con IA, subida de archivos de imagen (por ahora es un link), y "convocatorias" con horario/registro en el calendario (el diseño las incluía, pero no hay campo de Notion para eso todavía).
