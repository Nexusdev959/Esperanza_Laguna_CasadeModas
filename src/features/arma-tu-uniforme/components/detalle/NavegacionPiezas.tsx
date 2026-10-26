"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { FOCO } from "../estilos";

interface Props {
  anterior?: { nombre: string; onIr: () => void };
  siguiente?: { nombre: string; onIr: () => void };
}

const ENLACE = `group inline-flex min-w-0 items-center gap-2 py-2 font-sans text-xs text-foreground/55 hover:text-foreground transition-colors ${FOCO} rounded`;

/** Recorre las piezas sin cerrar el panel. */
export function NavegacionPiezas({ anterior, siguiente }: Props) {
  if (!anterior && !siguiente) return null;
  return (
    <nav aria-label="Otras piezas" className="flex items-center justify-between gap-4 border-t border-foreground/[0.08] pt-3">
      {anterior ? (
        <button type="button" onClick={anterior.onIr} className={ENLACE} aria-label={`Pieza anterior: ${anterior.nombre}`}>
          <ArrowLeft className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span className="truncate">{anterior.nombre}</span>
        </button>
      ) : <span />}
      {siguiente && (
        <button type="button" onClick={siguiente.onIr} className={ENLACE} aria-label={`Pieza siguiente: ${siguiente.nombre}`}>
          <span className="truncate">{siguiente.nombre}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </nav>
  );
}
