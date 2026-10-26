"use client";

import { Check } from "lucide-react";
import { FOCO } from "../estilos";

interface Props {
  indice: number;
  nombre: string;
  descripcion: string;
  activa: boolean;
  incluida: boolean;
  onSeleccionar: () => void;
}

/** Fila de la lista: número, nombre y descripción corta. La descripción va en el HTML para buscadores. */
export function ItemPieza({ indice, nombre, descripcion, activa, incluida, onSeleccionar }: Props) {
  return (
    <button
      type="button"
      onClick={onSeleccionar}
      aria-pressed={activa}
      className={`group relative flex w-full items-start gap-4 border-t border-foreground/[0.08] py-3.5 pl-1 pr-2 text-left transition-colors ${FOCO}`}
    >
      <span className={`mt-0.5 font-sans text-[11px] tabular-nums tracking-[0.12em] ${activa ? "text-[#2ec4a6]" : "text-foreground/35"}`}>
        {String(indice + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block font-sans text-sm transition-colors ${activa ? "font-semibold text-foreground" : "text-foreground/75 group-hover:text-foreground"}`}>
          {nombre}
        </span>
        <span className="mt-0.5 block truncate font-sans text-xs text-foreground/45">{descripcion}</span>
      </span>
      {incluida && (
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1c785f] text-white dark:bg-[#d4af37] dark:text-[#0b1410]" aria-label="En tu uniforme">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
      )}
      {activa && <span aria-hidden className="absolute -left-px top-3 bottom-3 w-px bg-[#2ec4a6]" />}
    </button>
  );
}
