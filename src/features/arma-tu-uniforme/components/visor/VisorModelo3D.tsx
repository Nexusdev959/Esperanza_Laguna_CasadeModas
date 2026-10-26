"use client";

import type { VisorModelo3D as DatosModelo3D } from "../../types";

/**
 * Lugar reservado para el visor 3D (.glb). Recibe las mismas props que VisorSecuencia.
 * shortcut: no hay visor 3D todavía; implementarlo con react-three-fiber cargado con next/dynamic cuando exista un .glb real.
 */
export function VisorModelo3D({ visor }: { visor: DatosModelo3D }) {
  return (
    <div className="mx-auto flex aspect-[3/4] w-full max-w-md items-center justify-center rounded-[2rem] bg-[#f4f6f4] text-center text-sm text-[#64748b]">
      Vista 3D en preparación ({visor.glb})
    </div>
  );
}
