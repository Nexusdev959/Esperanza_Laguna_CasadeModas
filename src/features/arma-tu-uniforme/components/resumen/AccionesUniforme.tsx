"use client";

import { BOTON_LINEA, BOTON_MARCA } from "../estilos";

interface Props {
  hayElegidas: boolean;
  onAgregarTodo: () => void;
  onCotizar: () => void;
}

export function AccionesUniforme({ hayElegidas, onAgregarTodo, onCotizar }: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button type="button" onClick={onAgregarTodo} disabled={!hayElegidas} className={`${BOTON_MARCA} px-5 py-2.5 text-xs`}>
        Agregar uniforme completo al carrito
      </button>
      <button type="button" onClick={onCotizar} className={`${BOTON_LINEA} px-5 py-2.5 text-xs`}>
        Cotizar este uniforme para mi club
      </button>
    </div>
  );
}
