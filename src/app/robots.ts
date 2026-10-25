import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/checkout", "/worker", "/reset-password"],
    },
    sitemap: "https://esperanzalaguna.com/sitemap.xml",
  };
}
