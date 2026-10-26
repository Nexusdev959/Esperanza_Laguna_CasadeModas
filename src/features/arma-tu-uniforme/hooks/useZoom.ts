import { useCallback, useEffect, useRef, useState } from "react";
import { ZOOM } from "../config";

export interface EstadoZoom {
  nivel: number;
  /** Punto de enfoque en % del visor (transform-origin). */
  x: number;
  y: number;
}

const limitar = (n: number) => Math.min(ZOOM.max, Math.max(ZOOM.min, n));
const INICIAL: EstadoZoom = { nivel: 1, x: 50, y: 50 };
const enReposo = (z: EstadoZoom) => z.nivel <= ZOOM.min + 0.01;

/** Zoom con rueda, pellizco y botones, con límites. El enfoque solo se mueve partiendo de 1×. */
export function useZoom(ref: React.RefObject<HTMLElement | null>) {
  const [zoom, setZoom] = useState(INICIAL);

  const enfocar = useCallback((nivel: number, x?: number, y?: number) => {
    setZoom((z) => ({
      nivel: limitar(nivel),
      x: enReposo(z) && x !== undefined ? x : z.x,
      y: enReposo(z) && y !== undefined ? y : z.y,
    }));
  }, []);
  const cambiar = useCallback((delta: number) => setZoom((z) => ({ ...z, nivel: limitar(z.nivel + delta) })), []);
  const restablecer = useCallback(() => setZoom(INICIAL), []);
  const rueda = useCallback(
    (deltaY: number, x: number, y: number) =>
      setZoom((z) => ({ nivel: limitar(z.nivel - deltaY * ZOOM.rueda), x: enReposo(z) ? x : z.x, y: enReposo(z) ? y : z.y })),
    []
  );

  const nivel = useRef(zoom.nivel);
  useEffect(() => {
    nivel.current = zoom.nivel;
  }, [zoom.nivel]);
  const pellizcando = useGestosZoom(ref, nivel, rueda, cambiar);
  return { zoom, enfocar, cambiar, restablecer, pellizcando };
}

/** Escucha rueda y pellizco con listeners no pasivos (para que la página no haga scroll mientras tanto). */
function useGestosZoom(
  ref: React.RefObject<HTMLElement | null>,
  nivel: React.RefObject<number>,
  rueda: (deltaY: number, x: number, y: number) => void,
  cambiar: (delta: number) => void
) {
  const pellizco = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const alRodar = (e: WheelEvent) => {
      // En 1× la rueda hacia abajo sigue bajando la página: el visor no atrapa el scroll
      if (nivel.current <= ZOOM.min + 0.01 && e.deltaY > 0) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      rueda(e.deltaY, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    };
    const alTocar = (e: TouchEvent) => {
      if (e.touches.length !== 2) return void (pellizco.current = null);
      e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (pellizco.current) cambiar((d - pellizco.current) / 200);
      pellizco.current = d;
    };
    el.addEventListener("wheel", alRodar, { passive: false });
    el.addEventListener("touchmove", alTocar, { passive: false });
    el.addEventListener("touchend", alTocar);
    return () => {
      el.removeEventListener("wheel", alRodar);
      el.removeEventListener("touchmove", alTocar);
      el.removeEventListener("touchend", alTocar);
    };
  }, [ref, nivel, rueda, cambiar]);

  return useCallback(() => pellizco.current !== null, []);
}
