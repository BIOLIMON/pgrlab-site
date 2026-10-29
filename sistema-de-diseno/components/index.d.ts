/** PGR Lab — motivos ASCII vivos (window.PGR). Los demás componentes son clases CSS de bundle.css. */

/** Línea de investigación: fija el color (`--line`) de un motivo o etiqueta. */
export type ResearchLine = "redes" | "sequia" | "nitrogeno" | "omica";

export interface MotifHandle {
  /** Detiene la animación y libera observadores. */
  stop(): void;
}

export interface AsciiFieldProps {
  /** 0–1, proporción de celdas con carácter. Por defecto 0.5. */
  density?: number;
  /** Multiplicador de velocidad del ruido. Por defecto 1. */
  speed?: number;
  /** Semilla: mismo valor, mismo campo. */
  seed?: number;
  /** Colorea las bases con el color de la línea. */
  line?: ResearchLine;
  /** Cuadros por segundo. Por defecto 8. */
  fps?: number;
  cols?: number;
  rows?: number;
}

export interface RootGrowthProps {
  seed?: number;
  line?: ResearchLine;
  /** 0–1, probabilidad de ramificación. Por defecto 0.16. */
  branch?: number;
  /** Por defecto 6. */
  fps?: number;
  cols?: number;
  rows?: number;
}

export interface HelixProps {
  seed?: number;
  line?: ResearchLine;
  /** Alto en filas, impar, 7–11. Por defecto 9. */
  rows?: number;
  fps?: number;
  cols?: number;
}

export interface NetworkNode { id: string; type: "tf" | "gene" | "hub"; module: "nitrogeno" | "sequia" | "cruce"; note?: string; }
export interface NetworkEdge { s: string; t: string; /** 1 activa, -1 reprime */ sign: 1 | -1; }
export interface NetworkProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  /** Nombre de condición → ids de nodos encendidos. */
  states: Record<string, string[]>;
  state?: string;
  label?: string;
  seed?: number;
  onSelect?(node: (NetworkNode & { deg: number; targets: { id: string; sign: number }[]; sources: { id: string; sign: number }[] }) | null): void;
}
export interface NetworkHandle extends MotifHandle { setState(name: string): void; focus(id: string | null): void; }
/** Los motivos aceptan además interactive?: boolean (true): responden al cursor. */
export declare function Network(container: HTMLElement, props: NetworkProps): NetworkHandle;
export interface PulseGraphProps { line?: ResearchLine; seed?: number; interactive?: boolean; names?: { tf: string[]; hub: string[]; gene: string[] }; }
/** Red regulatoria viva: pulsos en cascada, recableado, hover = cascada, clic = knockout. */
export declare function PulseGraph(container: HTMLElement, props?: PulseGraphProps): MotifHandle;
export interface PhyllotaxisProps { count?: number; interactive?: boolean; onState?(state: "crecer" | "resistir"): void; }
/** Espiral áurea viva; cursor = espirales de Fibonacci; clic = crecer ↔ resistir. */
export declare function Phyllotaxis(container: HTMLElement, props?: PhyllotaxisProps): MotifHandle & { setState(state: "crecer" | "resistir"): void };
export interface OmicsTracksProps { line?: ResearchLine; seed?: number; interactive?: boolean; }
/** Pistas multi-ómicas que convergen en una predicción; cursor = escáner; clic = control ↔ sequía. */
export declare function OmicsTracks(container: HTMLElement, props?: OmicsTracksProps): MotifHandle;
export declare function scramble(root?: ParentNode): void;
export declare function AsciiField(container: HTMLElement, props?: AsciiFieldProps): MotifHandle;
export declare function RootGrowth(container: HTMLElement, props?: RootGrowthProps): MotifHandle;
export declare function Helix(container: HTMLElement, props?: HelixProps): MotifHandle;
