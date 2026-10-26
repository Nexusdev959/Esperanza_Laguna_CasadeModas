"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TRANSICION, rutaFrame } from "../../config";
import { cargarImagen } from "../../hooks/useCargaFrames";
import type { Pieza, Uniforme, Vista } from "../../types";
import { VisorSecuencia } from "./VisorSecuencia";

// El 3D solo se descarga si algún uniforme lo usa
const VisorModelo3D = dynamic(() => import("./VisorModelo3D").then((m) => m.VisorModelo3D));

interface Props {
  uniforme: Uniforme;
  piezaActiva: Pieza | null;
  vista: Vista;
  autoGiro: boolean;
  onSeleccionar: (id: string) => void;
  onVista: (vista: Vista) => void;
}

const llave = (u: Uniforme) => `${u.programa}-${u.variante}`;

/**
 * Elige el visor según el tipo del uniforme. Al cambiar de uniforme, el anterior sigue
 * en pantalla hasta que el primer frame del nuevo está listo, y luego se funden.
 */
export function Visor({ uniforme, ...props }: Props) {
  const [mostrado, setMostrado] = useState(uniforme);

  useEffect(() => {
    if (llave(uniforme) === llave(mostrado)) return;
    const { visor } = uniforme;
    const listo = visor.tipo === "secuencia" ? cargarImagen(rutaFrame(visor.carpeta, "baja", visor.frameFrente)) : Promise.resolve(null);
    let vigente = true;
    listo.then(() => vigente && setMostrado(uniforme));
    return () => {
      vigente = false;
    };
  }, [uniforme, mostrado]);

  const { visor, piezas } = mostrado;
  // Mientras se funden, la pieza activa puede no existir en el uniforme saliente
  const piezaActiva = piezas.find((p) => p.id === props.piezaActiva?.id) ?? null;

  return (
    <div className="relative">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={llave(mostrado)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TRANSICION.uniforme }}
        >
          {visor.tipo === "secuencia" ? (
            <VisorSecuencia {...props} visor={visor} piezas={piezas} piezaActiva={piezaActiva} />
          ) : (
            <VisorModelo3D visor={visor} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
