type When = string | Date | null | undefined;
type PromoFields = { promoActive?: boolean; promoStartsAt?: When; promoEndsAt?: When };

// Misma regla que el servidor (backend promoLive/salePrice): activa, dentro de sus fechas y con precio menor
export const promoLive = (p: PromoFields, now = Date.now()) =>
  !!p.promoActive
  && (!p.promoStartsAt || new Date(p.promoStartsAt).getTime() <= now)
  && (!p.promoEndsAt || new Date(p.promoEndsAt).getTime() > now);

export const salePrice = (p: PromoFields & { price: number | string; promoPrice?: number | null }) => {
  const price = Number(p.price) || 0;
  return promoLive(p) && p.promoPrice != null && p.promoPrice > 0 && p.promoPrice < price ? p.promoPrice : price;
};

export const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
