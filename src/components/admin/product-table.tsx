"use client";

import { Search, Edit2, Trash2, Clock } from "lucide-react";

export function ProductTable({ products, onEdit, onDelete }: { products: any[], onEdit?: (p: any) => void, onDelete?: (id: string) => void }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, SKU o categoría..." 
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[var(--background)] text-[var(--muted)] text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Producto</th>
              <th className="px-6 py-4 font-medium">Categoría</th>
              <th className="px-6 py-4 font-medium">Tipo de Venta</th>
              <th className="px-6 py-4 font-medium">Tallas Disponibles</th>
              <th className="px-6 py-4 font-medium">Inventario</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)] text-[var(--foreground)]">
            {products.map(product => {
              return (
              <tr key={product.id} className="hover:bg-[var(--background)]/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium block">{product.name}</span>
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{product.audience?.join(', ')}</span>
                </td>
                <td className="px-6 py-4 text-[var(--muted)]">{product.category}</td>
                <td className="px-6 py-4">
                  {product.mode === "uniforme_completo" ? (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-md text-xs font-medium border border-purple-200 dark:border-purple-900">Combo completo</span>
                  ) : (
                    <span className="text-xs text-[var(--muted)]">Por Unidad</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {product.sizes && typeof product.sizes === 'object' ? Object.keys(product.sizes).filter((k: string) => product.sizes[k].active).map((s: string) => <span key={s} className="px-1.5 py-0.5 border border-[var(--border-color)] rounded text-[10px] font-bold bg-[var(--surface)] text-[var(--muted)]">{s}</span>) : <span className="text-xs text-[var(--muted)]">N/A</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {product.type === "encargo" ? (
                    <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 font-medium"><Clock className="w-3 h-3" /> Bajo Encargo</span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      product.stock > 10 ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-500 dark:border-green-900' :
                      'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-500 dark:border-red-900'
                    }`}>
                      {product.stock} und.
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {product.isPublished !== false ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-xs font-medium border border-blue-200 dark:border-blue-900">Publicado</span>
                  ) : (
                    <span className="px-2 py-1 bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-400 rounded-md text-xs font-medium border border-stone-200 dark:border-stone-700">Oculto</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button onClick={() => onEdit?.(product)} className="p-2 text-[var(--muted)] hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete?.(product.id)} className="p-2 text-[var(--muted)] hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
