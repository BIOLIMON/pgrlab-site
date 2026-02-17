import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Member } from '../types';

// ── Types ──────────────────────────────────────────────────────
interface GraphNode {
    member: Member;
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

interface TeamGraphProps {
    members: Member[];
}

// ── Seeded random for consistent connections ───────────────────
function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

// ── Generate random edges (3-4 per node) ───────────────────────
function generateEdges(count: number): Edge[] {
    const rand = seededRandom(42);
    const edges: Edge[] = [];
    const edgeSet = new Set<string>();

    const addEdge = (a: number, b: number) => {
        const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
        if (a !== b && !edgeSet.has(key)) {
            edgeSet.add(key);
            edges.push({ source: a, target: b });
        }
    };

    // Ensure each node has at least 2 connections
    for (let i = 0; i < count; i++) {
        let connections = 0;
        // Count existing connections
        for (const e of edges) {
            if (e.source === i || e.target === i) connections++;
        }
        while (connections < 2) {
            const target = Math.floor(rand() * count);
            if (target !== i) {
                const key = `${Math.min(i, target)}-${Math.max(i, target)}`;
                if (!edgeSet.has(key)) {
                    addEdge(i, target);
                    connections++;
                }
            }
        }
    }

    // Add extra random connections (target ~3 per node)
    for (let i = 0; i < count; i++) {
        let connections = 0;
        for (const e of edges) {
            if (e.source === i || e.target === i) connections++;
        }
        const targetConns = 3 + Math.floor(rand() * 2); // 3 or 4
        while (connections < targetConns) {
            const target = Math.floor(rand() * count);
            if (target !== i) {
                const key = `${Math.min(i, target)}-${Math.max(i, target)}`;
                if (!edgeSet.has(key)) {
                    addEdge(i, target);
                    connections++;
                }
            }
        }
    }

    return edges;
}

// ── Constants ──────────────────────────────────────────────────
const NODE_RADIUS = 32;
const REPULSION = 8000;
const SPRING_LENGTH = 200;
const SPRING_K = 0.002;
const GRAVITY = 0.015;
const DAMPING = 0.92;
const DRIFT = 0.15;
const DT = 1;

// ── Main Component ─────────────────────────────────────────────
export const TeamGraph: React.FC<TeamGraphProps> = ({ members }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<GraphNode[]>([]);
    const edgesRef = useRef<Edge[]>([]);
    const animRef = useRef<number>(0);
    const dragRef = useRef<{ index: number; offsetX: number; offsetY: number } | null>(null);
    const hoverRef = useRef<number>(-1);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
    const mouseDownTimeRef = useRef<number>(0);
    const mouseMoved = useRef(false);

    // ── Initialize nodes & edges ──────────────────────────────
    useEffect(() => {
        const rand = seededRandom(123);
        const cx = canvasSize.w / 2;
        const cy = canvasSize.h / 2;

        const nodes: GraphNode[] = members.map((member) => {
            const angle = rand() * Math.PI * 2;
            const dist = 100 + rand() * 150;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = member.image;
            const node: GraphNode = {
                member,
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
        edgesRef.current = generateEdges(members.length);
    }, [members, canvasSize.w, canvasSize.h]);

    // ── Resize handler ────────────────────────────────────────
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setCanvasSize({ w: rect.width, h: Math.max(550, Math.min(700, window.innerHeight * 0.7)) });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // ── Physics simulation + render ───────────────────────────
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

            // ── Apply forces ──
            for (let i = 0; i < nodes.length; i++) {
                if (dragRef.current && dragRef.current.index === i) continue;

                let fx = 0, fy = 0;

                // Repulsion (all pairs)
                for (let j = 0; j < nodes.length; j++) {
                    if (i === j) continue;
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = REPULSION / (dist * dist);
                    fx += (dx / dist) * force;
                    fy += (dy / dist) * force;
                }

                // Spring attraction (connected edges)
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

                // Central gravity
                fx += (cx - nodes[i].x) * GRAVITY;
                fy += (cy - nodes[i].y) * GRAVITY;

                // Update velocity + position
                nodes[i].vx = (nodes[i].vx + fx * DT) * DAMPING;
                nodes[i].vy = (nodes[i].vy + fy * DT) * DAMPING;
                nodes[i].x += nodes[i].vx * DT;
                nodes[i].y += nodes[i].vy * DT;

                // Keep in bounds with padding
                const pad = NODE_RADIUS + 10;
                nodes[i].x = Math.max(pad, Math.min(canvasSize.w - pad, nodes[i].x));
                nodes[i].y = Math.max(pad, Math.min(canvasSize.h - pad, nodes[i].y));
            }

            // ── Render ──
            ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

            const hovIdx = hoverRef.current;

            // Draw edges
            for (const edge of edges) {
                const a = nodes[edge.source];
                const b = nodes[edge.target];
                const isHighlighted = hovIdx === edge.source || hovIdx === edge.target;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = isHighlighted ? 'rgba(6, 182, 212, 0.5)' : 'rgba(148, 163, 184, 0.2)';
                ctx.lineWidth = isHighlighted ? 2 : 1;
                ctx.stroke();
            }

            // Draw nodes
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const isHovered = hovIdx === i;
                const r = isHovered ? node.radius + 4 : node.radius;

                // Glow for hovered
                if (isHovered) {
                    ctx.save();
                    ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
                    ctx.shadowBlur = 20;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, r + 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
                    ctx.fill();
                    ctx.restore();
                }

                // White circle border
                ctx.beginPath();
                ctx.arc(node.x, node.y, r + 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.strokeStyle = isHovered ? '#06b6d4' : '#e2e8f0';
                ctx.lineWidth = isHovered ? 2.5 : 2;
                ctx.stroke();

                // Clip for circular photo
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
                ctx.clip();

                if (node.imageLoaded && node.image) {
                    // Draw image covering the circle, respecting imagePosition
                    const img = node.image;
                    const imgAspect = img.naturalWidth / img.naturalHeight;
                    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

                    if (imgAspect > 1) {
                        // Wider than tall
                        sw = img.naturalHeight;
                        sx = (img.naturalWidth - sw) / 2;
                    } else {
                        // Taller than wide — use imagePosition to control vertical offset
                        sh = img.naturalWidth;
                        const posMatch = node.member.imagePosition?.match(/(\d+)%/);
                        const vertPercent = posMatch ? parseInt(posMatch[1]) / 100 : 0;
                        sy = (img.naturalHeight - sh) * vertPercent;
                    }

                    ctx.drawImage(img, sx, sy, sw, sh, node.x - r, node.y - r, r * 2, r * 2);
                } else {
                    // Placeholder
                    ctx.fillStyle = '#e2e8f0';
                    ctx.fillRect(node.x - r, node.y - r, r * 2, r * 2);
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = 'bold 14px Inter, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(node.member.name.charAt(0), node.x, node.y);
                }

                ctx.restore();

                // Name label
                const firstName = node.member.name.split(' ')[0];
                // Short name like "PhD José" -> use first two words
                const displayName = node.member.name.startsWith('PhD')
                    ? node.member.name.split(' ').slice(0, 2).join(' ')
                    : firstName;

                ctx.font = `${isHovered ? 'bold ' : ''}11px Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';

                // Text background
                const textWidth = ctx.measureText(displayName).width;
                const textX = node.x;
                const textY = node.y + r + 6;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.beginPath();
                ctx.roundRect(textX - textWidth / 2 - 4, textY - 2, textWidth + 8, 16, 4);
                ctx.fill();

                ctx.fillStyle = isHovered ? '#06b6d4' : '#334155';
                ctx.fillText(displayName, textX, textY);
            }

            animRef.current = requestAnimationFrame(simulate);
        };

        animRef.current = requestAnimationFrame(simulate);
        return () => cancelAnimationFrame(animRef.current);
    }, [canvasSize]);

    // ── Find node at position ─────────────────────────────────
    const findNodeAt = useCallback((x: number, y: number): number => {
        const nodes = nodesRef.current;
        for (let i = nodes.length - 1; i >= 0; i--) {
            const dx = x - nodes[i].x;
            const dy = y - nodes[i].y;
            if (dx * dx + dy * dy <= (nodes[i].radius + 6) ** 2) return i;
        }
        return -1;
    }, []);

    // ── Get position from event ───────────────────────────────
    const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0]?.clientX ?? (e as React.TouchEvent).changedTouches[0]?.clientX ?? 0 : e.clientX;
        const clientY = 'touches' in e ? e.touches[0]?.clientY ?? (e as React.TouchEvent).changedTouches[0]?.clientY ?? 0 : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }, []);

    // ── Mouse / Touch handlers ────────────────────────────────
    const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
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
    }, [findNodeAt, getPos]);

    const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const pos = getPos(e);

        if (dragRef.current) {
            const node = nodesRef.current[dragRef.current.index];
            node.x = pos.x - dragRef.current.offsetX;
            node.y = pos.y - dragRef.current.offsetY;
            node.vx = 0;
            node.vy = 0;
            mouseMoved.current = true;
        }

        // Hover detection
        const idx = findNodeAt(pos.x, pos.y);
        hoverRef.current = idx;
        if (canvasRef.current) {
            canvasRef.current.style.cursor = idx >= 0 ? 'grab' : 'default';
            if (dragRef.current) canvasRef.current.style.cursor = 'grabbing';
        }
    }, [findNodeAt, getPos]);

    const handlePointerUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (dragRef.current) {
            const elapsed = Date.now() - mouseDownTimeRef.current;
            // Click = short press without much movement
            if (elapsed < 300 && !mouseMoved.current) {
                const member = nodesRef.current[dragRef.current.index].member;
                setSelectedMember(member);
            }
            dragRef.current = null;
        }
    }, []);

    // ── Render ────────────────────────────────────────────────
    return (
        <div ref={containerRef} className="relative w-full" style={{ minHeight: canvasSize.h }}>
            <canvas
                ref={canvasRef}
                style={{ width: canvasSize.w, height: canvasSize.h }}
                className="block mx-auto"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={() => { dragRef.current = null; hoverRef.current = -1; }}
                onTouchStart={handlePointerDown}
                onTouchMove={(e) => { e.preventDefault(); handlePointerMove(e); }}
                onTouchEnd={handlePointerUp}
            />

            {/* Detail popup */}
            {selectedMember && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                        >
                            ✕
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-5">
                                <div className="absolute inset-0 bg-cyan-100 rounded-full blur-xl opacity-50 transform scale-90 translate-y-2"></div>
                                <img
                                    src={selectedMember.image}
                                    alt={selectedMember.name}
                                    className="relative w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white mx-auto"
                                    style={{ objectPosition: selectedMember.imagePosition || 'center top' }}
                                />
                            </div>
                            <div className="text-cyan-600 font-bold text-xs uppercase tracking-widest mb-1">
                                {selectedMember.role}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{selectedMember.name}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-4">{selectedMember.bio}</p>
                            {selectedMember.orcid && (
                                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        ORCID {selectedMember.orcid}
                                    </span>
                                    <a
                                        href={`https://orcid.org/${selectedMember.orcid}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-slate-400 hover:text-[#A6CE39] transition-colors"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                            <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.306v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.584-3.722-4.097-3.722h-2.222z" />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .animate-in {
          animation: popIn 0.25s ease-out;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
};
