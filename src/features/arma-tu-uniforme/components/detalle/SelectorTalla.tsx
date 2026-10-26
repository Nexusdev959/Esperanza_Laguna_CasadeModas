"use client";

import { FOCO, ROTULO } from "../estilos";

interface Props {
  tallas: string[];
  elegida?: string;
  onElegir: (talla: string) => void;
}

/** Tallas del producto en botones pequeños, como en la ficha de producto. */
export function SelectorTalla({ tallas, elegida, onElegir }: Props) {
  if (tallas.length === 0) return null;
  return (
    <fieldset>
      <legend className={`${ROTULO} mb-2`}>Talla</legend>
      <div className="flex flex-wrap gap-1.5">
        {tallas.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={elegida === t}
            onClick={() => onElegir(t)}
            className={`min-w-10 rounded-full border px-3 py-1.5 font-sans text-xs transition-colors ${FOCO} ${
              elegida === t
                ? "border-[#1c785f] bg-[#1c785f] text-white dark:border-[#d4af37] dark:bg-[#d4af37] dark:text-[#0b1410]"
                : "border-foreground/15 text-foreground/75 hover:border-foreground/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
