import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { NotificationProvider } from "@/components/ui/notification-provider";
import { Header } from "@/components/header";
import { CinematicPreloader } from "@/components/ui/CinematicPreloader";
import { GoogleProvider } from "@/components/ui/google-provider";

export const metadata: Metadata = {
  title: "Esperanza Laguna",
  description: "Club de Conquistadores, Aventureros y Guías Mayores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if (typeof window !== "undefined" && typeof window.__name === "undefined") { window.__name = function(target, value) { return target; }; }`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-primary/20 overflow-y-scroll">
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
