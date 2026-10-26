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
    // Se limpia siempre: con fotos de fondo transparente las siluetas se acumularían
    ctx.clearRect(0, 0, c.width, c.height);
    if (siguiente && mezcla > 0 && mezcla < 1) {
      // (1−t)·A + t·B exacto, también con transparencia: "lighter" suma los colores premultiplicados
      ctx.globalAlpha = 1 - mezcla;
      ctx.drawImage(fondo, 0, 0, c.width, c.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = mezcla;
      ctx.drawImage(siguiente, 0, 0, c.width, c.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(fondo, 0, 0, c.width, c.height);
    }
  }, [base, siguiente, mezcla]);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full object-contain" />;
}
