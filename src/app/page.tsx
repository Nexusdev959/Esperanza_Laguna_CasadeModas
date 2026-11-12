import Link from "next/link";
import { Flag, Truck, ShieldCheck, Users, ArrowUpRight } from "lucide-react";
import { HeroCinematic } from "@/components/hero";
import { ProductGallery } from "@/components/product-gallery";
import { AnimateIn } from "@/components/ui/animate-in";

// Solo promesas que el negocio ya cumple (ver /legal/shipping y el pago con Wompi): nada inventado
const TRUST = [
  { icon: Flag, title: "Hecho en Colombia", text: "Confección nacional" },
  { icon: Truck, title: "Envíos a toda Colombia", text: "Por transportadora" },
  { icon: ShieldCheck, title: "Pago seguro", text: "En línea con Wompi" },
  { icon: Users, title: "Pedidos para tu club", text: "Cotiza por cantidad" },
];

export default function Home() {
  return (
    <>
      <main className="flex-1">
        {/* Hero Section (Modularized) */}
        <HeroCinematic />

        {/* Barra de confianza: responde las dudas que frenan la compra antes de ver productos */}
        <section aria-label="Por qué comprar con nosotros" className="container mx-auto px-4 pt-6 relative z-20">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.03] backdrop-blur-md p-4">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0 text-[#1c785f] dark:text-[#d4af37]" aria-hidden="true" />
                <div className="font-sans leading-tight">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
                  <p className="text-xs text-[var(--muted)]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Galería Dinámica por Categorías */}
        <section className="py-16 px-4 container mx-auto overflow-hidden">
          <AnimateIn delay={0.2}>

            <ProductGallery />
          </AnimateIn>
        </section>

        {/* El pedido de club es el ticket más alto: bloque propio con su camino de compra */}
        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-3xl border border-[#d4af37]/30 bg-gradient-to-br from-[#1c785f]/[0.08] to-[#d4af37]/[0.06] p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1c785f] dark:text-[#d4af37] mb-3">¿Eres director de club?</p>
              <h2 className="text-2xl md:text-4xl font-serif text-[var(--foreground)] mb-3">Uniforma a todo tu club en un solo pedido</h2>
              <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed max-w-xl">
                Talla, nombre y RH por integrante, confección en lote y cotización en PDF para presentar a la junta.
              </p>
            </div>
            <Link href="/clubes" className="self-start md:self-auto inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1c785f] hover:bg-[#166450] dark:bg-[#d4af37] dark:hover:bg-[#e2c275] text-white dark:text-[#0b1410] text-sm font-semibold transition-colors whitespace-nowrap">
              Ver cómo funciona <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
