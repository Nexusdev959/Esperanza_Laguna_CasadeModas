"use client";

import { useEffect, useRef } from "react";
import { VISTAS } from "../../config";

interface Props {
  base: HTMLImageElement | null;
  siguiente: HTMLImageElement | null;
  /** Cuánto de `siguiente` se ve encima de `base` (0–1): fundido entre fotos vecinas. */
  mezcla: number;
  /** Con pocas fotos: la que sale se comprime y se corre, la que entra se abre, como si girara. */
  efectoGiro: boolean;
}

const suave = (t: number) => t * t * (3 - 2 * t);

/** Dibuja una foto comprimida en horizontal alrededor del centro y corrida `dx` (fracción del ancho). */
function dibujar(ctx: CanvasRenderingContext2D, img: HTMLImageElement, escalaX: number, dx: number, alpha: number) {
  const { width: w, height: h } = ctx.canvas;
  ctx.globalAlpha = alpha;
  ctx.setTransform(escalaX, 0, 0, 1, (w / 2) * (1 - escalaX) + dx * w, 0);
  ctx.drawImage(img, 0, 0, w, h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Dibuja el frame en un canvas. Si la imagen aún no llegó, deja el dibujo anterior
 * en pantalla: así el giro nunca parpadea.
 */
export function LienzoFrame({ base, siguiente, mezcla, efectoGiro }: Props) {
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
    if (!siguiente || mezcla <= 0 || mezcla >= 1) return dibujar(ctx, fondo, 1, 0, 1);
    const t = suave(mezcla);
    const k = efectoGiro ? VISTAS.compresion : 0;
    const d = efectoGiro ? VISTAS.desplazamiento : 0;
    // (1−t)·A + t·B exacto, también con transparencia: "lighter" suma los colores premultiplicados
    dibujar(ctx, fondo, 1 - k * mezcla, -d * mezcla, 1 - t);
    ctx.globalCompositeOperation = "lighter";
    dibujar(ctx, siguiente, 1 - k * (1 - mezcla), d * (1 - mezcla), t);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }, [base, siguiente, mezcla, efectoGiro]);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full object-contain" />;
}
