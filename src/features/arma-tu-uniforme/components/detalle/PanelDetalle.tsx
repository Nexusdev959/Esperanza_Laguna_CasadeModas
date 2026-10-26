"use client";

import { AnimatePresence, motion, useDragControls, type Transition } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { EASING, TRANSICION, UMBRAL_CIERRE_HOJA } from "../../config";
import { useEsEscritorio } from "../../hooks/useMovimientoReducido";
import { FOCO } from "../estilos";

interface Props {
  /** Llave de la pieza abierta (null = cerrado). Cambiarla funde el contenido. */
  abierto: string | null;
  onCerrar: () => void;
  /** Lo que se ve en escritorio cuando no hay pieza elegida. */
  vacio: React.ReactNode;
  children: React.ReactNode;
}

const TRANSICION_PANEL: Transition = { duration: TRANSICION.panel, ease: [...EASING] };

function BotonCerrar({ onCerrar }: { onCerrar: () => void }) {
  return (
    <button
      type="button"
      onClick={onCerrar}
      aria-label="Cerrar detalle"
      className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 hover:bg-foreground/[0.05] hover:text-foreground ${FOCO}`}
    >
      <X className="h-4 w-4" />
    </button>
  );
}

/** En escritorio, columna al costado del visor. En móvil, hoja inferior que se arrastra hacia abajo para cerrar. */
export function PanelDetalle(props: Props) {
  const escritorio = useEsEscritorio();
  const { abierto, onCerrar } = props;

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto, onCerrar]);

  return escritorio ? <PanelLateral {...props} /> : <HojaInferior {...props} />;
}

function PanelLateral({ abierto, onCerrar, vacio, children }: Props) {
  return (
    <aside aria-label="Detalle de la pieza" className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={abierto ?? "vacio"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={TRANSICION_PANEL}>
          {abierto && <BotonCerrar onCerrar={onCerrar} />}
          {abierto ? children : vacio}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}

function HojaInferior({ abierto, onCerrar, children }: Props) {
  // La hoja se arrastra solo desde la manija, para no robarle el scroll al contenido
  const arrastre = useDragControls();
  return (
    <AnimatePresence>
      {abierto && (
        <motion.aside
          aria-label="Detalle de la pieza"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={TRANSICION_PANEL}
          drag="y"
          dragListener={false}
          dragControls={arrastre}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.6 }}
          onDragEnd={(_, info) => info.offset.y > UMBRAL_CIERRE_HOJA && onCerrar()}
          className="fixed inset-x-0 bottom-0 z-40 max-h-[45vh] overflow-y-auto overscroll-contain rounded-t-3xl border-t border-foreground/10 bg-[var(--background)] px-5 pb-8 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.12)]"
        >
          <div aria-hidden onPointerDown={(e) => arrastre.start(e)} className="-mx-5 -mt-3 mb-2 cursor-grab touch-none py-3">
            <span className="mx-auto block h-1 w-10 rounded-full bg-foreground/15" />
          </div>
          <BotonCerrar onCerrar={onCerrar} />
          {children}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
