import { useCallback, useEffect, useRef } from "react";

/**
 * Un solo bucle requestAnimationFrame a la vez. `paso` recibe los ms desde el tick anterior
 * y devuelve false para terminar. Iniciar una animación cancela la anterior.
 * `animar` devuelve un turno: `detener(turno)` solo cancela si esa animación sigue siendo la actual.
 */
export function useAnimacion() {
  const raf = useRef(0);
  const turno = useRef(0);

  const detener = useCallback((de?: number) => {
    if (de === undefined || de === turno.current) cancelAnimationFrame(raf.current);
  }, []);

  const animar = useCallback(
    (paso: (dt: number) => boolean) => {
      cancelAnimationFrame(raf.current);
      const propio = ++turno.current;
      let anterior = performance.now();
      const tick = (ahora: number) => {
        const sigue = paso(Math.min(ahora - anterior, 64));
        anterior = ahora;
        if (sigue && propio === turno.current) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
      return propio;
    },
    []
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return { animar, detener };
}
