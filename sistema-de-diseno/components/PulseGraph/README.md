# PulseGraph

Red regulatoria viva en canvas con la notación de redes: factores de transcripción (triángulos) arriba, hubs (cuadrados) al medio y genes (círculos) abajo; flecha activa, barra plana reprime.

## Comportamiento

- Cada ~1 s un regulador dispara una señal; los pulsos recorren las aristas y, al llegar, encienden el nodo, que puede propagar la cascada hasta tres niveles. Una represión encoge el nodo de destino.
- Cada ~4 s la red se recablea: una arista redundante se disuelve y otra crece desde cero.
- **Cursor sobre un nodo:** dispara su cascada, muestra su nombre y atenúa todo lo que no es su descendencia.
- **Clic o toque:** knockout. El nodo queda punteado con ✕, sus aristas se cortan y deja de transmitir; otro clic lo restaura.
- El cursor aparta suavemente los nodos cercanos. Se detiene fuera de pantalla; con movimiento reducido queda quieta pero sigue respondiendo al cursor.

## Uso

```js
PGR.PulseGraph(container, { line: "redes", seed: 41 });
```

- **El consumidor provee** un contenedor con alto (≥ 240px) y, si quiere, `names` con los identificadores de cada nivel; por defecto usa genes de nitrógeno y sequía.
- Color: el de la línea (`line`); destellos de las señales en `chlorophyll`; aristas en reposo en `ink-faint`.
- Acompáñalo con una pista en mono que diga qué hacer («pasa el cursor… · clic para silenciarlo»).
- Es ilustrativo: la topología se genera con `seed` y no representa datos.
