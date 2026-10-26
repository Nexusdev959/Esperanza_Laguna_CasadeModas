import { api } from "@/lib/api";
import type { Pieza, TramoHotspot, Uniforme } from "../types";

// Único punto de contacto con la API de piezas (lo que se edita desde el admin)

interface PiezaApi {
  id: string;
  slug: string;
  name: string;
  description: string;
  meaning: string;
  regulationUse: string;
  productId: string | null;
  detailImage: string | null;
  hotspots: TramoHotspot[];
  position: number;
}

/** Pieza guardada en la base: lleva el id del registro además del de la URL. */
export type PiezaGuardada = Pieza & { registro: string; orden: number };

export const claveUniforme = (u: Pick<Uniforme, "programa" | "variante">) => `${u.programa}-${u.variante}`;

const aPieza = (p: PiezaApi): PiezaGuardada => ({
  registro: p.id,
  orden: p.position,
  id: p.slug,
  nombre: p.name,
  descripcion: p.description,
  significado: p.meaning,
  usoReglamentario: p.regulationUse,
  productoId: p.productId,
  imagenDetalle: p.detailImage,
  tramos: Array.isArray(p.hotspots) ? p.hotspots : [],
});

const aApi = (clave: string, p: Pieza, orden: number) => ({
  uniformKey: clave,
  slug: p.id,
  name: p.nombre,
  description: p.descripcion,
  meaning: p.significado,
  regulationUse: p.usoReglamentario,
  productId: p.productoId,
  detailImage: p.imagenDetalle,
  hotspots: p.tramos,
  position: orden,
});

/** Piezas guardadas de un uniforme. Si la API falla, lista vacía: el visor usa las del código. */
export const cargarPiezas = async (clave: string): Promise<PiezaGuardada[]> => {
  try {
    const { data } = await api.get<PiezaApi[]>("/uniform-pieces", { params: { uniforme: clave } });
    return data.map(aPieza);
  } catch {
    return [];
  }
};

export const crearPieza = (clave: string, p: Pieza, orden: number) => api.post("/uniform-pieces", aApi(clave, p, orden));

export const actualizarPieza = (registro: string, clave: string, p: Pieza, orden: number) =>
  api.put(`/uniform-pieces/${registro}`, aApi(clave, p, orden));

export const borrarPieza = (registro: string) => api.delete(`/uniform-pieces/${registro}`);

/** Sube la foto de detalle a Cloudinary (misma carpeta que los productos) y devuelve su URL. */
export const subirImagen = async (archivo: File) => {
  const datos = new FormData();
  datos.append("file", archivo);
  datos.append("folder", "products");
  const { data } = await api.post<{ data: { url: string } }>("/upload", datos, { headers: { "Content-Type": "multipart/form-data" } });
  return data.data.url;
};

/** El mensaje de error que devuelve la API, o uno genérico. */
export const mensajeError = (e: unknown) =>
  (e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "No se pudo guardar. Intenta de nuevo.";
