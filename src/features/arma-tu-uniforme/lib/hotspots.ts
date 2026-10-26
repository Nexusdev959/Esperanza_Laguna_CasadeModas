import type { PuntoHotspot, TramoHotspot } from "../types";

// Sin imports de valores para poder probarlo con node --test
const mod = (n: number, total: number) => ((n % total) + total) % total;

export interface PosicionHotspot {
  x: number;
  y: number;
  /** 1 en el centro del tramo, baja a 0 en los bordes (la pieza gira hacia atrás). */
  opacidad: number;
}

/** Distancia en frames desde el inicio del tramo, siguiendo el sentido del giro. */
const desplazamiento = (tramo: TramoHotspot, frame: number, total: number) => mod(frame - tramo[0].frame, total);

const largoTramo = (tramo: TramoHotspot, total: number) => desplazamiento(tramo, tramo[tramo.length - 1].frame, total);

const interpolar = (a: PuntoHotspot, b: PuntoHotspot, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

export const posicionEnTramo = (tramo: TramoHotspot, frame: number, total: number, fundido: number): PosicionHotspot | null => {
  if (tramo.length === 0) return null;
  const largo = largoTramo(tramo, total);
  const actual = desplazamiento(tramo, frame, total);
  if (actual > largo) return null;
  const opacidad = fundido > 0 ? Math.min(1, actual / fundido, (largo - actual) / fundido) : 1;
  if (tramo.length === 1) return { ...tramo[0], opacidad };
  for (let i = 0; i < tramo.length - 1; i++) {
    const a = desplazamiento(tramo, tramo[i].frame, total);
    const b = desplazamiento(tramo, tramo[i + 1].frame, total);
    if (actual <= b) return { ...interpolar(tramo[i], tramo[i + 1], b === a ? 0 : (actual - a) / (b - a)), opacidad };
  }
  return null;
};

/** Primer tramo en el que la pieza se ve en este frame (puede ser continuo, no entero). */
export const posicionHotspot = (tramos: TramoHotspot[], frame: number, total: number, fundido: number) => {
  for (const tramo of tramos) {
    const pos = posicionEnTramo(tramo, mod(frame, total), total, fundido);
    if (pos && pos.opacidad > 0) return pos;
  }
  return null;
};

/** Mejor ángulo de una pieza: el centro de su tramo más largo, donde mira de frente a la cámara. */
export const mejorFrame = (tramos: TramoHotspot[], total: number) => {
  const largo = tramos.filter((t) => t.length > 0).sort((a, b) => largoTramo(b, total) - largoTramo(a, total))[0];
  if (!largo) return null;
  return mod(largo[0].frame + Math.round(largoTramo(largo, total) / 2), total);
};
