import type { MetadataRoute } from "next";

// shortcut: solo páginas fijas, sin productos (vienen de la API), agregarlos si el SEO por producto importa
const pages = [
  "",
  "/catalogo",
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

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({ url: `https://esperanzalaguna.com${path}` }));
}
