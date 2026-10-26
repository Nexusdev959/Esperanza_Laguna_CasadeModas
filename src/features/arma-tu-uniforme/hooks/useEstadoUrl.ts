import { useCallback, useEffect, useState } from "react";
import { escribirEstado } from "../lib/url-state";
import type { EstadoUrl } from "../types";

/**
 * Estado compartible de la página. Se refleja en la URL con replaceState
 * (sin recargar ni pedir datos al servidor), así el enlace siempre se puede copiar.
 */
export function useEstadoUrl(inicial: EstadoUrl) {
  const [estado, setEstado] = useState(inicial);

  const actualizar = useCallback((cambios: Partial<EstadoUrl>) => setEstado((actual) => ({ ...actual, ...cambios })), []);

  // Fuera del render: Next escucha replaceState y actualiza su router
  useEffect(() => {
    const query = escribirEstado(estado);
    if (window.location.search !== query) window.history.replaceState(null, "", query);
  }, [estado]);

  return { estado, actualizar };
}
