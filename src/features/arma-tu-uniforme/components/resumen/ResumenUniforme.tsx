"use client";

import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatoPrecio, type LineaUniforme } from "../../lib/tienda";
import { FOCO } from "../estilos";
import { AccionesUniforme } from "./AccionesUniforme";

interface Props {
  elegidas: LineaUniforme[];
  totalPiezas: number;
  total: number;
  onAgregarTodo: () => void;
  onCotizar: () => void;
}

/** Barra fija y discreta con lo elegido; se despliega para ver piezas y tallas. */
export function ResumenUniforme({ elegidas, totalPiezas, total, onAgregarTodo, onCotizar }: Props) {
  const [abierto, setAbierto] = useState(false);
  return (
    <section aria-label="Tu uniforme" className="fixed inset-x-0 bottom-4 z-30 mx-auto w-[94%] max-w-5xl">
      <div className="rounded-3xl border border-foreground/10 bg-[var(--background)]/90 px-5 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.10)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={() => setAbierto(!abierto)}
            aria-expanded={abierto}
            aria-controls="resumen-piezas"
            className={`flex items-center gap-2 rounded text-left font-sans text-sm text-foreground ${FOCO}`}
          >
            <span>
              Tu uniforme: <strong className="font-semibold">{elegidas.length} de {totalPiezas} piezas</strong>
              {total > 0 && <> · Total <strong className="font-semibold">{formatoPrecio(total)}</strong></>}
            </span>
            <ChevronUp className={`h-4 w-4 text-foreground/50 transition-transform ${abierto ? "" : "rotate-180"}`} />
          </button>
          <AccionesUniforme hayElegidas={elegidas.length > 0} onAgregarTodo={onAgregarTodo} onCotizar={onCotizar} />
        </div>
        {abierto && (
          <ul id="resumen-piezas" className="mt-3 border-t border-foreground/[0.08] pt-2 font-sans text-xs text-foreground/70">
            {elegidas.length === 0 && <li className="py-1">Aún no eliges piezas: ábrelas en el visor o en la lista y súmalas.</li>}
            {elegidas.map(({ pieza, producto, talla }) => (
              <li key={pieza.id} className="flex justify-between gap-4 py-1">
                <span>{pieza.nombre}{talla && ` · Talla ${talla}`}</span>
                <span className="tabular-nums">{producto ? formatoPrecio(producto.precio) : "Por confirmar"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
