"use client";

import type { Pieza } from "../../types";
import { ROTULO } from "../estilos";
import { ItemPieza } from "./ItemPieza";

interface Props {
  piezas: Pieza[];
  activa: string | null;
  incluida: (id: string) => boolean;
  onSeleccionar: (id: string) => void;
}

/** Todas las piezas del uniforme, sincronizadas con el visor. También es la vía para teclado y lectores de pantalla. */
export function ListaPiezas({ piezas, activa, incluida, onSeleccionar }: Props) {
  return (
    <nav aria-labelledby="titulo-piezas">
      <h2 id="titulo-piezas" className={`${ROTULO} mb-3`}>
        Piezas del uniforme · {piezas.length}
      </h2>
      <ol className="border-b border-foreground/[0.08]">
        {piezas.map((pieza, i) => (
          <li key={pieza.id}>
            <ItemPieza
              indice={i}
              nombre={pieza.nombre}
              descripcion={pieza.descripcion}
              activa={activa === pieza.id}
              incluida={incluida(pieza.id)}
              onSeleccionar={() => onSeleccionar(pieza.id)}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}
