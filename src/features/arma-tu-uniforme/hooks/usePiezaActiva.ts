import { useCallback } from "react";
import type { EstadoUrl, Pieza } from "../types";

/** Pieza seleccionada (vive en la URL como ?pieza=) y navegación anterior / siguiente. */
export function usePiezaActiva(piezas: Pieza[], estado: EstadoUrl, actualizar: (c: Partial<EstadoUrl>) => void) {
  const indice = piezas.findIndex((p) => p.id === estado.pieza);
  const pieza = indice >= 0 ? piezas[indice] : null;

  const seleccionar = useCallback((id: string | null) => actualizar({ pieza: id }), [actualizar]);

  const mover = (paso: number) => {
    if (piezas.length === 0) return;
    const siguiente = (Math.max(indice, 0) + paso + piezas.length) % piezas.length;
    seleccionar(piezas[siguiente].id);
  };

  return {
    pieza,
    seleccionar,
    anterior: piezas.length > 1 ? () => mover(-1) : undefined,
    siguiente: piezas.length > 1 ? () => mover(1) : undefined,
    vecinas: pieza && piezas.length > 1
      ? { anterior: piezas[(indice - 1 + piezas.length) % piezas.length], siguiente: piezas[(indice + 1) % piezas.length] }
      : null,
  };
}
