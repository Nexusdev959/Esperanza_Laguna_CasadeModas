"use client";

import type { useSeleccionUniforme } from "../../hooks/useSeleccionUniforme";
import type { EstadoUrl } from "../../types";
import { SelectorSegmentos } from "./SelectorSegmentos";

interface Props {
  seleccion: ReturnType<typeof useSeleccionUniforme>;
  estado: EstadoUrl;
}

/** Programa arriba y variante debajo, centrados sobre el visor. */
export function SelectoresUniforme({ seleccion, estado }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <SelectorSegmentos grupo="programa" etiqueta="Programa" segmentos={seleccion.programas} activo={estado.programa} onElegir={seleccion.elegirPrograma} />
      <SelectorSegmentos grupo="variante" etiqueta="Variante" segmentos={seleccion.variantes} activo={estado.variante} onElegir={seleccion.elegirVariante} />
    </div>
  );
}
