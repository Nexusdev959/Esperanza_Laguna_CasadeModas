import type { Programa, ProgramaId, Uniforme, VarianteId } from "../types";
import { conquistadoresNino } from "./conquistadores-nino";
import { conquistadoresNina } from "./conquistadores-nina";

// Para sumar un uniforme: crear su archivo en esta carpeta y agregarlo a esta lista (ver README.md)
export const UNIFORMES: Uniforme[] = [conquistadoresNino, conquistadoresNina];

export const PROGRAMAS: Programa[] = [
  {
    id: "conquistadores",
    nombre: "Conquistadores",
    variantes: [{ id: "nino", nombre: "Niño" }, { id: "nina", nombre: "Niña" }],
  },
  {
    id: "aventureros",
    nombre: "Aventureros",
    variantes: [{ id: "nino", nombre: "Niño" }, { id: "nina", nombre: "Niña" }],
  },
  {
    id: "guias-mayores",
    nombre: "Guías Mayores",
    variantes: [{ id: "dama", nombre: "Dama" }, { id: "caballero", nombre: "Caballero" }],
  },
];

export const buscarUniforme = (programa: ProgramaId, variante: VarianteId) =>
  UNIFORMES.find((u) => u.programa === programa && u.variante === variante) ?? null;
