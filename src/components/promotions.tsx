"use client";

import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetcher } from "@/lib/api";
import { cldImage } from "@/lib/cloudinary";
import { salePrice, formatCOP } from "@/lib/price";

export type PromoProduct = {
  id: string; name: string; price: number; images?: string[];
  promoActive?: boolean; promoPrice?: number | null; promoTitle?: string | null;
  promoImage?: string | null; promoImageRatio?: number | null;
};

/** Tarjeta de promoción. La imagen conserva su formato (horizontal o vertical): nunca se recorta a la fuerza. */
export function PromoCard({ product, preview = false }: { product: PromoProduct; preview?: boolean }) {
  const image = product.promoImage || product.images?.[0];
  // Sin imagen propia se usa la foto del producto, que en la tienda es vertical 4:5
  const ratio = product.promoImage ? product.promoImageRatio || 1 : 4 / 5;
  const price = salePrice(product);
  const off = price < product.price ? Math.round((1 - price / product.price) * 100) : 0;

  const card = (
    <article className="group relative overflow-hidden rounded-[1.75rem] bg-[#0b1410] ring-1 ring-[#d4af37]/25 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] transition-all duration-700 hover:ring-[#d4af37]/60 hover:shadow-[0_30px_60px_-20px_rgba(212,175,55,0.35)]">
      <div className="relative w-full" style={{ aspectRatio: String(ratio) }}>
        {image && (
          <img
            src={preview && image.startsWith("blob:") ? image : cldImage(image, ratio > 1.2 ? 1200 : 720)}
            alt={product.promoTitle || product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
        )}
        {/* Velo para que el texto se lea sobre cualquier foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06100c] via-[#06100c]/35 to-transparent" />
        {off > 0 && (
          <span className="absolute top-4 left-4 rounded-full bg-[#d4af37] px-3 py-1 text-xs font-bold tracking-wide text-[#0b1410] shadow-lg">
            -{off}%
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          {product.promoTitle && (
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e9cf7a]">{product.promoTitle}</p>
          )}
          <h3 className="font-serif text-xl md:text-2xl leading-tight text-white">{product.name}</h3>
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="font-sans">
              <span className="text-lg md:text-xl font-semibold text-[#f5dc8c]">{formatCOP(price)}</span>
              {off > 0 && <span className="ml-2 text-sm text-white/55 line-through">{formatCOP(product.price)}</span>}
            </p>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-500 group-hover:border-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#0b1410]">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  return preview ? card : <Link href={`/products/${product.id}`} aria-label={`${product.name}, ${formatCOP(price)}`} className="block">{card}</Link>;
}

/** "Aprovecha nuestras promociones": solo aparece si el admin tiene alguna promoción activa. */
export function PromotionsSection() {
  const { data } = useSWR<PromoProduct[]>("/products/promotions", fetcher);
  if (!data?.length) return null;
  // Columnas tipo revista: cada imagen conserva su alto real. Con pocas promociones, menos columnas para que no queden huecos
  const cols = data.length === 1 ? "max-w-xl mx-auto" : data.length === 2 ? "sm:columns-2 max-w-5xl mx-auto" : "sm:columns-2 lg:columns-3";

  return (
    <section aria-labelledby="promos-title" className="container mx-auto px-4 pt-16">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1c785f] dark:text-[#d4af37]">Por tiempo limitado</p>
        <h2 id="promos-title" className="mt-3 font-serif text-3xl md:text-5xl text-[var(--foreground)]">Aprovecha nuestras promociones</h2>
        <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>
      <div className={`${cols} gap-6`}>
        {data.map((p, i) => (
          <motion.div
            key={p.id}
            className="mb-6 break-inside-avoid"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.12 }}
          >
            <PromoCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
