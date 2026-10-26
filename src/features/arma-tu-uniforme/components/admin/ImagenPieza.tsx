"use client";

import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { cldImage } from "@/lib/cloudinary";
import { useSubirImagen } from "../../hooks/useSubirImagen";
import { BOTON_SECUNDARIO, ETIQUETA } from "./estilosAdmin";

interface Props {
  url: string | null;
  onCambiar: (url: string | null) => void;
}

/** Foto de detalle de la pieza (la que se ve en el panel del visor). */
export function ImagenPieza({ url, onCambiar }: Props) {
  const { subir, subiendo } = useSubirImagen();

  const elegir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    const nueva = await subir(archivo);
    if (nueva) onCambiar(nueva);
  };

  return (
    <div className="space-y-2">
      <p className={ETIQUETA}>Foto de detalle</p>
      <div className="flex items-center gap-4">
        <div className="relative aspect-[4/3] w-40 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[#f4f6f4]">
          {url ? (
            <Image src={cldImage(url, 320) ?? url} alt="Foto de detalle" fill unoptimized className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-[var(--muted)]">Sin foto</span>
          )}
          {subiendo && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/70">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className={`${BOTON_SECUNDARIO} cursor-pointer`}>
            <ImagePlus className="h-4 w-4" />
            {url ? "Cambiar foto" : "Subir foto"}
            <input type="file" accept="image/*" className="sr-only" onChange={elegir} disabled={subiendo} />
          </label>
          {url && (
            <button type="button" onClick={() => onCambiar(null)} className="text-left text-xs text-[var(--muted)] hover:text-red-500">
              Quitar foto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
