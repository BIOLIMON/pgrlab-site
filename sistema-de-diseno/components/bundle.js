/* PGR Lab — motivos ASCII vivos. window.PGR = { AsciiField, RootGrowth, Helix, Network, PulseGraph, Phyllotaxis, OmicsTracks, GeneCircuit, scramble }.
   Cada motivo recibe un elemento contenedor y opciones; devuelve { stop() }.
   Responden al cursor: el campo se ilumina y germina, la raíz se replanta, la hélice acelera.
   Sin dependencias. Se detienen fuera de pantalla y con prefers-reduced-motion. */
(function () {
  var BASES = "ATGC";

  // Pausa global de animaciones (WCAG 2.2.2): un solo interruptor detiene todos los motivos y se recuerda
  var paused = false;
  try { paused = localStorage.getItem("pgr-motion") === "off"; } catch (e) {}
  function syncPaused() { document.documentElement.classList.toggle("pgr-paused", paused); }
  syncPaused();
  function setPaused(v) {
    paused = !!v; syncPaused();
    try { localStorage.setItem("pgr-motion", paused ? "off" : "on"); } catch (e) {}
    document.dispatchEvent(new CustomEvent("pgr-motion", { detail: { paused: paused } }));
  }
  var PAIR = { A: "T", T: "A", G: "C", C: "G" };

  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }

  // Ruido de valor 3D suave (x, y, tiempo)
  function makeNoise(seed) {
    var r = rng(seed), p = new Uint8Array(512), i;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = p[i]; p[i] = p[j]; p[j] = t; }
    for (i = 0; i < 256; i++) p[i + 256] = p[i];
    function h(x, y, z) { return p[p[p[x & 255] + (y & 255)] + (z & 255)] / 255; }
    function s(t) { return t * t * (3 - 2 * t); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    return function (x, y, z) {
      var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      var xf = s(x - xi), yf = s(y - yi), zf = s(z - zi);
      var a = lerp(lerp(h(xi, yi, zi), h(xi + 1, yi, zi), xf), lerp(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), xf), yf);
      var b = lerp(lerp(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), xf), lerp(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), xf), yf);
      return lerp(a, b, zf);
    };
  }

  function esc(c) { return c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c; }

  // Monta un <pre class="pgr-ascii"> que llena el contenedor y mide la celda
  function mount(el, opts) {
    var pre = document.createElement("pre");
    pre.className = "pgr-ascii";
    pre.setAttribute("aria-hidden", "true");
    if (opts.line) pre.setAttribute("data-line", opts.line);
    el.appendChild(pre);
    var probe = document.createElement("span");
    probe.textContent = "MMMMMMMMMM";
    pre.appendChild(probe);
    var cw = probe.getBoundingClientRect().width / 10 || 8, ch = probe.getBoundingClientRect().height || 13;
    pre.removeChild(probe);
    return {
      pre: pre,
      size: function () {
        var r = el.getBoundingClientRect();
        return {
          cols: opts.cols || Math.max(8, Math.floor((r.width || 480) / cw)),
          rows: opts.rows || Math.max(4, Math.floor((r.height || 240) / ch))
        };
      }
    };
  }

  // Posición del cursor en celdas, y ondas al hacer clic
  function pointer(el, m) {
    var st = { x: -99, y: -99, on: false, waves: [] };
    function cell(e) {
      var r = m.pre.getBoundingClientRect(), d = m.size();
      return { x: (e.clientX - r.left) / (r.width / d.cols), y: (e.clientY - r.top) / (r.height / d.rows) };
    }
    el.addEventListener("pointermove", function (e) { var c = cell(e); st.x = c.x; st.y = c.y; st.on = true; });
    el.addEventListener("pointerleave", function () { st.on = false; st.x = st.y = -99; });
    el.addEventListener("pointerdown", function (e) { var c = cell(e); st.waves.push({ x: c.x, y: c.y, age: 0 }); if (st.waves.length > 4) st.waves.shift(); });
    return st;
  }

  // Bucle a fps bajo, en pausa fuera de pantalla; un solo cuadro con movimiento reducido
  function loop(el, fps, frame) {
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var visible = true, raf = 0, last = 0, t = 0, dead = false, io = null;
    frame(0);
    if (reduced) return { stop: function () {} };
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (e) { visible = e[0].isIntersecting; });
      io.observe(el);
    }
    function tick(now) {
      if (dead) return;
      raf = requestAnimationFrame(tick);
      var f = typeof fps === "function" ? fps() : fps;
      if (!visible || paused || now - last < 1000 / f) return;
      last = now; t++; frame(t);
    }
    raf = requestAnimationFrame(tick);
    return { stop: function () { dead = true; cancelAnimationFrame(raf); if (io) io.disconnect(); } };
  }

  /* AsciiField — campo de ruido que respira; en los picos germinan bases.
     opts: { density 0..1 (0.5), speed (1), seed, line, fps (8), cols, rows, interactive (true) } */
  function AsciiField(el, opts) {
    opts = opts || {};
    var m = mount(el, opts), noise = makeNoise(opts.seed || 7), r = rng((opts.seed || 7) * 31);
    var ptr = opts.interactive === false ? null : pointer(el, m);
    if (ptr) el.style.cursor = "crosshair";
    var ramp = "  ..·::;=+*";
    var density = opts.density == null ? 0.5 : opts.density, speed = opts.speed || 1;
    var seq = []; for (var i = 0; i < 4096; i++) seq.push(BASES[Math.floor(r() * 4)]);
    var base = opts.fps || 8, zt = 0;
    return loop(el, function () { return ptr && (ptr.on || ptr.waves.length) ? 20 : base; }, function (t) {
      var d = m.size(), out = "", bias = 0.62 - density * 0.5;
      zt += (ptr && ptr.on ? 0.4 : 1) * 0.035 * speed * (base / (ptr && (ptr.on || ptr.waves.length) ? 20 : base));
      var z = zt;
      if (ptr) ptr.waves = ptr.waves.filter(function (w) { w.age += 1; return w.age < 40; });
      for (var y = 0; y < d.rows; y++) {
        for (var x = 0; x < d.cols; x++) {
          var n = noise(x * 0.07, y * 0.14, z) * 0.7 + noise(x * 0.19 + 40, y * 0.38, z * 1.7) * 0.3;
          if (ptr) {
            var dx = x - ptr.x, dy = (y - ptr.y) * 1.6, dd = dx * dx + dy * dy;
            if (ptr.on) n += 0.42 * Math.exp(-dd / 40);
            for (var wi = 0; wi < ptr.waves.length; wi++) {
              var w = ptr.waves[wi], wx = x - w.x, wy = (y - w.y) * 1.6, rr = Math.sqrt(wx * wx + wy * wy) - w.age * 1.4;
              n += 0.5 * Math.exp(-rr * rr / 3) * (1 - w.age / 40);
            }
          }
          var v = (n - bias) / (1 - bias);
          if (v <= 0) { out += " "; continue; }
          if (v > 0.8) {
            var b = seq[(x * 7 + y * 131) & 4095];
            out += v > 0.9 ? "<b>" + b + "</b>" : "<i>" + b + "</i>";
          } else out += esc(ramp[Math.min(ramp.length - 1, Math.floor(v * ramp.length))]);
        }
        out += "\n";
      }
      m.pre.innerHTML = out;
    });
  }

  /* RootGrowth — una raíz que crece hacia abajo, se ramifica y termina en nucleótidos.
     opts: { seed, line, fps (6), branch 0..1 (0.07), cols, rows } */
  function RootGrowth(el, opts) {
    opts = opts || {};
    var m = mount(el, opts), seed = opts.seed || 3, r = rng(seed), grid, tips, d, rest = 0;
    var branch = opts.branch == null ? 0.16 : opts.branch;
    var ptr = opts.interactive === false ? null : pointer(el, m), plantAt = null;
    if (ptr) { el.style.cursor = "pointer"; el.addEventListener("pointerdown", function () { plantAt = Math.round(ptr.x); }); }
    function reset() {
      d = m.size(); grid = [];
      for (var y = 0; y < d.rows; y++) { grid.push([]); for (var x = 0; x < d.cols; x++) grid[y].push(null); }
      // línea de suelo y semilla
      for (var sx = 0; sx < d.cols; sx++) if (r() < 0.55) grid[0][sx] = { c: r() < 0.7 ? "." : "_", k: "f" };
      var x0 = plantAt != null ? Math.max(1, Math.min(d.cols - 2, plantAt)) : Math.floor(d.cols / 2);
      grid[0][x0] = { c: "v", k: "b" };
      tips = [{ x: x0, y: 0, dx: 0, life: d.rows, main: true }];
    }
    function render() {
      var out = "";
      for (var y = 0; y < d.rows; y++) {
        for (var x = 0; x < d.cols; x++) {
          var g = grid[y][x];
          out += !g ? " " : g.k === "f" ? esc(g.c) : g.k === "b" ? "<b>" + g.c + "</b>" : g.k === "u" ? "<u>" + esc(g.c) + "</u>" : "<i>" + esc(g.c) + "</i>";
        }
        out += "\n";
      }
      m.pre.innerHTML = out;
    }
    function step() {
      var next = [];
      tips.forEach(function (p) {
        var turn = r(), dx = p.dx, wob = p.main ? 0.2 : 0.12;
        if (turn < wob) dx = Math.max(-1, dx - 1); else if (turn > 1 - wob) dx = Math.min(1, dx + 1);
        if (p.main && dx !== 0 && r() < 0.35) dx = 0; // la raíz principal busca la vertical
        var nx = p.x + dx, ny = p.y + 1, life = p.life - 1;
        if (ny >= d.rows || nx < 0 || nx >= d.cols || life <= 0 || grid[ny][nx]) {
          if (p.y > 0 && grid[p.y][p.x] && grid[p.y][p.x].k === "i") grid[p.y][p.x] = { c: BASES[Math.floor(r() * 4)], k: "b" };
          return;
        }
        grid[ny][nx] = { c: dx === 0 ? "|" : dx < 0 ? "/" : "\\", k: "i" };
        // pelos radicales: puntos finos a los lados
        if (r() < 0.18) { var hx = nx + (r() < 0.5 ? -1 : 1); if (hx >= 0 && hx < d.cols && !grid[ny][hx]) grid[ny][hx] = { c: r() < 0.5 ? "." : "·", k: "u" }; }
        next.push({ x: nx, y: ny, dx: dx, life: life, main: p.main });
        if (ny > 1 && r() < branch * (1 - 0.6 * ny / d.rows) && next.length < 24) {
          var side = r() < 0.5 ? -1 : 1;
          next.push({ x: nx, y: ny, dx: side, life: Math.max(3, Math.floor(life * (0.25 + r() * 0.45))), main: false });
        }
      });
      tips = next;
    }
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reset();
    // arranca ya crecida: entera si no hay movimiento, a medio camino si lo hay
    for (var k = 0, pre = reduced ? d.rows * 2 : Math.floor(d.rows * 0.45); k < pre && tips.length; k++) step();
    return loop(el, function () { return ptr && ptr.on ? 16 : (opts.fps || 6); }, function (t) {
      if (plantAt != null) { r = rng(++seed); reset(); plantAt = null; rest = 0; render(); return; }
      if (t > 0) {
        if (!tips.length) { if (++rest > 30) { r = rng(++seed); reset(); rest = 0; } }
        else step();
      }
      render();
    });
  }

  /* Helix — doble hélice horizontal girando, pares A–T / G–C.
     opts: { seed, line, fps (8), rows (9), cols } */
  function Helix(el, opts) {
    opts = opts || {};
    opts.rows = opts.rows || 9;
    var m = mount(el, opts), r = rng(opts.seed || 11), seq = [];
    var ptr = opts.interactive === false ? null : pointer(el, m), tt = 0;
    for (var i = 0; i < 2048; i++) seq.push(BASES[Math.floor(r() * 4)]);
    return loop(el, function () { return ptr && ptr.on ? 24 : (opts.fps || 8); }, function (t0) {
      if (t0 > 0) tt += ptr && ptr.on ? 2 : 1;
      var t = tt;
      var d = m.size(), H = d.rows, mid = (H - 1) / 2, amp = (H - 1) / 2, rows = [];
      for (var y = 0; y < H; y++) { rows.push([]); for (var x = 0; x < d.cols; x++) rows[y].push(" "); }
      var shift = Math.floor(t * 0.1 / 0.2);
      for (var x = 0; x < d.cols; x++) {
        var ph = x * 0.2 - t * 0.1, s = Math.sin(ph), c = Math.cos(ph), k = x - shift + 6144;
        var y1 = Math.round(mid + amp * s), y2 = Math.round(mid - amp * s);
        var b = seq[k & 2047];
        if (k % 4 === 0 && Math.abs(y1 - y2) > 2) {
          var lo = Math.min(y1, y2), hi = Math.max(y1, y2);
          for (var yy = lo + 2; yy < hi - 1; yy++) rows[yy][x] = ":";
          rows[lo + 1][x] = "<u>" + (y1 < y2 ? b : PAIR[b]) + "</u>";
          rows[hi - 1][x] = "<u>" + (y1 < y2 ? PAIR[b] : b) + "</u>";
        }
        var front1 = c > 0;
        rows[y2][x] = front1 ? "·" : "<i>o</i>";
        rows[y1][x] = front1 ? "<i>o</i>" : "·";
      }
      m.pre.innerHTML = rows.map(function (row) { return row.join(""); }).join("\n");
    });
  }

  /* PulseGraph — red regulatoria viva en canvas, con la notación de redes:
     triángulo = factor de transcripción, cuadrado = hub, círculo = gen; flecha activa, barra reprime.
     Señales recorren las aristas en cascada, la red se recablea sola, y responde al cursor:
     pasar sobre un nodo dispara su cascada; hacer clic lo silencia (knockout) y apaga su descendencia.
     opts: { line, seed, names: { tf:[], hub:[], gene:[] }, interactive (true) } */
  function PulseGraph(el, opts) {
    opts = opts || {};
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var r = rng(opts.seed || 13);
    var names = opts.names || {
      tf: ["NLP7", "ABF2", "TGA1", "bZIP1"],
      hub: ["NRT1.1", "SnRK2"],
      gene: ["NIA1", "NIR1", "NRT2.1", "RD29B", "RAB18", "ASN1", "P5CS1", "GLN2"]
    };
    var cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "display:block;width:100%;height:100%;touch-action:manipulation;";
    el.appendChild(cv);
    var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = 1;
    if (opts.line) el.setAttribute("data-line", opts.line);
    var cs = getComputedStyle(el);
    function col(v, fb) { var c = cs.getPropertyValue(v).trim(); return c || fb; }
    var C = {
      line: col("--line", "") || col("--genome", "#53346f"), faint: col("--ink-faint", "#a3a796"), muted: col("--ink-muted", "#4c5045"),
      ink: col("--ink", "#1a2119"), paper: col("--paper-raised", "") || col("--paper", "#e3e4db"), spark: col("--chlorophyll", "#6f9a35"),
      mono: col("--font-mono", "monospace")
    };

    // nodos en tres niveles: TF arriba, hubs al medio, genes abajo (jerarquía regulatoria)
    var nodes = [];
    function addLevel(type, list, y) {
      list.forEach(function (n, i) {
        var u = (i + 0.5) / list.length + (r() - 0.5) * 0.08;
        nodes.push({ id: n, type: type, u: u, v: y + (r() - 0.5) * 0.08, ph: r() * 6.28, glow: 0, dim: 0, ring: 0, ko: false, x: 0, y: 0 });
      });
    }
    addLevel("tf", names.tf, 0.16); addLevel("hub", names.hub, 0.5); addLevel("gene", names.gene, 0.84);
    var TF = nodes.filter(function (n) { return n.type === "tf"; }), HUB = nodes.filter(function (n) { return n.type === "hub"; }), GENE = nodes.filter(function (n) { return n.type === "gene"; });
    var edges = [];
    function has(a, b) { return edges.some(function (e) { return e.s === a && e.t === b && !e.dying; }); }
    function addEdge(a, b, grow) {
      if (a === b || has(a, b)) return;
      edges.push({ s: a, t: b, sign: r() < 0.22 ? -1 : 1, grow: grow ? 0 : 1, dying: false, heat: 0 });
    }
    function pick(arr) { return arr[Math.floor(r() * arr.length)]; }
    TF.forEach(function (t) { addEdge(t, pick(HUB)); addEdge(t, pick(GENE)); if (r() < 0.6) addEdge(t, pick(GENE)); });
    HUB.forEach(function (h) { for (var k = 0; k < 3; k++) addEdge(h, pick(GENE)); });
    addEdge(TF[0], TF[1 % TF.length]);
    GENE.forEach(function (g) { if (!edges.some(function (e) { return e.t === g; })) addEdge(pick(HUB), g); });

    var pulses = [], hover = null, ptr = { x: -999, y: -999 }, lastT = 0;

    function resize() {
      var b = el.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(120, b.width); H = Math.max(120, b.height);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    if ("ResizeObserver" in window) new ResizeObserver(function () { resize(); if (reduced) draw(0); }).observe(el);

    function place(t) {
      var px = 22, py = 18;
      nodes.forEach(function (n) {
        var dx = Math.sin(t * 0.0006 + n.ph) * 5, dy = Math.cos(t * 0.0005 + n.ph * 1.3) * 4;
        var x = px + n.u * (W - 2 * px) + dx, y = py + n.v * (H - 2 * py) + dy;
        // el cursor empuja suavemente
        var qx = x - ptr.x, qy = y - ptr.y, q = Math.sqrt(qx * qx + qy * qy);
        if (q < 70 && q > 0.1) { var f = (70 - q) / 70 * 10; x += qx / q * f; y += qy / q * f; }
        n.x = x; n.y = y;
      });
    }

    function fire(n, depth) {
      if (n.ko) return;
      n.ring = 1;
      edges.forEach(function (e) {
        if (e.s === n && e.grow >= 1 && !e.dying) pulses.push({ e: e, p: 0, depth: depth || 0, sp: 0.012 + r() * 0.006 });
      });
    }

    function size(n) { return n.type === "hub" ? 7.5 : n.type === "tf" ? 9 : 6; }

    function shape(n, s) {
      ctx.beginPath();
      if (n.type === "tf") { ctx.moveTo(n.x, n.y - s * 1.15); ctx.lineTo(n.x + s, n.y + s * 0.75); ctx.lineTo(n.x - s, n.y + s * 0.75); ctx.closePath(); }
      else if (n.type === "hub") ctx.rect(n.x - s, n.y - s, s * 2, s * 2);
      else ctx.arc(n.x, n.y, s, 0, 6.2832);
    }

    function downstream(n) {
      var seen = {}, st = [n];
      while (st.length) { var c = st.pop(); edges.forEach(function (e) { if (e.s === c && !seen[e.t.id]) { seen[e.t.id] = true; st.push(e.t); } }); }
      return seen;
    }

    function draw(t) {
      place(t);
      ctx.clearRect(0, 0, W, H);
      var down = hover ? downstream(hover) : null;
      // aristas
      edges.forEach(function (e) {
        var a = e.s, b = e.t, dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / d, uy = dy / d;
        var x1 = a.x + ux * (size(a) + 3), y1 = a.y + uy * (size(a) + 3), x2 = b.x - ux * (size(b) + 4), y2 = b.y - uy * (size(b) + 4);
        var g = Math.max(0, Math.min(1, e.grow)), xe = x1 + (x2 - x1) * g, ye = y1 + (y2 - y1) * g;
        var lit = e.heat > 0.05 || (hover && (e.s === hover || (down && down[e.s.id])));
        var cut = e.s.ko;
        ctx.globalAlpha = (e.dying ? Math.max(0, e.grow) : 1) * (cut ? 0.25 : hover && !lit ? 0.35 : 1);
        ctx.strokeStyle = lit && !cut ? C.line : C.faint;
        ctx.lineWidth = lit && !cut ? 1.6 : 1.1;
        ctx.setLineDash(cut ? [3, 4] : []);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(xe, ye); ctx.stroke();
        ctx.setLineDash([]);
        if (g >= 0.98 && !e.dying) {
          ctx.fillStyle = ctx.strokeStyle;
          if (e.sign > 0) { ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - ux * 6 - uy * 3.2, y2 - uy * 6 + ux * 3.2); ctx.lineTo(x2 - ux * 6 + uy * 3.2, y2 - uy * 6 - ux * 3.2); ctx.closePath(); ctx.fill(); }
          else { ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x2 - uy * 5, y2 + ux * 5); ctx.lineTo(x2 + uy * 5, y2 - ux * 5); ctx.stroke(); }
        }
        e.heat *= 0.94;
        e.x1 = x1; e.y1 = y1; e.x2 = x2; e.y2 = y2;
      });
      ctx.globalAlpha = 1;
      // señales viajando
      pulses.forEach(function (p) {
        var e = p.e, x = e.x1 + (e.x2 - e.x1) * p.p, y = e.y1 + (e.y2 - e.y1) * p.p;
        for (var k = 0; k < 4; k++) {
          var q = Math.max(0, p.p - k * 0.035), tx = e.x1 + (e.x2 - e.x1) * q, ty = e.y1 + (e.y2 - e.y1) * q;
          ctx.globalAlpha = 0.5 - k * 0.12; ctx.fillStyle = e.sign > 0 ? C.line : C.muted;
          ctx.beginPath(); ctx.arc(tx, ty, 2.6 - k * 0.5, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1; ctx.fillStyle = e.sign > 0 ? C.spark : C.muted;
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.2832); ctx.fill();
      });
      // nodos
      nodes.forEach(function (n) {
        var s = size(n) * (1 + n.glow * 0.25 - n.dim * 0.3), focus = hover && (n === hover || (down && down[n.id]));
        ctx.globalAlpha = hover && !focus ? 0.35 : 1;
        if (n.ring > 0.02) {
          ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.globalAlpha *= n.ring * 0.7;
          ctx.beginPath(); ctx.arc(n.x, n.y, s + (1 - n.ring) * 18, 0, 6.2832); ctx.stroke();
          ctx.globalAlpha = hover && !focus ? 0.35 : 1;
        }
        shape(n, s);
        ctx.fillStyle = C.paper; ctx.fill();
        if (n.glow > 0.02 && !n.ko) { ctx.globalAlpha *= Math.min(1, n.glow); ctx.fillStyle = C.line; shape(n, s); ctx.fill(); ctx.globalAlpha = hover && !focus ? 0.35 : 1; }
        ctx.strokeStyle = n.ko ? C.muted : C.line; ctx.lineWidth = n === hover ? 2.4 : 1.6;
        ctx.setLineDash(n.ko ? [2, 2] : []); shape(n, s); ctx.stroke(); ctx.setLineDash([]);
        if (n.ko) { ctx.strokeStyle = C.muted; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(n.x - 4, n.y - 4); ctx.lineTo(n.x + 4, n.y + 4); ctx.moveTo(n.x + 4, n.y - 4); ctx.lineTo(n.x - 4, n.y + 4); ctx.stroke(); }
        if (n === hover || n.ko) {
          ctx.globalAlpha = 1; ctx.font = "500 11px " + C.mono; ctx.textAlign = "center";
          var label = n.id + (n.ko ? " ✕ ko" : ""), ty = n.type === "gene" ? n.y - s - 8 : n.y + s + 15;
          ctx.lineWidth = 4; ctx.strokeStyle = C.paper; ctx.strokeText(label, n.x, ty);
          ctx.fillStyle = n.ko ? C.muted : C.ink; ctx.fillText(label, n.x, ty);
        }
        n.glow *= 0.955; n.dim *= 0.95; n.ring *= 0.93;
      });
      ctx.globalAlpha = 1;
    }

    // avance de las señales y recableado
    var lastFire = 0, lastWire = 0;
    function step(t) {
      pulses = pulses.filter(function (p) {
        if (p.e.s.ko) return false;
        p.p += p.sp;
        if (p.p < 1) return true;
        var e = p.e, b = e.t; e.heat = 1;
        if (e.sign > 0) { b.glow = 1; if (p.depth < 3 && r() < 0.75) setTimeout(function () { fire(b, p.depth + 1); }, 120); }
        else b.dim = 1;
        return false;
      });
      if (t - lastFire > 900) { lastFire = t; var live = TF.concat(HUB).filter(function (n) { return !n.ko; }); if (live.length) fire(pick(live), 0); }
      if (t - lastWire > 3800) {
        lastWire = t;
        var cand = edges.filter(function (e) { return !e.dying && e.grow >= 1 && edges.filter(function (f) { return f.t === e.t && !f.dying; }).length > 1; });
        if (cand.length) pick(cand).dying = true;
        var src = pick(TF.concat(HUB)), dst = pick(GENE.concat(HUB).filter(function (n) { return n !== src; }));
        addEdge(src, dst, true);
      }
      edges.forEach(function (e) { if (e.dying) e.grow -= 0.03; else if (e.grow < 1) e.grow += 0.025; });
      edges = edges.filter(function (e) { return !(e.dying && e.grow <= 0); });
    }

    if (opts.interactive !== false) {
      cv.style.cursor = "crosshair";
      function nearest(e) {
        var b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top, best = null, bd = 18;
        ptr.x = x; ptr.y = y;
        nodes.forEach(function (n) { var d = Math.hypot(n.x - x, n.y - y); if (d < bd) { bd = d; best = n; } });
        return best;
      }
      cv.addEventListener("pointermove", function (e) {
        var n = nearest(e);
        if (n !== hover) { hover = n; if (n) fire(n, 0); }
        cv.style.cursor = n ? "pointer" : "crosshair";
        if (reduced || paused) draw(lastT);
      });
      cv.addEventListener("pointerleave", function () { hover = null; ptr.x = ptr.y = -999; if (reduced || paused) draw(lastT); });
      cv.addEventListener("pointerdown", function (e) {
        var n = nearest(e);
        if (n) { n.ko = !n.ko; if (!n.ko) fire(n, 0); }
        if (reduced || paused) draw(lastT);
      });
    }

    if (reduced) { edges.forEach(function (e) { e.heat = 0; }); draw(0); return { stop: function () {} }; }
    var raf = 0, vis = true, io = null;
    if ("IntersectionObserver" in window) { io = new IntersectionObserver(function (en) { vis = en[0].isIntersecting; }); io.observe(el); }
    fire(TF[0], 0);
    (function tick(t) {
      raf = requestAnimationFrame(tick);
      if (!vis || paused) return;
      lastT = t || 0; step(lastT); draw(lastT);
    })(0);
    return { stop: function () { cancelAnimationFrame(raf); if (io) io.disconnect(); } };
  }

  // Lienzo que llena su contenedor, con colores tomados de los tokens
  function canvasFor(el) {
    var cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "display:block;width:100%;height:100%;touch-action:manipulation;";
    el.appendChild(cv);
    var o = { cv: cv, ctx: cv.getContext("2d"), W: 0, H: 0 };
    o.resize = function () {
      var b = el.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      o.W = Math.max(120, b.width); o.H = Math.max(120, b.height);
      cv.width = Math.round(o.W * dpr); cv.height = Math.round(o.H * dpr);
      o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    o.resize();
    var cs = getComputedStyle(el);
    o.col = function (v, fb) { var c = cs.getPropertyValue(v).trim(); return c || fb; };
    return o;
  }
  function animate(el, frame, onResize, cvs) {
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if ("ResizeObserver" in window) new ResizeObserver(function () { cvs.resize(); if (onResize) onResize(); frame(0, true); }).observe(el);
    if (reduced) { frame(0, true); return { reduced: true, stop: function () {} }; }
    var raf = 0, vis = true, io = null;
    if ("IntersectionObserver" in window) { io = new IntersectionObserver(function (en) { vis = en[0].isIntersecting; }); io.observe(el); }
    (function tick(t) { raf = requestAnimationFrame(tick); if (vis && !paused) frame(t || 0, false); })(0);
    return { reduced: false, stop: function () { cancelAnimationFrame(raf); if (io) io.disconnect(); } };
  }
  function hexA(c, a) {
    var m = /^#([0-9a-f]{6})/i.exec(c);
    if (!m) return c;
    var n = parseInt(m[1], 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }
  function mix(c1, c2, k) {
    var a = /^#([0-9a-f]{6})/i.exec(c1), b = /^#([0-9a-f]{6})/i.exec(c2);
    if (!a || !b) return k < 0.5 ? c1 : c2;
    var x = parseInt(a[1], 16), y = parseInt(b[1], 16), out = "#";
    [16, 8, 0].forEach(function (s) { var v = Math.round((x >> s & 255) * (1 - k) + (y >> s & 255) * k); out += (v < 16 ? "0" : "") + v.toString(16); });
    return out;
  }

  /* Phyllotaxis — la espiral de ángulo áureo con que la planta ordena sus primordios.
     Nacen en el centro y fluyen hacia afuera; una onda la recorre. El cursor revela las
     espirales de Fibonacci (8, 13, 21) como grafo. Clic: la planta alterna entre crecer y resistir.
     opts: { count (320), interactive (true), onState(state) } → { setState('crecer'|'resistir'), stop() } */
  function Phyllotaxis(el, opts) {
    opts = opts || {};
    var o = canvasFor(el), ctx = o.ctx, N = opts.count || 320, GA = Math.PI * (3 - Math.sqrt(5));
    var C = { grow: o.col("--moss", "#2a5530"), dry: o.col("--soil", "#7a4512"), young: o.col("--chlorophyll", "#6f9a35"), faint: o.col("--ink-faint", "#a3a796"), paper: o.col("--paper", "#d8dacf") };
    var s = 0, target = 0, ptr = { x: -999, y: -999, on: false }, lastUser = -1e9, lastAuto = 0, flow = 0, rot = 0, wave = 0, pts = [];
    function setState(name) { target = name === "resistir" ? 1 : 0; if (opts.onState) opts.onState(name); }
    function frame(t, still) {
      var W = o.W, H = o.H, cx = W / 2, cy = H / 2, maxR = Math.min(W, H) * 0.47;
      if (!still) {
        s += (target - s) * 0.06;
        flow = (flow + 0.012 * (1 - s * 0.7)) % 1;
        rot += 0.0009 * (1 - s * 0.6);
        wave = (wave + 1.6 * (1 - s * 0.5)) % (maxR * 1.6);
        if (opts.interactive !== false && t - lastUser > 14000 && t - lastAuto > 9000) { lastAuto = t; setState(target ? "crecer" : "resistir"); }
      }
      var scale = 1 - s * 0.3, c = maxR * scale / Math.sqrt(N);
      ctx.clearRect(0, 0, W, H);
      pts.length = 0;
      for (var i = 0; i < N; i++) {
        var k = i + flow, r = c * Math.sqrt(k), a = k * GA + rot;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), r: r, k: k });
      }
      // grafo de parastiquias cerca del cursor
      if (ptr.on) {
        ctx.lineWidth = 1;
        for (var j = 0; j < N; j++) {
          var p = pts[j], d = Math.hypot(p.x - ptr.x, p.y - ptr.y);
          if (d > 110) continue;
          var al = (1 - d / 110);
          [8, 13, 21].forEach(function (f, fi) {
            var q = pts[j + f]; if (!q) return;
            ctx.strokeStyle = hexA(fi === 1 ? mix(C.grow, C.dry, s) : C.young, al * 0.75);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          });
        }
      }
      for (var m = 0; m < N; m++) {
        var P = pts[m], u = P.r / maxR, fade = Math.min(1, (N - P.k) / 18) * Math.min(1, P.k / 2);
        var w = Math.exp(-Math.pow((P.r - wave) / 14, 2));
        var size = (0.9 + u * 3.3) * (1 - s * 0.4) * (1 + w * 0.5);
        var near = ptr.on ? Math.max(0, 1 - Math.hypot(P.x - ptr.x, P.y - ptr.y) / 110) : 0;
        var base = u < 0.18 ? mix(C.young, C.grow, u / 0.18) : C.grow;
        var colr = mix(base, C.dry, Math.min(1, s * (0.6 + u)));
        ctx.globalAlpha = fade * (0.55 + 0.45 * Math.max(w, near));
        ctx.fillStyle = colr;
        ctx.beginPath(); ctx.arc(P.x, P.y, size * (1 + near * 0.35), 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    var h = animate(el, frame, null, o);
    if (opts.interactive !== false) {
      o.cv.style.cursor = "pointer";
      o.cv.addEventListener("pointermove", function (e) { var b = o.cv.getBoundingClientRect(); ptr.x = e.clientX - b.left; ptr.y = e.clientY - b.top; ptr.on = true; if (h.reduced || paused) frame(0, true); });
      o.cv.addEventListener("pointerleave", function () { ptr.on = false; if (h.reduced || paused) frame(0, true); });
      o.cv.addEventListener("pointerdown", function () {
        lastUser = performance.now(); setState(target ? "crecer" : "resistir");
        if (h.reduced || paused) { s = target; frame(0, true); }
      });
    }
    return { setState: setState, stop: h.stop };
  }

  /* OmicsTracks — capas de datos como pistas de un navegador genómico (genoma, expresión,
     cromatina, fenotipo, ambiente) que avanzan y confluyen en un modelo que predice.
     El cursor es un escáner: lee cada capa y la predicción en ese punto. Clic: control ↔ sequía.
     opts: { seed, line, interactive (true) } */
  function OmicsTracks(el, opts) {
    opts = opts || {};
    if (opts.line) el.setAttribute("data-line", opts.line);
    var o = canvasFor(el), ctx = o.ctx, noise = makeNoise(opts.seed || 21), r = rng(opts.seed || 21);
    var C = { line: o.col("--line", "") || o.col("--water", "#215561"), dry: o.col("--soil", "#7a4512"), faint: o.col("--ink-faint", "#a3a796"), muted: o.col("--ink-muted", "#4c5045"), ink: o.col("--ink", "#1a2119"), spark: o.col("--chlorophyll", "#6f9a35"), paper: o.col("--paper", "#d8dacf"), mono: o.col("--font-mono", "monospace") };
    var TR = ["genoma", "expresión", "cromatina", "fenotipo", "ambiente"];
    var off = 0, dry = 0, dryT = 0, ptr = { x: -1, on: false }, auto = 0, pred = 0.5, seq = [];
    for (var i = 0; i < 4096; i++) seq.push(Math.floor(r() * 4));
    function val(k, x) {
      var z = (x + off) * 0.035, d = dry;
      if (k === 0) return seq[Math.floor((x + off) / 3) & 4095] / 3;
      if (k === 1) return Math.max(0, noise(z, 1.3, d * 2) * 1.3 - 0.25 - d * 0.15);
      if (k === 2) return Math.pow(Math.max(0, noise(z * 0.7, 7.1, 0.5) - 0.35) / 0.65, 2.2);
      if (k === 3) return noise(z * 0.45, 3.7, d) * (1 - d * 0.35);
      return 0.25 + noise(z * 0.25, 9.9, 0) * 0.5 + d * 0.3;
    }
    function frame(t, still) {
      var W = o.W, H = o.H, lab = W < 360 ? 0 : 66, top = W < 360 ? 14 : 6, x0 = lab, x1 = W * 0.7, mx = W * 0.84, my = H / 2, th = (H - top - 8) / TR.length;
      if (!still) { off += 0.45; dry += (dryT - dry) * 0.08; auto = (auto + 0.6) % (x1 - x0); }
      var sx = ptr.on && ptr.x > x0 && ptr.x < x1 ? ptr.x : x0 + auto;
      var lineC = mix(C.line, C.dry, dry);
      ctx.clearRect(0, 0, W, H);
      ctx.font = "500 10px " + C.mono; ctx.textBaseline = "middle";
      var readings = [];
      for (var k = 0; k < TR.length; k++) {
        var y0 = top + k * th, yb = y0 + th - 6, hh = th - 12;
        if (lab) { ctx.fillStyle = C.muted; ctx.textAlign = "left"; ctx.fillText(TR[k], 0, y0 + th / 2); }
        else { ctx.fillStyle = C.muted; ctx.textAlign = "left"; ctx.fillText(TR[k], x0, y0 + 2); }
        ctx.strokeStyle = hexA(C.faint, 0.6); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, yb + 0.5); ctx.lineTo(x1, yb + 0.5); ctx.stroke();
        var colr = k === 4 ? mix(C.line, C.dry, Math.min(1, dry * 1.3)) : lineC;
        if (k === 0) {
          for (var x = x0; x < x1; x += 3) { var v = val(0, x); ctx.fillStyle = hexA(colr, 0.25 + v * 0.6); ctx.fillRect(x, yb - hh * (0.35 + v * 0.3), 2, hh * (0.35 + v * 0.3)); }
        } else if (k === 1) {
          ctx.fillStyle = colr;
          for (var x2 = x0; x2 < x1; x2 += 4) { var v2 = Math.min(1, val(1, x2)); ctx.globalAlpha = 0.85; ctx.fillRect(x2, yb - v2 * hh, 2.5, v2 * hh); }
          ctx.globalAlpha = 1;
        } else if (k === 2) {
          ctx.beginPath(); ctx.moveTo(x0, yb);
          for (var x3 = x0; x3 <= x1; x3 += 2) ctx.lineTo(x3, yb - Math.min(1, val(2, x3)) * hh);
          ctx.lineTo(x1, yb); ctx.closePath(); ctx.fillStyle = hexA(colr, 0.35); ctx.fill();
        } else if (k === 3) {
          ctx.fillStyle = colr;
          for (var x4 = x0 + ((-off) % 9 + 9) % 9; x4 < x1; x4 += 9) { var v4 = val(3, x4); ctx.beginPath(); ctx.arc(x4, yb - v4 * hh, 2, 0, 6.2832); ctx.fill(); }
        } else {
          ctx.strokeStyle = colr; ctx.lineWidth = 1.5; ctx.beginPath();
          for (var x5 = x0; x5 <= x1; x5 += 3) { var y5 = yb - Math.min(1, val(4, x5)) * hh; if (x5 === x0) ctx.moveTo(x5, y5); else ctx.lineTo(x5, y5); }
          ctx.stroke();
        }
        readings.push(Math.min(1, val(k, sx)));
        // confluencia hacia el modelo
        var ey = y0 + th / 2;
        ctx.strokeStyle = hexA(colr, 0.55); ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.lineDashOffset = -off * 0.6;
        ctx.beginPath(); ctx.moveTo(x1 + 4, ey); ctx.bezierCurveTo(x1 + (mx - x1) * 0.6, ey, x1 + (mx - x1) * 0.5, my, mx - 12, my); ctx.stroke();
        ctx.setLineDash([]);
      }
      // escáner
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.globalAlpha = ptr.on ? 0.9 : 0.4;
      ctx.beginPath(); ctx.moveTo(sx + 0.5, top); ctx.lineTo(sx + 0.5, H - 8); ctx.stroke(); ctx.globalAlpha = 1;
      readings.forEach(function (v, k) {
        var yb = top + k * th + th - 6, hh = th - 12;
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(sx, yb - v * (k === 0 ? 0.6 : 1) * hh, 2.6, 0, 6.2832); ctx.fill();
      });
      // modelo y predicción
      var target = Math.max(0, Math.min(1, 0.15 + readings[1] * 0.35 + readings[2] * 0.15 + readings[3] * 0.4 - (readings[4] - 0.5) * 0.4));
      pred += (target - pred) * 0.12;
      ctx.fillStyle = C.paper; ctx.strokeStyle = lineC; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.rect(mx - 11, my - 11, 22, 22); ctx.fill(); ctx.stroke();
      ctx.fillStyle = lineC; ctx.globalAlpha = 0.35 + pred * 0.65; ctx.fillRect(mx - 7, my - 7, 14, 14); ctx.globalAlpha = 1;
      var gx = Math.min(W - 6, mx + 26), gh = H * 0.5, gy = my + gh / 2;
      ctx.strokeStyle = hexA(C.faint, 0.9); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx + 0.5, gy); ctx.lineTo(gx + 0.5, gy - gh); ctx.stroke();
      ctx.strokeStyle = lineC; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(gx + 0.5, gy); ctx.lineTo(gx + 0.5, gy - gh * pred); ctx.stroke();
      ctx.textAlign = "center"; ctx.fillStyle = C.ink; ctx.font = "500 11px " + C.mono;
      ctx.fillText("ŷ " + pred.toFixed(2), mx, my + 26);
      ctx.font = "10px " + C.mono; ctx.fillStyle = C.muted;
      ctx.fillText(dryT ? "sequía" : "control", mx, my - 24);
    }
    var h = animate(el, frame, null, o);
    if (opts.interactive !== false) {
      o.cv.style.cursor = "col-resize";
      o.cv.addEventListener("pointermove", function (e) { var b = o.cv.getBoundingClientRect(); ptr.x = e.clientX - b.left; ptr.on = true; if (h.reduced || paused) frame(0, true); });
      o.cv.addEventListener("pointerleave", function () { ptr.on = false; if (h.reduced || paused) frame(0, true); });
      o.cv.addEventListener("pointerdown", function () { dryT = dryT ? 0 : 1; if (h.reduced || paused) { dry = dryT; frame(0, true); } });
    }
    return { stop: h.stop };
  }

  /* GeneCircuit — circuito genético sintético con notación SBOL: promotor (flecha), RBS (semicírculo),
     secuencia codificante (flecha pentagonal), terminador (T). Dos casetes sensores (sequía, nitrato)
     producen factores de transcripción que viajan hasta el promotor lógico del casete de salida.
     El visitante enciende las señales y cambia la compuerta (Y, O, Y-NO); la salida responde.
     Los controles son botones reales y hay tabla de verdad: se usa con teclado, toque o lector.
     opts: { line, gate ('and'|'or'|'andnot'), labels } */
  function GeneCircuit(el, opts) {
    opts = opts || {};
    var NS = "http://www.w3.org/2000/svg";
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var L = Object.assign({ a: "sequía", b: "nitrato", pa: "p·ABA", pb: "p·NO₃", ta: "TF-A", tb: "TF-B", out: "salida" }, opts.labels || {});
    var GATES = {
      and: { name: "Y", long: "sequía Y nitrato", f: function (a, b) { return a && b; }, signB: 1 },
      or: { name: "O", long: "sequía O nitrato", f: function (a, b) { return a || b; }, signB: 1 },
      andnot: { name: "Y-NO", long: "sequía Y NO nitrato", f: function (a, b) { return a && !b; }, signB: -1 }
    };
    var st = { a: true, b: false, gate: opts.gate || "and", pa: 0, pb: 0, out: 0 };
    el.classList.add("pgr-circuit");
    if (opts.line) el.setAttribute("data-line", opts.line);

    // ── dibujo ──
    var W = 360, H = 232, X0 = 54, ROWS = { a: 44, b: 112, o: 190 };
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("class", "pgr-circuit__svg");
    svg.setAttribute("role", "img");
    function s(tag, attrs, parent) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); (parent || svg).appendChild(n); return n; }
    function txt(x, y, t, cls, parent) { var n = s("text", { x: x, y: y, "class": cls }, parent); n.textContent = t; return n; }

    // líneas de regulación (interacción SBOL): de cada CDS sensora al operador de la salida
    // bajan por la derecha y entran al operador desde arriba, sin cruzarse ni cruzar los casetes
    var regA = s("path", { d: "M 226 " + ROWS.a + " H 250 Q 258 " + ROWS.a + " 258 " + (ROWS.a + 8) + " V 152 Q 258 160 250 160 H 54 Q 46 160 46 168 V " + (ROWS.o - 14), "class": "pgr-circuit__reg" });
    var regB = s("path", { d: "M 226 " + ROWS.b + " H 238 Q 246 " + ROWS.b + " 246 " + (ROWS.b + 8) + " V 142 Q 246 150 238 150 H 38 Q 30 150 30 158 V " + (ROWS.o - 14), "class": "pgr-circuit__reg" });
    var tipA = s("path", { "class": "pgr-circuit__tip" });
    var tipB = s("path", { "class": "pgr-circuit__tip" });

    function cassette(key, y, prom, cds, mod) {
      var g = s("g", { "class": "pgr-circuit__cas", "data-mod": mod });
      s("line", { x1: 14, y1: y, x2: 232, y2: y, "class": "pgr-circuit__dna" }, g);
      // promotor: flecha en ángulo
      s("path", { d: "M " + X0 + " " + y + " v -16 h 14", "class": "pgr-circuit__prom" }, g);
      s("path", { d: "M " + (X0 + 12) + " " + (y - 20) + " l 6 4 l -6 4 z", "class": "pgr-circuit__promtip" }, g);
      txt(X0 - 2, y + 15, prom, "pgr-circuit__lab", g);
      // RBS: semicírculo
      s("path", { d: "M 86 " + y + " a 7 7 0 0 1 14 0", "class": "pgr-circuit__rbs" }, g);
      // CDS: flecha pentagonal
      var cdsD = "M 108 " + (y - 10) + " h 82 l 12 10 l -12 10 h -82 z";
      s("path", { d: cdsD, "class": "pgr-circuit__cdsbg" }, g);
      var cdsEl = s("path", { d: cdsD, "class": "pgr-circuit__cds" }, g);
      txt(146, y + 4, cds, "pgr-circuit__cdslab", g);
      // terminador: T
      s("path", { d: "M 216 " + y + " v -14 M 209 " + (y - 14) + " h 14", "class": "pgr-circuit__term" }, g);
      return { g: g, cds: cdsEl, y: y };
    }
    var CA = cassette("a", ROWS.a, L.pa, L.ta, "sequia");
    var CB = cassette("b", ROWS.b, L.pb, L.tb, "nitrogeno");
    var CO = cassette("o", ROWS.o, "p·lógico", L.out, "salida");
    // operadores del promotor lógico (cajas donde se unen los factores)
    var opB = s("rect", { x: 24, y: ROWS.o - 13, width: 12, height: 9, "class": "pgr-circuit__op", "data-mod": "nitrogeno" });
    var opA = s("rect", { x: 40, y: ROWS.o - 13, width: 12, height: 9, "class": "pgr-circuit__op", "data-mod": "sequia" });
    // señales de entrada (rayos sobre los promotores sensores), clicables
    function signal(y, label, key) {
      var g = s("g", { "class": "pgr-circuit__sig", "data-key": key });
      s("circle", { cx: 26, cy: y - 22, r: 9, "class": "pgr-circuit__sigdot" }, g);
      txt(26, y - 19, key === "a" ? "≈" : "N", "pgr-circuit__siglab", g);
      g.addEventListener("click", function () { toggle(key); });
      return g;
    }
    var SA = signal(ROWS.a, L.a, "a"), SB = signal(ROWS.b, L.b, "b");
    var gateLab = txt(300, ROWS.o + 4, "Y", "pgr-circuit__gate");
    txt(300, ROWS.o + 20, "compuerta", "pgr-circuit__lab");
    var dotsG = s("g", {});
    var caption = document.createElement("p");
    caption.className = "pgr-circuit__eyebrow";
    caption.textContent = "circuito interactivo";
    el.appendChild(caption);
    el.appendChild(svg);

    // ── controles accesibles ──
    var ctr = document.createElement("div");
    ctr.className = "pgr-circuit__ctl";
    ctr.innerHTML =
      '<div class="pgr-circuit__group"><span class="pgr-circuit__label">señales</span>' +
      '<div class="pgr-circuit__inputs" role="group" aria-label="Señales de entrada">' +
      '<button type="button" class="pgr-circuit__in" data-key="a" data-mod="sequia"><span data-name></span><span class="pgr-circuit__in-state" data-state></span></button>' +
      '<button type="button" class="pgr-circuit__in" data-key="b" data-mod="nitrogeno"><span data-name></span><span class="pgr-circuit__in-state" data-state></span></button></div></div>' +
      '<div class="pgr-circuit__group"><span class="pgr-circuit__label">compuerta</span>' +
      '<div class="pgr-seg" role="group" aria-label="Compuerta lógica">' +
      Object.keys(GATES).map(function (k) { return '<button type="button" data-gate="' + k + '">' + GATES[k].name + "</button>"; }).join("") + "</div></div>" +
      '<p class="pgr-circuit__status" role="status" aria-live="polite"><span>salida</span><strong data-result></strong></p>' +
      '<details class="pgr-circuit__details"><summary>ver tabla de verdad</summary>' +
      '<table class="pgr-circuit__tt"><caption>tabla de verdad · <span data-gl></span></caption><thead><tr><th scope="col">' + L.a + '</th><th scope="col">' + L.b + '</th><th scope="col">' + L.out + "</th></tr></thead><tbody></tbody></table></details>";
    el.appendChild(ctr);
    var inBtns = ctr.querySelectorAll(".pgr-circuit__in"), gBtns = ctr.querySelectorAll("[data-gate]");
    inBtns.forEach(function (b) { b.addEventListener("click", function () { toggle(b.dataset.key); }); });
    gBtns.forEach(function (b) { b.addEventListener("click", function () { st.gate = b.dataset.gate; sync(); }); });

    function toggle(k) { st[k] = !st[k]; sync(); }
    function target() { return GATES[st.gate].f(st.a, st.b); }
    function sync() {
      var G = GATES[st.gate];
      inBtns.forEach(function (b) {
        var on = st[b.dataset.key];
        b.setAttribute("aria-pressed", on);
        b.querySelector("[data-name]").textContent = b.dataset.key === "a" ? L.a : L.b;
        b.querySelector("[data-state]").textContent = on ? "encendida" : "apagada";
      });
      gBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.gate === st.gate); });
      gateLab.textContent = G.name;
      ctr.querySelector("[data-gl]").textContent = G.long;
      ctr.querySelector("tbody").innerHTML = [[0, 0], [0, 1], [1, 0], [1, 1]].map(function (r) {
        var o = G.f(!!r[0], !!r[1]), cur = !!r[0] === st.a && !!r[1] === st.b;
        return '<tr' + (cur ? ' class="is-cur"' : "") + "><td>" + (r[0] ? "sí" : "no") + "</td><td>" + (r[1] ? "sí" : "no") + "</td><td>" + (o ? "ON" : "off") + "</td></tr>";
      }).join("");
      SA.classList.toggle("is-on", st.a); SB.classList.toggle("is-on", st.b);
      regB.classList.toggle("is-rep", G.signB < 0);
      var t = target();
      var status = ctr.querySelector(".pgr-circuit__status");
      status.querySelector("[data-result]").textContent = t ? "encendida" : "apagada";
      status.dataset.active = t ? "true" : "false";
      status.setAttribute("aria-label", L.out + ": " + (t ? "encendida" : "apagada") + " (" + L.a + " " + (st.a ? "sí" : "no") + ", " + L.b + " " + (st.b ? "sí" : "no") + ", compuerta " + G.name + ")");
      svg.setAttribute("aria-label", "Circuito genético ilustrativo: dos sensores y una compuerta " + G.name + "; " + L.out + " " + (t ? "encendida" : "apagada") + ".");
      if (reduced || paused) { st.pa = st.a ? 1 : 0; st.pb = st.b ? 1 : 0; st.out = t ? 1 : 0; draw(); }
    }

    // ── animación: polimerasas que transcriben y proteínas que viajan ──
    var pols = [], prots = [], lenA = regA.getTotalLength(), lenB = regB.getTotalLength(), acc = 0;
    function tip(path, len, sign, el2) {
      var p = path.getPointAtLength(len), q = path.getPointAtLength(len - 6), dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1;
      dx /= d; dy /= d;
      el2.setAttribute("d", sign > 0
        ? "M " + p.x + " " + p.y + " L " + (p.x - dx * 6 - dy * 3.5) + " " + (p.y - dy * 6 + dx * 3.5) + " L " + (p.x - dx * 6 + dy * 3.5) + " " + (p.y - dy * 6 - dx * 3.5) + " Z"
        : "M " + (p.x - dy * 6) + " " + (p.y + dx * 6) + " L " + (p.x + dy * 6) + " " + (p.y - dx * 6));
      el2.classList.toggle("is-rep", sign < 0);
    }
    function draw() {
      CA.g.classList.toggle("is-on", st.a); CB.g.classList.toggle("is-on", st.b);
      CA.cds.style.fillOpacity = st.pa; CB.cds.style.fillOpacity = st.pb; CO.cds.style.fillOpacity = st.out;
      CO.g.classList.toggle("is-on", st.out > 0.5);
      opA.style.fillOpacity = st.pa; opB.style.fillOpacity = st.pb;
      regA.classList.toggle("is-on", st.pa > 0.3); regB.classList.toggle("is-on", st.pb > 0.3);
      tip(regA, lenA, 1, tipA); tip(regB, lenB, GATES[st.gate].signB, tipB);
      while (dotsG.firstChild) dotsG.removeChild(dotsG.firstChild);
      pols.forEach(function (p) { s("circle", { cx: p.x, cy: p.y - 5, r: 3.2, "class": "pgr-circuit__pol" }, dotsG); });
      prots.forEach(function (p) { var pt = p.path.getPointAtLength(p.t * p.len); s("circle", { cx: pt.x, cy: pt.y, r: 3, "class": "pgr-circuit__prot", "data-mod": p.mod }, dotsG); });
    }
    function step(dt) {
      var t = target(), k = Math.min(1, dt / 600);
      st.pa += ((st.a ? 1 : 0) - st.pa) * k * 0.9;
      st.pb += ((st.b ? 1 : 0) - st.pb) * k * 0.9;
      var eff = GATES[st.gate].f(st.pa > 0.5, st.pb > 0.5);
      st.out += ((eff ? 1 : 0) - st.out) * k * 0.7;
      acc += dt;
      if (acc > 700) {
        acc = 0;
        if (st.a) pols.push({ x: X0, y: ROWS.a, row: "a" });
        if (st.b) pols.push({ x: X0, y: ROWS.b, row: "b" });
        if (st.out > 0.5) pols.push({ x: X0, y: ROWS.o, row: "o" });
      }
      pols = pols.filter(function (p) {
        p.x += dt * 0.07;
        if (p.x < 204) return true;
        if (p.row === "a") prots.push({ path: regA, len: lenA, t: 0, mod: "sequia" });
        if (p.row === "b") prots.push({ path: regB, len: lenB, t: 0, mod: "nitrogeno" });
        return false;
      });
      prots = prots.filter(function (p) { p.t += dt / 1800; return p.t < 1; });
    }

    var api = { set: function (a, b, gate) { st.a = !!a; st.b = !!b; if (gate) st.gate = gate; sync(); } };
    sync();
    if (reduced) { draw(); api.stop = function () {}; return api; }
    var raf = 0, last = 0, vis = true, io = null;
    if ("IntersectionObserver" in window) { io = new IntersectionObserver(function (en) { vis = en[0].isIntersecting; }); io.observe(el); }
    (function tick(now) {
      raf = requestAnimationFrame(tick);
      now = now || 0; var dt = Math.min(64, now - last); last = now;
      if (!vis) return;
      if (paused) { st.pa = st.a ? 1 : 0; st.pb = st.b ? 1 : 0; st.out = target() ? 1 : 0; pols = []; prots = []; draw(); return; }
      step(dt); draw();
    })(0);
    api.stop = function () { cancelAnimationFrame(raf); if (io) io.disconnect(); };
    return api;
  }

  /* scramble — al pasar el cursor, el texto se desarma en bases y se vuelve a leer, como una secuencia.
     PGR.scramble(root): aplica a todo [data-scramble] dentro de root. */
  function scramble(root) {
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    (root || document).querySelectorAll("[data-scramble]").forEach(function (el) {
      var text = el.textContent, busy = false;
      if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", text); // el nombre accesible no cambia durante el efecto
      function run() {
        if (busy || paused) return; busy = true;
        var frame = 0, total = Math.min(12, text.length + 4); // 12 × 28 ms ≈ 340 ms: estable antes de 400 ms
        (function tick() {
          var out = "";
          for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            out += ch === " " || i < (frame / total) * text.length ? ch : BASES[Math.floor(Math.random() * 4)];
          }
          el.textContent = out;
          if (++frame <= total) setTimeout(tick, 28); else { el.textContent = text; busy = false; }
        })();
      }
      el.addEventListener("pointerenter", run);
      el.addEventListener("focus", run);
    });
  }

  /* Network — red génica con notación de redes: triángulo = factor de transcripción,
     círculo = gen, cuadrado = hub. Flecha = activa, barra plana = reprime.
     PGR.Network(el, { nodes:[{id,type:'tf'|'gene'|'hub',module,note}], edges:[{s,t,sign:1|-1}],
                        states:{nombre:[ids encendidos]}, state, onSelect(node) }) */
  function Network(el, data) {
    // En pantallas angostas la red se apila en vertical (nitrógeno arriba, sequía abajo) para que las etiquetas se lean
    var NS = "http://www.w3.org/2000/svg", W = 960, H = 540, vert = false;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var r = rng(data.seed || 5), byId = {}, nodes = data.nodes.map(function (n) { var c = Object.assign({}, n); byId[c.id] = c; return c; });
    var edges = data.edges.map(function (e) { return { s: byId[e.s], t: byId[e.t], sign: e.sign }; });
    function center(n) {
      var k = n.module === "nitrogeno" ? 0.27 : n.module === "sequia" ? 0.73 : 0.5;
      return vert ? { x: W / 2, y: H * k } : { x: W * k, y: H / 2 };
    }
    nodes.forEach(function (n) { n.deg = edges.filter(function (e) { return e.s === n || e.t === n; }).length; });
    function seed() {
      var q = rng(data.seed || 5);
      nodes.forEach(function (n) {
        var c = center(n);
        n.x = c.x + (q() - 0.5) * (vert ? 320 : 260); n.y = c.y + (q() - 0.5) * (vert ? 240 : 300); n.vx = n.vy = 0; n.fixed = false;
      });
    }
    function sim(iter, alpha) {
      for (var k = 0; k < iter; k++) {
        var a = alpha * (1 - k / iter);
        for (var i = 0; i < nodes.length; i++) for (var j = i + 1; j < nodes.length; j++) {
          var A = nodes[i], B = nodes[j], dx = B.x - A.x, dy = B.y - A.y, d2 = dx * dx + dy * dy + 0.01, d = Math.sqrt(d2);
          var f = 15000 / d2 * a; dx /= d; dy /= d;
          if (!A.fixed) { A.vx -= dx * f; A.vy -= dy * f; } if (!B.fixed) { B.vx += dx * f; B.vy += dy * f; }
        }
        edges.forEach(function (e) {
          var dx = e.t.x - e.s.x, dy = e.t.y - e.s.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - 118) * 0.05 * a;
          dx /= d; dy /= d;
          if (!e.s.fixed) { e.s.vx += dx * f; e.s.vy += dy * f; } if (!e.t.fixed) { e.t.vx -= dx * f; e.t.vy -= dy * f; }
        });
        nodes.forEach(function (n) {
          var c = center(n);
          n.vx += (c.x - n.x) * (vert ? 0.012 : 0.008) * a; n.vy += (c.y - n.y) * (vert ? 0.008 : 0.01) * a;
          if (n.fixed) { n.vx = n.vy = 0; return; }
          n.x += n.vx; n.y += n.vy; n.vx *= 0.6; n.vy *= 0.6;
          n.x = Math.max(50, Math.min(W - 50, n.x)); n.y = Math.max(40, Math.min(H - 44, n.y));
        });
      }
    }
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "pgr-net");
    svg.setAttribute("role", "group"); svg.setAttribute("aria-label", data.label || "Red génica");
    var uid = "n" + Math.floor(r() * 1e6), defs = "";
    ["base", "nitrogeno", "sequia", "cruce"].forEach(function (k) {
      defs += '<marker id="' + uid + '-a-' + k + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L9 5 L0 9 z" class="pgr-net__tip pgr-net__tip--' + k + '"/></marker>' +
        '<marker id="' + uid + '-b-' + k + '" viewBox="0 0 4 12" refX="2" refY="6" markerWidth="4" markerHeight="12" orient="auto"><rect x="0.5" y="0" width="3" height="12" class="pgr-net__tip pgr-net__tip--' + k + '"/></marker>';
    });
    svg.innerHTML = "<defs>" + defs + "</defs>";
    function mark(e, hot) { e.el.setAttribute("marker-end", "url(#" + uid + "-" + (e.sign < 0 ? "b" : "a") + "-" + (hot ? e.s.module : "base") + ")"); }
    var gE = document.createElementNS(NS, "g"), gN = document.createElementNS(NS, "g");
    svg.appendChild(gE); svg.appendChild(gN); el.appendChild(svg);

    edges.forEach(function (e) {
      var ln = document.createElementNS(NS, "line");
      ln.setAttribute("class", "pgr-net__edge" + (e.sign < 0 ? " is-rep" : ""));
      ln.setAttribute("data-module", e.s.module);
      gE.appendChild(ln); e.el = ln; mark(e, false);
    });
    nodes.forEach(function (n) {
      var g = document.createElementNS(NS, "g"), sh;
      g.setAttribute("class", "pgr-net__node is-" + n.type); g.setAttribute("data-module", n.module);
      g.setAttribute("tabindex", "0"); g.setAttribute("role", "button");
      g.setAttribute("aria-label", n.id + ", " + ({ tf: "factor de transcripción", gene: "gen", hub: "hub" })[n.type] + ", " + n.deg + " conexiones");
      if (n.type === "tf") { sh = document.createElementNS(NS, "path"); sh.setAttribute("d", "M0 -17 L15 11 L-15 11 Z"); }
      else if (n.type === "hub") { sh = document.createElementNS(NS, "rect"); sh.setAttribute("x", -14); sh.setAttribute("y", -14); sh.setAttribute("width", 28); sh.setAttribute("height", 28); }
      else { sh = document.createElementNS(NS, "circle"); sh.setAttribute("r", 10); }
      sh.setAttribute("class", "pgr-net__shape");
      var tx = document.createElementNS(NS, "text"); tx.textContent = n.id; tx.setAttribute("class", "pgr-net__label"); tx.setAttribute("y", n.type === "hub" ? 34 : n.type === "tf" ? 31 : 29);
      g.appendChild(sh); g.appendChild(tx); gN.appendChild(g); n.el = g;
    });

    function draw() {
      edges.forEach(function (e) {
        var dx = e.t.x - e.s.x, dy = e.t.y - e.s.y, d = Math.sqrt(dx * dx + dy * dy) || 1, pad = e.t.type === "hub" ? 20 : e.t.type === "tf" ? 17 : 15;
        e.el.setAttribute("x1", e.s.x + dx / d * 14); e.el.setAttribute("y1", e.s.y + dy / d * 14);
        e.el.setAttribute("x2", e.t.x - dx / d * pad); e.el.setAttribute("y2", e.t.y - dy / d * pad);
      });
      nodes.forEach(function (n) { n.el.setAttribute("transform", "translate(" + n.x.toFixed(1) + " " + n.y.toFixed(1) + ")"); });
    }
    function layout() {
      vert = (el.clientWidth || 960) < 560;
      W = vert ? 520 : 960; H = vert ? 760 : 540;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      seed(); sim(400, 1); draw();
    }
    layout();
    if ("ResizeObserver" in window) new ResizeObserver(function () { if (((el.clientWidth || 960) < 560) !== vert) layout(); }).observe(el);

    var on = {};
    function setState(name) {
      on = {}; (data.states[name] || []).forEach(function (id) { on[id] = true; });
      nodes.forEach(function (n) { n.el.classList.toggle("is-on", !!on[n.id]); });
      edges.forEach(function (e) { e.el.classList.toggle("is-on", !!on[e.s.id]); mark(e, !!on[e.s.id]); });
    }
    setState(data.state || Object.keys(data.states)[0]);

    function focusNode(n) {
      svg.classList.toggle("is-focus", !!n);
      var nb = {}; if (n) { nb[n.id] = true; edges.forEach(function (e) { if (e.s === n) nb[e.t.id] = true; if (e.t === n) nb[e.s.id] = true; }); }
      nodes.forEach(function (m) { m.el.classList.toggle("is-near", !!nb[m.id]); });
      edges.forEach(function (e) { var near = !!n && (e.s === n || e.t === n); e.el.classList.toggle("is-near", near); mark(e, near || !!on[e.s.id]); });
      if (data.onSelect) data.onSelect(n ? Object.assign({ targets: edges.filter(function (e) { return e.s === n; }).map(function (e) { return { id: e.t.id, sign: e.sign }; }), sources: edges.filter(function (e) { return e.t === n; }).map(function (e) { return { id: e.s.id, sign: e.sign }; }) }, n) : null);
    }

    // arrastre: el nodo se fija donde lo sueltas y la red se reacomoda
    var drag = null;
    function pt(e) { var b = svg.getBoundingClientRect(); return { x: (e.clientX - b.left) / b.width * W, y: (e.clientY - b.top) / b.height * H }; }
    nodes.forEach(function (n) {
      n.el.addEventListener("pointerenter", function (e) { if (!drag && e.pointerType !== "touch") focusNode(n); });
      n.el.addEventListener("focus", function () { focusNode(n); });
      n.el.addEventListener("pointerdown", function (e) {
        e.stopPropagation(); focusNode(n);
        if (e.pointerType === "touch") return; // en táctil: tocar selecciona; arrastrar desplaza la página
        drag = n; n.fixed = true; n.el.setPointerCapture(e.pointerId); e.preventDefault();
      });
      n.el.addEventListener("keydown", function (e) { if (e.key === "Escape") { n.el.blur(); focusNode(null); } });
    });
    svg.addEventListener("pointermove", function (e) {
      if (!drag) return; var p = pt(e); drag.x = p.x; drag.y = p.y; sim(3, 0.35); draw();
    });
    svg.addEventListener("pointerup", function () { if (drag) { drag.fixed = false; drag = null; } });
    svg.addEventListener("pointercancel", function () { if (drag) { drag.fixed = false; drag = null; } });
    svg.addEventListener("pointerleave", function (e) { if (!drag && e.pointerType !== "touch") focusNode(null); });
    svg.addEventListener("pointerdown", function () { focusNode(null); }); // tocar el fondo limpia la selección

    // respiración leve: la red nunca queda del todo quieta
    var raf = 0, t = 0, io = null, vis = true;
    if (!reduced) {
      if ("IntersectionObserver" in window) { io = new IntersectionObserver(function (en) { vis = en[0].isIntersecting; }); io.observe(el); }
      nodes.forEach(function (n) { n.ph = r() * 6.28; n.bx = n.x; n.by = n.y; });
      (function tick() {
        raf = requestAnimationFrame(tick); if (!vis || drag || paused) return; t += 0.012;
        nodes.forEach(function (n) { if (!n.fixed) { n.x += Math.sin(t + n.ph) * 0.06; n.y += Math.cos(t * 0.8 + n.ph) * 0.06; } });
        draw();
      })();
    }
    return { setState: setState, focus: function (id) { focusNode(byId[id] || null); }, stop: function () { cancelAnimationFrame(raf); if (io) io.disconnect(); } };
  }

  window.PGR = { AsciiField: AsciiField, RootGrowth: RootGrowth, Helix: Helix, Network: Network, PulseGraph: PulseGraph, Phyllotaxis: Phyllotaxis, OmicsTracks: OmicsTracks, GeneCircuit: GeneCircuit, scramble: scramble,
    setPaused: setPaused, isPaused: function () { return paused; } };
})();
