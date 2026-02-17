import React, { useEffect, useRef, useState, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface Affiliation {
  name: string;
  image: string;
  url: string;
}

interface GraphNode {
  aff: Affiliation;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  image: HTMLImageElement | null;
  imageLoaded: boolean;
}

interface Edge {
  source: number;
  target: number;
}

// ── Affiliations data ──────────────────────────────────────────
const affiliations: Affiliation[] = [
  {
    name: 'PhytoLearning',
    image: '/images/affiliations/phytolearning.png',
    url: 'https://phytolearning.cl/',
  },
  { name: 'iBio', image: '/images/affiliations/ibio.png', url: 'https://www.ibio.cl/' },
  { name: 'CBV UNAB', image: '/images/affiliations/cbv.png', url: 'https://cbv.unab.cl/' },
  {
    name: 'Fac. Cs. Vida',
    image: '/images/affiliations/facultad_unab.jpg',
    url: 'https://facultades.unab.cl/cienciasdelavida/',
  },
  {
    name: 'EMBO',
    image: '/images/affiliations/embo.svg',
    url: 'https://people.embo.org/profile/jose-m-alvarez',
  },
  { name: 'UNAB', image: '/images/affiliations/unab.png', url: 'https://www.unab.cl/' },
];

// ── Generate edges (connect all in a mesh for 6 nodes) ─────────
function generateEdges(count: number): Edge[] {
  const edges: Edge[] = [];
  // With only 6 nodes, connect each to 2-3 others for a nice web
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      // Skip some connections to avoid full mesh
      if ((i + j) % 3 === 0 && i !== 0) continue;
      edges.push({ source: i, target: j });
    }
  }
  return edges;
}

// ── Constants ──────────────────────────────────────────────────
const NODE_RADIUS = 28;
const REPULSION = 4000;
const SPRING_LENGTH = 120;
const SPRING_K = 0.003;
const GRAVITY = 0.02;
const DAMPING = 0.9;
const DT = 1;

