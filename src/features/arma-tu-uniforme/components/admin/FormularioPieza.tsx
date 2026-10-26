"use client";

import { useState } from "react";
import { useFormularioPieza } from "../../hooks/useFormularioPieza";
import { useListaProductos } from "../../hooks/useTienda";
import type { Pieza, Uniforme } from "../../types";
import { CamposPieza } from "./CamposPieza";
import { BOTON_PRIMARIO, BOTON_SECUNDARIO, TARJETA } from "./estilosAdmin";
import { ImagenPieza } from "./ImagenPieza";
import { MarcadorPuntos } from "./MarcadorPuntos";

interface Props {
  uniforme: Uniforme;
  /** null = pieza nueva. */
  pieza: Pieza | null;
  onGuardar: (pieza: Pieza) => Promise<boolean>;
  onCancelar: () => void;
}

/** Alta y edición de una pieza: textos, producto, foto de detalle y ubicación en cada foto. */
export function FormularioPieza({ uniforme, pieza, onGuardar, onCancelar }: Props) {
  const { visor } = uniforme;
  const total = visor.tipo === "secuencia" ? visor.frames : 1;
  const form = useFormularioPieza(pieza, total);
  const productos = useListaProductos();
  const [guardando, setGuardando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const ok = await onGuardar(form.pieza());
    setGuardando(false);
    if (ok) onCancelar();
  };

  return (
    <form onSubmit={enviar} className={`${TARJETA} space-y-8 p-6`}>
      <h2 className="text-lg font-sans font-semibold tracking-tight text-[var(--foreground)]">
        {pieza ? `Editar: ${pieza.nombre}` : "Nueva pieza"}
      </h2>
      <CamposPieza datos={form.datos} productos={productos} onCambiar={form.cambiar} onCambiarId={form.cambiarId} />
      <ImagenPieza url={form.datos.imagenDetalle} onCambiar={(url) => form.cambiar("imagenDetalle", url)} />
      {visor.tipo === "secuencia" && <MarcadorPuntos visor={visor} puntos={form.puntos} onMarcar={form.marcar} onQuitar={form.quitar} />}
      <div className="flex justify-end gap-3 border-t border-[var(--border-color)] pt-6">
        <button type="button" onClick={onCancelar} className={BOTON_SECUNDARIO}>
          Cancelar
        </button>
        <button type="submit" disabled={!form.valida || guardando} className={BOTON_PRIMARIO}>
          {guardando ? "Guardando…" : "Guardar pieza"}
        </button>
      </div>
    </form>
  );
}
