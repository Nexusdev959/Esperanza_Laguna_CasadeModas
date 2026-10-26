import { api } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { toCardProduct } from "@/components/product-card";
import { LLAVE_COTIZACION } from "../config";
import type { Pieza } from "../types";

// Único punto de contacto con la tienda: productos, carrito y /quotes. Si cambian, se toca solo este archivo.

export interface ProductoPieza {
  id: string;
  nombre: string;
  precio: number;
  tallas: string[];
  stock: number;
  imagen?: string;
  esUniforme: boolean;
}

export interface LineaUniforme {
  pieza: Pieza;
  producto: ProductoPieza | null;
  talla?: string;
}

interface ProductoApi {
  id: string;
  name: string;
  price: number;
  stock?: number;
  images?: string[];
  isUniform?: boolean;
}

const aProductoPieza = (p: ProductoApi): ProductoPieza => {
  const card = toCardProduct(p);
  return {
    id: String(p.id),
    nombre: p.name,
    precio: Number(p.price) || 0,
    tallas: card.sizes ?? [],
    stock: Number(p.stock) || 0,
    imagen: card.image,
    esUniforme: !!p.isUniform,
  };
};

/** Un producto que no existe o falla devuelve null: la pieza se muestra "por confirmar". */
export const cargarProductos = async (ids: string[]) => {
  const productos = await Promise.all(
    ids.map((id) => api.get<ProductoApi>(`/products/${id}`).then((r) => aProductoPieza(r.data)).catch(() => null))
  );
  return Object.fromEntries(ids.map((id, i) => [id, productos[i]])) as Record<string, ProductoPieza | null>;
};

export const formatoPrecio = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/** Piezas que no se pueden comprar todavía: sin producto o sin la talla que el producto exige. */
export const faltantes = (lineas: LineaUniforme[]) =>
  lineas.filter((l) => !l.producto || (l.producto.tallas.length > 0 && !l.talla));

export const agregarAlCarrito = (lineas: LineaUniforme[]) => {
  const { addItem } = useCartStore.getState();
  for (const { producto, talla } of lineas) {
    if (!producto) continue;
    addItem({
      id: [producto.id, talla].filter(Boolean).join("|"),
      productId: producto.id,
      name: producto.nombre,
      price: producto.precio,
      quantity: 1,
      image: producto.imagen,
      size: talla,
      isUniform: producto.esUniforme,
      sizes: producto.esUniforme ? producto.tallas : undefined,
    });
  }
};

/** Deja las piezas donde /quotes las lee (igual que el carrito); el club luego ajusta cantidades. */
export const guardarParaCotizar = (lineas: LineaUniforme[]) => {
  const items = lineas.map(({ pieza, producto, talla }) => ({
    name: producto?.nombre ?? pieza.nombre,
    price: producto?.precio ?? 0,
    quantity: 1,
    size: talla,
  }));
  localStorage.setItem(LLAVE_COTIZACION, JSON.stringify(items));
};
