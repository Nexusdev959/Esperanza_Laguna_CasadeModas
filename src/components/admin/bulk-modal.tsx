"use client";

import { useState } from "react";
import { X, Plus, Trash2, TrendingDown, Gift } from "lucide-react";
import { api } from "@/lib/api";
import { formatCOP } from "@/lib/price";
import { useNotification } from "@/components/ui/notification-provider";

type Tier =
  | { min: number; type: "PRICE"; price: number }
  | { min: number; type: "GIFT"; giftProductId: string; giftQty: number; every: number };

type Product = { id: string; name: string; price: number; isUniform?: boolean; archivedAt?: string | null; bulkTiers?: Tier[] | null; compareAtPrice?: number | null };

const input = "w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none";

/** Beneficios por mayor que el admin pone a mano: precio especial por unidad o producto de regalo. */
export function BulkModal({ product, products, onClose, onSaved }: { product: Product; products: Product[]; onClose: () => void; onSaved: () => void }) {
  const [tiers, setTiers] = useState<Tier[]>(Array.isArray(product.bulkTiers) ? product.bulkTiers : []);
  const [compareAt, setCompareAt] = useState(product.compareAtPrice?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();
  // Un uniforme no puede ser regalo: ocuparía cupo del taller (el servidor también lo impide)
  const giftOptions = products.filter((p) => !p.isUniform && !p.archivedAt);

  const update = (n: number, patch: Partial<Tier>) => setTiers((list) => list.map((t, i) => (i === n ? ({ ...t, ...patch } as Tier) : t)));
  const add = (type: Tier["type"]) => setTiers((list) => [
    ...list,
    type === "PRICE"
      ? { min: 10, type, price: Math.round(product.price * 0.9) }
      : { min: 10, type, giftProductId: giftOptions[0]?.id ?? "", giftQty: 1, every: 10 },
  ]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/products/${product.id}/bulk`, { bulkTiers: tiers, compareAtPrice: compareAt ? Number(compareAt) : null });
      showNotification("Beneficios por cantidad guardados", "success");
      onSaved();
    } catch (e) {
      showNotification((e as { response?: { data?: { error?: string } } }).response?.data?.error || "No se pudieron guardar los beneficios", "error");
    } finally {
      setSaving(false);
    }
  };

  const giftName = (id: string) => products.find((p) => p.id === id)?.name.trim() ?? "producto";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="bulk-modal-title">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[var(--surface)] border border-[var(--border-color)] shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-[var(--border-color)]">
          <div>
            <h2 id="bulk-modal-title" className="text-xl font-semibold text-[var(--foreground)]">Beneficios por cantidad · {product.name.trim()}</h2>
            <p className="text-sm text-[var(--muted)]">Precio normal {formatCOP(product.price)}. Se aplican solos en el carrito y en el pedido; si hay promoción, vale el precio más bajo.</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-full hover:bg-[var(--background)]"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {tiers.length === 0 && <p className="text-sm text-[var(--muted)]">Sin beneficios. Agrega un precio por mayor o un regalo.</p>}
          {tiers.map((t, n) => (
            <div key={n} className="p-4 rounded-2xl border border-[var(--border-color)] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  {t.type === "PRICE" ? <TrendingDown className="w-4 h-4 text-primary" /> : <Gift className="w-4 h-4 text-amber-500" />}
                  {t.type === "PRICE" ? "Precio por mayor" : "Producto de regalo"}
                </span>
                <button onClick={() => setTiers((list) => list.filter((_, i) => i !== n))} aria-label="Quitar escalón" className="p-1.5 text-[var(--muted)] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="text-xs text-[var(--muted)]">Desde (unidades)
                  <input type="number" min={2} value={t.min} onChange={(e) => update(n, { min: Number(e.target.value) })} className={`${input} mt-1`} />
                </label>
                {t.type === "PRICE" ? (
                  <label className="text-xs text-[var(--muted)] sm:col-span-3">Precio por unidad
                    <input type="number" min={1} step={100} value={t.price} onChange={(e) => update(n, { price: Number(e.target.value) })} className={`${input} mt-1 ${t.price >= product.price ? "border-red-500" : ""}`} />
                  </label>
                ) : (
                  <>
                    <label className="text-xs text-[var(--muted)] col-span-2 sm:col-span-1">Regalo
                      <select value={t.giftProductId} onChange={(e) => update(n, { giftProductId: e.target.value })} className={`${input} mt-1`}>
                        {giftOptions.map((p) => <option key={p.id} value={p.id}>{p.name.trim()}</option>)}
                      </select>
                    </label>
                    <label className="text-xs text-[var(--muted)]">Cantidad
                      <input type="number" min={1} value={t.giftQty} onChange={(e) => update(n, { giftQty: Number(e.target.value) })} className={`${input} mt-1`} />
                    </label>
                    <label className="text-xs text-[var(--muted)]">Por cada
                      <input type="number" min={1} value={t.every} onChange={(e) => update(n, { every: Number(e.target.value) })} className={`${input} mt-1`} />
                    </label>
                  </>
                )}
              </div>
              <p className="text-xs text-[var(--muted)]">
                {t.type === "PRICE"
                  ? `Desde ${t.min} unidades, cada una a ${formatCOP(t.price || 0)}${t.price < product.price ? ` (ahorro de ${Math.round((1 - t.price / product.price) * 100)}%)` : ""}.`
                  : `Desde ${t.min} unidades, regalamos ${t.giftQty} × ${giftName(t.giftProductId)} por cada ${t.every} compradas.`}
              </p>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <button onClick={() => add("PRICE")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm hover:bg-[var(--background)]"><Plus className="w-4 h-4" /> Precio por mayor</button>
            <button onClick={() => add("GIFT")} disabled={!giftOptions.length} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm hover:bg-[var(--background)] disabled:opacity-50"><Plus className="w-4 h-4" /> Regalo</button>
          </div>

          <label className="block pt-4 border-t border-[var(--border-color)]">
            <span className="text-sm font-medium text-[var(--foreground)]">Precio por separado (kits, opcional)</span>
            <span className="block text-xs text-[var(--muted)]">Lo que costarían las piezas sueltas. La tienda muestra el precio tachado y «Ahorras».</span>
            <input type="number" min={0} step={100} value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="Vacío: no es un kit" className={`${input} mt-1.5 max-w-xs`} />
          </label>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-sm">Cancelar</button>
          <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50">
            {saving ? "Guardando…" : "Guardar beneficios"}
          </button>
        </div>
      </div>
    </div>
  );
}
