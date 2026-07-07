# Portal de noticias EAAD

_Started 2026-07-07 17:49 UTC_

---

## User

Una página de avisos/noticias para la Escuela de Arquitectura, Arte y Diseño del Tecnológico de Monterrey, pensada como un espacio amigable y de fácil lectura para la comunidad escolar. El contenido lo generan los profesores mediante un formulario; antes de publicarse, cada nota pasa por una revisión de redacción con IA y luego por la aprobación de un administrador. El resultado final es una página pública de noticias con buen diseño — este es el punto que más nos importa resolver, porque las iteraciones anteriores (Tally + Notion + Super.so, y un mockup en Gemini) se quedaron cortas: la primera por limitantes de plantilla, la segunda por ser solo una imagen sin funcionalidad detrás.

2. A quién le habla


Lectores: Facultad, Directivos y Público en general interesado en la escuela, es decir, posibles nuevos estudiantes, revisando avisos de forma rápida, probablemente desde el celular.
Profesores: no son diseñadores ni tienen tiempo — el formulario de captura debe sentirse simple, casi como llenar un memo. Puedes ver qué información se les solicita en este tally: https://tally.so/r/gDQDjP
Administrador (tú): necesitas ver de un vistazo qué está pendiente de aprobar, sin fricción.


3. Referencia visual

Adjunto: captura del mockup hecho en Gemini. Tómalo como punto de partida de estilo (tono visual, tipo de layout de tarjetas de noticias), no como plantilla exacta a copiar, también, te comparto la página institucional que ya tiene una identidad visual que necesitamos no replicar, pero hacer congruente, es decir, se tiene que sentir parte de la misma: eaad.tec.mx 

[4. Pantallas a diseñar

Prioridad 1 — Página pública de noticias


Vista principal tipo feed/mosaico de avisos recientes
Vista de detalle de una sola noticia
Forma de organizar por categoría si aplica (ej. eventos, congresos, campus (más tarde hacemos la lista), carrera (Arquitectura, Arte Digital, Diseño, Urbanismo)
Debe leerse bien en celular primero (mobile-first), ya que así la consultará la mayoría

5. Restricciones técnicas para el handoff a Claude Code


El contenido se alimenta desde una base de datos de Notion vía su API — el diseño debe contemplar los campos reales que existen ahí: [lista los campos de tu database de Notion: título, cuerpo, categoría, fecha, estado, autor, etc.]
El sitio se alojará en Firebase Hosting, con dominio .web.app gratuito por ahora
No se requiere sistema de cuentas de usuario para los lectores — es un sitio público de solo lectura



7. Qué NO estamos resolviendo en este brief


La lógica de revisión con IA (eso se construye directamente en Claude Code, no es parte visual)
La integración con la API de Notion (parte de la implementación, no del diseño)
Decisiones de marca institucional que dependan de aprobación de la escuela — si eso está pendiente, usamos una paleta provisional y la ajustamos después

## Assistant

Voy a revisar primero las referencias visuales que adjuntaste.

_[tool: view_image]_

_[tool: view_image]_

Reviso el formulario de Tally que compartiste para conocer los campos reales.Tengo buen contexto del brief, las referencias y los campos. Antes de diseñar quiero afinar algunas decisiones clave.

_[tool: questions_v2]_

_[tool: web_fetch]_

## User

Questions answered:
- scope: Feed + detalle + organización por categoría
- visual: Neutro cálido tipo galería (menos corporativo, más 'arte y diseño')
- layout: 0
- nav: Barra superior + chips de categoría (mobile-first)
- categorias: Por carrera (Arquitectura, Arte Digital, Diseño, Urbanismo)
- imagery: Usa imágenes de muestra realistas para el demo
- campos: Por ahora mantén esos, más tarde los ajustamos a lo específico
- variaciones: 2 variaciones de estilo visual
- tono: Creativo/editorial pero institucional

## Assistant

Decisiones claras. Construyo un prototipo funcional del portal (feed + chips por carrera + vista de detalle), mobile-first, con imágenes de muestra realistas, en dos variaciones de estilo editorial-institucional. Empiezo por la Variación A "Galería".

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: show_html]_

Variación A quedó sólida. Ahora la Variación B "Índice" — más estructurada, tipográfica grotesca, azul Tec más presente, con barras de color por carrera.

_[tool: dc_write]_

_[tool: update_todos]_

Ambas variaciones listas. Verifico la B, que es la que está abierta ahora.

_[tool: ready_for_verification]_

Listo. Dos variaciones del **portal público de avisos EAAD**, ambas funcionales (feed → filtro por carrera → vista de detalle), mobile-first, con imágenes de muestra y los campos reales que mencionaste (título, cuerpo, categoría/tipo, campus, fecha, autor, depto/iniciativa, carrera, socios, estudiantes):

- **`Portal EAAD - Galeria.dc.html`** — cálido tipo galería, serif editorial (Newsreader), azul Tec como acento discreto.
- **`Portal EAAD - Indice.dc.html`** — más estructurada, grotesca (Space Grotesk), azul Tec presente y barras de color por carrera.

Cada tarjeta y el destacado abren el detalle; el botón "← Todos los avisos" y el logo regresan al feed. Los chips filtran por Arquitectura, Arte Digital, Diseño y Urbanismo.

Dime cuál dirección prefieres y la refino. Pendientes que quedaron fuera del brief y podemos sumar cuando digas: el formulario del profesor (estilo memo) y la cola de aprobación del admin.

## User

ME gusta más el Portal EAAD - Indice, me gusta esta seriedad

## Assistant

¡Perfecto! El Índice tiene esa seriedad institucional que buscas. ¿Quieres que avancemos con algo de esto sobre esa base?

- Refinar detalles del Índice (jerarquía, densidad, colores por carrera)
- Agregar el **formulario del profesor** (estilo memo, simple)
- Agregar la **cola de aprobación del admin**
- Ajustar filtros (por campus, tipo de evento) además de carrera

Dime por dónde seguimos.

