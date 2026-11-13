"use client";

import { useEffect, useState } from "react";
import { X, ImagePlus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useNotification } from "@/components/ui/notification-provider";
import { PromoSlide, type PromoProduct } from "@/components/promotions";

const input = "w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none";

/** Ancho/alto real de la imagen elegida: con eso la tarjeta respeta si es horizontal o vertical. */
const measure = (src: string) => new Promise<number>((resolve) => {
  const img = new Image();
  img.onload = () => resolve(img.naturalWidth / img.naturalHeight || 1);
  img.onerror = () => resolve(1);
  img.src = src;
});

export function PromoModal({ product, onClose, onSaved }: { product: PromoProduct; onClose: () => void; onSaved: () => void }) {
  const [active, setActive] = useState(product.promoActive ?? false);
  const [price, setPrice] = useState(product.promoPrice?.toString() ?? "");
  const [title, setTitle] = useState(product.promoTitle ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState(product.promoImage ?? null);
  const [ratio, setRatio] = useState(product.promoImageRatio ?? null);
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();

  // La vista previa local se libera al cambiar de imagen o cerrar
  useEffect(() => () => { if (image?.startsWith("blob:")) URL.revokeObjectURL(image); }, [image]);

  const pick = async (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return showNotification("Elige una imagen (JPG, PNG o WebP)", "error");
    if (f.size > 8 * 1024 * 1024) return showNotification("La imagen pesa más de 8 MB", "error");
    const url = URL.createObjectURL(f);
    setRatio(await measure(url));
    setFile(f);
    setImage(url);
  };

  const promoPrice = Number(price);
  const invalidPrice = price !== "" && !(promoPrice > 0 && promoPrice < Number(product.price));

  const save = async () => {
    setSaving(true);
    const data = new FormData();
    data.append("promoActive", String(active));
    data.append("promoPrice", price);
    data.append("promoTitle", title);
    if (file) { data.append("image", file); data.append("promoImageRatio", String(ratio ?? 1)); }
    else if (!image && product.promoImage) data.append("removeImage", "true");
    try {
      await api.put(`/products/${product.id}/promo`, data, { headers: { "Content-Type": "multipart/form-data" } });
      showNotification(active ? "Promoción publicada en el inicio" : "Promoción guardada (no visible)", "success");
      onSaved();
    } catch (e) {
      showNotification((e as { response?: { data?: { error?: string } } }).response?.data?.error || "No se pudo guardar la promoción", "error");
    } finally {
      setSaving(false);
    }
  };

  const preview: PromoProduct = { ...product, promoActive: true, promoPrice: invalidPrice || !price ? null : promoPrice, promoTitle: title || null, promoImage: image, promoImageRatio: ratio };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="promo-modal-title">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[var(--surface)] border border-[var(--border-color)] shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-[var(--border-color)]">
          <div>
            <h2 id="promo-modal-title" className="text-xl font-semibold text-[var(--foreground)]">Promoción · {product.name}</h2>
            <p className="text-sm text-[var(--muted)]">Las promociones activas salen primero en el inicio, en «Aprovecha nuestras promociones».</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-full hover:bg-[var(--background)]"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-5">
            <label className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--border-color)] cursor-pointer">
              <span>
                <span className="block text-sm font-medium text-[var(--foreground)]">Mostrar en promociones</span>
                <span className="block text-xs text-[var(--muted)]">Apágala cuando termine; la configuración se conserva.</span>
              </span>
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-5 h-5 accent-[#1c785f]" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[var(--foreground)]">Precio de promoción (opcional)</span>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="100" placeholder={`Normal: ${Number(product.price).toLocaleString("es-CO")}`} className={`${input} mt-1.5 ${invalidPrice ? "border-red-500" : ""}`} />
              <span className={`block mt-1 text-xs ${invalidPrice ? "text-red-500" : "text-[var(--muted)]"}`}>
                {invalidPrice ? "Debe ser menor que el precio normal." : "Es lo que se cobra mientras la promoción esté activa. Vacío: se destaca sin rebaja."}
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[var(--foreground)]">Frase corta (opcional)</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="Ej. Temporada de investiduras" className={`${input} mt-1.5`} />
            </label>

            <div>
              <span className="text-sm font-medium text-[var(--foreground)]">Imagen de la promoción (opcional)</span>
              <p className="text-xs text-[var(--muted)] mb-2">Ideal horizontal (16:9, por ejemplo 1920×1080). Una vertical se muestra completa sobre un fondo difuminado. Sin imagen se usa la foto del producto.</p>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm cursor-pointer hover:bg-[var(--background)]">
                  <ImagePlus className="w-4 h-4" /> {image ? "Cambiar imagen" : "Subir imagen"}
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
                </label>
                {image && (
                  <button type="button" onClick={() => { setFile(null); setImage(null); setRatio(null); }} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" /> Quitar
                  </button>
                )}
              </div>
              {image && ratio && <p className="mt-2 text-xs text-[var(--muted)]">Formato: {ratio > 1.15 ? "horizontal" : ratio < 0.87 ? "vertical" : "cuadrado"}</p>}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">Así se verá en el inicio</p>
            <div className="overflow-hidden rounded-2xl ring-1 ring-[#d4af37]/30"><PromoSlide product={preview} preview /></div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-sm">Cancelar</button>
          <button onClick={save} disabled={saving || invalidPrice} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50">
            {saving ? "Guardando…" : "Guardar promoción"}
          </button>
        </div>
      </div>
    </div>
  );
}
