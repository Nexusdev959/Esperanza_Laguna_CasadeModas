import { useCallback, useSyncExternalStore } from "react";
import { MEDIA_ESCRITORIO } from "../config";

/** Media query reactiva; en el servidor devuelve `servidor`. */
export function useMediaQuery(query: string, servidor = false) {
  const subscribe = useCallback(
    (avisar: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", avisar);
      return () => mql.removeEventListener("change", avisar);
    },
    [query]
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => servidor);
}

export const useMovimientoReducido = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useEsEscritorio = () => useMediaQuery(MEDIA_ESCRITORIO, true);
