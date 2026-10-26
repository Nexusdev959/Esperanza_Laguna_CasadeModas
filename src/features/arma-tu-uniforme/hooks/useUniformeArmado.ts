import { useCallback, useMemo, useState } from "react";
import type { LineaUniforme, ProductoPieza } from "../lib/tienda";
import type { Pieza } from "../types";

type Eleccion = { incluida: boolean; talla?: string };

/** Piezas elegidas para el uniforme, con su talla, y el total con los precios reales. */
export function useUniformeArmado(piezas: Pieza[], productos: Record<string, ProductoPieza | null>) {
  const [elecciones, setElecciones] = useState<Record<string, Eleccion>>({});

  const linea = useCallback(
    (pieza: Pieza): LineaUniforme => ({
      pieza,
      producto: pieza.productoId ? productos[pieza.productoId] ?? null : null,
      talla: elecciones[pieza.id]?.talla,
    }),
    [productos, elecciones]
  );

  const elegidas = useMemo(() => piezas.filter((p) => elecciones[p.id]?.incluida).map(linea), [piezas, elecciones, linea]);
  const total = elegidas.reduce((suma, l) => suma + (l.producto?.precio ?? 0), 0);

  const alternar = useCallback((id: string) => {
    setElecciones((e) => ({ ...e, [id]: { ...e[id], incluida: !e[id]?.incluida } }));
  }, []);
  // Elegir talla también suma la pieza al uniforme
  const elegirTalla = useCallback((id: string, talla: string) => {
    setElecciones((e) => ({ ...e, [id]: { incluida: true, talla } }));
  }, []);

  return {
    elegidas,
    total,
    /** Para cotizar: lo elegido o, si no se eligió nada, el uniforme completo. */
    paraCotizar: elegidas.length > 0 ? elegidas : piezas.map(linea),
    linea,
    incluida: (id: string) => !!elecciones[id]?.incluida,
    alternar,
    elegirTalla,
  };
}
