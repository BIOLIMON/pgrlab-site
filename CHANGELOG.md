# Registro de cambios

## Rediseño en el repositorio (rama `rediseno/v1.1`)

- La app de React + Vite se reemplaza por HTML estático generado con `scripts/build.mjs` (Node, sin dependencias). `npm run build` sigue produciendo `dist/`, que es lo que publica el Worker (`wrangler.jsonc` sin cambios).
- Contenido en `sitio/contenido/`, plantilla en `sitio/plantilla.html`, sistema de diseño en `sistema-de-diseno/`.
- Imágenes como archivos en `public/img/` (antes embebidas en base64): la portada pasa de ~436 KB a ~110 KB de HTML. El JavaScript del sistema se sirve como `/assets/pgr.<hash>.js` con caché larga (`public/_headers`).
- Worker: las rutas del sitio anterior redirigen con 301 a su sección; las rutas inexistentes responden 404 con página propia (antes devolvían la portada con 200).
- `sitemap.xml` con la portada; la página oculta `/genes/` lleva `noindex` (meta y cabecera) y no está enlazada.
- Se eliminan el prerender por rutas y las dependencias de React, Vite y ESLint. `recursos/` y `public/images/` se conservan sin cambios.
- Comprobado en local: build, `wrangler dev` (rutas, 301, 404, cabeceras) y verificación de títulos contra Crossref (0 diferencias).

## Maqueta v1.1 (Fase 1 · Corrección)

Fecha: 18-oct-2026. Responde a los puntos 1–3, 8, 9, 10, 14 y 15 del brief (§2) con los criterios conservadores acordados.

## Cómo se construye ahora

- El contenido sale de archivos, no se teclea: `sitio/contenido/` (publicaciones, equipo, noticias, divulgación, cifras y herramientas). Si un dato cambia, se cambia el archivo y se corre `npm run build`.
- `publicaciones.json` es el del paquete, sin cambios (títulos de Crossref).
- El sistema de diseño vive en `sistema-de-diseno/` y la página lo usa tal cual (tokens, `bundle.css`, `bundle.js`).

## Comprobaciones hechas

- `verificar_titulos.py`: **11 entradas, 0 diferencias**.
- Sin errores de JavaScript ni desborde horizontal en 360, 390, 600, 768, 844×390, 1024, 1280, 1440 y 1920 px de ancho; la cabecera mide 73 px en todos.
- Sin JavaScript: se leen todas las secciones; la navegación queda visible (no se pliega); los controles que necesitan JS (filtros, pausa, copiar, condición de la red) no se muestran.
- Pausa: el botón detiene todos los motivos, se recuerda entre visitas y con movimiento reducido se oculta (todo queda quieto).
- Ningún texto retirado aparece en la página (TomViz, «uno de 12», «software abierto», «escuelas rurales», CultivaDatos, ES / EN, fechas EMBO 2026–2029, personas sin confirmar).
- **No probado**: lector de pantalla real, dispositivo táctil real y Core Web Vitals en móvil.

## Cambios por punto del brief

| # | Cambio |
|---|---|
| 1 | Las 11 publicaciones se renderizan desde `publicaciones.json`: títulos corregidos (PNAS 2022 ahora «…key hubs of endodermal response to nitrate»; PCE 2024 y New Phytologist 2025 completos). Etiquetas de línea desde `líneas_propuestas` (solo las cuatro líneas del sitio); contadores del filtro calculados desde los datos (redes 9 · sequía 3 · nitrógeno 8 · multi-ómica 2). El New Phytologist de Cerda & Álvarez queda en 2023, el año del archivo. Los miembros del laboratorio van en negrita por nombre y apellido, y nunca se ocultan al abreviar la lista de autores. |
| 1 | Bajo la lista: «Se muestran 11 de los 42 trabajos revisados por pares de la PI (criterio…)» con enlace al ORCID. |
| 2 | EMBO: «EMBO Global Investigator · promoción 2025 (12 seleccionados)» con enlace a EMBO; sin fechas 2026–2029 hasta confirmarlas. La noticia de EMBO se reformuló en el mismo sentido. |
| 2 | PRINT: «Software desarrollado en el laboratorio» (opción B, sin «abierto»); descripción según el README; enlace al repositorio actual `github.com/gabsga/PRINT`. |
| 2 | TomViz retirado de Herramientas y de la línea multi-ómica hasta confirmar su atribución. |
| 2 | Núcleo: las 6 universidades nombradas y enlazadas; cifras con su criterio («trabajos revisados por pares (ORCID)» y «personas en el laboratorio», que ahora se cuenta desde el archivo de equipo: 14). |
| 2 | Divulgación: cada actividad con fecha y enlace a su noticia. PhytoLink nombra el colegio; se quitó «rurales». CultivaDatos se retiró porque el paquete no trae una fuente. |
| 3 | Equipo desde `equipo.json`: Gabriela Vásquez pasa a Doctorado y Nicolás Müller a Asistentes de investigación (roles del Núcleo, por confirmar); Camilo Osorio como encargado de administración y gestión. Jean Pierre Ramos y «Joaquín» retirados hasta tener nombre completo y rol. PI con enlace a ORCID. |
| 6* | Noticias desde `noticias.csv` (las 10 nuevas más las 5 anteriores); se muestran las 8 más recientes, la última del 25-sep-2026, con enlace a todas. |
| 7* | «Únete al laboratorio» ya no es un enlace circular: abre un correo con asunto. El correo se muestra como enlace y como texto. (La sección «Conecta» queda para la Fase 2.) |
| 8 | Se quitó el «ES / EN» sin función hasta que el inglés funcione. La página declara `lang="es"`. |
| 9 | Cada pista tiene redacción de ratón y de toque, según `(hover: none), (pointer: coarse)`. |
| 10 | Botón «pausar animaciones» visible en la cabecera (solo ícono en teléfonos angostos, con nombre accesible). Detiene campo, raíz, hélice, red, filotaxis y pistas. |
| 10 | El efecto de letras en el menú se estabiliza en unos 340 ms y no cambia el nombre accesible. |
| 14 | Meta description, canonical (`https://pgrlab.cl/`), Open Graph y JSON-LD (ResearchOrganization, Person y las 11 ScholarlyArticle). |
| 15 | Nombre: sin cambios («PGR Lab» / «Plant Genome Regulation Lab») hasta que la PI decida el canónico. |
| — | La red génica tiene una alternativa en texto («la red en texto») con todas sus conexiones. |

\* Adelantados de la Fase 2 porque eran correcciones baratas y sin decisiones pendientes.

## Limitaciones del formato de maqueta

- La maqueta se publica como artefacto: el visor envuelve el archivo en su propio `<head>`, así que el `<title>`, las metas y `lang` no quedan donde deben ir en el sitio real. En el sitio (repositorio `pgrlab-site`) van en el `<head>` del HTML.
- Las imágenes siguen embebidas en base64 y el logo del Núcleo sigue repetido (bloque del Núcleo y pie). El paso a archivos aparte, una sola copia por logo, WebP/SVG y tipografías propias es de la Fase 3 (punto 13).

## Pendiente de decisión (brief §6)

- Fechas exactas de EMBO, licencia de PRINT, atribución de TomViz.
- Roles actuales de Gabriela Vásquez y Nicolás Müller; datos de Jean Pierre Ramos y «Joaquín».
- Nombre canónico ES/EN.
- Criterio de «publicaciones del laboratorio» (para la lista completa de la Fase 2).
- Validar las etiquetas de línea de `publicaciones.json`.
