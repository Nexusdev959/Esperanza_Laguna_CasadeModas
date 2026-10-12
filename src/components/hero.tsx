"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { HeroCanvasBackground } from "@/components/ui/hero-canvas-background";
import { api } from "@/lib/api";

// Three.js (~600 KB) fuera del bundle inicial: la selva llega después de la primera pintura
const JungleBackground = dynamic(
  () => import("@/components/ui/jungle-background").then((m) => m.JungleBackground),
  { ssr: false, loading: () => <div className="absolute inset-0 z-0 bg-[#f8faf9] dark:bg-[#040706]" /> }
);

// Diapositivas editoriales
const HERO_SLIDES = [
  {
    id: 1,
    title: "Origen & Esencia",
    highlight: "NACIONAL",
    subtitle:
      "Fibras puras y texturas nobles nacidas en tierras colombianas. Vestir la frescura de nuestra propia naturaleza.",
    cta: "Explorar Colección",
    link: "/catalogo",
    themeHue: "emerald", // Tonalidad de hilos: bosque / esmeralda
  },
  {
    id: 2,
    title: "Sutileza en",
    highlight: "MOVIMIENTO",
    subtitle:
      "Siluetas etéreas y confección orgánica que respiran con cada paso. Diseño contemporáneo sin artificios.",
    cta: "Ver Novedades",
    link: "/catalogo",
    themeHue: "gold", // Tonalidad de hilos: hebras de oro
  },
  {
    id: 3,
    title: "El lujo de lo",
    highlight: "NATURAL",
    subtitle:
      "Algodones crudos, tonos tierra y el eco de nuestros paisajes. La elegancia más pura no compite, simplemente existe.",
    cta: "Descubrir Prendas",
    link: "/catalogo",
    themeHue: "mist", // Tonalidad de hilos: bruma andina y lino
  },
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
      {/* ================= SELVA BASE (COMPONENTE INDEPENDIENTE PROCEDURAL) ================= */}
      <JungleBackground paused={!inView || !!reduceMotion} />

      {/* ================= CANVAS VIVO (MOTOR 3D: MONTAÑAS Y POLVO) ================= */}
      <HeroCanvasBackground themeHue={slide.themeHue} paused={!inView || !!reduceMotion} />

      {/* Rayos de sol (God Rays) y resplandor natural para luz de día */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-100 dark:opacity-0 transition-opacity duration-1000 overflow-hidden">
        {/* Rayos rotatorios */}
        <div className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,220,0)_0%,rgba(255,255,220,0.3)_10%,rgba(255,255,220,0)_20%,rgba(255,255,220,0.4)_35%,rgba(255,255,220,0)_50%,rgba(255,255,220,0.25)_65%,rgba(255,255,220,0)_80%,rgba(255,255,220,0.35)_90%,rgba(255,255,220,0)_100%)] animate-[spin_60s_linear_infinite] motion-reduce:animate-none" />
        {/* Sol cálido difuso en el centro */}
        <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,250,220,0.9)_0%,rgba(255,250,220,0.4)_30%,transparent_70%)]" />
      </div>

      {/* Viñeta oscura en los bordes para enmarcar la escena (solo en modo oscuro) */}
      <div className="absolute inset-0 bg-transparent dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10 pointer-events-none transition-colors duration-700" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#f4f7f5] dark:from-[#050807] to-transparent z-10 pointer-events-none transition-colors duration-700" />

      {/* ================= CONTENIDO EDITORIAL ================= */}
      <h1 className="sr-only">Esperanza Laguna: moda colombiana en fibras naturales</h1>
      <div
        className={`relative z-20 w-full mx-auto px-6 pt-20 lg:pt-0 pointer-events-none flex flex-col-reverse items-center gap-8 ${
          hasGarments ? "max-w-7xl lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-12" : "max-w-4xl"
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
                  className={`font-sans font-extralight tracking-[0.6em] text-transparent bg-clip-text bg-gradient-to-r from-[#18362a] via-[#10241b] to-[#d4af37] dark:from-[#fdfbf7] dark:via-[#f0ede6] dark:to-[#d4af37] uppercase text-2xl sm:text-4xl md:text-5xl mt-3 block pl-[0.6em] ${
                    hasGarments ? "lg:pl-0" : ""
                  }`}
                >
                  {slide.highlight}
                </span>
              </h2>

              {/* Subtítulo Poético */}
              <p className="text-[#3c5246] dark:text-[#c8d4cf] text-sm sm:text-base md:text-lg font-light tracking-widest max-w-xl leading-relaxed drop-shadow-sm dark:drop-shadow-md mb-9 font-sans transition-colors duration-700">
                {slide.subtitle}
              </p>

              {/* CTA de Cristal Líquido (Liquid Glass) */}
              <Link
                href={slide.link}
                className="pointer-events-auto group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-black/[0.04] dark:bg-white/[0.07] hover:bg-black/[0.08] dark:hover:bg-white/[0.16] text-[#1a2b22] dark:text-[#f2f6f4] border border-black/10 dark:border-white/20 hover:border-[#2ec4a6]/50 backdrop-blur-xl text-xs sm:text-[13px] font-sans font-medium tracking-[0.22em] uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2ec4a6]"
              >
                <span>{slide.cta}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#2ec4a6]" />
              </Link>
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
