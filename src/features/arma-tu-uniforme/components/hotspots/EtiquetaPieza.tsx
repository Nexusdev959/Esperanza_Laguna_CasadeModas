"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EASING, TRANSICION } from "../../config";

interface Props {
  nombre: string;
  visible: boolean;
  /** Hacia dónde sale la línea desde el punto. */
  lado: "izquierda" | "derecha";
}

/** Línea fina que se dibuja desde el punto hacia el nombre, como en una ficha técnica de modas. */
export function EtiquetaPieza({ nombre, visible, lado }: Props) {
  const derecha = lado === "derecha";
  return (
    <AnimatePresence>
      {visible && (
        <span
          aria-hidden
          className={`pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center ${derecha ? "left-full flex-row" : "right-full flex-row-reverse"}`}
        >
          <motion.span
            className={`block h-px w-10 sm:w-14 bg-[#1b1e1c]/55 ${derecha ? "origin-left" : "origin-right"}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, transition: { duration: 0.15 } }}
            transition={{ duration: TRANSICION.etiqueta, ease: [...EASING] }}
          />
          <motion.span
            className="whitespace-nowrap rounded-full border border-foreground/10 bg-white/95 px-3 py-1 text-[11px] font-sans font-medium tracking-[0.08em] text-[#1b1e1c] shadow-[0_4px_16px_rgba(0,0,0,0.06)] dark:bg-[#070b09]/90 dark:text-[#f1f5f9]"
            initial={{ opacity: 0, x: derecha ? -4 : 4 }}
            animate={{ opacity: 1, x: 0, transition: { delay: TRANSICION.etiqueta * 0.6, duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {nombre}
          </motion.span>
        </span>
      )}
    </AnimatePresence>
  );
}
