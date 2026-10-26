import type { Pieza, Uniforme } from "../types";

// Datos de ejemplo: frames de muestra generados y textos por confirmar. Ver README.md.
const POR_CONFIRMAR = "[Contenido por confirmar]";

const frente = (y: number) => [[
  { frame: 29, x: 40.7, y }, { frame: 31, x: 40.9, y }, { frame: 33, x: 43.1, y }, { frame: 35, x: 47.4, y },
  { frame: 1, x: 52.6, y }, { frame: 3, x: 56.9, y }, { frame: 5, x: 59.1, y }, { frame: 7, x: 59.3, y },
]];
const espalda = (y: number) => [[
  { frame: 11, x: 40.7, y }, { frame: 13, x: 40.9, y }, { frame: 15, x: 43.1, y }, { frame: 17, x: 47.4, y },
  { frame: 19, x: 52.6, y }, { frame: 21, x: 56.9, y }, { frame: 23, x: 59.1, y }, { frame: 25, x: 59.3, y },
]];

const pieza = (id: string, nombre: string, tramos: Pieza["tramos"]): Pieza => ({
  id,
  nombre,
  descripcion: POR_CONFIRMAR,
  significado: POR_CONFIRMAR,
  usoReglamentario: POR_CONFIRMAR,
  productoId: null,
  imagenDetalle: null,
  tramos,
});

export const PIEZAS_BASE: Pieza[] = [
  pieza("camisa", "Camisa", [...frente(41), ...espalda(36)]),
  pieza("panoleta", "Pañoleta", frente(27)),
  pieza("insignia-pecho", "Insignia del pecho", [[
    { frame: 31, x: 38.4, y: 31 }, { frame: 33, x: 38.3, y: 31 }, { frame: 35, x: 40.9, y: 31 }, { frame: 1, x: 45.4, y: 31 },
    { frame: 3, x: 50.5, y: 31 }, { frame: 5, x: 54.4, y: 31 }, { frame: 7, x: 56.6, y: 31 }, { frame: 9, x: 57.9, y: 31 },
    { frame: 10, x: 58.8, y: 31 },
  ]]),
  pieza("parche-manga", "Parche de la manga", [[
    { frame: 2, x: 33.6, y: 29 }, { frame: 4, x: 37.8, y: 29 }, { frame: 6, x: 43.1, y: 29 }, { frame: 8, x: 47.9, y: 29 },
    { frame: 10, x: 52.1, y: 29 }, { frame: 12, x: 56.9, y: 29 }, { frame: 14, x: 62.2, y: 29 }, { frame: 16, x: 66.4, y: 29 },
  ]]),
  pieza("cinturon", "Cinturón", frente(51.5)),
];

export const PIEZA_INFERIOR = (id: string, nombre: string) => pieza(id, nombre, [...frente(68), ...espalda(68)]);

export const conquistadoresNino: Uniforme = {
  programa: "conquistadores",
  variante: "nino",
  nombre: "Uniforme de gala de Conquistadores · Niño",
  descripcion: POR_CONFIRMAR,
  visor: { tipo: "secuencia", carpeta: "/uniformes/conquistadores/nino", frames: 36, frameFrente: 0 },
  piezas: [...PIEZAS_BASE, PIEZA_INFERIOR("pantalon", "Pantalón")],
};
