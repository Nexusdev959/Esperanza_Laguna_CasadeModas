"use client";

import { MoveHorizontal } from "lucide-react";
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
  const { escenario, zoom, cambiar, restablecer, girar, gestos, lienzo, progreso, visibles, etiquetasAfuera, verVista, teclado, frame, interactuado } = useVisorSecuencia(opciones);
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
            {/* Sombra de piso: con fotos sin fondo el uniforme no queda flotando */}
            <div aria-hidden className="absolute bottom-[3.5%] left-1/2 h-[3%] w-[42%] -translate-x-1/2 rounded-[50%] bg-[#1b1e1c]/15 blur-md" />
            <LienzoFrame {...lienzo} />
            {EDITOR && <EditorHotspots frame={frame} />}
          </div>
          <BarraCarga progreso={progreso} />
        </div>
        {/* Misma escala que el lienzo pero sin recorte: las etiquetas pueden salir del escenario */}
        <div className={`${CAPA} pointer-events-none`} style={escala}>
          <CapaHotspots visibles={visibles} zoom={zoom.nivel} activa={opciones.piezaActiva?.id ?? null} afuera={etiquetasAfuera} onSeleccionar={onSeleccionar} />
        </div>
      </div>
      <p
        aria-hidden
        className={`-my-1 inline-flex items-center justify-center gap-2 font-sans text-[11px] tracking-[0.08em] text-foreground/45 transition-opacity duration-500 ${interactuado ? "opacity-0" : "opacity-100"}`}
      >
        <MoveHorizontal className="h-3.5 w-3.5" />
        Arrastra para girar
      </p>
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
