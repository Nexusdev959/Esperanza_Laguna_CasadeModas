import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: "standalone",
  // Módulos sin conectar a la API todavía: se ocultan en esta versión. Para activarlos, quitar la ruta de esta lista.
  async redirects() {
    const hidden = [
      "/worker",
      "/admin/workers",
      "/admin/customers",
      "/admin/admins",
      "/admin/orders/new",
      "/admin/orders/preparation",
      "/admin/payments/pending",
    ];
    return hidden.map((source) => ({
      source,
      destination: source.startsWith("/admin") ? "/admin" : "/",
      permanent: false,
    }));
  },
  // shortcut: sin Content-Security-Policy (Wompi, Google y Cloudinary necesitan una lista blanca probada), agregarla cuando se pruebe el checkout real
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withPWA(nextConfig);

// Para pruebas locales de diseño (UI/UX) sin errores de ruteo de Cloudflare:
// import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
