# Portal EAAD · Avisos

Portal público de avisos para la Escuela de Arquitectura, Arte y Diseño (EAAD) del Tecnológico de Monterrey. Implementado a partir de la variación **"Índice"** diseñada en Claude Design (ver `project/` y `chats/` para el brief y el prototipo original), con una segunda iteración de diseño (rebrand a blanco y negro, filtro por campus, vista de calendario) traída de vuelta desde Claude Design y adaptada al código real.

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

Los avisos se traen de Notion **en build time** (no en cada visita): un script consulta la base de datos, filtra los avisos con Estado = "Publicado" o "Programado" (configurable vía `NOTION_STATUS_VALUES`, separados por coma) y regenera `app/src/data.js` con ese contenido antes de compilar. El token de Notion nunca llega al navegador. La carrera (Arquitectura/Arte Digital/Diseño/Urbanismo) se detecta automáticamente de la columna "Insignias de la escuela".

`app/src/data.js` exporta dos listas: `AVISOS` (todo lo que trajo Notion, Publicado + Programado — la usa el Calendario) y `PUBLICADOS` (solo notas completas — la usan el feed, el detalle, "más avisos" y la lista de campus). Un aviso "Programado" nunca aparece fuera del calendario.

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

**Correr el workflow manualmente / descargar la vista previa:**
1. Pestaña **Actions** del repo → workflow "Fetch Notion, build y deploy a Firebase Hosting" → **Run workflow** (o espera a que corra solo).
2. Para ver el sitio en vivo: `https://portal-eaad-noticias.web.app` (o `.firebaseapp.com`) una vez que una corrida termine en verde.
3. Para la vista previa de un solo archivo (además del sitio en vivo): entra a esa ejecución → sección **Artifacts** → descarga `vista-previa`.

## Formulario de profesores

Se mantiene en **Tally** (no en el sitio): [tally.so/r/gDQDjP](https://tally.so/r/gDQDjP), linkeado desde el footer del sitio. Se evaluó construir un formulario nativo con verificación por correo institucional (Firebase Auth + Cloud Function escribiendo directo a Notion), pero requería el plan de pago Blaze de Firebase, que no está autorizado — se descartó por ahora. Si más adelante se autoriza ese gasto, o aparece otra forma de restringir el acceso sin necesitar Blaze, se puede retomar.

## Calendario y avisos "Programado"

Autoservicio para que un profesor agende un evento futuro sin pasar por gestión central: un segundo Tally, más corto (nombre del evento, fecha, carrera, campus, póster), conectado a la **misma base de Notion** vía la integración nativa Tally↔Notion — sin backend nuevo. Cada envío crea una fila con Estado = **"Programado"** (hay que agregar esa opción a la columna Estado en Notion si no existe).

- El fetch trae tanto "Publicado" como "Programado" (ver arriba).
- El detalle y "más avisos" **nunca** muestran un "Programado" — solo el Calendario (`/calendario`) y el banner de spotlight del feed (ver abajo).
- En el Calendario, un "Programado" se ve como una etiqueta con borde (no rellena) y su modal no tiene botón "Ver nota completa" — solo título, fecha, carrera, campus y el póster si ya lo subieron.
- Cuando la nota real de ese mismo día se publica (Estado = "Publicado"), el Calendario dejar de mostrar el "Programado" de ese día automáticamente y solo enseña la nota — es una regla de visualización (por fecha), no una fusión de datos: ambas filas siguen existiendo por separado en Notion. Si quieres limpieza real de datos (borrar el placeholder cuando ya existe la nota), es un paso manual en Notion por ahora.

### Banner de spotlight

Arriba de los chips de categoría en el feed (`app/src/components/SpotlightBanner.jsx`), se muestra automáticamente el "Programado" más próximo en fecha — sin selección manual. Si no hay ningún "Programado" futuro, el banner simplemente no aparece. Enlaza al Calendario (no tiene nota propia todavía). Usa la descripción del Tally corto si la capturaste; si no hay póster todavía, muestra un recuadro gris en su lugar.

### Calendario "solo días con eventos"

El Calendario (`app/src/pages/Calendar.jsx`) no dibuja una cuadrícula completa del mes: solo aparecen las columnas de día-de-la-semana que tuvieron algo ese mes, y dentro de esas columnas, solo las celdas con avisos — el resto queda en blanco, sin caja ni número. Cada celda muestra el póster, no solo el título. Si un día tiene 2 avisos, la celda se divide en "franjas" (dos columnas iguales, una por aviso); con 3 o más no hay un tope todavía — se verá angosto pero no se rompe, y se ajustará si llega a pasar en la práctica. En pantallas angostas (≤720px) la cuadrícula se reemplaza por una lista cronológica de una sola columna (mismo criterio de "solo lo que tiene algo"), controlada por CSS en `app/src/index.css` (`.calendar-grid-view` / `.calendar-list-view`).

## Estado actual

- Vista pública: feed con destacado, chips de filtro por carrera (Arquitectura, Arte Digital, Diseño, Urbanismo), grid de tarjetas y vista de detalle. URLs con React Router (`/`, `/aviso/:id`, `/calendario`) para poder compartir enlaces directos a cada aviso.
- Panel "Navegar" (filtro por Campus + acceso a Calendario + link a Carreras): columna fija en escritorio, menú colapsable en móvil. La lista de campus se arma sola a partir de los valores reales en los datos, no está hardcodeada.
- Vista de Calendario "solo días con eventos", con póster por aviso y franjas para días con 2 avisos (ver sección de arriba). También muestra avisos "Programado" (save-the-date sin nota todavía, vía un segundo Tally corto — ver sección de arriba).
- Paleta monocromática (negro/blanco) y tipografía Arial/Helvetica, actualizada desde una segunda iteración en Claude Design.
- Integración con Notion vía `app/scripts/fetch-notion.mjs` (build-time, filtrada por estado). Datos de muestra en `app/src/data.js` mientras no se corra el fetch — mismo formato en ambos casos.
- Formulario de profesores: se queda en Tally (ver arriba), linkeado desde el footer.
- Cola de aprobación del administrador: resuelta directamente en Notion (columna Estado, "No publicado" → "Publicado"), sin vista propia en el sitio.
- Fuera de alcance por ahora: lógica de revisión con IA, y "convocatorias" con horario/registro en el calendario (el diseño las incluía, pero no hay campo de Notion para eso todavía).
