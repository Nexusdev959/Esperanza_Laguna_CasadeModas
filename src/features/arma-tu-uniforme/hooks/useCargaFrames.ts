import { useCallback, useEffect, useRef, useState } from "react";
import { rutaFrame, type Resolucion } from "../config";
import { ordenDeCarga } from "../lib/frames";

/** Carga y decodifica una imagen; nunca rechaza (un frame roto no frena el resto). */
export const cargarImagen = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => img.decode().then(() => resolve(img), () => resolve(img));
    img.onerror = () => resolve(null);
    img.src = src;
  });

type Imagenes = Record<Resolucion, (HTMLImageElement | null | undefined)[]>;

/**
 * Carga progresiva: primero todos los frames en baja (el giro funciona enseguida) y,
 * cuando `alta` se activa, los de alta empezando por el frame actual.
 */
export function useCargaFrames(carpeta: string, total: number, frameActual: number, alta: boolean) {
  const [imagenes, setImagenes] = useState<Imagenes>({ baja: [], alta: [] });
  const pedidos = useRef<Record<Resolucion, Set<number>>>({ baja: new Set(), alta: new Set() });
  const desde = useRef(frameActual);
  useEffect(() => {
    desde.current = frameActual;
  }, [frameActual]);

  const cargar = useCallback(
    (resolucion: Resolucion) => {
      for (const i of ordenDeCarga(desde.current, total)) {
        if (pedidos.current[resolucion].has(i)) continue;
        pedidos.current[resolucion].add(i);
        cargarImagen(rutaFrame(carpeta, resolucion, i)).then((img) =>
          setImagenes((prev) => ({ ...prev, [resolucion]: Object.assign([...prev[resolucion]], { [i]: img }) }))
        );
      }
    },
    [carpeta, total]
  );

  useEffect(() => cargar("baja"), [cargar]);

  const bajas = imagenes.baja.filter((img) => img !== undefined).length;
  const listaBaja = bajas >= total;
  useEffect(() => {
    if (alta && listaBaja) cargar("alta");
  }, [alta, listaBaja, cargar]);

  return {
    /** La mejor imagen disponible para el frame actual, o null si aún no llega ninguna. */
    imagen: imagenes.alta[frameActual] ?? imagenes.baja[frameActual] ?? null,
    progreso: Math.min(1, bajas / total),
  };
}
