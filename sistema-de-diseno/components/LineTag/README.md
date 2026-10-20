# LineTag

Etiqueta en `mono` con un punto de 6px; con `data-line` toma el color de la línea de investigación, sin él queda en `ink-muted`.

```html
<span class="pgr-tag pgr-tag--line" data-line="nitrogeno">nitrógeno</span>
<span class="pgr-tag">Arabidopsis</span>
```

- **El consumidor provee** el texto en minúsculas y, si es una línea, `data-line`: `redes` · `sequia` · `nitrogeno` · `omica`.
- Sin caja ni fondo: es una anotación, no un botón. Para filtrar, envuélvela en un `<button>` sin estilo.
