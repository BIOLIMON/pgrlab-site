# OmicsTracks

Cinco capas de datos dibujadas como pistas de un navegador genómico: genoma, expresión, cromatina, fenotipo y ambiente. Avanzan en el tiempo y confluyen, por líneas que fluyen, en un modelo (cuadrado) que entrega una predicción `ŷ` con su medidor. Es el motivo de la línea de multi-ómica.

## Comportamiento

- **Cursor:** una línea vertical escanea las pistas y marca el valor de cada capa en ese punto; la predicción se recalcula con esos valores. Sin cursor, el escáner barre solo.
- **Clic o toque:** alterna entre **control** y **sequía**. En sequía la pista de ambiente sube y vira a `soil`, la expresión y el fenotipo bajan, y la predicción responde.
- Se detiene fuera de pantalla; con movimiento reducido queda quieto y el escáner sigue al cursor.

## Uso

```js
PGR.OmicsTracks(container, { line: "omica", seed: 88 });
```

- **El consumidor provee** un contenedor con alto (≥ 240px). Por debajo de 360px de ancho los rótulos de pista suben sobre cada pista.
- Es ilustrativo: los datos son ruido generado con `seed`, no mediciones.
