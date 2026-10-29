# AsciiField

Campo de caracteres que respira lentamente; en sus picos germinan bases `A T G C` en `chlorophyll` y en el color de línea. Es el fondo vivo de la portada y de las cabeceras de sección.

## Uso

```js
const field = PGR.AsciiField(container, { density: 0.5, seed: 7, line: "nitrogeno" });
field.stop(); // al desmontar
```

- **El consumidor provee** un contenedor con alto definido (el campo lo llena en columnas × filas de 13px).
- `density` 0–1 (0.5): proporción de celdas con carácter. Portada 0.5–0.6; detrás de texto, ≤ 0.3.
- `line`: `redes` · `sequia` · `nitrogeno` · `omica` tiñe las bases en el color de esa línea.
- `seed`: mismo seed, mismo campo. Úsalo para que cada línea tenga su forma.
- `fps` (8) y `speed` (1): no subir; el campo debe parecer crecimiento, no animación.

## Reglas

- Un motivo vivo por pantalla. Nunca detrás de texto con `density` > 0.3.
- Caracteres de fondo en `ink-faint`; no cambiar a `ink`.
- Se detiene fuera de pantalla y queda quieto con `prefers-reduced-motion`. Es `aria-hidden`.
