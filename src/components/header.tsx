"use client";

import Link from "next/link";
import { Search, User, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Cart } from "./cart";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

const NAV_LINKS = [
  { path: "/", label: "Inicio" },
  { path: "/track-order", label: "Rastrear" },
  { path: "/quotes", label: "Cotizaciones" },
  { path: "/contact", label: "Soporte" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userRoute, setUserRoute] = useState("/login");
  const pathname = usePathname();
  const [bannerMessage, setBannerMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "ADMIN" || payload.role === "SUPERADMIN") {
          setUserRoute("/admin");
        } else {
          setUserRoute("/account");
        }
      } catch {
        setUserRoute("/login");
      }
    }

    api
      .get("/settings")
      .then((res: any) => {
        if (res.data?.bannerMessage) {
          setBannerMessage(res.data.bannerMessage);
        }
      })
      .catch(console.error);
  }, []);

  // Cerrar menú móvil al navegar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isDark = mounted ? theme === "dark" : true;

  return (
    <>
      {/* Banner Superior Dinámico */}
      {bannerMessage && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-[#0b1714] via-[#163a30] to-[#0b1714] border-b border-[#2ec4a6]/20 text-[#a3ecd8] text-center text-xs font-sans tracking-[0.16em] uppercase py-1.5 px-4 font-medium backdrop-blur-md">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2ec4a6] mr-2 animate-pulse" />
          {bannerMessage}
        </div>
      )}

      {/* Header Principal */}
      <header
        className={`fixed inset-x-0 mx-auto z-50 w-[94%] max-w-7xl transition-all duration-300 select-none ${bannerMessage ? "top-11 sm:top-13" : "top-5 sm:top-7"
          }`}
      >
        <div
          className={`relative rounded-2xl md:rounded-full px-4 sm:px-8 h-20 flex items-center justify-between border backdrop-blur-2xl transition-colors ${isDark
            ? "bg-[#070b09]/85 border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.08)]"
            : "bg-[#ffffff]/90 border-stone-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.08),_inset_0_1px_1px_rgba(255,255,255,0.9)]"
            }`}
        >
          {/* Filete de luz metálica superior tenue */}
          <div className="absolute inset-x-16 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent pointer-events-none" />

          {/* ================= SECCIÓN IZQUIERDA: MARCA / LOGO ================= */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            {/* Monograma de escala generosa */}
            <img
              src="/logos/log1.png"
              alt="Monograma"
              width="120"
              height="120"
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)]"
            />

            {/* Tipografía de Marca */}
            <div className="flex flex-col justify-center">
              <img
                src="/logos/log2.png"
                alt="Casa de modas Esperanza Laguna"
                width="400"
                height="80"
                className="h-8 sm:h-9 w-auto object-contain dark:hidden"
              />
              <img
                src="/logos/log3.png"
                alt="Casa de modas Esperanza Laguna"
                width="400"
                height="80"
                className="h-8 sm:h-9 w-auto object-contain hidden dark:block drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
              />
            </div>
          </Link>

          {/* ================= NAVEGACIÓN DESKTOP ABIERTA (SIN CÁPSULAS INTERNAS) ================= */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative py-2 text-sm tracking-wide transition-colors duration-200 font-sans ${isActive
                    ? isDark
                      ? "text-[#f0f4f2] font-semibold"
                      : "text-[#0d2a23] font-semibold"
                    : isDark
                      ? "text-stone-400 hover:text-[#2ec4a6]"
                      : "text-stone-600 hover:text-[#187563]"
                    }`}
                >
                  <span>{link.label}</span>

                  {/* Resalte sutil: hebra esmeralda inferior con luz */}
                  {isActive && (
                    <motion.div
                      layoutId="activeHeaderThread"
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#2ec4a6] to-transparent shadow-[0_0_8px_#2ec4a6]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ================= SECCIÓN DERECHA: ACCIONES Y MENÚ MÓVIL ================= */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Buscador */}
            <button
              aria-label="Buscar productos"
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.08] text-foreground/80 hover:text-[#2ec4a6] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Alternar Tema */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Cambiar modo de tema claro u oscuro"
                className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.08] text-foreground/80 transition-colors"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-800" />
                )}
              </button>
            )}

            {/* Perfil de Usuario (Desktop) */}
            {mounted && (
              <Link
                href={userRoute}
                aria-label="Cuenta"
                className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.08] text-foreground/80 hover:text-[#2ec4a6] transition-colors relative hidden sm:flex items-center justify-center"
              >
                <User className="w-4 h-4" />
                {userRoute !== "/login" && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#2ec4a6] rounded-full shadow-[0_0_6px_#2ec4a6]" />
                )}
              </Link>
            )}

            {/* Carrito */}
            <div className="pl-1 border-l border-stone-300 dark:border-white/10 flex items-center">
              <Cart />
            </div>

            {/* Botón Menú Hamburguesa (Sólo Móviles / Tablets) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="p-2.5 rounded-full lg:hidden text-foreground/80 hover:text-[#2ec4a6] hover:bg-black/5 dark:hover:bg-white/[0.08] transition-colors ml-1"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ================= PANEL LATERAL / DROPDOWN MÓVIL ================= */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`lg:hidden mt-2 p-5 rounded-2xl border backdrop-blur-2xl flex flex-col space-y-3 shadow-2xl ${isDark
                ? "bg-[#070b09]/95 border-white/[0.08]"
                : "bg-white/95 border-stone-200"
                }`}
            >
              {/* Enlaces Móviles */}
              <div className="flex flex-col space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`px-4 py-3 rounded-xl text-sm font-sans transition-colors ${isActive
                        ? "bg-[#2ec4a6]/15 text-[#2ec4a6] font-semibold"
                        : isDark
                          ? "text-stone-300 hover:bg-white/[0.04]"
                          : "text-stone-700 hover:bg-black/[0.04]"
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Acceso a Cuenta en Móvil */}
              <div className="pt-3 border-t border-stone-200 dark:border-white/10 flex items-center justify-between">
                <Link
                  href={userRoute}
                  className="flex items-center gap-2 text-sm text-[#2ec4a6] font-medium py-1"
                >
                  <User className="w-4 h-4" />
                  <span>{userRoute === "/login" ? "Iniciar Sesión" : "Mi Cuenta"}</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}