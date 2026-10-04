import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LoadingStep {
    label: string;
    isCompleted: boolean;
}

interface AuthTransitionCurtainProps {
    /** Indica si la autenticación inicial fue exitosa */
    isAuthenticated: boolean;
    /** Lista opcional de pasos de carga de datos para el menú */
    steps?: LoadingStep[];
    /** Callback al finalizar el zoom de apertura */
    onTransitionComplete: () => void;
    logoSrc?: string;
}

export const AuthTransitionCurtain: React.FC<AuthTransitionCurtainProps> = ({
    isAuthenticated,
    steps,
    onTransitionComplete,
    logoSrc = '/images/recurso-25-logo.png', // Ruta a tu logo dorado
}) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isDataReady, setIsDataReady] = useState(false);
    const [isZooming, setIsZooming] = useState(false);

    // Pasos por defecto si no se pasan desde fuera
    const defaultSteps = [
        'Verificando credenciales de acceso...',
        'Cargando menú y permisos del sistema...',
        'Sincronizando estado de pedidos y catálogo...',
        '¡Todo listo! Ingresando...',
    ];

    const activeSteps = steps ? steps.map((s) => s.label) : defaultSteps;

    // Secuencia de simulación/avance de carga
    useEffect(() => {
        if (!isAuthenticated) return;

        let index = 0;
        const interval = setInterval(() => {
            index++;
            if (index < activeSteps.length) {
                setCurrentStepIndex(index);
            } else {
                clearInterval(interval);
                setIsDataReady(true);
            }
        }, 600); // 600ms por cada fase de preparación

        return () => clearInterval(interval);
    }, [isAuthenticated, activeSteps.length]);

    // Cuando los datos están listos, disparamos el zoom reveal estilo cortina
    useEffect(() => {
        if (isDataReady) {
            const zoomTimer = setTimeout(() => {
                setIsZooming(true);
            }, 400);

            const exitTimer = setTimeout(() => {
                onTransitionComplete();
            }, 1200);

            return () => {
                clearTimeout(zoomTimer);
                clearTimeout(exitTimer);
            };
        }
    }, [isDataReady, onTransitionComplete]);

    return (
        <AnimatePresence>
            <motion.div
                key="auth-curtain"
                initial={{ opacity: 0 }}
                animate={
                    isZooming
                        ? {
                            opacity: 0,
                            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
                        }
                        : { opacity: 1, transition: { duration: 0.3 } }
                }
                className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090A0D] select-none overflow-hidden px-4"
            >
                {/* Halo resplandeciente dorado de fondo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0.15 }}
                    animate={{
                        scale: [0.85, 1.25, 0.95],
                        opacity: [0.2, 0.45, 0.25],
                    }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse' }}
                    className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.25)_0%,_rgba(0,0,0,0)_70%)] blur-3xl pointer-events-none"
                />

                {/* Contenedor del Logo con Zoom de Entrada y Apertura */}
                <motion.div
                    initial={{ scale: 0.85, opacity: 0, y: 15 }}
                    animate={
                        isZooming
                            ? {
                                scale: 16,
                                opacity: 0,
                                transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
                            }
                            : {
                                scale: 1,
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.7, ease: 'easeOut' },
                            }
                    }
                    className="relative flex items-center justify-center"
                >
                    <div className="relative w-32 h-40 sm:w-40 sm:h-48 flex items-center justify-center">
                        <img
                            src={logoSrc}
                            alt="Logo Esperanza Laguna"
                            className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(212,175,55,0.4)]"
                        />

                        {/* Brillo reflectivo metálico que recorre el isotipo */}
                        <motion.div
                            initial={{ x: '-150%', opacity: 0 }}
                            animate={{
                                x: '150%',
                                opacity: [0, 0.7, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2.0,
                                ease: 'easeInOut',
                                repeatDelay: 0.6,
                            }}
                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-amber-100/35 to-transparent skew-x-[-25deg] pointer-events-none mix-blend-overlay"
                        />
                    </div>
                </motion.div>

                {/* Sección de Estado y Carga de Datos */}
                <motion.div
                    animate={
                        isZooming
                            ? { opacity: 0, y: 15, transition: { duration: 0.3 } }
                            : { opacity: 1, y: 0 }
                    }
                    className="mt-8 flex flex-col items-center max-w-xs text-center"
                >
                    <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-amber-300/80">
                        CASA DE MODAS
                    </span>
                    <span className="font-serif text-lg tracking-widest text-neutral-200 mt-0.5">
                        ESPERANZA LAGUNA
                    </span>

                    {/* Barra de progreso interactiva */}
                    <div className="w-56 h-1 bg-neutral-800/80 rounded-full mt-6 overflow-hidden relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-600 via-amber-300 to-amber-500 rounded-full"
                            initial={{ width: '15%' }}
                            animate={{
                                width: `${((currentStepIndex + 1) / activeSteps.length) * 100}%`,
                            }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                    </div>

                    {/* Texto dinámico del proceso */}
                    <div className="h-6 mt-3 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentStepIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.25 }}
                                className="text-xs text-neutral-400 font-light tracking-wide"
                            >
                                {activeSteps[currentStepIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};