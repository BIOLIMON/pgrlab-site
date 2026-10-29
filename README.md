<div align="center">
  <a href="https://github.com/PhytoLearningCL">
    <img src="https://raw.githubusercontent.com/PhytoLearningCL/.github/main/profile/logo.png" alt="PhytoLearning" width="300">
  </a>
  <br><br>
  <a href="https://github.com/PhytoLearningCL">
    <img src="https://img.shields.io/badge/Desarrollado%20en-PhytoLearningCL-00A98F?style=for-the-badge&logo=github&logoColor=white" alt="PhytoLearningCL">
  </a>
</div>

---

# pgrlab-site

Sitio web de **pgrlab.cl**, el Plant Genome Regulation Lab (PGR Lab) de la Universidad Andrés Bello y sede del Núcleo Milenio PhytoLearning.

El sitio es HTML estático generado a partir de archivos de contenido y servido por un **Cloudflare Worker** (`src/worker.ts`) con los archivos de `dist/`.

## Uso

Requiere Node ≥ 18. No hay dependencias que instalar.

| Comando | Qué hace |
|---|---|
| `npm run build` | Genera `dist/` desde `sitio/` y `public/` |
| `npm run dev` | Build + servidor local del Worker en http://localhost:8787 (`wrangler dev`) |
| `npm run deploy` | Build + despliegue en Cloudflare (`wrangler deploy`) |
| `npm run verify:titles` | Compara los títulos de las publicaciones con Crossref (Python 3, requiere internet) |

## Dónde está cada cosa

```
sitio/
  plantilla.html        Estructura y estilos de la página (marcadores {{…}} que llena el build)
  contenido/            EL CONTENIDO: se edita aquí, no en la plantilla
    publicaciones.json  Trabajos de la PI (títulos verificados contra Crossref)
    equipo.json         Personas, roles y bios
    noticias.csv        Noticias (se muestran las 8 más recientes)
    divulgacion.csv     Actividades de formación y divulgación
    sitio.json          Nombre, correo, cifras con su fuente, universidades, herramientas
sistema-de-diseno/      Sistema de diseño (tokens, bundle.css, bundle.js con los motivos, guías)
public/                 Se copia tal cual a dist/: imágenes, favicon, robots, sitemap, _headers
  genes/                Página oculta «¿Cuándo nació cada gen?» (noindex, sin enlace desde el sitio)
scripts/build.mjs       Generador del sitio (sin dependencias)
src/worker.ts           Worker: redirecciones de rutas antiguas, 404 y diagnóstico
```

## Cambiar contenido

1. Edita el archivo correspondiente en `sitio/contenido/`.
2. Corre `npm run build` y revisa con `npm run dev`.
3. Si tocaste publicaciones, corre `npm run verify:titles`: debe dar 0 diferencias.

Reglas del contenido (del brief de diseño): cada cifra o credencial lleva su fuente en `sitio.json`; no se publica una persona sin nombre completo y rol confirmados; no se dejan controles sin función.

## Worker y rutas

- Las rutas del sitio anterior (`/about`, `/research`, `/publications`, `/team`, `/resources`, `/contact`) redirigen con 301 a su sección en la portada.
- Una ruta inexistente responde 404 con `dist/404.html`.
- `/__worker_ping` responde `ok` para confirmar que el tráfico pasa por el Worker.
- Las cabeceras de los archivos estáticos (caché larga de `/assets/`, `noindex` de `/genes/`) están en `public/_headers`.

---

<div align="center">
  <sub>Desarrollado en el marco de <a href="https://github.com/PhytoLearningCL">PhytoLearningCL</a> · Núcleo Milenio en Ciencia de Datos y Resiliencia Vegetal</sub>
</div>
