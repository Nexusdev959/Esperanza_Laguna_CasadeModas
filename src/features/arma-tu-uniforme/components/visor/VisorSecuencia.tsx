"use client";

import { ZOOM } from "../../config";
import { useVisorSecuencia, type OpcionesVisor } from "../../hooks/useVisorSecuencia";
import { CapaHotspots } from "../hotspots/CapaHotspots";
import { EditorHotspots } from "../dev/EditorHotspots";
import { FOCO } from "../estilos";
import { BarraCarga } from "./BarraCarga";
import { ControlesVisor } from "./ControlesVisor";
import { LienzoFrame } from "./LienzoFrame";

interface Props extends OpcionesVisor {
  onSeleccionar: (id: string) => void;
}

const EDITOR = process.env.NODE_ENV === "development";
const CAPA = "absolute inset-0 transition-transform duration-300 ease-out motion-reduce:transition-none";

/** Visor de fotos en secuencia: escenario con el frame actual, hotspots y controles. */
export function VisorSecuencia({ onSeleccionar, ...opciones }: Props) {
  const { escenario, zoom, cambiar, restablecer, girar, gestos, carga, visibles, etiquetasAfuera, verVista, teclado, frame } = useVisorSecuencia(opciones);
  const escala = { transform: `scale(${zoom.nivel})`, transformOrigin: `${zoom.x}% ${zoom.y}%` };
  return (
    <div className="flex h-full flex-col gap-4">
      <div
        ref={escenario}
        tabIndex={0}
        role="group"
        aria-roledescription="visor 360°"
        aria-label="Uniforme en 360°. Arrastra o usa las flechas para girarlo; + y − para acercar."
        onKeyDown={teclado}
        {...gestos}
        className={`relative mx-auto aspect-[3/4] scroll-mt-28 w-full max-h-[72vh] max-w-[calc(72vh*0.75)] cursor-grab touch-none select-none rounded-[2rem] active:cursor-grabbing ${FOCO}`}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#f4f6f4]">
          <div className={CAPA} style={escala}>
            <LienzoFrame imagen={carga.imagen} />
            {EDITOR && <EditorHotspots frame={frame} />}
          </div>
          <BarraCarga progreso={carga.progreso} />
        </div>
        {/* Misma escala que el lienzo pero sin recorte: las etiquetas pueden salir del escenario */}
        <div className={`${CAPA} pointer-events-none`} style={escala}>
          <CapaHotspots visibles={visibles} zoom={zoom.nivel} activa={opciones.piezaActiva?.id ?? null} afuera={etiquetasAfuera} onSeleccionar={onSeleccionar} />
        </div>
      </div>
      <ControlesVisor
        vista={opciones.vista}
        onGirar={girar}
        onVista={verVista}
        onZoom={cambiar}
        onRestablecer={restablecer}
        pasoZoom={ZOOM.paso}
      />
    </div>
  );
}
