import { useCallback, useRef } from "react";
import { ROTACION } from "../config";

interface Opciones {
  frameRef: React.RefObject<number>;
  mover: (frame: number) => void;
  interrumpir: () => void;
  animar: (paso: (dt: number) => boolean) => number;
  reducido: boolean;
  bloqueado: () => boolean;
  alDetenerse?: (frame: number) => void;
}

/** Arrastre horizontal → frames, y al soltar sigue girando con inercia hasta frenar. */
export function useArrastre({ frameRef, mover, interrumpir, animar, reducido, bloqueado, alDetenerse }: Opciones) {
  const arrastre = useRef<{ x: number; t: number; v: number } | null>(null);

  const inercia = useCallback(
    (velocidad: number) => {
      let v = reducido ? 0 : velocidad;
      animar((dt) => {
        v *= Math.exp(-ROTACION.friccion * dt);
        if (Math.abs(v) < ROTACION.velocidadMinima) {
          alDetenerse?.(frameRef.current);
          return false;
        }
        mover(frameRef.current + v * dt);
        return true;
      });
    },
    [animar, mover, reducido, alDetenerse, frameRef]
  );

  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (!e.isPrimary) return;
      interrumpir();
      e.currentTarget.setPointerCapture(e.pointerId);
      arrastre.current = { x: e.clientX, t: e.timeStamp, v: 0 };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const a = arrastre.current;
      if (!a || !e.isPrimary || bloqueado()) return;
      const df = (e.clientX - a.x) / ROTACION.pxPorFrame;
      arrastre.current = { x: e.clientX, t: e.timeStamp, v: df / Math.max(1, e.timeStamp - a.t) };
      mover(frameRef.current + df);
    },
    onPointerUp: (e: React.PointerEvent) => {
      const a = arrastre.current;
      arrastre.current = null;
      if (!a) return;
      // Si el dedo se quedó quieto antes de soltar, no hay inercia
      if (e.timeStamp - a.t < 80) inercia(a.v);
      else alDetenerse?.(frameRef.current);
    },
  };
}
