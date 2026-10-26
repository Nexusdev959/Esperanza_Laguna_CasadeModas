"use client";

import { ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PROGRAMAS, UNIFORMES } from "../../data";
import { useAdminPiezas } from "../../hooks/useAdminPiezas";
import { claveUniforme, type PiezaGuardada } from "../../lib/contenido";
import { escribirEstado } from "../../lib/url-state";
import type { Uniforme } from "../../types";
import { BOTON_PRIMARIO, BOTON_SECUNDARIO, TARJETA } from "./estilosAdmin";
import { FormularioPieza } from "./FormularioPieza";
import { ListaPiezasAdmin } from "./ListaPiezasAdmin";

const etiqueta = (u: Uniforme) => {
  const programa = PROGRAMAS.find((p) => p.id === u.programa);
  return `${programa?.nombre ?? u.programa} · ${programa?.variantes.find((v) => v.id === u.variante)?.nombre ?? u.variante}`;
};

/** Admin de «Arma tu uniforme»: elegir uniforme y agregar, editar, ordenar o quitar sus piezas. */
export function AdminUniformes() {
  const [uniforme, setUniforme] = useState<Uniforme>(UNIFORMES[0]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)]">Arma tu uniforme</h1>
        <p className="text-sm text-[var(--muted)]">Piezas del visor 360°: textos, foto de detalle, producto y ubicación en las fotos.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Uniforme">
        {UNIFORMES.map((u) => (
          <button
            key={claveUniforme(u)}
            type="button"
            role="radio"
            aria-checked={u === uniforme}
            onClick={() => setUniforme(u)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${u === uniforme ? "border-primary bg-primary text-white" : "border-[var(--border-color)] text-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            {etiqueta(u)}
          </button>
        ))}
      </div>
      <PiezasDelUniforme key={claveUniforme(uniforme)} uniforme={uniforme} />
    </div>
  );
}

function PiezasDelUniforme({ uniforme }: { uniforme: Uniforme }) {
  const { piezas, isLoading, guardar, borrar, mover, importarEjemplo } = useAdminPiezas(uniforme);
  const [editando, setEditando] = useState<PiezaGuardada | "nueva" | null>(null);
  const enlace = `/arma-tu-uniforme${escribirEstado({ programa: uniforme.programa, variante: uniforme.variante, pieza: null, vista: "frente" })}`;

  if (editando) {
    const existente = editando === "nueva" ? null : editando;
    return <FormularioPieza uniforme={uniforme} pieza={existente} onGuardar={(p) => guardar(p, existente)} onCancelar={() => setEditando(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={enlace} target="_blank" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          Ver en la tienda <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <button type="button" onClick={() => setEditando("nueva")} className={BOTON_PRIMARIO}>
          <Plus className="h-4 w-4" /> Agregar pieza
        </button>
      </div>
      {!isLoading && piezas.length === 0 ? (
        <div className={`${TARJETA} space-y-3 p-6 text-sm text-[var(--muted)]`}>
          <p>Este uniforme todavía usa las {uniforme.piezas.length} piezas de ejemplo del código. Cópialas para editarlas aquí, o agrega piezas nuevas.</p>
          <button type="button" onClick={importarEjemplo} className={BOTON_SECUNDARIO}>Copiar las piezas de ejemplo</button>
        </div>
      ) : (
        <ListaPiezasAdmin
          piezas={piezas}
          onEditar={setEditando}
          onMover={mover}
          onBorrar={(p) => confirm(`¿Eliminar «${p.nombre}» del visor?`) && borrar(p)}
        />
      )}
    </div>
  );
}
