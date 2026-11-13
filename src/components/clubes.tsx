"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUpRight, CalendarClock, ClipboardList, CreditCard, MessageCircle, Ruler, Truck } from "lucide-react";
import { LOT_MIN_UNIFORMS, LEAD_DAYS, addBusinessDays } from "@/store/cart";
import { whatsappLink, useStorePhone } from "@/components/whatsapp-button";

// Todo lo que dice esta página sale de reglas que el sistema ya aplica (lote, días de confección, anticipo de la cotización,
// métodos de entrega del carrito). Descuentos por volumen o fechas de temporada no se prometen hasta que el negocio los defina.
const STEPS = [
  { icon: ClipboardList, title: "Arma tu cotización", text: "Elige las piezas del catálogo y las cantidades. Descárgala en PDF para presentarla a la junta o a la iglesia." },
  { icon: Ruler, title: "Tallas y nombres por integrante", text: "En el carrito registras la talla, el nombre a bordar y el RH de cada conquistador." },
  { icon: CreditCard, title: "Anticipo del 50 %", text: "Con el anticipo empieza la confección. El saldo se paga antes de la entrega o el despacho." },
  { icon: Truck, title: "Entrega", text: "Envío por transportadora a toda Colombia, domicilio en Medellín o recoges en tienda sin costo." },
];

const FAQ = [
  { q: "¿Desde cuántos uniformes es un pedido de club?", a: `Desde ${LOT_MIN_UNIFORMS} uniformes el pedido se confecciona en lote, todos juntos.` },
  { q: "¿Cuánto tarda la confección?", a: `Alrededor de ${LEAD_DAYS.lot} días hábiles en lote y ${LEAD_DAYS.unit} por unidad, contados desde el pago del anticipo. El tiempo de la transportadora se suma aparte.` },
  { q: "¿Cuánto cuesta el envío?", a: "Con 10 o más uniformes en el pedido, el envío nacional por tierra es gratis: lo asume la tienda. En pedidos más pequeños el flete lo cobra la transportadora según destino y peso. Recoger en tienda no tiene costo." },
  { q: "¿Puedo pedir insignias y cintas con nombre?", a: "Sí. Las cintas de nombre se bordan con el nombre y el RH de cada integrante; las insignias y parches se agregan al mismo pedido." },
];

const subscribeNever = () => () => {};
const formatDate = (d: Date) => d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

export function ClubesContent() {
  const phone = useStorePhone();
  // La fecha depende del día del visitante: se calcula solo en el navegador para no desajustar la hidratación
  const lotReady = useSyncExternalStore(subscribeNever, () => formatDate(addBusinessDays(new Date(), LEAD_DAYS.lot)), () => "");
  const wa = whatsappLink(phone, "Hola, soy director(a) de club y quiero cotizar uniformes para mi club.");

  return (
    <main className="flex-1 container max-w-5xl mx-auto px-4 pt-36 pb-20 font-sans">
      <section className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1c785f] dark:text-[#d4af37] mb-4">Para directores de club</p>
        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-[var(--foreground)] mb-6">
          Uniformes para <span className="italic">todo tu club</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed mb-8">
          Conquistadores, Aventureros y Guías Mayores. Un solo pedido con la talla, el nombre y el RH de cada integrante, confeccionado en Colombia.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/quotes" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1c785f] hover:bg-[#166450] dark:bg-[#d4af37] dark:hover:bg-[#e2c275] text-white dark:text-[#0b1410] text-sm font-semibold transition-colors">
            Cotizar para mi club <ArrowUpRight className="w-4 h-4" />
          </Link>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#25D366]/60 hover:bg-[#25D366]/10 text-sm font-semibold text-[var(--foreground)] transition-colors">
            <MessageCircle className="w-4 h-4 text-[#25D366]" /> Hablar con un asesor
          </a>
        </div>
      </section>

      {lotReady && (
        <section className="mt-12 flex items-start gap-4 rounded-2xl border border-[#d4af37]/40 bg-[#d4af37]/[0.06] p-5 max-w-3xl mx-auto">
          <CalendarClock className="w-6 h-6 shrink-0 text-[#b38f39] dark:text-[#d4af37]" aria-hidden="true" />
          <p className="text-sm text-[var(--foreground)] leading-relaxed">
            <span className="font-semibold">¿Tienen investidura o camporí pronto?</span> Si pagas el anticipo hoy, tu lote estaría listo
            alrededor del <span className="font-semibold">{lotReady}</span>, más el tiempo de envío. Pide con margen para llegar a tiempo.
          </p>
        </section>
      )}

      <section aria-labelledby="steps-title" className="mt-20">
        <h2 id="steps-title" className="text-2xl md:text-3xl font-serif text-center text-[var(--foreground)] mb-10">Cómo funciona</h2>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs tabular-nums text-[var(--muted)]">{String(i + 1).padStart(2, "0")}</span>
                <Icon className="w-5 h-5 text-[#1c785f] dark:text-[#d4af37]" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">{title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq-title" className="mt-20 max-w-3xl mx-auto">
        <h2 id="faq-title" className="text-2xl md:text-3xl font-serif text-center text-[var(--foreground)] mb-8">Preguntas frecuentes</h2>
        <div className="divide-y divide-[var(--border-color)] border-y border-[var(--border-color)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-4">
              <summary className="cursor-pointer list-none flex justify-between gap-4 text-sm font-medium text-[var(--foreground)]">
                {q}
                <span className="text-[var(--muted)] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-[var(--muted)]">
          ¿Otra pregunta?{" "}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="text-[var(--foreground)] underline underline-offset-4">Escríbenos por WhatsApp</a>
        </p>
      </section>
    </main>
  );
}
