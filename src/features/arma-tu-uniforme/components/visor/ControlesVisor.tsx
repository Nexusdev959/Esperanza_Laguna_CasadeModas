"use client";

import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Undo2 } from "lucide-react";
import type { Vista } from "../../types";
import { FOCO } from "../estilos";

interface Props {
  vista: Vista;
  onGirar: (pasos: number) => void;
  onVista: (vista: Vista) => void;
  onZoom: (delta: number) => void;
  onRestablecer: () => void;
  pasoZoom: number;
}

const ICONO = `h-9 w-9 inline-flex items-center justify-center rounded-full text-foreground/60 hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors ${FOCO}`;

/** Controles discretos bajo el visor. */
export function ControlesVisor({ vista, onGirar, onVista, onZoom, onRestablecer, pasoZoom }: Props) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2" role="toolbar" aria-label="Controles del visor">
      <button type="button" className={ICONO} onClick={() => onGirar(-3)} aria-label="Girar a la izquierda">
        <RotateCcw className="h-4 w-4" />
      </button>
      <div className="flex items-center rounded-full border border-foreground/10 p-0.5">
        {(["frente", "espalda"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onVista(v)}
            aria-pressed={vista === v}
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-sans font-medium uppercase tracking-[0.14em] transition-colors ${FOCO} ${
              vista === v ? "bg-foreground/[0.07] text-foreground" : "text-foreground/50 hover:text-foreground"
            }`}
          >
            {v === "frente" ? "Frente" : "Espalda"}
          </button>
        ))}
      </div>
      <button type="button" className={ICONO} onClick={() => onGirar(3)} aria-label="Girar a la derecha">
        <RotateCw className="h-4 w-4" />
      </button>
      <span aria-hidden className="mx-1 h-4 w-px bg-foreground/10" />
      <button type="button" className={ICONO} onClick={() => onZoom(-pasoZoom)} aria-label="Alejar">
        <ZoomOut className="h-4 w-4" />
      </button>
      <button type="button" className={ICONO} onClick={() => onZoom(pasoZoom)} aria-label="Acercar">
        <ZoomIn className="h-4 w-4" />
      </button>
      <button type="button" className={ICONO} onClick={onRestablecer} aria-label="Restablecer vista">
        <Undo2 className="h-4 w-4" />
      </button>
    </div>
  );
}
