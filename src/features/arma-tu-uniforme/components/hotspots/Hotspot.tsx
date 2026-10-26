"use client";

import { useState } from "react";
import { FOCO } from "../estilos";
import { EtiquetaPieza } from "./EtiquetaPieza";

interface Props {
  nombre: string;
  x: number;
  y: number;
  opacidad: number;
  /** Compensa el zoom del visor para que el punto conserve su tamaño. */
  escala: number;
  activa: boolean;
  lado: "izquierda" | "derecha";
  onSeleccionar: () => void;
}

/** Punto discreto sobre una pieza visible; al pasar el cursor o enfocarlo muestra su etiqueta. */
export function Hotspot({ nombre, x, y, opacidad, escala, activa, lado, onSeleccionar }: Props) {
  const [abierta, setAbierta] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Ver ${nombre}`}
      aria-pressed={activa}
      tabIndex={opacidad < 0.5 ? -1 : 0}
      // El visor captura el puntero para girar: sin esto el clic nunca llega al punto
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onSeleccionar}
      onPointerEnter={() => setAbierta(true)}
      onPointerLeave={() => setAbierta(false)}
      onFocus={() => setAbierta(true)}
      onBlur={() => setAbierta(false)}
      className={`group absolute -ml-4 -mt-4 flex h-8 w-8 items-center justify-center rounded-full transition-opacity duration-150 ${FOCO}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: opacidad,
        transform: `scale(${escala})`,
        pointerEvents: opacidad < 0.3 ? "none" : "auto",
      }}
    >
      <span
        className={`absolute h-5 w-5 rounded-full border transition-all duration-300 ${
          activa ? "scale-100 border-[#d4af37]" : "scale-75 border-white/80 group-hover:scale-100"
        }`}
      />
      <span
        className={`h-2 w-2 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,0.55)] transition-colors ${activa ? "bg-[#d4af37]" : "bg-[#1c785f]"}`}
      />
      <EtiquetaPieza nombre={nombre} visible={abierta || activa} lado={lado} />
    </button>
  );
}
