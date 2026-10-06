"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { HeroCanvasBackground } from "@/components/ui/hero-canvas-background";
import { JungleBackground } from "@/components/ui/jungle-background";

// Diapositivas editoriales
const HERO_SLIDES = [
  {
    id: 1,
    title: "Origen & Esencia",
    highlight: "N A C I O N A L",
    subtitle:
      "Fibras puras y texturas nobles nacidas en tierras colombianas. Vestir la frescura de nuestra propia naturaleza.",
    cta: "Explorar Colección",
    link: "/catalogo",
    themeHue: "emerald", // Tonalidad de hilos: bosque / esmeralda
  },
  {
    id: 2,
    title: "Sutileza en",
    highlight: "M O V I M I E N T O",
    subtitle:
      "Siluetas etéreas y confección orgánica que respiran con cada paso. Diseño contemporáneo sin artificios.",
    cta: "Ver Novedades",
    link: "/catalogo",
    themeHue: "gold", // Tonalidad de hilos: hebras de oro
  },
  {
    id: 3,
    title: "El lujo de lo",
    highlight: "N A T U R A L",
    subtitle:
      "Algodones crudos, tonos tierra y el eco de nuestros paisajes. La elegancia más pura no compite, simplemente existe.",
    cta: "Descubrir Prendas",
    link: "/catalogo",
    themeHue: "mist", // Tonalidad de hilos: bruma andina y lino
  },
];

export function HeroCinematic() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Rotación automática cada 14 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 14000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative h-screen min-h-[720px] w-full flex items-center justify-center overflow-hidden bg-[#f4f7f5] dark:bg-[#050807] text-stone-900 dark:text-white select-none transition-colors duration-700">
      {/* ================= SELVA BASE (COMPONENTE INDEPENDIENTE PROCEDURAL) ================= */}
      <JungleBackground />

      {/* ================= CANVAS VIVO (MOTOR 3D: MONTAÑAS Y POLVO) ================= */}
      <HeroCanvasBackground themeHue={slide.themeHue} />

      {/* Rayos de sol (God Rays) y resplandor natural para luz de día */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-1000 overflow-hidden">
        {/* Rayos rotatorios */}
        <div className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,220,0)_0%,rgba(255,255,220,0.3)_10%,rgba(255,255,220,0)_20%,rgba(255,255,220,0.4)_35%,rgba(255,255,220,0)_50%,rgba(255,255,220,0.25)_65%,rgba(255,255,220,0)_80%,rgba(255,255,220,0.35)_90%,rgba(255,255,220,0)_100%)] animate-[spin_60s_linear_infinite]" />
        {/* Sol cálido difuso en el centro */}
        <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,250,220,0.9)_0%,rgba(255,250,220,0.4)_30%,transparent_70%)]" />
      </div>

      {/* Viñeta oscura en los bordes para enmarcar la escena (solo en modo oscuro) */}
      <div className="absolute inset-0 bg-transparent dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10 pointer-events-none transition-colors duration-700" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#f4f7f5] dark:from-[#050807] to-transparent z-10 pointer-events-none transition-colors duration-700" />

      {/* ================= CONTENIDO EDITORIAL CENTRAL ================= */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} // Curva más orgánica y rápida (sin blurs costosos)
            className="flex flex-col items-center"
          >
            {/* Título de Alta Costura */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight leading-[1.05] mb-5 drop-shadow-sm dark:drop-shadow-[0_8px_30px_rgba(0,0,0,0.85)]">
              <span className="italic font-normal block text-[#1a2b22] dark:text-[#f2f5f3]">
                {slide.title}
              </span>
              <span className="font-sans font-extralight tracking-[0.24em] text-transparent bg-clip-text bg-gradient-to-r from-[#18362a] via-[#10241b] to-[#d4af37] dark:from-[#fdfbf7] dark:via-[#f0ede6] dark:to-[#d4af37] uppercase text-2xl sm:text-4xl md:text-5xl mt-3 block">
                {slide.highlight}
              </span>
            </h1>

            {/* Subtítulo Poético */}
            <p className="text-[#3c5246] dark:text-[#c8d4cf] text-sm sm:text-base md:text-lg font-light tracking-widest max-w-xl mx-auto leading-relaxed drop-shadow-sm dark:drop-shadow-md mb-9 font-sans transition-colors duration-700">
              {slide.subtitle}
            </p>

            {/* CTA de Cristal Líquido (Liquid Glass) */}
            <Link
              href={slide.link}
              className="pointer-events-auto group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-black/[0.04] dark:bg-white/[0.07] hover:bg-black/[0.08] dark:hover:bg-white/[0.16] text-[#1a2b22] dark:text-[#f2f6f4] border border-black/10 dark:border-white/20 hover:border-[#2ec4a6]/50 backdrop-blur-xl text-xs sm:text-[13px] font-sans font-medium tracking-[0.22em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <span>{slide.cta}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#2ec4a6]" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================= INDICADORES DE PROGRESO DE DIAPOSITIVAS ================= */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3.5">
        {HERO_SLIDES.map((s, index) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir a escena ${index + 1}`}
            className="group relative h-6 flex items-center focus:outline-none"
          >
            <div className="h-[2px] w-12 sm:w-14 bg-black/10 dark:bg-white/20 overflow-hidden rounded-full transition-colors duration-700">
              {index === currentSlide && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 14, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-[#2ec4a6] to-[#d4af37] shadow-[0_0_10px_rgba(46,196,166,0.3)] dark:shadow-[0_0_10px_rgba(46,196,166,0.7)]"
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}