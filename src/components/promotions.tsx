"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Clock, Pause, Play } from "lucide-react";
import { fetcher } from "@/lib/api";
import { cldImage } from "@/lib/cloudinary";
import { salePrice, formatCOP } from "@/lib/price";

export type PromoProduct = {
  id: string; name: string; price: number; images?: string[];
  promoActive?: boolean; promoPrice?: number | null; promoTitle?: string | null;
  promoImage?: string | null; promoImageRatio?: number | null;
  promoStartsAt?: string | null; promoEndsAt?: string | null;
};

/** "Termina en 2 d 05 h 12 min": solo si la promoción tiene fecha de fin. Se actualiza cada minuto. */
function Countdown({ endsAt }: { endsAt: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const left = new Date(endsAt).getTime() - now;
  if (!(left > 0)) return null;
  const d = Math.floor(left / 86_400_000);
  const h = Math.floor((left % 86_400_000) / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] sm:text-xs font-medium text-white/90 backdrop-blur-md">
      <Clock className="h-3.5 w-3.5 text-[#e9cf7a]" aria-hidden="true" />
      Termina en {d > 0 && `${d} d `}{pad(h)} h {pad(m)} min
    </p>
  );
}

const SLIDE_SECONDS = 6;

/**
 * Póster en formato horizontal (16:9). Un póster horizontal llena el cuadro; uno vertical o cuadrado
 * se muestra completo a la derecha sobre su propia imagen difuminada: nunca se recorta.
 */
export function PromoSlide({ product, preview = false }: { product: PromoProduct; preview?: boolean }) {
  const image = product.promoImage || product.images?.[0];
  // Sin póster propio se usa la foto del producto, que en la tienda es vertical 4:5
  const ratio = product.promoImage ? product.promoImageRatio || 1 : 4 / 5;
  const fill = ratio >= 1.4 && ratio <= 2.1;
  const src = image && (preview && image.startsWith("blob:") ? image : cldImage(image, 1600));
  const price = salePrice(product);
  const off = price < product.price ? Math.round((1 - price / product.price) * 100) : 0;

  return (
    <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden bg-[#06100c]">
      {src && !fill && (
        <img src={src} alt="" aria-hidden="true" draggable={false} className="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-2xl" />
      )}
      {src && (
        <img
          src={src}
          alt={product.promoTitle || product.name}
          draggable={false}
          className={`absolute inset-0 h-full w-full ${fill ? "object-cover" : "object-contain object-right sm:pr-[6%]"}`}
        />
      )}
      {/* Velo de cine: oscurece a la izquierda y abajo para que el texto se lea sobre cualquier póster */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06100c]/90 via-[#06100c]/35 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06100c]/85 via-transparent to-transparent" />

      <div className="absolute inset-y-0 left-0 flex w-full sm:w-3/5 flex-col justify-end p-5 sm:p-8 md:p-12">
        <div className="flex items-center gap-3">
          {off > 0 && <span className="rounded-full bg-[#d4af37] px-3 py-1 text-xs font-bold text-[#0b1410] shadow-lg">-{off}%</span>}
          {product.promoTitle && (
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#e9cf7a]">{product.promoTitle}</p>
          )}
        </div>
        <h3 className="mt-3 font-serif text-2xl sm:text-3xl md:text-5xl leading-[1.05] text-white drop-shadow-lg">{product.name}</h3>
        <p className="mt-3 sm:mt-4 font-sans">
          <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#f5dc8c]">{formatCOP(price)}</span>
          {off > 0 && <span className="ml-3 text-sm sm:text-base text-white/55 line-through">{formatCOP(product.price)}</span>}
        </p>
        {product.promoEndsAt && <Countdown endsAt={product.promoEndsAt} />}
        {preview ? (
          <span className="mt-4 sm:mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#d4af37] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b1410]">
            Ver producto <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : (
          <Link
            href={`/products/${product.id}`}
            aria-label={`Ver ${product.name}, ${formatCOP(price)}`}
            className="mt-4 sm:mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#d4af37] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b1410] shadow-[0_10px_30px_-10px_rgba(212,175,55,0.8)] transition-transform hover:-translate-y-0.5"
          >
            Ver producto <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

const slide = {
  enter: (dir: number) => ({ x: `${dir * 100}%`, opacity: 0.3, scale: 1.04 }),
  center: { x: "0%", opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: `${-dir * 100}%`, opacity: 0.3, scale: 0.96 }),
};

/** "Aprovecha nuestras promociones": carrusel infinito, un póster a la vez. Solo aparece si hay promociones activas. */
export function PromotionsSection() {
  const { data } = useSWR<PromoProduct[]>("/products/promotions", fetcher);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [hover, setHover] = useState(false);
  const [stopped, setStopped] = useState(false);
  const still = useReducedMotion();

  if (!data?.length) return null;
  const n = data.length;
  const cur = index % n;
  const go = (d: number) => { setDir(d); setIndex((v) => (v + d + n) % n); };
  const jump = (to: number) => { setDir(to > cur ? 1 : -1); setIndex(to); };
  // Avanza solo; se detiene con el mouse encima, con el botón de pausa o si el cliente pidió menos movimiento
  const paused = hover || stopped || !!still || n < 2;

  return (
    <section aria-labelledby="promos-title" className="container mx-auto px-4 pt-16">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1c785f] dark:text-[#d4af37]">Por tiempo limitado</p>
        <h2 id="promos-title" className="mt-3 font-serif text-3xl md:text-5xl text-[var(--foreground)]">Aprovecha nuestras promociones</h2>
        <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>

      <div
        className="mx-auto max-w-6xl"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Promociones"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="group relative overflow-hidden rounded-[2rem] ring-1 ring-[#d4af37]/30 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
          {/* Cuadro fijo: los pósters entran y salen por encima sin mover la página */}
          <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-[#06100c]">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={data[cur].id}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: still ? 0 : 0.9, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-0"
                aria-roledescription="diapositiva"
                aria-label={`${cur + 1} de ${n}`}
                drag={n > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
              >
                <PromoSlide product={data[cur]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {n > 1 && (
            <>
              <button onClick={() => go(-1)} aria-label="Promoción anterior" className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100 hover:bg-[#d4af37] hover:text-[#0b1410]">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => go(1)} aria-label="Siguiente promoción" className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100 hover:bg-[#d4af37] hover:text-[#0b1410]">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {n > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {data.map((p, i) => (
              <button key={p.id} onClick={() => jump(i)} aria-label={`Ver promoción ${i + 1}: ${p.name}`} aria-current={i === cur} className="group/dot py-2">
                <span className={`relative block h-1 overflow-hidden rounded-full bg-[var(--muted)]/30 transition-all duration-500 ${i === cur ? "w-12" : "w-6 group-hover/dot:bg-[var(--muted)]/60"}`}>
                  {i === cur && (
                    // La barra dorada mide el tiempo del póster; al llenarse pasa al siguiente
                    <span
                      key={`${cur}-${index}`}
                      className="promo-progress absolute inset-0 origin-left rounded-full bg-[#d4af37]"
                      style={{ animationDuration: `${SLIDE_SECONDS}s`, animationPlayState: paused ? "paused" : "running" }}
                      onAnimationEnd={() => go(1)}
                    />
                  )}
                </span>
              </button>
            ))}
            <button onClick={() => setStopped((s) => !s)} aria-label={stopped ? "Reanudar promociones" : "Pausar promociones"} className="ml-2 p-1.5 text-[var(--muted)] hover:text-[var(--foreground)]">
              {stopped ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
