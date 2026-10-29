El sitio del Plant Genome Regulation Lab (Universidad Andrés Bello, Núcleo Milenio PhytoLearning) se lee como un cuaderno de laboratorio que está vivo: papel de piedra y liquen, tipografía de revista científica, y debajo, código que respira. La bioinformática aparece tal cual es —texto monoespaciado, secuencias, grillas de caracteres— pero se mueve como tejido: lento, irregular, creciendo.

```
   .·:   biología  ─────┐
  ·:;=+  ATGGCT…        ├──▶  una sola superficie, continua
   .·:   código   ──────┘
```

## Principios

1. **Pregunta antes que producto.** La portada abre con una pregunta de investigación, no con un eslogan. «¿Cómo decide una planta qué hacer con el poco nitrógeno que tiene?» en vez de «Decoding the future of crops».
2. **El dato es el adorno.** No hay ilustraciones de stock, gradientes ni íconos de UI decorativos. Lo que decora es la propia materia del laboratorio: secuencias, redes, raíces dibujadas en caracteres.
3. **Papel, no tarjetas.** Superficies planas separadas por líneas finas (`rule`), sin sombras ni esquinas redondeadas (`radius-0`). Nada flota.
4. **Vivo, pero lento.** Todo movimiento es de 1–8 fps, como crecimiento, nunca como interfaz. Se detiene con `prefers-reduced-motion` y cuando no está en pantalla.
5. **Tiempo de lectura generoso.** Espacios grandes (`space-8` entre secciones), texto a `measure`, una idea por pantalla.

## Voz y contenido

- **Bilingüe, español primero.** Títulos y navegación en español; los títulos de publicaciones quedan en su idioma original (inglés). El selector `ES / EN` se agrega solo cuando la versión en inglés funcione: no se entregan controles sin función.
- **Primera persona plural, tono de seminario.** «Estudiamos», «nos preguntamos», «todavía no sabemos». Se admite la duda; se evita el superlativo («líder», «de vanguardia», «innovador»).
- **Mayúscula solo inicial** en títulos: «Redes transcripcionales», no «Redes Transcripcionales». Los rótulos `label` sí van en mayúsculas (lo hace el estilo, no el texto).
- **Nombres científicos en cursiva**: *Arabidopsis thaliana*, *Solanum pennellii*. Genes en `mono`: `NLP7`, `ABF2`, `ABF3`.
- **Cifras como lectura de instrumento, no como trofeo.** En lugar de contadores animados («42+ publicaciones!»), un `Readout` sobrio: `publicaciones ........ 42`.
- **Sin emoji.** Los glifos permitidos son tipográficos: `→ · § ¶ ─ │ ▸ >_`.

## Color

El papel (`paper`, un gris piedra con dejo de salvia, nunca crema ni blanco) y la tinta (`ink`) cargan el 90 % de cualquier pantalla. Los colores de identidad vienen del logo (`moss`, `genome`, `chlorophyll`) y de PhytoLearning (`water`), más un ocre de suelo (`soil`) que da calidez.

Cada **línea de investigación** tiene un color y solo uno; se usa en su número, su punto, su campo ASCII y su etiqueta, nunca de fondo:

| Línea | Token | Glifo |
| --- | --- | --- |
| 01 · Redes transcripcionales | `genome` | `◇─◇` |
| 02 · Estrategias de adaptación a sequía | `soil` | `∴` |
| 03 · Señalización y eficiencia de uso de nitrógeno | `moss` | `N` |
| 04 · Multi-ómica y sistemas predictivos | `water` | `≋` |

- Enlaces y acción principal en `moss`; texto sobre relleno `moss` en `on-moss`.
- `chlorophyll` es luz, no tinta: destellos en los campos ASCII y el punto «vivo». De día nunca como texto.
- `ink-faint` solo para caracteres de fondo de los campos ASCII.
- **Solo tema claro.** El sitio no tiene modo oscuro: todo se diseña sobre `paper`. Todos los pares de texto cumplen ≥4.5:1.

## Tipografía

Dos familias, ambas de Google Fonts: **Newsreader** (serif de revista, con eje óptico) para todo lo que se lee, e **IBM Plex Mono** para todo lo que se *computa*.

- `display` una vez por página, peso 400. La autoridad viene del tamaño y del aire, no de la negrita.
- `body` 18px a `measure`. `lede` en cursiva bajo el título.
- `label` (mono, mayúsculas, tracking 0.08em) para numerar: `§ 02`, `LÍNEA 03 · NITRÓGENO`, `SOFTWARE`.
- `mono` para DOIs, genes, rutas (`~/publicaciones`), y `ascii` (interlineado 1) solo dentro de campos ASCII.
- Nunca mono para párrafos; nunca serif dentro de un campo ASCII.

## Motivos ASCII

El rasgo de la marca. Siete motivos, todos en `components/bundle.js` (`window.PGR`):

