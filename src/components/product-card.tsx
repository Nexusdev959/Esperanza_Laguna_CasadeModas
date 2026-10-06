"use client";

import Link from "next/link";
import { Star, Heart, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  status?: string;
  rating?: number;
  reviewsCount?: number;
  sizes?: string[];
}

export function ProductCard({ product }: { product: Product }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(product.price) || 0);

  const rating = product.rating ?? 4.9;
  const reviewsCount = product.reviewsCount ?? 48;
  const sizes = product.sizes ?? ["S", "M", "L", "XL"];

  return (
    <div className="group relative flex flex-col w-full rounded-2xl bg-gradient-to-b from-white dark:from-[#111916]/90 via-[#f9fbfaf0] dark:via-[#0a0f0d] to-[#eef2f0] dark:to-[#070a09] border border-black/[0.05] dark:border-white/[0.08] hover:border-[#2ec4a6]/40 p-3 transition-all duration-700 ease-out hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),_0_0_25px_rgba(46,196,166,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),_0_0_25px_rgba(46,196,166,0.12)] hover:-translate-y-1 select-none overflow-hidden font-sans">

      {/* Luz cenital de foco (Spotlight en hover) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 10%, rgba(46, 196, 166, 0.15) 0%, transparent 65%)"
        }}
      />

      {/* ================= CONTENEDOR FOTOGRÁFICO ================= */}
      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#f0f4f2] dark:bg-[#070b09] border border-black/[0.05] dark:border-white/[0.05] transition-colors duration-700">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover object-center w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out will-change-transform mix-blend-multiply dark:mix-blend-normal"
            loading="lazy"
          />
        </Link>

        {/* Degradado inferior cinematográfico */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-[#070a09]/80 via-transparent to-black/10 dark:to-black/20 pointer-events-none transition-colors duration-700" />

        {/* ================= BADGES SUPERIORES ================= */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold tracking-wider uppercase bg-white/90 dark:bg-[#090d0b]/90 backdrop-blur-md text-[#1c785f] dark:text-[#2ec4a6] border border-[#2ec4a6]/30 shadow-md transition-colors duration-700">
            {product.status || "NUEVO"}
          </span>

          {/* Botón Favorito Interactivo */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            aria-label="Guardar en favoritos"
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 dark:bg-[#0b1411]/80 backdrop-blur-md border border-black/10 dark:border-white/10 hover:border-[#2ec4a6]/50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isFavorite
                  ? "fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                  : "text-black/40 hover:text-black/80 dark:text-white/70 dark:hover:text-white"
                }`}
            />
          </button>
        </div>

        {/* ================= SELECTOR DE TALLAS RÁPIDAS (EMERGE EN HOVER) ================= */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <div className="flex items-center gap-1 bg-white/90 dark:bg-[#070b09]/90 backdrop-blur-md px-2 py-1 rounded-lg border border-black/10 dark:border-white/10 shadow-lg transition-colors duration-700">
            <span className="text-[10px] text-[#5a6c65] dark:text-[#7a8c85] mr-1 font-mono uppercase transition-colors duration-700">Tallas:</span>
            {sizes.map((s) => (
              <span
                key={s}
                className="text-[10px] font-semibold text-[#1a2b22] dark:text-[#f0f4f2] px-1 py-0.5 rounded hover:bg-[#2ec4a6]/20 hover:text-[#1c785f] dark:hover:text-[#2ec4a6] transition-colors duration-300"
              >
                {s}
              </span>
            ))}
          </div>

          <Link
            href={`/products/${product.id}`}
            aria-label="Ver detalles"
            className="w-8 h-8 rounded-lg bg-[#2ec4a6] text-white dark:text-[#070a09] flex items-center justify-center hover:bg-[#1aab8d] dark:hover:bg-[#52e5c7] transition-all hover:scale-105 shadow-[0_4px_12px_rgba(46,196,166,0.4)]"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ================= DETALLES Y REPUTACIÓN ================= */}
      <div className="pt-3 px-1.5 flex flex-col space-y-1.5">

        {/* Fila: Categoría y Calificaciones */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-sans font-medium text-[#5a6c65] dark:text-[#7a8c85] tracking-wider uppercase transition-colors duration-700">
            {product.category || "UNIFORME REGLAMENTARIO"}
          </span>

          {/* Sistema de Calificaciones (Rating) */}
          <div className="flex items-center gap-1 text-[#d4af37] dark:text-[#f5e1a4]">
            <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
            <span className="font-semibold text-[#1a2b22] dark:text-white/90 text-xs tabular-nums transition-colors duration-700">
              {Number(rating).toFixed(1)}
            </span>
            <span className="text-[#7a8c85] dark:text-[#5d6f68] text-[10px] transition-colors duration-700">
              ({reviewsCount})
            </span>
          </div>
        </div>

        {/* Título de Producto */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[15px] font-sans font-medium text-[#1a2b22] dark:text-[#f0f4f2] hover:text-[#1c785f] dark:hover:text-[#2ec4a6] transition-colors duration-300 line-clamp-1 tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Precio y Garantía Oficial */}
        <div className="flex items-center justify-between pt-1 border-t border-black/[0.06] dark:border-white/[0.04] transition-colors duration-700">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-sans font-semibold text-[#0f1f18] dark:text-white tracking-tight tabular-nums transition-colors duration-700">
              {formattedPrice}
            </span>
            <span className="text-[10px] font-mono text-[#7a8c85] dark:text-[#5d6f68] uppercase transition-colors duration-700">
              COP
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#1c785f] dark:text-[#2ec4a6]/90 font-medium transition-colors duration-700">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1c785f] dark:text-[#2ec4a6] transition-colors duration-700" />
            <span className="text-[11px]">Reglamentario</span>
          </div>
        </div>
      </div>
    </div>
  );
}