# Button

Botón rectangular en `mono`; el primario va en `moss` con texto `on-moss`, el silencioso con borde `ink-muted`.

## Uso

```html
<a class="pgr-btn pgr-btn--primary" href="/publicaciones">Ver publicaciones <span class="pgr-btn__glyph">→</span></a>
<a class="pgr-btn pgr-btn--quiet" href="/contacto">Únete al laboratorio</a>
```

- **El consumidor provee** el texto (verbo primero, mayúscula inicial) y, opcional, un glifo en `.pgr-btn__glyph`: `→` interno, `↗` externo, `↓` descarga, `>_` software.
- Un solo primario por pantalla. Todo lo demás es silencioso o un `Link`.
- Radio `radius-sm`, relleno `space-3` × `space-4`. Foco: anillo `focus`.
