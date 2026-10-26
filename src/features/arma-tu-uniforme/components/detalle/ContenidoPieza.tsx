"use client";

import Image from "next/image";
import { formatoPrecio, type ProductoPieza } from "../../lib/tienda";
import type { Pieza } from "../../types";
import { BOTON_LINEA, BOTON_MARCA, ROTULO } from "../estilos";
import { SelectorTalla } from "./SelectorTalla";

interface Props {
  pieza: Pieza;
  producto: ProductoPieza | null;
  talla?: string;
  incluida: boolean;
  onTalla: (talla: string) => void;
  onAlternar: () => void;
  onAgregar: () => void;
}

function Seccion({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="border-t border-foreground/[0.08] pt-3">
      <h4 className={ROTULO}>{titulo}</h4>
      <p className="mt-1.5 font-sans text-sm leading-relaxed text-foreground/75">{texto}</p>
    </div>
  );
}

/** Ficha de la pieza: foto de detalle, textos, precio, talla y acciones. */
export function ContenidoPieza({ pieza, producto, talla, incluida, onTalla, onAlternar, onAgregar }: Props) {
  return (
    <article className="flex flex-col gap-5">
      <div className="relative aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-2xl bg-[#f4f6f4]">
        {pieza.imagenDetalle ? (
          <Image src={pieza.imagenDetalle} alt={`Detalle: ${pieza.nombre}`} fill sizes="(min-width: 1024px) 360px, 90vw" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-sans text-xs text-[#64748b]">Foto de detalle por confirmar</span>
        )}
      </div>

      <header>
        <h3 className="font-sans text-2xl font-semibold tracking-tight text-foreground">{pieza.nombre}</h3>
        <p className="mt-1 font-sans text-sm text-foreground/60">{pieza.descripcion}</p>
        <p className="mt-3 font-sans text-lg font-medium text-foreground">
          {producto ? formatoPrecio(producto.precio) : <span className="text-sm text-foreground/50">Precio por confirmar</span>}
        </p>
        {producto && (
          <p className="mt-0.5 font-sans text-xs text-foreground/45">{producto.stock > 0 ? `${producto.stock} disponibles` : "Sin unidades en stock por ahora"}</p>
        )}
      </header>

      <Seccion titulo="Significado" texto={pieza.significado} />
      <Seccion titulo="Uso reglamentario" texto={pieza.usoReglamentario} />

      {producto && <SelectorTalla tallas={producto.tallas} elegida={talla} onElegir={onTalla} />}

      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
        <button type="button" onClick={onAgregar} disabled={!producto} className={`${BOTON_MARCA} flex-1 px-5 py-3 text-sm`}>
          Agregar al carrito
        </button>
        <button type="button" onClick={onAlternar} aria-pressed={incluida} className={`${BOTON_LINEA} flex-1 px-5 py-3 text-sm`}>
          {incluida ? "Quitar de mi uniforme" : "Sumar a mi uniforme"}
        </button>
      </div>
    </article>
  );
}
