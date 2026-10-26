export type ProgramaId = "conquistadores" | "aventureros" | "guias-mayores";
export type VarianteId = "nino" | "nina" | "dama" | "caballero";
export type Vista = "frente" | "espalda";

/** Posición del hotspot en % de la imagen en un frame concreto. */
export interface PuntoHotspot {
  frame: number;
  x: number;
  y: number;
}

/**
 * Un tramo es una racha continua de frames (en orden de giro, puede pasar de 35 a 0)
 * en la que la pieza se ve. Entre dos puntos la posición se interpola.
 */
export type TramoHotspot = PuntoHotspot[];

export interface Pieza {
  id: string;
  nombre: string;
  descripcion: string;
  significado: string;
  usoReglamentario: string;
  /** Id del producto real en la tienda (precio, tallas, stock). null = aún sin enlazar. */
  productoId: string | null;
  imagenDetalle: string | null;
  tramos: TramoHotspot[];
  /** Solo para el visor modelo3d. */
  punto3d?: [number, number, number];
}

export interface VisorSecuencia {
  tipo: "secuencia";
  /** Carpeta en /public con las subcarpetas de resolución (baja, alta). */
  carpeta: string;
  frames: number;
  frameFrente: number;
  /** Foto de espalda; si falta, la que está a media vuelta del frente. */
  frameEspalda?: number;
}

export interface VisorModelo3D {
  tipo: "modelo3d";
  glb: string;
}

export interface Uniforme {
  programa: ProgramaId;
  variante: VarianteId;
  nombre: string;
  descripcion: string;
  visor: VisorSecuencia | VisorModelo3D;
  piezas: Pieza[];
}

export interface Programa {
  id: ProgramaId;
  nombre: string;
  variantes: { id: VarianteId; nombre: string }[];
}

/** Estado compartible en la URL. */
export interface EstadoUrl {
  programa: ProgramaId;
  variante: VarianteId;
  pieza: string | null;
  vista: Vista;
}
