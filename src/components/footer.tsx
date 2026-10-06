"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Mail, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { api } from "@/lib/api";

export function Footer() {
  const pathname = usePathname();
  const [storeName, setStoreName] = useState("Esperanza Laguna Casa de Modas");
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    api
      .get("/settings")
      .then((res) => {
        if (res.data?.storeName) setStoreName(res.data.storeName);
      })
      .catch(console.error);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isDark = mounted ? theme === "dark" : true;

  return (
    <footer className={`relative w-full mt-24 font-sans select-none overflow-hidden transition-colors duration-500 ${isDark ? "bg-[#050807] text-[#8e9f99]" : "bg-[#fbfcfb] text-[#5e6e68]"}`}>
      {/* ================= ILUMINACIÓN CINEMÁTICA SUPERIOR ================= */}
      {/* Luz cenital difusa */}
      <div
        className="absolute top-0 inset-x-0 h-40 pointer-events-none"
        style={{
          backgroundImage: isDark 
            ? "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(46, 196, 166, 0.08) 0%, transparent 80%)"
            : "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(46, 196, 166, 0.15) 0%, transparent 80%)"
        }}
      />

      {/* Filete superior degradado en oro viejo */}
      <div className={`absolute top-0 inset-x-0 h-[1px] ${isDark ? "bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent" : "bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent"}`} />

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Columna 1: Identidad y Misión */}
          <div className="space-y-5 lg:pr-4">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <img
                src="/logos/log1.png"
                alt="Logo"
                width="120"
                height="120"
                className={`h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${isDark ? "drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)]" : "drop-shadow-[0_2px_12px_rgba(212,175,55,0.5)]"}`}
              />
              <div className="flex flex-col justify-center">
                <img
                  src="/logos/log2.png"
                  alt="Logotipo"
                  width="400"
                  height="80"
                  className="h-10 w-auto object-contain dark:hidden"
                />
                <img
                  src="/logos/log3.png"
                  alt="Logotipo"
                  width="400"
                  height="80"
                  className="h-10 w-auto object-contain hidden dark:block drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
                />
              </div>
            </Link>

            <p className={`text-xs sm:text-[13px] leading-relaxed font-normal ${isDark ? "text-[#788a83]" : "text-[#5e6e68]"}`}>
              Alta costura y manufactura nacional de indumentaria institucional. Diseño impecable, materiales premium y estricta precisión reglamentaria.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div className="space-y-4">
            <h3 className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isDark ? "text-[#d4af37]" : "text-[#b38f39]"}`}>
              Navegación
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/track-order" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Rastrear Pedido
                </Link>
              </li>
              <li>
                <Link href="/quotes" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Cotizaciones
                </Link>
              </li>
              <li>
                <Link href="/admin" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Panel de Administrador
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte y Ayuda */}
          <div className="space-y-4">
            <h3 className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isDark ? "text-[#d4af37]" : "text-[#b38f39]"}`}>
              Soporte y Ayuda
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/contact" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Centro de Soporte / Contacto
                </Link>
              </li>
              <li>
                <Link href="/legal/shipping" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Política de Envíos
                </Link>
              </li>
              <li>
                <Link href="/legal/refunds" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Devoluciones y Reembolsos
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Legales y Privacidad */}
          <div className="space-y-4">
            <h3 className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isDark ? "text-[#d4af37]" : "text-[#b38f39]"}`}>
              Legales y Privacidad
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/legal/privacy" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/legal/legal-notice" className={`inline-block transition-all duration-200 hover:translate-x-1 ${isDark ? "hover:text-[#f0f4f2]" : "hover:text-[#0d2a23]"}`}>
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 5: Síguenos (Cápsulas de Cristal Líquido) */}
          <div className="space-y-4">
            <h3 className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${isDark ? "text-[#d4af37]" : "text-[#b38f39]"}`}>
              Síguenos
            </h3>
            <div className="flex items-center space-x-3 pt-1">
              <a
                href="#"
                aria-label="Sitio Web"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-sm ${isDark ? "bg-white/[0.03] border border-white/[0.08] hover:border-[#2ec4a6]/50 hover:bg-[#2ec4a6]/10 hover:text-[#2ec4a6] text-[#788a83]" : "bg-black/[0.03] border border-stone-200 hover:border-[#2ec4a6]/50 hover:bg-[#2ec4a6]/10 hover:text-[#187563] text-[#5e6e68]"}`}
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Mensaje"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-sm ${isDark ? "bg-white/[0.03] border border-white/[0.08] hover:border-[#2ec4a6]/50 hover:bg-[#2ec4a6]/10 hover:text-[#2ec4a6] text-[#788a83]" : "bg-black/[0.03] border border-stone-200 hover:border-[#2ec4a6]/50 hover:bg-[#2ec4a6]/10 hover:text-[#187563] text-[#5e6e68]"}`}
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Correo"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-sm ${isDark ? "bg-white/[0.03] border border-white/[0.08] hover:border-[#2ec4a6]/50 hover:bg-[#2ec4a6]/10 hover:text-[#2ec4a6] text-[#788a83]" : "bg-black/[0.03] border border-stone-200 hover:border-[#2ec4a6]/50 hover:bg-[#2ec4a6]/10 hover:text-[#187563] text-[#5e6e68]"}`}
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* ================= BARRA INFERIOR / CRÉDITOS ================= */}
        <div className={`mt-14 pt-6 relative flex flex-col items-center gap-3.5 text-center text-xs ${isDark ? "text-[#b0c0b8]" : "text-[#4a5b54]"}`}>
          {/* Separador con desvanecimiento lateral */}
          <div className={`absolute top-0 inset-x-8 h-[1px] ${isDark ? "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" : "bg-gradient-to-r from-transparent via-black/[0.08] to-transparent"}`} />

          <p className="tracking-wide">
            &copy; {new Date().getFullYear()} {storeName}. Diseñado para servir. Todos los derechos reservados.
          </p>

          <div className="flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <span className={`text-[11px] tracking-wider uppercase ${isDark ? "text-[#788a83]" : "text-[#5e6e68]"}`}>Designed by</span>
            {mounted && (
              <img 
                src={isDark ? "/logos/log5.png" : "/logos/log4.png"} 
                alt="Designer Logo" 
                width="200"
                height="40"
                className="h-5 w-auto object-contain brightness-90 contrast-125" 
              />
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}