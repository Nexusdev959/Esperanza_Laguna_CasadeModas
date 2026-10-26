import type { Uniforme } from "../types";
import { PIEZAS_BASE, PIEZA_INFERIOR } from "./conquistadores-nino";

// Datos de ejemplo: comparte las piezas superiores con el de niño y cambia el pantalón por la falda
export const conquistadoresNina: Uniforme = {
  programa: "conquistadores",
  variante: "nina",
  nombre: "Uniforme de gala de Conquistadores · Niña",
  descripcion: "[Contenido por confirmar]",
  visor: { tipo: "secuencia", carpeta: "/uniformes/conquistadores/nina", frames: 36, frameFrente: 0 },
  piezas: [...PIEZAS_BASE, PIEZA_INFERIOR("falda", "Falda")],
};
