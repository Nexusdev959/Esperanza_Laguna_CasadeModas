"use client";

import Link from "next/link";
import { Search, User, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Cart } from "./cart";
import { motion } from "framer-motion";
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

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'ADMIN' || payload.role === 'SUPERADMIN') {
          setUserRoute('/admin');
        } else {
          setUserRoute('/account');
        }
      } catch (e) {
        setUserRoute('/login');
      }
    }
    api.get('/settings').then((res: any) => {
      if (res.data.bannerMessage) {
        setBannerMessage(res.data.bannerMessage);
      }
    }).catch(console.error);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {bannerMessage && (
        <div className="bg-primary/90 text-white text-center text-xs py-1.5 px-4 font-medium tracking-wide z-[60] relative top-0 w-full animate-fade-in-down shadow-sm">
          {bannerMessage}
        </div>
      )}
      <header className={`fixed ${bannerMessage ? 'top-10' : 'top-4'} inset-x-0 mx-auto z-50 w-[95%] max-w-7xl rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-[var(--foreground)] shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500`}>
        <div className="px-6 h-[76px] flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <button className="p-2 -ml-2 hover:text-primary transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <Link href="/" className="flex items-center gap-5 group">
            <img src="/logos/log1.png" alt="Logo" className="h-[72px] w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm" />
            <div className="flex flex-col justify-center">
              {/* Modo claro -> log2 | Modo oscuro -> log3 */}
              <img src="/logos/log2.png" alt="Logotipo" className="h-[52px] w-auto object-contain dark:hidden" />
              <img src="/logos/log3.png" alt="Logotipo" className="h-[52px] w-auto object-contain hidden dark:block" />
            </div>
          </Link>

          {/* Desktop Nav (Cinematic & Glassmorphism) */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-black/[0.03] dark:bg-white/[0.03] rounded-full border border-black/5 dark:border-white/5 shadow-inner">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  href={link.path} 
                  className={`relative px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-colors duration-300 ${
                    isActive 
                      ? "text-white" 
                      : "text-stone-600 dark:text-stone-300 hover:text-primary dark:hover:text-primary hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navIndicatorHeader"
                      className="absolute inset-0 bg-[#0c2e22] dark:bg-[#0c2e22] rounded-full shadow-md"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-[var(--foreground)]">
              <Search className="w-5 h-5" />
            </button>
            {mounted ? (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-[var(--foreground)]"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            ) : (
              <div className="w-9 h-9" />
            )}
            {mounted ? (
              <Link href={userRoute} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors hidden md:block text-[var(--foreground)] relative group">
                <User className="w-5 h-5" />
                {userRoute !== "/login" && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 border border-white dark:border-black rounded-full shadow-sm"></span>
                )}
              </Link>
            ) : (
              <div className="w-9 h-9 hidden md:block" />
            )}
            <div className="text-[var(--foreground)] ml-2 pl-2 border-l border-black/10 dark:border-white/10">
              <Cart />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
