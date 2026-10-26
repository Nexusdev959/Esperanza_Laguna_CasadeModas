import useSWR from "swr";
import { cargarPiezas, claveUniforme, type PiezaGuardada } from "../lib/contenido";
import type { Uniforme } from "../types";

/**
 * El uniforme con las piezas editadas en el admin. Mientras no haya ninguna guardada
 * se usan las del archivo de datos. `iniciales` llegan del servidor (SEO, sin parpadeo).
 */
export function usePiezasUniforme(uniforme: Uniforme | null, iniciales?: { clave: string; piezas: PiezaGuardada[] }) {
  const clave = uniforme ? claveUniforme(uniforme) : null;
  const { data } = useSWR(clave ? ["piezas-uniforme", clave] : null, () => cargarPiezas(clave!), {
    fallbackData: iniciales && iniciales.clave === clave ? iniciales.piezas : undefined,
  });
  if (!uniforme) return null;
  return data && data.length > 0 ? { ...uniforme, piezas: data } : uniforme;
}
