# RootGrowth

Bajo una línea de suelo punteada, una raíz dibujada con `| / \` crece hacia abajo, se ramifica, echa pelos radicales `·` y termina cada punta en un nucleótido; al completarse, reposa y vuelve a crecer con otra semilla.

## Uso

```js
PGR.RootGrowth(container, { line: "sequia", seed: 3, branch: 0.07 });
```

- **El consumidor provee** el contenedor con alto (la raíz ocupa todas las filas).
- `line`: color del trazo. Las puntas brotan en `chlorophyll`, los pelos en `ink-muted`.
- `branch` 0–1 (0.16): probabilidad de ramificar. Sequía 0.08–0.12 (raíz pivotante, profunda); nitrógeno 0.2–0.3 (raíces laterales, densa).

## Dónde

Fichas de las líneas Sequía y Nitrógeno; estados de carga y vacío («todavía no hay publicaciones con este filtro»). No en la portada si ya hay un `AsciiField`.
