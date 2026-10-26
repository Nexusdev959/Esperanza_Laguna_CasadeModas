"use client";

import { useEffect, useRef } from "react";

interface Props {
  base: HTMLImageElement | null;
  siguiente: HTMLImageElement | null;
  /** Cuánto de `siguiente` se ve encima de `base` (0–1): fundido entre fotos vecinas. */
  mezcla: number;
}

/**
 * Dibuja el frame en un canvas. Si la imagen aún no llegó, deja el dibujo anterior
 * en pantalla: así el giro nunca parpadea.
 */
export function LienzoFrame({ base, siguiente, mezcla }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    const fondo = mezcla >= 1 ? siguiente : base;
    const ctx = c?.getContext("2d");
    if (!c || !ctx || !fondo) return;
    if (c.width !== fondo.naturalWidth || c.height !== fondo.naturalHeight) {
      c.width = fondo.naturalWidth;
      c.height = fondo.naturalHeight;
    }
    ctx.globalAlpha = 1;
    ctx.drawImage(fondo, 0, 0, c.width, c.height);
    if (siguiente && mezcla > 0 && mezcla < 1) {
      ctx.globalAlpha = mezcla;
      ctx.drawImage(siguiente, 0, 0, c.width, c.height);
      ctx.globalAlpha = 1;
    }
  }, [base, siguiente, mezcla]);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full object-contain" />;
}
