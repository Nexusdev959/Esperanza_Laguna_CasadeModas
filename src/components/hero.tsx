"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { HeroCanvasBackground } from "@/components/ui/hero-canvas-background";
import { api } from "@/lib/api";

// Diapositivas: cada una dice qué se vende y lleva a su categoría. Sin afirmaciones sobre telas que no estén verificadas.
const QUOTE_CTA = { label: "Cotizar para mi club", link: "/quotes" };

const HERO_SLIDES = [
  {
    id: 1,
    title: "Uniformes",
    highlight: "REGLAMENTARIOS",
    subtitle: "Para Conquistadores, Aventureros y Guías Mayores. Confeccionados en Colombia, listos para tu próxima investidura.",
    cta: { label: "Ver uniformes", link: "/catalogo" },
    secondary: QUOTE_CTA,
    themeHue: "emerald", // Tonalidad de hilos: bosque / esmeralda
  },
  {
    id: 2,
    title: "Hecho para tu",
    highlight: "CLUB",
    subtitle: "Pedidos para todo el club con insignias y parches. Arma tu cotización en minutos y descárgala en PDF.",
    cta: QUOTE_CTA,
    secondary: { label: "Ver insignias", link: `/catalogo?categoria=${encodeURIComponent("Insignias y Parches")}` },
    themeHue: "gold", // Tonalidad de hilos: hebras de oro
  },
  {
    id: 3,
    title: "Moda con",
    highlight: "PROPÓSITO",
    subtitle: "Prendas para damas y caballeros, pensadas para el día a día y para las ocasiones especiales.",
    cta: { label: "Ver colección", link: "/catalogo" },
    secondary: QUOTE_CTA,
    themeHue: "mist", // Tonalidad de hilos: bruma andina y lino
  },
  {
    id: 4,
    title: "Productos",
    highlight: "N A C I O N A L E S",
    subtitle: "Hechos con calidad y amor en Colombia para todo el mundo.",
    cta: { label: "Ver colección", link: "/catalogo" },
    secondary: QUOTE_CTA,
    themeHue: "mist", // Tonalidad de hilos: bruma andina y lino
  }
];

const SLIDE_MS = 7000;

type HeroGarment = { id: string; name: string; price: number; image: string };

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

// Posiciones de la pasarela: 0 = prenda al frente, 1 y 2 = las que esperan turno detrás
const DECK = [
  { x: "0%", scale: 1, opacity: 1, zIndex: 30 },
  { x: "62%", scale: 0.8, opacity: 0.7, zIndex: 20 },
  { x: "106%", scale: 0.64, opacity: 0.4, zIndex: 10 },
];

