// Todas las constantes del visor en un solo lugar
export const RESOLUCIONES = { baja: "baja", alta: "alta" } as const;
export const EXTENSION_FRAMES = "webp";
/** Nombre de archivo de cada frame: 00.webp, 01.webp… */
export const nombreFrame = (i: number) => `${String(i).padStart(2, "0")}.${EXTENSION_FRAMES}`;
export type Resolucion = keyof typeof RESOLUCIONES;
export const rutaFrame = (carpeta: string, resolucion: Resolucion, i: number) => `${carpeta}/${RESOLUCIONES[resolucion]}/${nombreFrame(i)}`;
/** Ancho de los frames en baja: si el visor se ve más grande que esto, se cargan los de alta. */
export const ANCHO_BAJA = 480;

export const ROTACION = {
  /** Píxeles de arrastre por frame. */
  pxPorFrame: 9,
  /** Fricción de la inercia por milisegundo (0–1, más alto = frena antes). */
  friccion: 0.004,
  /** Velocidad mínima (frames/ms) para seguir girando. */
  velocidadMinima: 0.0015,
  /** Giro automático inicial, en frames por segundo. */
  autoFps: 4,
  /** Duración del giro hacia un frame elegido (ms). */
  duracionIrA: 650,
} as const;

export const ZOOM = {
  min: 1,
  max: 2.5,
  paso: 0.25,
  /** Zoom leve al seleccionar una pieza. */
  pieza: 1.35,
  /** Sensibilidad de la rueda del mouse. */
  rueda: 0.0015,
  /** A partir de este zoom se piden los frames en alta. */
  umbralAlta: 1.05,
} as const;

export const HOTSPOTS = {
  /** Frames de desvanecido en los bordes de cada tramo. */
  fundido: 1.2,
  /** Con el escenario más angosto que esto (px), las etiquetas salen hacia el centro para no cortarse. */
  anchoEtiquetasAfuera: 420,
  /** Margen (%) dentro del escenario: un punto que el zoom deja más afuera se oculta. */
  margen: 3,
} as const;

/** Curva de la marca para giros y transiciones (ease-out suave). */
export const EASING = [0.22, 1, 0.36, 1] as const;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Resorte de las pastillas deslizantes (el mismo de la navbar). */
export const RESORTE = { type: "spring", stiffness: 380, damping: 30 } as const;

/** Desde aquí el detalle va en columna lateral; debajo, en hoja inferior. */
export const MEDIA_ESCRITORIO = "(min-width: 1024px)";

/** Hoja inferior en móvil: cuánto hay que arrastrarla hacia abajo para cerrarla (px). */
export const UMBRAL_CIERRE_HOJA = 120;

export const TRANSICION = {
  /** Fundido al cambiar de uniforme (s). */
  uniforme: 0.45,
  /** Dibujo de la línea de la etiqueta (s). */
  etiqueta: 0.35,
  panel: 0.3,
} as const;

/** Llave de localStorage que lee /quotes (la misma que usa el carrito). */
export const LLAVE_COTIZACION = "pilypage_quote_items";
