import useSWR from "swr";
import { useNotification } from "@/components/ui/notification-provider";
import { actualizarPieza, borrarPieza, cargarPiezas, claveUniforme, crearPieza, mensajeError, type PiezaGuardada } from "../lib/contenido";
import type { Pieza, Uniforme } from "../types";

/** Piezas guardadas de un uniforme y las acciones del admin sobre ellas, con sus avisos. */
export function useAdminPiezas(uniforme: Uniforme) {
  const clave = claveUniforme(uniforme);
  const { data: piezas = [], mutate, isLoading } = useSWR(["piezas-uniforme", clave], () => cargarPiezas(clave));
  const ejecutar = useConAviso(mutate);

  const guardar = (pieza: Pieza, existente: PiezaGuardada | null) =>
    existente
      ? ejecutar(() => actualizarPieza(existente.registro, clave, pieza, existente.orden), "Pieza guardada")
      : ejecutar(() => crearPieza(clave, pieza, piezas.length), "Pieza agregada");

  const borrar = (p: PiezaGuardada) => ejecutar(() => borrarPieza(p.registro), `${p.nombre} eliminada`);

  /** Cambia de lugar con la vecina: se guardan las dos posiciones. */
  const mover = (indice: number, paso: -1 | 1) => {
    const a = piezas[indice];
    const b = piezas[indice + paso];
    if (!a || !b) return;
    return ejecutar(
      () => Promise.all([actualizarPieza(a.registro, clave, a, indice + paso), actualizarPieza(b.registro, clave, b, indice)]),
      "Orden actualizado"
    );
  };

  /** Copia las piezas del archivo de datos a la base para empezar a editarlas. */
  const importarEjemplo = () =>
    ejecutar(async () => {
      for (const [i, p] of uniforme.piezas.entries()) await crearPieza(clave, p, i);
    }, "Piezas copiadas: ya puedes editarlas");

  return { piezas, isLoading, guardar, borrar, mover, importarEjemplo };
}

/** Corre una acción, recarga la lista y avisa el resultado. Devuelve si salió bien. */
function useConAviso(recargar: () => Promise<unknown>) {
  const { showNotification } = useNotification();
  return async (accion: () => Promise<unknown>, exito: string) => {
    try {
      await accion();
      await recargar();
      showNotification(exito, "success");
      return true;
    } catch (e) {
      showNotification(mensajeError(e), "error");
      return false;
    }
  };
}
