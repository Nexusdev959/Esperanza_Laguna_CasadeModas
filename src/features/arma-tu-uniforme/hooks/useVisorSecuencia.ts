import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ANCHO_BAJA, HOTSPOTS, MEDIA_ESCRITORIO, VISTAS, ZOOM } from "../config";
import { frameDeVista, mezcla, vistaDeFrame } from "../lib/frames";
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
  onVista: (vista: Vista) => void;
}

/** Une giro, zoom, carga y hotspots del visor de secuencia. */
export function useVisorSecuencia({ visor, piezas, piezaActiva, vista, onVista }: OpcionesVisor) {
  const escenario = useRef<HTMLDivElement>(null);
  const reducido = useMovimientoReducido();
  const { zoom, enfocar, cambiar, restablecer, pellizcando } = useZoom(escenario);
  const { frames: total, frameFrente, frameEspalda } = visor;
  const [frameInicial] = useState(() => (piezaActiva && mejorFrame(piezaActiva.tramos, total)) ?? frameDeVista(vista, frameFrente, total, frameEspalda));
  const alDetenerse = useCallback((f: number) => onVista(vistaDeFrame(f, frameFrente, total, frameEspalda)), [onVista, frameFrente, total, frameEspalda]);
  const pocasVistas = total <= VISTAS.maxFramesConFundido;
  const rot = useRotacion({ total, frameInicial, reducido, conInercia: !pocasVistas, bloqueado: pellizcando, alDetenerse });
  const ancho = useAnchoEscenario(escenario);
  const grande = ancho * window.devicePixelRatio > ANCHO_BAJA;
  const m = mezcla(rot.frame, total, pocasVistas ? VISTAS.anchoFundido : 0);
  const frame = m.t >= 0.5 ? m.b : m.a;
  const carga = useCargaFrames(visor.carpeta, total, frame, grande || zoom.nivel > ZOOM.umbralAlta);
  const lienzo = { base: carga.imagenDe(m.a), siguiente: carga.imagenDe(m.b), mezcla: m.t, efectoGiro: pocasVistas };

  useEnfocarPieza(piezaActiva, total, rot.irA, enfocar, restablecer, escenario);

  // Los puntos siguen a la foto que se ve (frame entero + fundido), no al giro continuo
  const frameVisual = m.a + m.t;
  const visibles = useMemo(() => hotspotsEnCuadro(piezas, frameVisual, total, zoom), [piezas, frameVisual, total, zoom]);

  const verVista = (v: Vista) => (restablecer(), rot.irA(frameDeVista(v, frameFrente, total, frameEspalda)));
  const teclado = useTecladoVisor(rot.girar, cambiar, restablecer);

  const etiquetasAfuera = ancho >= HOTSPOTS.anchoEtiquetasAfuera;
  return { escenario, zoom, cambiar, restablecer, girar: rot.girar, gestos: rot.handlers, lienzo, progreso: carga.progreso, visibles, etiquetasAfuera, verVista, teclado, frame, interactuado: rot.interactuado };
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
    const pos = posicionHotspot(pieza.tramos, frame, total, Math.max(HOTSPOTS.fundidoMinimo, (total * HOTSPOTS.fundidoGrados) / 360));
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