- **`AsciiField`** — un campo de ruido que respira lentamente con la rampa `  .·:;=+*` y, en los picos, bases `A T G C` que germinan en `chlorophyll`. Úsalo con moderación, solo como textura secundaria: la portada y las líneas de investigación tienen motivos propios.
- **`RootGrowth`** — una raíz que crece hacia abajo, se ramifica y termina en nucleótidos. Para la línea de sequía y nitrógeno, y para estados vacíos/carga.
- **`Helix`** — doble hélice horizontal girando con pares A–T / G–C. Separador entre secciones.

- **`Phyllotaxis`** — la espiral áurea con que la planta ordena sus primordios. El cursor revela las espirales de Fibonacci como grafo y el clic hace que la planta alterne entre crecer (verde, expandida) y resistir (ocre, contraída). Motivo de la portada.
- **`OmicsTracks`** — pistas de genoma, expresión, cromatina, fenotipo y ambiente que convergen en una predicción. El cursor escanea las capas y el clic alterna entre control y sequía. Motivo de la línea de multi-ómica.
- **`PulseGraph`** — red regulatoria viva en tres niveles (factores de transcripción, hubs, genes). Las señales viajan en cascada por las aristas y la red se recablea sola cada pocos segundos. Al pasar el cursor sobre un nodo se dispara su cascada; al hacer clic queda en knockout y su descendencia se apaga. Es el motivo de la línea de redes transcripcionales.
- **`Network`** — red génica interactiva: triángulos para factores de transcripción, círculos para genes, cuadrados para hubs; flecha activa, barra plana reprime. Encendida por condición (reposo, nitrato, sequía).

Los motivos responden al cursor: el campo se ilumina y germina bases donde pasa y lanza una onda al hacer clic; la raíz se replanta donde se hace clic; la hélice acelera al pasar encima. `PGR.scramble()` hace que los enlaces marcados con `data-scramble` se desarmen en bases y se vuelvan a leer al pasar el cursor.

Reglas: un motivo vivo por pantalla; en color de línea o `ink-faint`, nunca multicolor; densidad baja (que se lea como textura, no como imagen); `aria-hidden="true"`; quieto con `prefers-reduced-motion`.

## Espacio y composición

- Grilla de 12 columnas dentro de `container` (1240px); márgenes laterales `space-4` en móvil.
- Columnas asimétricas: rótulo `label` en una columna estrecha a la izquierda, contenido a la derecha (como notas al margen).
- Separación entre secciones `space-8` (escritorio) / `space-7` (móvil); entre filas `space-5`.
- Líneas finas `rule` de `rule-width` separan filas de listas. Sin sombras, sin tarjetas.

## Formatos

- **Escritorio (> 1080px):** navegación completa en una línea, columna de margen para los rótulos `§`.
- **Tablet (721–1080px):** navegación tras «menú +»; bajo 1024px desaparece la columna de margen y las líneas de investigación pasan a dos columnas (texto + motivo); bajo 900px la portada se apila y la espiral se centra.
- **Teléfono (≤ 720px):** una columna; `Network` se reorganiza en vertical (nitrógeno arriba, sequía abajo) para que las etiquetas se lean; los motivos tienen alto fijo.
- Los titulares (`display`, `title`, `heading`, `lede`) escalan de forma fluida entre teléfono y escritorio.
- En pantallas táctiles (`hover: none`) las pistas dicen «toca» en vez de «pasa el cursor»; tocar un nodo lo selecciona y arrastrar desplaza la página.

## Movimiento

- Tres niveles: **ambiente** (los motivos vivos, lentos), **respuesta** (≤ 200 ms) y **narrativa** (≤ 600 ms, una vez).
- El movimiento ambiente siempre tiene un interruptor visible «pausar animaciones» (`.pgr-motion` + `PGR.setPaused()`), que se recuerda entre visitas (WCAG 2.2.2). En pausa, los motivos siguen respondiendo al cursor y al toque.
- Con `prefers-reduced-motion` todo queda estático y el interruptor se oculta.
- El efecto `scramble` se estabiliza antes de 400 ms y no cambia el nombre accesible del enlace.

## Estados e interacción

- Foco: anillo de 2px en `focus` con 2px de separación, siempre visible al navegar con teclado.
- Hover de enlace: el subrayado pasa de 1px a 2px; de fila de lista: fondo `paper-raised`.
- Movimiento de interfaz: 160ms ease-out, solo opacidad y color. El movimiento «vivo» es exclusivo de los motivos ASCII.

## Logos

En `assets/Logos/`. El logo del laboratorio (triángulo púrpura, hélice y hojas) se usa en la cabecera a 40px de alto y en el pie; el de PhytoLearning encabeza la fila de afiliaciones del pie a 88px de alto (el director del Núcleo dirige el lab) y aparece también en «Acerca de» a 96px o más. Las demás afiliaciones (UNAB, CBV, EMBO) van detrás, a 36–40px. No recolorear ni redibujar ningún logo.

## Iconografía

No hay set de íconos. Se usan glifos tipográficos en `mono`: `→` enlace, `↗` enlace externo, `↓` descarga, `§` sección, `>_` herramienta/software, `·` separador. Los colores de línea se marcan con un punto de 6px (`radius-pill`).
