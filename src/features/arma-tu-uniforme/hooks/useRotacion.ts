import { useCallback, useEffect, useRef, useState } from "react";
import { ROTACION, easeOut } from "../config";
import { distanciaCircular, normalizar } from "../lib/frames";
import { useAnimacion } from "./useAnimacion";
import { useArrastre } from "./useArrastre";

interface Opciones {
  total: number;
  frameInicial: number;
  /** Giro lento de bienvenida hasta que el usuario toca algo. */
  autoGiro: boolean;
  reducido: boolean;
  /** Mientras devuelva true (p. ej. pellizco de zoom) el arrastre no gira. */
  bloqueado: () => boolean;
  /** Se llama cuando el giro queda quieto, con el frame final. */
  alDetenerse?: (frame: number) => void;
}

/** Giro de la secuencia: arrastre con inercia, giro automático y animación hacia un frame. */
export function useRotacion({ total, frameInicial, autoGiro, reducido, bloqueado, alDetenerse }: Opciones) {
  const [frame, setFrame] = useState(frameInicial);
  const frameRef = useRef(frameInicial);
  const [interactuado, setInteractuado] = useState(false);
  const { animar, detener } = useAnimacion();
  const mover = useCallback((f: number) => setFrame((frameRef.current = f)), []);
  const interrumpir = useCallback(() => (setInteractuado(true), detener()), [detener]);

  useEffect(() => {
    if (!autoGiro || reducido || interactuado) return;
    const propio = animar((dt) => (mover(frameRef.current + (dt / 1000) * ROTACION.autoFps), true));
    return () => detener(propio);
  }, [autoGiro, reducido, interactuado, animar, detener, mover]);

  const irA = useCallback(
    (destino: number, alTerminar?: () => void) => {
      interrumpir();
      const desde = frameRef.current;
      const delta = distanciaCircular(normalizar(desde, total), destino, total);
      const duracion = reducido ? 0 : ROTACION.duracionIrA;
      let transcurrido = 0;
      animar((dt) => {
        const t = duracion === 0 ? 1 : Math.min(1, (transcurrido += dt) / duracion);
        mover(desde + delta * easeOut(t));
        if (t < 1) return true;
        alTerminar?.();
        alDetenerse?.(frameRef.current);
        return false;
      });
    },
    [animar, interrumpir, mover, reducido, total, alDetenerse]
  );

  const girar = useCallback((pasos: number) => irA(normalizar(Math.round(frameRef.current) + pasos, total)), [irA, total]);
  const handlers = useArrastre({ frameRef, mover, interrumpir, animar, reducido, bloqueado, alDetenerse });

  return { frame, handlers, irA, girar, interrumpir };
}
