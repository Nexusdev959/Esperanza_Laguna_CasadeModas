"use client";

import { motion } from "framer-motion";
import { RESORTE } from "../../config";
import { FOCO } from "../estilos";

export interface Segmento {
  id: string;
  nombre: string;
  /** Sin uniforme cargado todavía: se muestra con "Pronto" y no se puede elegir. */
  pronto?: boolean;
}

interface Props {
  etiqueta: string;
  segmentos: Segmento[];
  activo: string;
  onElegir: (id: string) => void;
  /** Para que cada selector tenga su propia pastilla deslizante. */
  grupo: string;
}

/** Pestañas en forma de segmentos con una pastilla que se desliza a la opción elegida. */
export function SelectorSegmentos({ etiqueta, segmentos, activo, onElegir, grupo }: Props) {
  return (
    <div role="radiogroup" aria-label={etiqueta} className="inline-flex max-w-full items-center gap-0.5 overflow-x-auto hide-scrollbar rounded-full border border-foreground/10 p-1">
      {segmentos.map((s) => {
        const elegido = s.id === activo;
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={elegido}
            disabled={s.pronto}
            onClick={() => onElegir(s.id)}
            className={`relative shrink-0 rounded-full px-4 py-2 font-sans text-xs tracking-wide transition-colors disabled:cursor-not-allowed ${FOCO} ${
              elegido ? "text-white dark:text-[#0b1410]" : "text-foreground/65 hover:text-foreground disabled:text-foreground/30"
            }`}
          >
            {elegido && (
              <motion.span
                layoutId={`segmento-${grupo}`}
                className="absolute inset-0 rounded-full bg-[#1c785f] dark:bg-[#d4af37]"
                transition={RESORTE}
              />
            )}
            <span className="relative">
              {s.nombre}
              {s.pronto && <span className="ml-1.5 text-[9px] uppercase tracking-[0.14em]">Pronto</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
