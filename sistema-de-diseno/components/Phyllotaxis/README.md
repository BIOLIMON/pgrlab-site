# Phyllotaxis

La espiral de ángulo áureo (137,5°) con que las plantas ordenan hojas, semillas y primordios: nacen en el centro y fluyen hacia afuera, y una onda recorre la espiral como un pulso. Es el motivo de la portada.

## Comportamiento

- **Cursor encima:** se dibujan las parastiquias, las espirales de Fibonacci que unen cada primordio con sus vecinos 8, 13 y 21 posiciones más allá. La espiral se lee como un grafo.
- **Clic o toque:** la planta «decide». En **crecer** la espiral está expandida, gira y es verde (`moss`, centro en `chlorophyll`). En **resistir** se contrae, se ralentiza, sus primordios se achican y vira a ocre (`soil`).
- Sin interacción alterna sola cada ~9 s. Se detiene fuera de pantalla; con movimiento reducido queda quieta y responde igual.

## Uso

```js
const p = PGR.Phyllotaxis(container, { onState: s => label.textContent = s });
p.setState("resistir");
```

- **El consumidor provee** un contenedor cuadrado (≈ 340–460px) y, si quiere, una etiqueta para el estado vía `onState`.
- Acompáñalo con una pista en mono: «pasa el cursor… · clic: la planta decide».