// ── Component ──────────────────────────────────────────────────
export const AffiliationsGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const animRef = useRef<number>(0);
  const dragRef = useRef<{ index: number; offsetX: number; offsetY: number } | null>(null);
  const hoverRef = useRef<number>(-1);
  const [canvasSize, setCanvasSize] = useState({ w: 400, h: 300 });
  const mouseDownTimeRef = useRef<number>(0);
  const mouseMoved = useRef(false);

  // ── Initialize ────────────────────────────────────────────
  useEffect(() => {
    const cx = canvasSize.w / 2;
    const cy = canvasSize.h / 2;
    const count = affiliations.length;

    const nodes: GraphNode[] = affiliations.map((aff, i) => {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const dist = 60 + Math.random() * 40;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = aff.image;
      const node: GraphNode = {
        aff,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: NODE_RADIUS,
        image: null,
        imageLoaded: false,
      };
      img.onload = () => {
        node.image = img;
        node.imageLoaded = true;
      };
      return node;
    });

    nodesRef.current = nodes;
    edgesRef.current = generateEdges(count);
  }, [canvasSize.w, canvasSize.h]);

  // ── Resize ────────────────────────────────────────────────
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ w: rect.width, h: 300 });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // ── Physics + Render ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.w * dpr;
    canvas.height = canvasSize.h * dpr;
    ctx.scale(dpr, dpr);

    const simulate = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const cx = canvasSize.w / 2;
      const cy = canvasSize.h / 2;

      for (let i = 0; i < nodes.length; i++) {
        if (dragRef.current && dragRef.current.index === i) continue;

        let fx = 0,
          fy = 0;

        // Repulsion
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = REPULSION / (dist * dist);
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }

        // Springs
        for (const edge of edges) {
          let other = -1;
          if (edge.source === i) other = edge.target;
          else if (edge.target === i) other = edge.source;
          if (other < 0) continue;
          const dx = nodes[other].x - nodes[i].x;
          const dy = nodes[other].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const displacement = dist - SPRING_LENGTH;
          fx += (dx / dist) * displacement * SPRING_K;
          fy += (dy / dist) * displacement * SPRING_K;
        }

        // Gravity
        fx += (cx - nodes[i].x) * GRAVITY;
        fy += (cy - nodes[i].y) * GRAVITY;

        nodes[i].vx = (nodes[i].vx + fx * DT) * DAMPING;
        nodes[i].vy = (nodes[i].vy + fy * DT) * DAMPING;
        nodes[i].x += nodes[i].vx * DT;
        nodes[i].y += nodes[i].vy * DT;

        const pad = NODE_RADIUS + 10;
        nodes[i].x = Math.max(pad, Math.min(canvasSize.w - pad, nodes[i].x));
        nodes[i].y = Math.max(pad, Math.min(canvasSize.h - pad, nodes[i].y));
      }

      // ── Render ──
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
      const hovIdx = hoverRef.current;

      // Edges
      for (const edge of edges) {
        const a = nodes[edge.source];
        const b = nodes[edge.target];
        const isHl = hovIdx === edge.source || hovIdx === edge.target;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = isHl ? 'rgba(6, 182, 212, 0.45)' : 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = isHl ? 1.5 : 1;
        ctx.stroke();
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isHovered = hovIdx === i;
        const r = isHovered ? node.radius + 3 : node.radius;

        if (isHovered) {
          ctx.save();
          ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
          ctx.fill();
          ctx.restore();
        }

        // White circle bg
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#06b6d4' : '#e2e8f0';
        ctx.lineWidth = isHovered ? 2 : 1.5;
        ctx.stroke();

        // Logo
        if (node.imageLoaded && node.image) {
          const img = node.image;
          const padding = 8;
          const drawSize = (r - padding) * 2;
          const imgAspect = img.naturalWidth / img.naturalHeight;
          let dw: number, dh: number;
          if (imgAspect > 1) {
            dw = drawSize;
            dh = drawSize / imgAspect;
          } else {
            dh = drawSize;
            dw = drawSize * imgAspect;
          }
          ctx.drawImage(img, node.x - dw / 2, node.y - dh / 2, dw, dh);
        } else {
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.aff.name.charAt(0), node.x, node.y);
        }

        // Label
        ctx.font = `${isHovered ? 'bold ' : ''}9px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const textWidth = ctx.measureText(node.aff.name).width;
        const textX = node.x;
        const textY = node.y + r + 5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.roundRect(textX - textWidth / 2 - 3, textY - 1, textWidth + 6, 13, 3);
        ctx.fill();
        ctx.fillStyle = isHovered ? '#06b6d4' : '#64748b';
        ctx.fillText(node.aff.name, textX, textY);
      }

      animRef.current = requestAnimationFrame(simulate);
    };

    animRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animRef.current);
  }, [canvasSize]);

  // ── Hit test ──────────────────────────────────────────────
  const findNodeAt = useCallback((x: number, y: number): number => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const dx = x - nodes[i].x;
      const dy = y - nodes[i].y;
      if (dx * dx + dy * dy <= (nodes[i].radius + 6) ** 2) return i;
    }
    return -1;
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX =
      'touches' in e
        ? (e.touches[0]?.clientX ?? (e as React.TouchEvent).changedTouches[0]?.clientX ?? 0)
        : e.clientX;
    const clientY =
      'touches' in e
        ? (e.touches[0]?.clientY ?? (e as React.TouchEvent).changedTouches[0]?.clientY ?? 0)
        : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  // ── Interactions ──────────────────────────────────────────
  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const pos = getPos(e);
      const idx = findNodeAt(pos.x, pos.y);
      if (idx >= 0) {
        dragRef.current = {
          index: idx,
          offsetX: pos.x - nodesRef.current[idx].x,
          offsetY: pos.y - nodesRef.current[idx].y,
        };
        nodesRef.current[idx].vx = 0;
        nodesRef.current[idx].vy = 0;
        mouseDownTimeRef.current = Date.now();
        mouseMoved.current = false;
      }
    },
    [findNodeAt, getPos],
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const pos = getPos(e);
      if (dragRef.current) {
        const node = nodesRef.current[dragRef.current.index];
        node.x = pos.x - dragRef.current.offsetX;
        node.y = pos.y - dragRef.current.offsetY;
        node.vx = 0;
        node.vy = 0;
        mouseMoved.current = true;
      }
      const idx = findNodeAt(pos.x, pos.y);
      hoverRef.current = idx;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = idx >= 0 ? 'grab' : 'default';
        if (dragRef.current) canvasRef.current.style.cursor = 'grabbing';
      }
    },
    [findNodeAt, getPos],
  );

  const handlePointerUp = useCallback(() => {
    if (dragRef.current) {
      const elapsed = Date.now() - mouseDownTimeRef.current;
      if (elapsed < 300 && !mouseMoved.current) {
        const aff = nodesRef.current[dragRef.current.index].aff;
        window.open(aff.url, '_blank');
      }
      dragRef.current = null;
    }
  }, []);

  return (
    <div ref={containerRef} className='relative w-full'>
      <canvas
        ref={canvasRef}
        style={{ width: canvasSize.w, height: canvasSize.h }}
        className='block mx-auto'
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => {
          dragRef.current = null;
          hoverRef.current = -1;
        }}
        onTouchStart={handlePointerDown}
        onTouchMove={(e) => {
          e.preventDefault();
          handlePointerMove(e);
        }}
        onTouchEnd={handlePointerUp}
      />
    </div>
  );
};
