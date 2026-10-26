import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useNotification } from "@/components/ui/notification-provider";
import { agregarAlCarrito, cargarProductos, faltantes, guardarParaCotizar, type LineaUniforme } from "../lib/tienda";
import type { Pieza } from "../types";

const SIN_PRODUCTOS: Record<string, never> = {};

/** Productos reales de las piezas (precio, tallas, stock). */
export function useProductosPiezas(piezas: Pieza[]) {
  const ids = piezas.map((p) => p.productoId).filter((id): id is string => !!id);
  const { data } = useSWR(ids.length ? ["arma-tu-uniforme", ...ids] : null, () => cargarProductos(ids));
  return data ?? SIN_PRODUCTOS;
}

/** Acciones de compra con sus avisos; la conexión real vive en lib/tienda.ts. */
export function useAccionesTienda() {
  const router = useRouter();
  const { showNotification } = useNotification();

  const agregar = (lineas: LineaUniforme[]) => {
    if (lineas.length === 0) return showNotification("Elige al menos una pieza", "error");
    const pendientes = faltantes(lineas);
    if (pendientes.length > 0) {
      const sinProducto = pendientes.find((l) => !l.producto);
      return showNotification(
        sinProducto ? `${sinProducto.pieza.nombre} aún no está a la venta: puedes cotizarla` : `Elige la talla de ${pendientes[0].pieza.nombre}`,
        "error"
      );
    }
    agregarAlCarrito(lineas);
    showNotification(lineas.length === 1 ? `${lineas[0].pieza.nombre} agregada al carrito` : "Uniforme agregado al carrito", "success");
  };

  const cotizar = (lineas: LineaUniforme[]) => {
    guardarParaCotizar(lineas);
    router.push("/quotes");
  };

  return { agregar, cotizar };
}
