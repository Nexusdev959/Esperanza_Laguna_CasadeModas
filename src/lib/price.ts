// Misma regla que el servidor (backend salePrice): la promoción solo rebaja si está activa y su precio es menor
export const salePrice = (p: { price: number | string; promoActive?: boolean; promoPrice?: number | null }) => {
  const price = Number(p.price) || 0;
  return p.promoActive && p.promoPrice != null && p.promoPrice > 0 && p.promoPrice < price ? p.promoPrice : price;
};

export const formatCOP = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
