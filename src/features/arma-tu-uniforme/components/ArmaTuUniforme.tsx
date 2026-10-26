"use client";

import { useCallback } from "react";
import { useEstadoUrl } from "../hooks/useEstadoUrl";
import { usePiezaActiva } from "../hooks/usePiezaActiva";
import { useSeleccionUniforme } from "../hooks/useSeleccionUniforme";
import { useAccionesTienda, useProductosPiezas } from "../hooks/useTienda";
import { useUniformeArmado } from "../hooks/useUniformeArmado";
import type { EstadoUrl, Vista } from "../types";
import { MesaUniforme } from "./MesaUniforme";
import { ResumenUniforme } from "./resumen/ResumenUniforme";
import { SelectoresUniforme } from "./seleccion/SelectoresUniforme";

/** Compone la experiencia: selectores, lista, visor, detalle y resumen de compra. */
export function ArmaTuUniforme({ inicial }: { inicial: EstadoUrl }) {
  const { estado, actualizar } = useEstadoUrl(inicial);
  const seleccion = useSeleccionUniforme(estado, actualizar);
  const piezas = seleccion.uniforme?.piezas ?? [];
  const activa = usePiezaActiva(piezas, estado, actualizar);
  const productos = useProductosPiezas(piezas);
  const armado = useUniformeArmado(piezas, productos);
  const tienda = useAccionesTienda();
  const alVista = useCallback((vista: Vista) => actualizar({ vista }), [actualizar]);

  return (
    <div className="flex flex-col gap-10 pb-40">
      <SelectoresUniforme seleccion={seleccion} estado={estado} />

      {seleccion.uniforme ? (
        <MesaUniforme uniforme={seleccion.uniforme} vista={estado.vista} autoGiro={seleccion.autoGiro} activa={activa} armado={armado} onAgregar={tienda.agregar} onVista={alVista} />
      ) : (
        <p className="py-24 text-center font-sans text-sm text-foreground/55">Este uniforme estará disponible muy pronto.</p>
      )}

      {seleccion.uniforme && (
        <ResumenUniforme
          elegidas={armado.elegidas}
          totalPiezas={piezas.length}
          total={armado.total}
          onAgregarTodo={() => tienda.agregar(armado.elegidas)}
          onCotizar={() => tienda.cotizar(armado.paraCotizar)}
        />
      )}
    </div>
  );
}
