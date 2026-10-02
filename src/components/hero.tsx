"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Frases editoriales enfocadas en frescura, origen natural colombiano y moda
const HERO_SLIDES = [
  {
    id: 1,
    title: "Origen & Esencia",
    highlight: "N A C I O N A L",
    subtitle:
      "Fibras puras y texturas nobles nacidas en tierras colombianas. Vestir la frescura de nuestra propia naturaleza.",
    cta: "Explorar Colección",
    link: "/coleccion"
  },
  {
    id: 2,
    title: "Sutileza en",
    highlight: "M O V I M I E N T O",
    subtitle:
      "Siluetas etéreas y confección orgánica que respiran con cada paso. Diseño contemporáneo sin artificios.",
    cta: "Ver Novedades",
    link: "/novedades"
  },
  {
    id: 3,
    title: "El lujo de lo",
    highlight: "N A T U R A L",
    subtitle:
      "Algodones crudos, tonos tierra y el eco de nuestros paisajes. La elegancia más pura no compite, simplemente existe.",
    cta: "Descubrir Prendas",
    link: "/catalogo"
  }
];

export function HeroCinematic() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Rotación automática cada 15 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative h-screen min-h-[680px] w-full flex items-center justify-center overflow-hidden bg-stone-950 text-white select-none">
      {/* 1. Fondo de Vídeo Cinemático: Naturaleza, frescura, agua y hojas tropicales colombianas (Pexels CC0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1920"
          className="h-full w-full object-cover opacity-60 scale-105 transition-transform duration-1000 ease-out"
        >
          {/* Video de naturaleza botánica, brisa, rocío y frescura tropical */}
          <source
            src="https://videos.pexels.com/video-files/855938/855938-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradiente cinematográfico tipo viñeta: enfoca el centro y oscurece sutilmente los bordes */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-stone-950/70 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-stone-950/20 to-stone-950/80 z-10" />
      </div>

      {/* 2. Capa Central Minimalista: Título y Frases Editoriales */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -25, filter: "blur(6px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Título de Alta Costura: Tipografía Serif Fina y Espaciada */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight leading-[1.08] mb-6 drop-shadow-2xl">
              <span className="italic font-normal block text-stone-200">{slide.title}</span>
              <span className="font-sans font-extralight tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-stone-200 to-emerald-100 uppercase text-3xl sm:text-5xl md:text-6xl mt-2 block">
                {slide.highlight}
              </span>
            </h1>

            {/* Subtítulo Poético / Persuasivo */}
            <p className="text-stone-300/90 text-base sm:text-lg md:text-xl font-light tracking-widest max-w-xl mx-auto leading-relaxed drop-shadow-md mb-10">
              {slide.subtitle}
            </p>

            {/* CTA único de cristal pulido (Liquid Glass) */}
            <Link
              href={slide.link}
              className="group inline-flex items-center gap-3 px-9 py-4 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-white border border-white/25 backdrop-blur-md text-xs sm:text-sm font-light tracking-[0.25em] uppercase transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              <span>{slide.cta}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-80" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Indicador de Progreso Discreto (3 líneas temporizadas a 20s) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {HERO_SLIDES.map((s, index) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir a escena ${index + 1}`}
            className="group relative h-6 flex items-center focus:outline-none"
          >
            <div className="h-[1.5px] w-12 bg-white/20 overflow-hidden rounded-full">
              {index === currentSlide && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, ease: "linear" }}
                  className="h-full bg-amber-200/90 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}