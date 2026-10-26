"use client";

import type { PosicionHotspot } from "../../lib/hotspots";
import type { Pieza } from "../../types";
import { Hotspot } from "./Hotspot";

interface Props {
  visibles: (PosicionHotspot & { pieza: Pieza })[];
  zoom: number;
  activa: string | null;
  /** Etiquetas hacia afuera del uniforme (escenario ancho) o hacia el centro (móvil). */
  afuera: boolean;
  onSeleccionar: (id: string) => void;
}

/** Puntos de las piezas que se ven en el frame actual. */
export function CapaHotspots({ visibles, zoom, activa, afuera, onSeleccionar }: Props) {
  return (
    <div className="absolute inset-0">
      {visibles.map(({ pieza, x, y, opacidad }) => (
        <Hotspot
          key={pieza.id}
          nombre={pieza.nombre}
          x={x}
          y={y}
          opacidad={opacidad}
          escala={1 / zoom}
          lado={(x < 50) === afuera ? "izquierda" : "derecha"}
          activa={activa === pieza.id}
          onSeleccionar={() => onSeleccionar(pieza.id)}
        />
      ))}
    </div>
  );
}
