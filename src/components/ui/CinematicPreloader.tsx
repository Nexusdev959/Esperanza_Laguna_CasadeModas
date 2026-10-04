"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

export interface CinematicPreloaderProps {
  /** Logo claro por defecto (light mode) */
  lightLogoSrc?: string;
  /** Logo oscuro por defecto (dark mode) */
  darkLogoSrc?: string;
  /** Duración mínima de la cortina para asegurar el efecto cinemático */
  minDurationMs?: number;
  /** Callback al desmontar la cortina */
  onComplete?: () => void;
}

export const CinematicPreloader: React.FC<CinematicPreloaderProps> = ({
  lightLogoSrc = '/logos/log2.png',
  darkLogoSrc = '/logos/log3.png',
  minDurationMs = 1800,
  onComplete,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fase 0: Set background color immediately to avoid white flashes (F5)
    document.body.style.backgroundColor = '#07080A';

    let windowLoaded = false;
    let fontsReady = false;
    let timeElapsed = false;

    const checkReady = () => {
      if (windowLoaded && fontsReady && timeElapsed) {
        setIsReady(true);
      }
    };

    // 1. Duración mínima
    const timer = setTimeout(() => {
      timeElapsed = true;
      checkReady();
    }, minDurationMs);

    // 2. Window Load
    if (document.readyState === 'complete') {
      windowLoaded = true;
    } else {
      window.addEventListener('load', () => {
        windowLoaded = true;
        checkReady();
      });
    }

    // 3. Fonts Ready
    if (document.fonts) {
      document.fonts.ready.then(() => {
        fontsReady = true;
        checkReady();
      });
    } else {
      fontsReady = true;
    }

    checkReady();

    return () => clearTimeout(timer);
  }, [minDurationMs]);

  useEffect(() => {
    // Fase 4: Salida cortina
    if (isReady && !isFinished) {
      const zoomTimer = setTimeout(() => {
        setIsZooming(true);
      }, 200);

      const exitTimer = setTimeout(() => {
        setIsFinished(true);
        document.body.style.backgroundColor = ''; // Restore body background
        if (onComplete) onComplete();
      }, 1000);

      return () => {
        clearTimeout(zoomTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [isReady, isFinished, onComplete]);

  if (isFinished) return null;

  // Use correct logo based on theme (defaults to dark logo if not mounted to prevent flash)
  const currentLogo = mounted && resolvedTheme === 'light' ? lightLogoSrc : darkLogoSrc;

  // Curvas de animación cinemáticas estilo Apple
  const easeInOutApple = [0.76, 0, 0.24, 1];
  const easeOutQuart = [0.25, 1, 0.5, 1];

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="cinematic-preloader"
          initial={{ opacity: 1 }}
          animate={
            isZooming
              ? { opacity: 0, transition: { duration: 0.8, ease: easeInOutApple } }
              : { opacity: 1 }
          }
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#07080A] select-none overflow-hidden px-4"
        >
          {/* Halo volumétrico respirando (iluminación radial) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.2 }}
            animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
            className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,1)_0%,_rgba(0,0,0,0)_70%)] blur-3xl pointer-events-none mix-blend-screen"
          />

          {/* Contenedor de elementos para aplicar el Zoom expansivo unificado */}
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={
              isZooming
                ? { scale: 18, opacity: 0, transition: { duration: 0.8, ease: easeOutQuart } }
                : { scale: 1, opacity: 1 }
            }
            className="relative flex flex-col items-center justify-center z-10"
          >
            {/* Isotipo: Entrada orgánica con blur */}
            <motion.div
              initial={{ scale: 0.92, filter: 'blur(6px)', opacity: 0 }}
              animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 1.2, ease: easeInOutApple }}
              className="relative w-32 h-40 sm:w-44 sm:h-52 flex items-center justify-center mb-6"
            >
              <img
                src={currentLogo}
                alt="Casa de Modas Esperanza Laguna"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
              />

              {/* Shimmer / Light Sweep líquido */}
              <motion.div
                initial={{ x: '-150%', opacity: 0 }}
                animate={{ x: '150%', opacity: [0, 0.65, 0] }}
                transition={{ duration: 1.8, ease: 'linear', repeat: Infinity, repeatDelay: 1.2 }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-amber-200/40 to-transparent skew-x-[-25deg] pointer-events-none mix-blend-overlay"
              />
            </motion.div>

            {/* Tipografía con máscara/revelado vertical */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={
                isZooming
                  ? { opacity: 0, y: -20, transition: { duration: 0.4, ease: easeInOutApple } }
                  : { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.6, ease: easeInOutApple } }
              }
              className="flex flex-col items-center text-center overflow-hidden"
            >
              <span className="text-[10px] sm:text-[11px] font-light tracking-[0.4em] text-amber-500/80 uppercase">
                Casa de Modas
              </span>
              <span className="font-serif text-lg sm:text-xl tracking-[0.25em] text-[#F4F4F5] mt-1.5 font-medium">
                ESPERANZA LAGUNA
              </span>
            </motion.div>

            {/* Indicador de carga minimalista */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={
                isZooming
                  ? { opacity: 0, transition: { duration: 0.3 } }
                  : { opacity: 1, transition: { duration: 0.8, delay: 1.0, ease: easeInOutApple } }
              }
              className="mt-10 w-44 h-[1.5px] bg-[#1F2024] overflow-hidden rounded-full relative"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.6, ease: 'linear', repeat: Infinity }}
                className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-amber-500/80 to-transparent"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