export function HeroCinematic() {
  // step solo crece: define la escena (step % 3) y la prenda (step % prendas), así cada vuelta muestra otra prenda
  const [step, setStep] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [garments, setGarments] = useState<HeroGarment[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const reduceMotion = useReducedMotion();

  const autoplay = !userPaused && !hovered && !reduceMotion && inView;
  const currentSlide = step % HERO_SLIDES.length;
  const slide = HERO_SLIDES[currentSlide];
  const hasGarments = garments.length > 0;
  const deck = DECK.slice(0, Math.min(DECK.length, garments.length));

  // Prendas reales del catálogo, en orden aleatorio por visita
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const list: HeroGarment[] = (res.data || [])
          .filter((p: any) => p.isPublished !== false)
          .map((p: any) => ({ id: p.id, name: p.name, price: Number(p.price) || 0, image: p.image || p.images?.[0] }))
          .filter((p: HeroGarment) => p.image);
        setGarments(list.sort(() => Math.random() - 0.5));
      })
      .catch(() => setGarments([])); // sin catálogo el hero se ve como siempre, solo sin prendas
  }, []);

  // Timeout por escena: un clic manual reinicia el conteo completo
  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => setStep((s) => s + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [step, autoplay]);

  const goTo = (index: number) =>
    setStep((s) => s + ((index - (s % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length));

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carrusel"
      aria-label="Colecciones destacadas"
      className="relative h-svh min-h-[720px] w-full flex items-center justify-center overflow-hidden bg-[#f4f7f5] dark:bg-[#050807] text-stone-900 dark:text-white transition-colors duration-700"
    >
      {/* ================= HILOS (CANVAS 2D) =================
          La máscara los desvanece donde está el texto para que nunca lo crucen */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none ${hasGarments
          ? "[mask-image:linear-gradient(to_bottom,black_0%,black_38%,transparent_58%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,transparent_42%,black_68%)]"
          : "[mask-image:radial-gradient(ellipse_55%_45%_at_50%_50%,transparent_0%,transparent_60%,black_100%)]"
          }`}
      >
        <HeroCanvasBackground themeHue={slide.themeHue} paused={!inView || !!reduceMotion} />
      </div>

      {/* Resplandor cálido fijo para el modo claro (sin animación: la foto de la prenda es la protagonista) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-1000 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,250,220,0.7)_0%,rgba(255,250,220,0.3)_30%,transparent_70%)]" />
      </div>

      {/* Viñeta oscura en los bordes para enmarcar la escena (solo en modo oscuro) */}
      <div className="absolute inset-0 bg-transparent dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10 pointer-events-none transition-colors duration-700" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#f4f7f5] dark:from-[#050807] to-transparent z-10 pointer-events-none transition-colors duration-700" />

      {/* ================= CONTENIDO EDITORIAL ================= */}
      <h1 className="sr-only">Esperanza Laguna: uniformes para clubes y moda colombiana</h1>
      <div
        className={`relative z-20 w-full mx-auto px-6 pt-20 lg:pt-0 pointer-events-none flex flex-col-reverse items-center gap-8 ${hasGarments ? "max-w-7xl lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-12" : "max-w-4xl"
          }`}
      >
        <div className={`text-center flex flex-col items-center ${hasGarments ? "lg:text-left lg:items-start" : ""}`}>
          {/* initial={false}: el primer titular se pinta de inmediato (LCP), las animaciones son solo para los cambios */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              className={`flex flex-col items-center ${hasGarments ? "lg:items-start" : ""}`}
            >
              {/* Título de Alta Costura */}
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight leading-[1.05] mb-5 drop-shadow-sm dark:drop-shadow-[0_8px_30px_rgba(0,0,0,0.85)]">
                <span className="italic font-normal block text-[#1a2b22] dark:text-[#f2f5f3]">{slide.title}</span>
                <span
                  className={`font-sans font-normal tracking-[0.28em] text-[#1c785f] dark:text-[#e2c275] uppercase text-xl sm:text-3xl md:text-4xl mt-3 block pl-[0.28em] ${hasGarments ? "lg:pl-0" : ""
                    }`}
                >
                  {slide.highlight}
                </span>
              </h2>

              {/* Subtítulo Poético */}
              <p className="text-[#2c3e35] dark:text-[#d6e0dc] text-base md:text-lg font-normal max-w-xl leading-relaxed dark:drop-shadow-md mb-9 font-sans transition-colors duration-700">
                {slide.subtitle}
              </p>

              {/* CTA principal sólido + secundario de texto */}
              <div className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 ${hasGarments ? "lg:items-center" : ""}`}>
                <Link
                  href={slide.cta.link}
                  className="pointer-events-auto group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#1c785f] hover:bg-[#166450] dark:bg-[#d4af37] dark:hover:bg-[#e2c275] text-white dark:text-[#0b1410] text-xs sm:text-[13px] font-sans font-semibold tracking-[0.18em] uppercase transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_10px_30px_rgba(28,120,95,0.25)] dark:shadow-[0_10px_30px_rgba(212,175,55,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2ec4a6]"
                >
                  <span>{slide.cta.label}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href={slide.secondary.link}
                  className="pointer-events-auto text-sm font-sans font-medium text-[#1a2b22] dark:text-[#f2f6f4] underline decoration-[#1c785f]/40 dark:decoration-[#e2c275]/50 underline-offset-[6px] hover:decoration-[#1c785f] dark:hover:decoration-[#e2c275] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2ec4a6] rounded"
                >
                  {slide.secondary.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================= PASARELA: PRENDAS REALES DEL CATÁLOGO ================= */}
        {hasGarments && (
          <div className="relative w-[42vw] max-w-[13rem] sm:max-w-[15rem] lg:max-w-[21rem] lg:w-full aspect-[3/4.3] -translate-x-[36%] lg:translate-x-0 pointer-events-auto"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <AnimatePresence initial={false}>
              {deck.map((pos, k) => {
                const n = step + k;
                const g = garments[n % garments.length];
                const front = k === 0;
                return (
                  <motion.div
                    key={n}
                    initial={{ x: "110%", scale: 0.5, opacity: 0 }}
                    animate={pos}
                    exit={{ x: "-35%", scale: 1.04, opacity: 0, zIndex: 40 }}
                    transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.25, 1, 0.5, 1] }}
                    style={{ transformOrigin: "bottom left" }}
                    className="absolute inset-0"
                    aria-hidden={!front}
                  >
                    <Link
                      href={`/products/${g.id}`}
                      tabIndex={front ? 0 : -1}
                      onClick={(e) => {
                        // las prendas de atrás pasan al frente en vez de navegar
                        if (!front) {
                          e.preventDefault();
                          setStep((s) => s + k);
                        }
                      }}
                      className="group block w-full h-full rounded-t-full rounded-b-3xl overflow-hidden border border-[#d4af37]/40 bg-[#e9efeb] dark:bg-[#0b1410] shadow-[0_24px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2ec4a6]"
                    >
                      {/* Zoom editorial lento mientras la prenda está al frente */}
                      <motion.img
                        src={g.image}
                        alt={front ? g.name : ""}
                        initial={false}
                        animate={{ scale: front && !reduceMotion ? 1 : 1.12 }}
                        transition={{ duration: front ? SLIDE_MS / 1000 : 0.9, ease: "linear" }}
                        className="w-full h-full object-cover"
                      />
                      {front && (
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-black/75 via-black/30 to-transparent text-white">
                          <p className="font-serif italic text-sm sm:text-base lg:text-2xl leading-tight line-clamp-1">{g.name}</p>
                          <p className="mt-1 flex items-center justify-between gap-2 text-[11px] lg:text-xs tracking-widest">
                            <span className="text-[#f5dc8c]">{formatPrice(g.price)}</span>
                            <span className="hidden sm:inline-flex items-center gap-1 text-white/80 group-hover:text-white transition-colors">
                              Ver prenda <ArrowUpRight className="h-3.5 w-3.5 text-[#2ec4a6]" />
                            </span>
                          </p>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ================= INDICADORES DE PROGRESO DE DIAPOSITIVAS ================= */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3.5">
        {HERO_SLIDES.map((s, index) => (
          <button
            key={s.id}
            onClick={() => goTo(index)}
            aria-label={`Ir a escena ${index + 1}`}
            aria-current={index === currentSlide}
            className="group relative h-6 flex items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ec4a6]"
          >
            <div className="h-[2px] w-12 sm:w-14 bg-black/10 dark:bg-white/20 overflow-hidden rounded-full transition-colors duration-700">
              {index === currentSlide && (
                <motion.div
                  key={`${step}-${autoplay}`}
                  initial={{ width: autoplay ? "0%" : "100%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: autoplay ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-[#2ec4a6] to-[#d4af37] shadow-[0_0_10px_rgba(46,196,166,0.3)] dark:shadow-[0_0_10px_rgba(46,196,166,0.7)]"
                />
              )}
            </div>
          </button>
        ))}
        {!reduceMotion && (
          <button
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Reanudar carrusel" : "Pausar carrusel"}
            className="ml-1 h-6 w-6 flex items-center justify-center rounded-full text-[#1a2b22]/60 dark:text-white/60 hover:text-[#2ec4a6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2ec4a6] transition-colors"
          >
            {userPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </section>
  );
}
