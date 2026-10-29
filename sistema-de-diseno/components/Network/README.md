# Network

Red génica interactiva con la notación de redes regulatorias: triángulo para factor de transcripción, círculo para gen, cuadrado para hub; flecha para activación y barra plana para represión.

## Uso

```js
const net = PGR.Network(container, {
  label: "Red de nitrógeno y sequía",
  nodes: [{ id: "NLP7", type: "tf", module: "nitrogeno", note: "…" }, …],
  edges: [{ s: "NRT1.1", t: "NLP7", sign: 1 }, { s: "SnRK2", t: "NLP7", sign: -1 }, …],
  states: { reposo: [], nitrato: ["NRT1.1", "NLP7", …] },
  state: "nitrato",
  onSelect: node => { /* node.targets, node.sources, node.deg, node.note — o null */ }
});
net.setState("sequia");
```

- **El consumidor provee** los nodos (`type`: `tf` · `gene` · `hub`; `module`: `nitrogeno` → `moss`, `sequia` → `soil`, `cruce` → `genome`), las aristas con signo, los estados (qué nodos se encienden) y, si quiere, un panel que muestre `onSelect`.
- Encendido = relleno del color del módulo; las aristas que salen de un nodo encendido se vuelven punteadas y fluyen.
- Pasar el cursor o enfocar un nodo atenúa todo lo que no es su vecindario. Los nodos se arrastran; la red se reacomoda.
- Acompaña siempre con un selector `.pgr-seg` de condiciones y una leyenda de formas.
- Si las conexiones no son un resultado publicado, dilo en una nota bajo la red («esquema ilustrativo»).
