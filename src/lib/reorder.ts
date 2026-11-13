import { api } from "@/lib/api";
import { salePrice } from "@/lib/price";
import { useCartStore, type ClubMember, type InsigniaOption } from "@/store/cart";

/** Línea a repetir: viene de una cotización guardada o de un pedido anterior */
export type ReorderLine = {
  productId: string; quantity: number; size?: string | null; option?: string | null; insignias?: string | null;
  union?: string | null; association?: string | null; personalization?: string | null; details?: string | null;
  members?: ClubMember[] | null;
};

const sizesOf = (sizes: unknown): string[] => {
  if (Array.isArray(sizes)) return sizes.map((s) => (typeof s === "string" ? s : s?.size ?? s?.name)).filter(Boolean);
  if (sizes && typeof sizes === "object") return Object.keys(sizes).filter((k) => (sizes as Record<string, { active?: boolean }>)[k]?.active);
  return [];
};

/**
 * Agrega las líneas al carrito con el producto como está hoy (precio, tallas, opciones).
 * Lo que ya no existe o cambió (talla u opción retirada) se omite y se cuenta, para avisarle al cliente.
 * El precio final lo vuelve a calcular el servidor al hacer el pedido.
 */
export async function addLinesToCart(lines: ReorderLine[]) {
  const { addItem } = useCartStore.getState();
  let added = 0;
  let skipped = 0;
  for (const line of lines) {
    try {
      const { data: p } = await api.get(`/products/${line.productId}`);
      if (!p?.isPublished || p.archivedAt) { skipped++; continue; }
      const sizes = sizesOf(p.sizes);
      const options: string[] = Array.isArray(p.options) ? p.options : [];
      if (line.size && sizes.length && !sizes.includes(line.size)) { skipped++; continue; }
      if (line.option && !options.includes(line.option)) { skipped++; continue; }
      const insignias = (p.isUniform ? line.insignias ?? "COMPLETAS" : undefined) as InsigniaOption | undefined;
      const base = salePrice(p);
      const details = {
        size: line.size ?? undefined, personalization: line.personalization ?? undefined, union: line.union ?? undefined,
        association: line.association ?? undefined, details: line.details ?? undefined, insignias,
      };
      addItem({
        id: [p.id, line.option, details.size ?? (p.isUniform && line.quantity >= 3 ? "lote" : ""), insignias, details.personalization, details.union, details.association, details.details].filter(Boolean).join("|"),
        productId: p.id,
        name: p.name,
        price: insignias === "NINGUNA" ? Math.max(0, base - (Number(p.noInsigniaDiscount) || 0)) : base,
        quantity: line.quantity,
        image: p.images?.[0],
        isUniform: !!p.isUniform,
        sizes: p.isUniform ? sizes : undefined,
        // Los integrantes (nombre, RH y talla) se repiten; si la talla ya no existe queda vacía para elegirla
        members: p.isUniform ? (line.members ?? []).map((m) => ({ name: m.name, rh: m.rh, size: m.size && sizes.includes(m.size) ? m.size : undefined })) : undefined,
        option: line.option ?? undefined,
        optionLabel: line.option ? p.optionLabel : undefined,
        ...details,
      });
      added++;
    } catch {
      skipped++;
    }
  }
  // El carrito escucha este evento para abrirse
  if (added) window.dispatchEvent(new Event("open-cart"));
  return { added, skipped };
}
