import { useState } from "react";
import { HOTSPOTS } from "../config";
import { puntosDeTramos, tramosDesdePuntos } from "../lib/hotspots";
import type { Pieza, PuntoHotspot } from "../types";

const VACIA: Pieza = {
  id: "",
  nombre: "",
  descripcion: "",
  significado: "",
  usoReglamentario: "",
  productoId: null,
  imagenDetalle: null,
  tramos: [],
};

/** "Insignia del pecho" → "insignia-del-pecho" (lo que va en la URL del visor). */
export const aIdentificador = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** Estado del formulario de una pieza: textos, producto, foto y un punto por cada foto del uniforme. */
export function useFormularioPieza(inicial: Pieza | null, totalFrames: number) {
  const [datos, setDatos] = useState<Pieza>(inicial ?? VACIA);
  const [puntos, setPuntos] = useState<PuntoHotspot[]>(() => puntosDeTramos(inicial?.tramos ?? []));
  // Mientras sea nueva, el identificador sigue al nombre
  const [idManual, setIdManual] = useState(!!inicial);

  const cambiar = <K extends keyof Pieza>(campo: K, valor: Pieza[K]) =>
    setDatos((d) => ({ ...d, [campo]: valor, ...(campo === "nombre" && !idManual ? { id: aIdentificador(String(valor)) } : {}) }));

  const cambiarId = (valor: string) => {
    setIdManual(true);
    setDatos((d) => ({ ...d, id: aIdentificador(valor) }));
  };

  const marcar = (frame: number, x: number, y: number) =>
    setPuntos((ps) => [...ps.filter((p) => p.frame !== frame), { frame, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }]);
  const quitar = (frame: number) => setPuntos((ps) => ps.filter((p) => p.frame !== frame));

  const pieza = (): Pieza => ({ ...datos, tramos: tramosDesdePuntos(puntos, totalFrames, HOTSPOTS.saltoMaximoEnTramo(totalFrames)) });
  const valida = datos.nombre.trim().length > 0 && datos.id.length > 0;

  return { datos, cambiar, cambiarId, puntos, marcar, quitar, pieza, valida };
}
