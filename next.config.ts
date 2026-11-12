import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

// Política de seguridad: el navegador solo carga código, marcos y conexiones de estos orígenes.
// La sesión vive en localStorage: si alguien lograra inyectar un <script src> ajeno, aquí se bloquea.
// Si se agrega un servicio externo nuevo (otro pago, otro mapa, otro chat), hay que sumarlo a su lista.
const isDev = process.env.NODE_ENV === "development";
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL || "https://api.esperanzalaguna.com/api/v1").origin;
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline': Next inyecta scripts en línea para hidratar; el resto de orígenes es explícito
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://checkout.wompi.co https://accounts.google.com/gsi/client https://www.googletagmanager.com https://connect.facebook.net`,
  "style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.pexels.com https://images.unsplash.com https://via.placeholder.com https://ui-avatars.com https://*.googleusercontent.com https://www.googletagmanager.com https://*.google-analytics.com https://www.facebook.com",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin} ${apiOrigin.replace(/^http/, "ws")} https://*.wompi.co https://accounts.google.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.facebook.com https://connect.facebook.net`,
  "frame-src https://checkout.wompi.co https://*.wompi.co https://accounts.google.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
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
