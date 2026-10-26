import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { NotificationProvider } from "@/components/ui/notification-provider";
import { Header } from "@/components/header";
import { CinematicPreloader } from "@/components/ui/CinematicPreloader";
import { GoogleProvider } from "@/components/ui/google-provider";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  // Las vistas previas de enlaces (WhatsApp) necesitan la URL absoluta de la imagen
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://esperanzalaguna.com"),
  title: "Esperanza Laguna",
  description: "Club de Conquistadores, Aventureros y Guías Mayores.",
  openGraph: {
    title: "Esperanza Laguna · Casa de Modas",
    description: "Uniformes para Conquistadores, Aventureros y Guías Mayores. Revisa tu pedido y paga en línea.",
    siteName: "Esperanza Laguna",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if (typeof window !== "undefined" && typeof window.__name === "undefined") { window.__name = function(target, value) { return target; }; }`,
          }}
        />
      </head>
      <body className={`${GeistSans.className} antialiased min-h-screen flex flex-col selection:bg-primary/20 overflow-y-scroll`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            <GoogleProvider>
              <CinematicPreloader />
              <Header />
              {children}
              <Footer />
            </GoogleProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
