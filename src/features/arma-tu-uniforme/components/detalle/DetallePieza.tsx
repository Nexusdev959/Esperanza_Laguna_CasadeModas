"use client";

import type { usePiezaActiva } from "../../hooks/usePiezaActiva";
import type { useUniformeArmado } from "../../hooks/useUniformeArmado";
import type { LineaUniforme } from "../../lib/tienda";
import type { Uniforme } from "../../types";
import { ROTULO } from "../estilos";
import { ContenidoPieza } from "./ContenidoPieza";
import { NavegacionPiezas } from "./NavegacionPiezas";
import { PanelDetalle } from "./PanelDetalle";

interface Props {
  uniforme: Uniforme;
  activa: ReturnType<typeof usePiezaActiva>;
  armado: ReturnType<typeof useUniformeArmado>;
  onAgregar: (lineas: LineaUniforme[]) => void;
}

/** Lo que muestra la columna de detalle antes de elegir una pieza. */
function IntroUniforme({ uniforme }: { uniforme: Uniforme }) {
  return (
    <div className="flex flex-col gap-3 border-t border-foreground/[0.08] pt-4">
      <p className={ROTULO}>El uniforme</p>
      <h2 className="font-sans text-xl font-semibold tracking-tight text-foreground">{uniforme.nombre}</h2>
      <p className="font-sans text-sm leading-relaxed text-foreground/60">{uniforme.descripcion}</p>
      <p className="font-sans text-sm text-foreground/50">Toca un punto sobre el uniforme o elige una pieza de la lista para ver su detalle.</p>
    </div>
  );
}

/** Une el panel con la ficha de la pieza activa y la navegación entre piezas. */
export function DetallePieza({ uniforme, activa, armado, onAgregar }: Props) {
  const { pieza, vecinas, seleccionar } = activa;
  const linea = pieza ? armado.linea(pieza) : null;

  return (
    <PanelDetalle abierto={pieza?.id ?? null} onCerrar={() => seleccionar(null)} vacio={<IntroUniforme uniforme={uniforme} />}>
      {pieza && linea && (
        <div className="flex flex-col gap-6">
          <ContenidoPieza
            pieza={pieza}
            producto={linea.producto}
            talla={linea.talla}
            incluida={armado.incluida(pieza.id)}
            onTalla={(t) => armado.elegirTalla(pieza.id, t)}
            onAlternar={() => armado.alternar(pieza.id)}
            onAgregar={() => onAgregar([linea])}
          />
          <NavegacionPiezas
            anterior={vecinas ? { nombre: vecinas.anterior.nombre, onIr: () => seleccionar(vecinas.anterior.id) } : undefined}
            siguiente={vecinas ? { nombre: vecinas.siguiente.nombre, onIr: () => seleccionar(vecinas.siguiente.id) } : undefined}
          />
        </div>
      )}
    </PanelDetalle>
  );
}
