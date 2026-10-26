"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, Link2, MapPin, Pencil, Trash2 } from "lucide-react";
import { cldImage } from "@/lib/cloudinary";
import type { PiezaGuardada } from "../../lib/contenido";
import { BOTON_ICONO, TARJETA } from "./estilosAdmin";

interface Props {
  piezas: PiezaGuardada[];
  onEditar: (p: PiezaGuardada) => void;
  onBorrar: (p: PiezaGuardada) => void;
  onMover: (indice: number, paso: -1 | 1) => void;
}

/** Piezas guardadas en el orden en que aparecen en el visor. */
export function ListaPiezasAdmin({ piezas, onEditar, onBorrar, onMover }: Props) {
  return (
    <ol className={`${TARJETA} divide-y divide-[var(--border-color)] overflow-hidden`}>
      {piezas.map((p, i) => (
        <li key={p.registro} className="flex items-center gap-4 px-4 py-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f4f6f4]">
            {p.imagenDetalle && <Image src={cldImage(p.imagenDetalle, 96) ?? p.imagenDetalle} alt="" fill unoptimized className="object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--foreground)]">{p.nombre}</p>
            <p className="flex flex-wrap gap-x-3 text-xs text-[var(--muted)]">
              <span>?pieza={p.id}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{p.tramos.flat().length} fotos</span>
              <span className={`inline-flex items-center gap-1 ${p.productoId ? "" : "text-amber-600"}`}>
                <Link2 className="h-3 w-3" />{p.productoId ? "Con producto" : "Sin producto"}
              </span>
            </p>
          </div>
          <div className="flex items-center">
            <button type="button" onClick={() => onMover(i, -1)} disabled={i === 0} className={BOTON_ICONO} aria-label={`Subir ${p.nombre}`}><ArrowUp className="h-4 w-4" /></button>
            <button type="button" onClick={() => onMover(i, 1)} disabled={i === piezas.length - 1} className={BOTON_ICONO} aria-label={`Bajar ${p.nombre}`}><ArrowDown className="h-4 w-4" /></button>
            <button type="button" onClick={() => onEditar(p)} className={BOTON_ICONO} aria-label={`Editar ${p.nombre}`}><Pencil className="h-4 w-4" /></button>
            <button type="button" onClick={() => onBorrar(p)} className={`${BOTON_ICONO} hover:text-red-500`} aria-label={`Eliminar ${p.nombre}`}><Trash2 className="h-4 w-4" /></button>
          </div>
        </li>
      ))}
    </ol>
  );
}
