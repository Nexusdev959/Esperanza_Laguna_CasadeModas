"use client";

import Image from "next/image";
import { useState } from "react";
import { rutaFrame } from "../../config";
import type { PuntoHotspot, VisorSecuencia } from "../../types";
import { BOTON_SECUNDARIO, ETIQUETA } from "./estilosAdmin";

interface Props {
  visor: VisorSecuencia;
  puntos: PuntoHotspot[];
  onMarcar: (frame: number, x: number, y: number) => void;
  onQuitar: (frame: number) => void;
}

/** Elige una foto del uniforme y haz clic sobre la pieza: ese punto aparece en el visor en esa vista. */
export function MarcadorPuntos({ visor, puntos, onMarcar, onQuitar }: Props) {
  const [frame, setFrame] = useState(visor.frameFrente);
  const punto = puntos.find((p) => p.frame === frame);

  const marcar = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onMarcar(frame, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <div className="space-y-3">
      <p className={ETIQUETA}>Ubicación en las fotos</p>
      <p className="text-xs text-[var(--muted)]">
        Elige una foto y haz clic sobre la pieza. Márcala en todas las fotos donde se vea; en las demás no aparece el punto.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={marcar}
          aria-label={`Marcar la pieza en la foto ${frame + 1}`}
          className="relative aspect-[3/4] w-full max-w-[260px] cursor-crosshair overflow-hidden rounded-xl border border-[var(--border-color)] bg-[#f4f6f4]"
        >
          <Image src={rutaFrame(visor.carpeta, "alta", frame)} alt="" fill sizes="260px" className="object-contain" />
          {punto && (
            <span
              className="absolute -ml-2.5 -mt-2.5 h-5 w-5 rounded-full border-2 border-white bg-[#1c785f] shadow"
              style={{ left: `${punto.x}%`, top: `${punto.y}%` }}
            />
          )}
        </button>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: visor.frames }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFrame(i)}
                aria-pressed={i === frame}
                className={`relative h-14 w-11 overflow-hidden rounded-lg border bg-[#f4f6f4] ${i === frame ? "border-primary ring-1 ring-primary" : "border-[var(--border-color)]"}`}
              >
                <Image src={rutaFrame(visor.carpeta, "baja", i)} alt={`Foto ${i + 1}`} fill sizes="44px" className="object-contain" />
                {puntos.some((p) => p.frame === i) && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#1c785f]" />}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--muted)]">
            Foto {frame + 1} de {visor.frames} · {punto ? `punto en ${punto.x}%, ${punto.y}%` : "sin punto"} · marcada en {puntos.length}
          </p>
          {punto && (
            <button type="button" onClick={() => onQuitar(frame)} className={BOTON_SECUNDARIO}>
              Quitar el punto de esta foto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
