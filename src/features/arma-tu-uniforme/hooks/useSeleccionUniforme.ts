import { PROGRAMAS, buscarUniforme, programaDisponible, varianteDisponible } from "../data";
import type { EstadoUrl, ProgramaId, VarianteId } from "../types";

/** Programa y variante elegidos, el uniforme que les corresponde y las opciones para los selectores. */
export function useSeleccionUniforme(estado: EstadoUrl, actualizar: (c: Partial<EstadoUrl>) => void) {
  const programa = PROGRAMAS.find((p) => p.id === estado.programa) ?? PROGRAMAS[0];

  const elegirPrograma = (id: string) => {
    actualizar({ programa: id as ProgramaId, variante: varianteDisponible(id as ProgramaId), pieza: null, vista: "frente" });
  };
  const elegirVariante = (id: string) => {
    actualizar({ variante: id as VarianteId, pieza: null, vista: "frente" });
  };

  return {
    uniforme: buscarUniforme(estado.programa, estado.variante),
    programas: PROGRAMAS.map((p) => ({ id: p.id, nombre: p.nombre, pronto: !programaDisponible(p.id) })),
    variantes: programa.variantes.map((v) => ({ ...v, pronto: !buscarUniforme(programa.id, v.id) })),
    elegirPrograma,
    elegirVariante,
  };
}
