"use client";

import type { Pieza } from "../../types";
import { formatoPrecio } from "../../lib/tienda";
import { CAMPO, ETIQUETA } from "./estilosAdmin";

interface Props {
  datos: Pieza;
  productos: { id: string; nombre: string; precio: number }[];
  onCambiar: <K extends keyof Pieza>(campo: K, valor: Pieza[K]) => void;
  onCambiarId: (valor: string) => void;
}

function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className={ETIQUETA}>{etiqueta}</span>
      {children}
      {ayuda && <span className="block text-xs text-[var(--muted)]">{ayuda}</span>}
    </label>
  );
}

/** Textos de la pieza y el producto de la tienda que le da precio, tallas y stock. */
export function CamposPieza({ datos, productos, onCambiar, onCambiarId }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Campo etiqueta="Nombre">
        <input value={datos.nombre} onChange={(e) => onCambiar("nombre", e.target.value)} required maxLength={80} placeholder="Ej. Boina" className={CAMPO} />
      </Campo>
      <Campo etiqueta="Identificador" ayuda="Va en el enlace del visor (?pieza=…). Solo minúsculas, números y guiones.">
        <input value={datos.id} onChange={(e) => onCambiarId(e.target.value)} required maxLength={60} placeholder="boina" className={CAMPO} />
      </Campo>
      <div className="md:col-span-2">
        <Campo etiqueta="Descripción corta" ayuda="Se ve en la lista de piezas y bajo el nombre.">
          <input value={datos.descripcion} onChange={(e) => onCambiar("descripcion", e.target.value)} maxLength={400} className={CAMPO} />
        </Campo>
      </div>
      <Campo etiqueta="Significado">
        <textarea value={datos.significado} onChange={(e) => onCambiar("significado", e.target.value)} rows={4} maxLength={2000} className={`${CAMPO} resize-y`} />
      </Campo>
      <Campo etiqueta="Uso reglamentario" ayuda="Dónde va y cómo se porta.">
        <textarea value={datos.usoReglamentario} onChange={(e) => onCambiar("usoReglamentario", e.target.value)} rows={4} maxLength={2000} className={`${CAMPO} resize-y`} />
      </Campo>
      <div className="md:col-span-2">
        <Campo etiqueta="Producto de la tienda" ayuda="De aquí salen el precio, las tallas y el stock. Sin producto se muestra «Precio por confirmar» y solo se puede cotizar.">
          <select value={datos.productoId ?? ""} onChange={(e) => onCambiar("productoId", e.target.value || null)} className={CAMPO}>
            <option value="">Sin producto (por confirmar)</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} · {formatoPrecio(p.precio)}
              </option>
            ))}
          </select>
        </Campo>
      </div>
    </div>
  );
}
