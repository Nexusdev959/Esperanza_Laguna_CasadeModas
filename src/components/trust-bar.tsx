"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flag, Truck, ShieldCheck, Users } from "lucide-react";

// Solo promesas que el negocio ya cumple (ver /legal/shipping y el pago con Wompi): nada inventado
const TRUST = [
  { icon: Flag, title: "Hecho en Colombia", text: "Confección nacional, pieza por pieza" },
  { icon: Truck, title: "Envíos a toda Colombia", text: "Por transportadora, con guía de rastreo" },
  { icon: ShieldCheck, title: "Pago seguro", text: "En línea con Wompi o transferencia" },
  { icon: Users, title: "Pedidos para tu club", text: "Cotiza por cantidad y en lote" },
];

export function TrustBar() {
  const still = useReducedMotion();
  return (
    <section aria-label="Por qué comprar con nosotros" className="container mx-auto px-4 pt-6 relative z-20">
      <div className="relative overflow-hidden rounded-3xl border border-[#d4af37]/25 bg-gradient-to-br from-white via-[#fbfaf5] to-[#f3efe2] dark:from-[#0d1813] dark:via-[#0a130f] dark:to-[#08100c] shadow-[0_18px_50px_-25px_rgba(28,120,95,0.35)]">
        {/* Destello dorado que cruza la barra de vez en cuando */}
        {!still && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent skew-x-[-20deg]"
            animate={{ x: ["0%", "450%"] }}
            transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }}
          />
        )}
        <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />

        <ul className="relative grid grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, text }, i) => (
            <motion.li
              key={title}
              initial={still ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              className={`group flex items-center gap-4 p-5 md:p-6 border-[#d4af37]/15 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""}`}
            >
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1c785f] to-[#145a47] dark:from-[#d4af37] dark:to-[#a8862a] text-white dark:text-[#0b1410] shadow-md transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]">
                <span aria-hidden="true" className="absolute inset-0 rounded-2xl ring-1 ring-[#d4af37]/50 transition-all duration-500 group-hover:ring-4 group-hover:ring-[#d4af37]/25" />
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 font-sans leading-tight">
                <p className="text-sm md:text-[15px] font-semibold text-[var(--foreground)]">{title}</p>
                <p className="mt-1 text-xs text-[var(--muted)] leading-snug">{text}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
