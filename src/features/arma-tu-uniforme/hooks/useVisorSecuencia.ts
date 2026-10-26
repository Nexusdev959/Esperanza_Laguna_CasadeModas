import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ANCHO_BAJA, HOTSPOTS, MEDIA_ESCRITORIO, ZOOM } from "../config";
import { frameDeVista, frameDibujado, vistaDeFrame } from "../lib/frames";
import { mejorFrame, posicionHotspot } from "../lib/hotspots";
import type { Pieza, Vista, VisorSecuencia } from "../types";
import { useCargaFrames } from "./useCargaFrames";
import { useMovimientoReducido } from "./useMovimientoReducido";
import { useRotacion } from "./useRotacion";
import { useZoom, type EstadoZoom } from "./useZoom";

export interface OpcionesVisor {
  visor: VisorSecuencia;
  piezas: Pieza[];
  piezaActiva: Pieza | null;
  vista: Vista;
  autoGiro: boolean;
  onVista: (vista: Vista) => void;
}

/** Une giro, zoom, carga y hotspots del visor de secuencia. */
export function useVisorSecuencia({ visor, piezas, piezaActiva, vista, autoGiro, onVista }: OpcionesVisor) {
  const escenario = useRef<HTMLDivElement>(null);
  const reducido = useMovimientoReducido();
  const { zoom, enfocar, cambiar, restablecer, pellizcando } = useZoom(escenario);
  const { frames: total, frameFrente } = visor;
  const [frameInicial] = useState(() => (piezaActiva && mejorFrame(piezaActiva.tramos, total)) ?? frameDeVista(vista, frameFrente, total));
  const alDetenerse = useCallback((f: number) => onVista(vistaDeFrame(f, frameFrente, total)), [onVista, frameFrente, total]);
  const rot = useRotacion({ total, frameInicial, autoGiro: autoGiro && !piezaActiva, reducido, bloqueado: pellizcando, alDetenerse });
  const ancho = useAnchoEscenario(escenario);
  const grande = ancho * window.devicePixelRatio > ANCHO_BAJA;
  const frame = frameDibujado(rot.frame, total);
  const carga = useCargaFrames(visor.carpeta, total, frame, grande || zoom.nivel > ZOOM.umbralAlta);

  useEnfocarPieza(piezaActiva, total, rot.irA, enfocar, restablecer, escenario);

  const visibles = useMemo(() => hotspotsEnCuadro(piezas, rot.frame, total, zoom), [piezas, rot.frame, total, zoom]);

  const verVista = (v: Vista) => (restablecer(), rot.irA(frameDeVista(v, frameFrente, total)));
  const teclado = useTecladoVisor(rot.girar, cambiar, restablecer);

  const etiquetasAfuera = ancho >= HOTSPOTS.anchoEtiquetasAfuera;
  return { escenario, zoom, cambiar, restablecer, girar: rot.girar, gestos: rot.handlers, carga, visibles, etiquetasAfuera, verVista, teclado, frame };
}

/** Al elegir una pieza: girar a su mejor ángulo y acercar un poco sobre ella. */
function useEnfocarPieza(
  pieza: Pieza | null,
  total: number,
  irA: (frame: number, alTerminar?: () => void) => void,
  enfocar: (nivel: number, x?: number, y?: number) => void,
  restablecer: () => void,
  escenario: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    restablecer();
    const frame = pieza && mejorFrame(pieza.tramos, total);
    if (!pieza || frame === null) return;
    // En móvil la hoja de detalle ocupa la parte de abajo: el visor sube para quedar a la vista
    if (!window.matchMedia(MEDIA_ESCRITORIO).matches) escenario.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const pos = posicionHotspot(pieza.tramos, frame, total, 0);
    irA(frame, () => pos && enfocar(ZOOM.pieza, pos.x, pos.y));
    // Solo cuando cambia la pieza, no en cada render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieza?.id]);
}

/** Flechas giran, + y − acercan, 0 restablece. */
function useTecladoVisor(girar: (pasos: number) => void, cambiar: (delta: number) => void, restablecer: () => void) {
  return (e: React.KeyboardEvent) => {
    const acciones: Record<string, () => void> = {
      ArrowLeft: () => girar(-1),
      ArrowRight: () => girar(1),
      "+": () => cambiar(ZOOM.paso),
      "=": () => cambiar(ZOOM.paso),
      "-": () => cambiar(-ZOOM.paso),
      "0": restablecer,
    };
    const accion = acciones[e.key];
    if (!accion) return;
    e.preventDefault();
    accion();
  };
}

/** Hotspots visibles en este frame que, con el zoom aplicado, siguen dentro del escenario. */
function hotspotsEnCuadro(piezas: Pieza[], frame: number, total: number, zoom: EstadoZoom) {
  const enCuadro = (v: number, origen: number) => {
    const visto = origen + (v - origen) * zoom.nivel;
    return visto >= HOTSPOTS.margen && visto <= 100 - HOTSPOTS.margen;
  };
  return piezas.flatMap((pieza) => {
    const pos = posicionHotspot(pieza.tramos, frame, total, HOTSPOTS.fundido);
    return pos && enCuadro(pos.x, zoom.x) && enCuadro(pos.y, zoom.y) ? [{ pieza, ...pos }] : [];
  });
}

/** Ancho del escenario en px (decide resolución de frames y lado de las etiquetas). */
function useAnchoEscenario(ref: React.RefObject<HTMLElement | null>) {
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new ResizeObserver(([e]) => setAncho(e.contentRect.width));
    observador.observe(el);
    return () => observador.disconnect();
  }, [ref]);
  return ancho;
}
