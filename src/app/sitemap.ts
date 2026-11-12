import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/api";

const SITE = "https://esperanzalaguna.com";

const pages = [
  "",
  "/catalogo",
  "/clubes",
  "/arma-tu-uniforme",
  "/quotes",
  "/track-order",
  "/contact",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/refunds",
  "/legal/shipping",
  "/legal/legal-notice",
];

// Cada producto con su propia URL: es lo que la gente busca en Google ("cinta de nombre conquistadores")
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { id: string; updatedAt?: string; isPublished?: boolean }[] = [];
  try {
    const res = await fetch(`${API_URL}/products`);
    if (res.ok) products = await res.json();
  } catch {
    // Si la API no responde, el sitemap sale igual con las páginas fijas
  }
  return [
    ...pages.map((path) => ({ url: `${SITE}${path}` })),
    ...products
      .filter((p) => p.isPublished !== false)
      .map((p) => ({ url: `${SITE}/products/${p.id}`, lastModified: p.updatedAt })),
  ];
}
