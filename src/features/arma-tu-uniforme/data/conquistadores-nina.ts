import type { Pieza, Uniforme } from "../types";

// 4 fotos reales: 0 frente, 1 tres cuartos, 2 perfil, 3 espalda. Textos por confirmar (ver README.md).
const POR_CONFIRMAR = "[Contenido por confirmar]";

const pieza = (id: string, nombre: string, puntos: [frame: number, x: number, y: number][]): Pieza => ({
  id,
  nombre,
  descripcion: POR_CONFIRMAR,
  significado: POR_CONFIRMAR,
  usoReglamentario: POR_CONFIRMAR,
  productoId: null,
  imagenDetalle: null,
  tramos: [puntos.map(([frame, x, y]) => ({ frame, x, y }))],
});

export const conquistadoresNina: Uniforme = {
  programa: "conquistadores",
  variante: "nina",
  nombre: "Uniforme de gala de Conquistadores · Niña",
  descripcion: POR_CONFIRMAR,
  visor: { tipo: "secuencia", carpeta: "/uniformes/conquistadores/nina", frames: 4, frameFrente: 0, frameEspalda: 3 },
  piezas: [
    pieza("boina", "Boina", [[0, 50, 9.2], [1, 50.3, 9.2], [2, 50, 10.5], [3, 50, 10.5]]),
    pieza("panoleta", "Pañoleta", [[0, 53.5, 25.1], [1, 48.6, 24.2], [2, 44.8, 26.1], [3, 46.5, 26.8]]),
    pieza("camisa", "Camisa", [[0, 45.6, 39.9], [1, 55.6, 39.2], [2, 46.5, 39.2], [3, 59.1, 39.2]]),
    pieza("banda", "Banda", [[0, 55.6, 37.3], [1, 46.5, 39.2], [2, 46.5, 43.1], [3, 49.1, 37.9]]),
    pieza("insignia-pecho", "Insignia del pecho", [[0, 59.1, 29], [1, 50.3, 29.5], [2, 43, 32]]),
    pieza("parche-manga", "Parches de la manga", [[0, 36.1, 33.3], [1, 61.3, 29], [2, 51.7, 29.4], [3, 65.2, 33.7]]),
    pieza("falda", "Falda", [[0, 48.3, 58.8], [1, 50.9, 61.4], [2, 51.7, 61.4], [3, 49.1, 57.5]]),
    pieza("medias", "Medias", [[0, 46.2, 82.4], [1, 51.7, 81], [2, 50, 83.7], [3, 48.3, 81]]),
    pieza("zapatos", "Zapatos", [[0, 49.1, 93.1], [1, 50.9, 92.2], [2, 48.3, 94.1], [3, 51.7, 93.5]]),
  ],
};
