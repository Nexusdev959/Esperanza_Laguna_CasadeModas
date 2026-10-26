"use client";

import dynamic from "next/dynamic";
import type { usePiezaActiva } from "../hooks/usePiezaActiva";
import type { useUniformeArmado } from "../hooks/useUniformeArmado";
import type { LineaUniforme } from "../lib/tienda";
import type { Uniforme, Vista } from "../types";
import { DetallePieza } from "./detalle/DetallePieza";
import { ListaPiezas } from "./piezas/ListaPiezas";
import { EsperaVisor } from "./visor/EsperaVisor";

// El visor (canvas, gestos, animaciones) se descarga aparte y no frena el resto de la página
const Visor = dynamic(() => import("./visor/Visor").then((m) => m.Visor), { ssr: false, loading: () => <EsperaVisor /> });

interface Props {
  uniforme: Uniforme;
  vista: Vista;
  activa: ReturnType<typeof usePiezaActiva>;
  armado: ReturnType<typeof useUniformeArmado>;
  onAgregar: (lineas: LineaUniforme[]) => void;
  onVista: (vista: Vista) => void;
}

/** Lista de piezas, visor y detalle: tres columnas en escritorio; en móvil el visor va primero. */
export function MesaUniforme({ uniforme, vista, activa, armado, onAgregar, onVista }: Props) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)_minmax(300px,360px)] lg:items-start lg:gap-12">
      <div className="order-2 lg:order-1 lg:sticky lg:top-32">
        <ListaPiezas piezas={uniforme.piezas} activa={activa.pieza?.id ?? null} incluida={armado.incluida} onSeleccionar={activa.seleccionar} />
      </div>
      <div className="order-1 lg:order-2">
        <Visor uniforme={uniforme} piezaActiva={activa.pieza} vista={vista} onSeleccionar={activa.seleccionar} onVista={onVista} />
      </div>
      <div className="order-3 lg:sticky lg:top-32">
        <DetallePieza uniforme={uniforme} activa={activa} armado={armado} onAgregar={onAgregar} />
      </div>
    </div>
  );
}
