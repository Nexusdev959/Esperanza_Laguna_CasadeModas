"use client";

import { useEffect, useRef } from "react";

/**
 * Dibuja el frame en un canvas. Si la imagen del frame aún no llegó, deja el dibujo
 * anterior en pantalla: así el giro nunca parpadea.
 */
export function LienzoFrame({ imagen }: { imagen: HTMLImageElement | null }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c || !imagen) return;
    if (c.width !== imagen.naturalWidth || c.height !== imagen.naturalHeight) {
      c.width = imagen.naturalWidth;
      c.height = imagen.naturalHeight;
    }
    c.getContext("2d")?.drawImage(imagen, 0, 0, c.width, c.height);
  }, [imagen]);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full object-contain" />;
}
