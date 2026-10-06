"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export interface CinematicPreloaderProps {
  monogramSrc?: string;
  textLogoSrc?: string;
  /** Duración mínima visible para apreciar la entrada */
  minDurationMs?: number;
  onComplete?: () => void;
}

export const CinematicPreloader: React.FC<CinematicPreloaderProps> = ({
  monogramSrc = "/logos/log1.png",
  textLogoSrc = "/logos/log3.png",
  minDurationMs = 1400,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  // Esperar a montar para evitar desajustes de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  const isLightMode = mounted && (resolvedTheme === "light" || theme === "light");

  // En modo claro usamos el logo oscuro (log4)
  const currentTextLogo = textLogoSrc === "/logos/log3.png" && isLightMode
    ? "/logos/log2.png"
    : textLogoSrc;

  useEffect(() => {
    const startTime = Date.now();

    const handleReady = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDurationMs - elapsed);

      setTimeout(() => {
        setIsVisible(false);
      }, remaining);
    };

    const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
    const loadPromise =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));

    Promise.all([fontsPromise, loadPromise]).then(handleReady);
  }, [minDurationMs]);

  const cinematicEase = [0.16, 1, 0.3, 1] as const;

  return (
    <AnimatePresence
      onExitComplete={() => {
        onComplete?.();
      }}
    >
      {isVisible && (
        <motion.div
          key="cinematic-curtain"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.7, ease: cinematicEase },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f4f7f5] dark:bg-[#060908] select-none overflow-hidden will-change-opacity transition-colors duration-700"
        >
          {/* Trama Textil de Urdimbre en Bajorrelieve */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] dark:opacity-[0.04] mix-blend-multiply dark:mix-blend-screen transition-opacity duration-700">
            <defs>
              <pattern id="preloaderWeave" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M0 12 L12 0 M12 24 L24 12 M0 0 L24 24" stroke={isLightMode ? "#8c6b16" : "#d4af37"} strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="1" fill={isLightMode ? "#1a8566" : "#2ec4a6"} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#preloaderWeave)" />
          </svg>

          {/* Viñeta de Iluminación Óptica */}
          <div
            className="absolute inset-0 pointer-events-none transition-colors duration-700"
            style={{
              backgroundImage: isLightMode
                ? "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(26, 133, 102, 0.03) 0%, rgba(244, 247, 245, 0.7) 60%, #f4f7f5 100%)"
                : "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(46, 196, 166, 0.08) 0%, rgba(6, 9, 8, 0.7) 60%, #060908 100%)",
            }}
          />

          {/* Halo central suave */}
          <motion.div
            initial={{ opacity: 0.15, scale: 0.95 }}
            animate={{ opacity: 0.35, scale: 1.05 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute w-96 h-96 rounded-full bg-[#d4af37]/15 dark:bg-[#d4af37]/8 blur-3xl pointer-events-none transition-colors duration-700"
          />

          {/* Hilván Perimetral con Pespuntes */}
          <div className="absolute inset-4 sm:inset-8 rounded-2xl border border-dashed border-[#b48c28]/20 dark:border-[#d4af37]/15 pointer-events-none [stroke-dasharray:6_6] transition-colors duration-700">
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#b48c28]/40 dark:border-[#d4af37]/35 transition-colors duration-700" />
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#b48c28]/40 dark:border-[#d4af37]/35 transition-colors duration-700" />
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#b48c28]/40 dark:border-[#d4af37]/35 transition-colors duration-700" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#b48c28]/40 dark:border-[#d4af37]/35 transition-colors duration-700" />
          </div>

          {/* ================= NÚCLEO CENTRAL ================= */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 1.02,
              transition: { duration: 0.5, ease: [0.32, 0, 0.67, 0] },
            }}
            transition={{ duration: 0.8, ease: cinematicEase }}
            className="relative z-10 flex flex-col items-center justify-center px-6"
          >
            {/* Monograma / Isotipo (Aumentado de tamaño) */}
            <motion.img
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: cinematicEase }}
              src={monogramSrc}
              alt="Monograma"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain brightness-100 dark:brightness-105 drop-shadow-[0_6px_24px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_6px_24px_rgba(0,0,0,0.7)] transition-all duration-700"
            />

            {/* Logotipo Tipográfico (Aumentado de tamaño) */}
            <motion.img
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: cinematicEase }}
              src={currentTextLogo}
              alt="Tipografía Logo"
              className="w-64 sm:w-76 md:w-84 h-auto mt-6 object-contain opacity-95 drop-shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all duration-700"
            />

            {/* ================= BARRA DE COSTURA CON MÁQUINA ACTIVA ================= */}
            <div className="relative mt-12 w-64 sm:w-72 h-14 flex items-center justify-center">
              {/* Carril de Tela Base (Guía de puntada tenue) */}
              <div className="w-full h-[2px] bg-black/[0.04] dark:bg-white/[0.04] relative rounded-full overflow-hidden transition-colors duration-700">
                <div className="absolute inset-0 border-b border-dashed border-[#b48c28]/30 dark:border-[#d4af37]/20 [stroke-dasharray:4_4] transition-colors duration-700" />
              </div>

              {/* Pespunte de Hilo Luminoso Revelado (Efecto de Hilo que se Cose) */}
              <div className="absolute left-0 right-0 h-full flex items-center pointer-events-none">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.85, 1],
                  }}
                  className="h-full overflow-hidden flex items-center"
                >
                  <svg 
                    width="400" 
                    height="4" 
                    className="shrink-0 transition-all duration-700" 
                    style={{ 
                      filter: isLightMode ? "drop-shadow(0 0 2px rgba(28,120,95,0.4))" : "drop-shadow(0 0 3px rgba(212,175,55,0.6))"
                    }}
                  >
                    <line 
                      x1="0" y1="2" x2="400" y2="2" 
                      stroke={isLightMode ? "#1c785f" : "#d4af37"} 
                      strokeWidth="2.5" 
                      strokeDasharray="6 5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Pie de Máquina de Coser (Prensatelas y Aguja Mecánica) */}
              <motion.div
                initial={{ left: "0%" }}
                animate={{ left: ["0%", "100%", "0%"] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.85, 1],
                }}
                className="absolute top-1 pointer-events-none -translate-x-1/2 z-20"
              >
                {/* Micro-rebote vertical de la aguja al penetrar la tela */}
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{
                    duration: 0.16,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex flex-col items-center"
                >
                  <svg width="26" height="32" viewBox="0 0 26 32" fill="none">
                    <defs>
                      <linearGradient id="machineMetal" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={isLightMode ? "#cca643" : "#f5e1a4"} />
                        <stop offset="50%" stopColor={isLightMode ? "#997b2d" : "#bfa054"} />
                        <stop offset="100%" stopColor={isLightMode ? "#66511e" : "#7a5c1e"} />
                      </linearGradient>
                      <linearGradient id="needleSteel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isLightMode ? "#94a3b8" : "#ffffff"} />
                        <stop offset="50%" stopColor={isLightMode ? "#64748b" : "#cbd5e1"} />
                        <stop offset="100%" stopColor={isLightMode ? "#475569" : "#64748b"} />
                      </linearGradient>
                    </defs>

                    {/* Barra porta-aguja superior */}
                    <rect x="11.5" y="0" width="3" height="12" rx="0.5" fill="url(#needleSteel)" />
                    {/* Tornillo de sujeción dorado */}
                    <rect x="9.5" y="7" width="7" height="3" rx="1" fill="url(#machineMetal)" />

                    {/* Aguja ultra fina con punta afilada */}
                    <line x1="13" y1="12" x2="13" y2="24" stroke="url(#needleSteel)" strokeWidth="1.4" strokeLinecap="round" />
                    {/* Ojo de la aguja */}
                    <circle cx="13" cy="20" r="0.6" fill={isLightMode ? "#1a2b22" : "#060908"} />

                    {/* Hilo tenso saliendo del ojo de la aguja */}
                    <path d="M13 20 Q16 17 20 14" stroke={isLightMode ? "#1c785f" : "#d4af37"} strokeWidth="1.2" fill="none" opacity="0.9" className="transition-colors duration-700" />

                    {/* Pie prensatelas de doble patín (perfil lateral de máquina) */}
                    <path
                      d="M7 21 C7 21 8 23 10 23 L16 23 C18 23 19 21 19 21"
                      stroke="url(#machineMetal)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>

                  {/* Destello de fricción / luz en el punto exacto de la puntada */}
                  <span className={`w-1.5 h-1.5 rounded-full blur-[1px] -mt-1 transition-colors duration-700 ${isLightMode ? 'bg-[#1c785f] drop-shadow-[0_0_3px_rgba(28,120,95,0.8)]' : 'bg-[#d4af37] drop-shadow-[0_0_4px_rgba(212,175,55,0.8)]'}`} />
                </motion.div>
              </motion.div>
            </div>

            {/* Sello inferior sutil */}
            <span className="mt-1 text-[10px] tracking-[0.38em] text-[#a37c1d] dark:text-[#d4af37]/60 uppercase font-mono transition-colors duration-700">
              Alta Costura • Confección
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};