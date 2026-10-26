"use client";

import { useState } from "react";

/**
 * Solo en desarrollo: con el modo activo, un clic sobre el uniforme copia
 * `{ frame, x, y }` al portapapeles para pegarlo en los tramos de la pieza.
 */
export function EditorHotspots({ frame }: { frame: number }) {
  const [activo, setActivo] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  const marcar = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 1000) / 10;
    const y = Math.round(((e.clientY - r.top) / r.height) * 1000) / 10;
    const texto = `{ frame: ${frame}, x: ${x}, y: ${y} },`;
    navigator.clipboard?.writeText(texto).catch(() => {});
    setCopiado(texto);
  };

  return (
    <>
      {activo && <div className="absolute inset-0 z-10 cursor-crosshair bg-[#2ec4a6]/[0.04]" onPointerDown={marcar} />}
      <div className="absolute left-3 top-3 z-20 flex flex-col items-start gap-1 font-mono text-[10px]" onPointerDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setActivo(!activo)}
          className="rounded-full border border-dashed border-[#2ec4a6] bg-white/90 px-2.5 py-1 text-[#1c785f]"
        >
          {activo ? "Salir del editor" : "Editar hotspots"} · frame {frame}
        </button>
        {activo && copiado && <span className="rounded bg-white/90 px-2 py-0.5 text-[#1b1e1c]">Copiado: {copiado}</span>}
      </div>
    </>
  );
}
