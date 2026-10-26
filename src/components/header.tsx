"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Cart } from "./cart";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { api } from "@/lib/api";
import { isPanelRoute } from "@/components/panel/panel-user";

const NAV_LINKS = [
  { path: "/", label: "Inicio", match: ["/"] },
  { path: "/catalogo", label: "Catálogo", match: ["/catalogo", "/products"] },
];

const SERVICE_GROUPS = [
  {
    title: "Antes de comprar",
    links: [
      { path: "/arma-tu-uniforme", label: "Arma tu uniforme", description: "Explora cada pieza y su uso reglamentario" },
      { path: "/quotes", label: "Cotiza para tu club", description: "Pedidos por cantidad, con tallas" },
    ],
  },
  {
    title: "Después de comprar",
    links: [
      { path: "/track-order", label: "Rastrea tu pedido", description: "Consulta el estado de tu envío" },
      { path: "/contact", label: "Soporte", description: "Preguntas frecuentes y contacto" },
    ],
  },
];

const SERVICES_KEY = "servicios";
const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2ec4a6]";
const BRAND_BUTTON = "rounded-full bg-[#1c785f] hover:bg-[#166450] dark:bg-[#d4af37] dark:hover:bg-[#e2c275] text-white dark:text-[#0b1410] font-sans font-semibold tracking-wide transition-colors";

const subscribeNever = () => () => {};

// La sesión vive en localStorage; se relee en cada render (el login ya no recarga la página)
const readUserRoute = () => {
  const token = localStorage.getItem("jwt_token");
  if (!token) return "/login";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "ADMIN" || payload.role === "SUPERADMIN" ? "/admin" : "/account";
  } catch {
    return "/login";
  }
};

const matches = (pathname: string, path: string) =>
  path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);
  const userRoute = useSyncExternalStore(subscribeNever, readUserRoute, () => "/login");
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [bannerMessage, setBannerMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const servicesTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastPointer = useRef("mouse");
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    setIsSearchOpen(false);
    setSearchTerm("");
    router.push(`/catalogo?q=${encodeURIComponent(term)}`);
  };

  // Al navegar: cerrar menús
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsServicesOpen(false);
  }

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => {
        if (res.data?.bannerMessage) {
          setBannerMessage(res.data.bannerMessage);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isServicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsServicesOpen(false);
      servicesButtonRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setIsServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isServicesOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileMenuOpen]);

  if (isPanelRoute(pathname)) {
    return null;
  }

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const servicesActive = SERVICE_GROUPS.some((group) => group.links.some((link) => matches(pathname, link.path)));
  const activeNav = servicesActive
    ? SERVICES_KEY
    : NAV_LINKS.find((link) => link.match.some((path) => matches(pathname, path)))?.path ?? null;
  const indicatorKey = hoveredNav ?? activeNav;

  // Solo el mouse abre por hover (100 ms) y cierra al salir (200 ms); en táctil y teclado manda el clic
  const hoverServices = (open: boolean) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(servicesTimer.current);
    servicesTimer.current = setTimeout(() => setIsServicesOpen(open), open ? 100 : 200);
  };

  const navTextClass = (active: boolean) =>
    active
      ? isDark
        ? "text-[#f0f4f2] font-semibold"
        : "text-[#0d2a23] font-semibold"
      : isDark
        ? "text-stone-400 hover:text-[#2ec4a6]"
        : "text-stone-600 hover:text-[#187563]";

  const indicator = (key: string) =>
    indicatorKey === key && (
      <motion.span
        layoutId="activeHeaderThread"
        className="absolute bottom-0 inset-x-3 h-[2px] bg-gradient-to-r from-transparent via-[#2ec4a6] to-transparent shadow-[0_0_8px_#2ec4a6]"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    );

  const searchForm = (mobile: boolean) => (
    <form
      role="search"
      onSubmit={(e) => {
        submitSearch(e);
        e.currentTarget.querySelector("input")?.blur();
      }}
      className={
        mobile
          ? "relative w-full"
          : `relative hidden lg:block transition-[width] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${isSearchOpen ? "w-56 xl:w-64" : "w-32"}`
      }
    >
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#2ec4a6]" />
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsSearchOpen(true)}
        onBlur={() => !searchTerm.trim() && setIsSearchOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && !searchTerm.trim() && e.currentTarget.blur()}
        placeholder={mobile ? "Busca insignias, uniformes, parches…" : "Buscar"}
        aria-label="Buscar productos"
        className={`w-full rounded-full border pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/50 bg-black/[0.03] dark:bg-white/[0.04] border-stone-200 dark:border-white/10 focus:outline-none focus-visible:border-[#2ec4a6]/60 focus-visible:ring-2 focus-visible:ring-[#2ec4a6]/40 ${mobile ? "py-3" : "py-2"}`}
      />
    </form>
  );

  return (
    <MotionConfig reducedMotion="user">
      {/* Banner Superior Dinámico */}
      {bannerMessage && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-[#0b1714] via-[#163a30] to-[#0b1714] border-b border-[#2ec4a6]/20 text-[#a3ecd8] text-center text-xs font-sans tracking-[0.16em] uppercase py-1.5 px-4 font-medium backdrop-blur-md">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2ec4a6] mr-2 animate-pulse" />
          {bannerMessage}
        </div>
      )}

      {/* Header Principal */}
      <header
        className={`fixed inset-x-0 mx-auto z-50 w-[94%] max-w-7xl transition-all duration-300 motion-reduce:transition-none select-none ${bannerMessage
          ? scrolled ? "top-10 sm:top-11" : "top-11 sm:top-13"
          : scrolled ? "top-3 sm:top-4" : "top-5 sm:top-7"
          }`}
      >
        <div
          className={`relative rounded-2xl md:rounded-full px-4 sm:px-8 flex items-center gap-3 border backdrop-blur-2xl transition-[height,background-color,border-color] duration-300 motion-reduce:transition-[background-color] ${scrolled ? "h-16" : "h-20"} ${isDark
            ? `${scrolled ? "bg-[#070b09]/70" : "bg-[#070b09]/85"} border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.08)]`
            : `${scrolled ? "bg-[#ffffff]/75" : "bg-[#ffffff]/90"} border-stone-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.08),_inset_0_1px_1px_rgba(255,255,255,0.9)]`
            }`}
        >
          {/* Filete de luz metálica superior tenue */}
          <div className="absolute inset-x-16 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent pointer-events-none" />

          {/* ================= SECCIÓN IZQUIERDA: MARCA / LOGO ================= */}
          <Link href="/" aria-label="Esperanza Laguna, inicio" className={`flex items-center gap-3.5 group shrink-0 rounded-xl ${FOCUS}`}>
            <Image
              src="/logos/log1.png"
              alt=""
              width={47}
              height={56}
              loading="eager"
              className={`w-auto object-contain transition-[height,transform] duration-300 motion-reduce:transition-none group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(212,175,55,0.3)] ${scrolled ? "h-10" : "h-12 sm:h-14"}`}
            />

            {/* Tipografía de Marca (en lg se oculta para dejar sitio al buscador) */}
            <div className="flex flex-col justify-center lg:hidden xl:flex">
              <Image
                src="/logos/log2.png"
                alt="Casa de modas Esperanza Laguna"
                width={106}
                height={36}
                loading="eager"
                className={`w-auto object-contain dark:hidden transition-[height] duration-300 motion-reduce:transition-none ${scrolled ? "h-7" : "h-8 sm:h-9"}`}
              />
              <Image
                src="/logos/log3.png"
                alt="Casa de modas Esperanza Laguna"
                width={106}
                height={36}
                loading="eager"
                className={`w-auto object-contain hidden dark:block drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition-[height] duration-300 motion-reduce:transition-none ${scrolled ? "h-7" : "h-8 sm:h-9"}`}
              />
            </div>
          </Link>

          {/* ================= NAVEGACIÓN DESKTOP ================= */}
          <nav aria-label="Principal" className="hidden lg:flex items-center gap-1 ml-4" onPointerLeave={() => setHoveredNav(null)}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                aria-current={pathname === link.path ? "page" : undefined}
                onPointerEnter={() => setHoveredNav(link.path)}
                className={`relative px-3 py-2 rounded-full text-sm tracking-wide transition-colors duration-200 font-sans ${FOCUS} ${navTextClass(activeNav === link.path)}`}
              >
                <span>{link.label}</span>
                {indicator(link.path)}
              </Link>
            ))}

            <div
              ref={servicesRef}
              className="relative"
              onPointerEnter={(e) => {
                setHoveredNav(SERVICES_KEY);
                hoverServices(true)(e);
              }}
              onPointerLeave={hoverServices(false)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setIsServicesOpen(false)}
            >
              <button
                ref={servicesButtonRef}
                type="button"
                aria-expanded={isServicesOpen}
                aria-controls="services-menu"
                onPointerDown={(e) => (lastPointer.current = e.pointerType)}
                onClick={(e) => {
                  clearTimeout(servicesTimer.current);
                  // Con mouse el hover ya lo abrió: el clic no debe cerrarlo. Teclado (detail 0) y táctil alternan.
                  const mouseClick = lastPointer.current === "mouse" && e.detail > 0;
                  setIsServicesOpen((open) => mouseClick || !open);
                }}
                className={`relative flex items-center gap-1 px-3 py-2 rounded-full text-sm tracking-wide transition-colors duration-200 font-sans ${FOCUS} ${navTextClass(servicesActive)}`}
              >
                <span>Servicios</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
                {indicator(SERVICES_KEY)}
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  // pt-3 es el puente invisible: el cursor cruza al panel sin salir del área
                  <motion.div
                    id="services-menu"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1, transition: { type: "spring", duration: 0.25, bounce: 0.3 } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
                    className="absolute left-0 top-full pt-3 origin-top-left"
                  >
                    <div
                      className={`w-[520px] grid grid-cols-2 gap-2 p-3 rounded-2xl border backdrop-blur-2xl shadow-2xl ${isDark
                        ? "bg-[#070b09]/95 border-white/[0.08]"
                        : "bg-white/95 border-stone-200"
                        }`}
                    >
                      {SERVICE_GROUPS.map((group) => (
                        <div key={group.title}>
                          <p className="px-3 pt-2 pb-1 text-[10px] font-sans font-medium tracking-[0.16em] uppercase text-foreground/50">
                            {group.title}
                          </p>
                          <ul>
                            {group.links.map((link) => (
                              <li key={link.path}>
                                <Link
                                  href={link.path}
                                  aria-current={matches(pathname, link.path) ? "page" : undefined}
                                  onClick={() => setIsServicesOpen(false)}
                                  className={`block px-3 py-2.5 rounded-xl transition-colors ${FOCUS} ${matches(pathname, link.path)
                                    ? "bg-[#2ec4a6]/15"
                                    : isDark
                                      ? "hover:bg-white/[0.04]"
                                      : "hover:bg-black/[0.04]"
                                    }`}
                                >
                                  <span className={`block text-sm font-sans font-medium ${matches(pathname, link.path) ? "text-[#2ec4a6]" : "text-foreground"}`}>
                                    {link.label}
                                  </span>
                                  <span className="block mt-0.5 text-xs font-sans text-foreground/55">{link.description}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* ================= SECCIÓN DERECHA: BUSCADOR, COTIZAR Y ACCIONES ================= */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {searchForm(false)}

            <Link href="/quotes" className={`hidden lg:inline-flex px-5 py-2 text-xs shrink-0 ${BRAND_BUTTON} ${FOCUS}`}>
              Cotizar
            </Link>

            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Alternar Tema */}
              {mounted && (
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  aria-label="Cambiar modo de tema claro u oscuro"
                  className={`p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.08] text-foreground/80 transition-colors ${FOCUS}`}
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Moon className="w-4 h-4 text-emerald-800" />
                  )}
                </button>
              )}

              {/* Perfil de Usuario */}
              {mounted && (
                <Link
                  href={userRoute}
                  aria-label={userRoute === "/login" ? "Iniciar sesión" : "Mi cuenta"}
                  className={`p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.08] text-foreground/80 hover:text-[#2ec4a6] transition-colors relative flex items-center justify-center ${FOCUS}`}
                >
                  <User className="w-4 h-4" />
                  {userRoute !== "/login" && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#2ec4a6] rounded-full shadow-[0_0_6px_#2ec4a6]" />
                  )}
                </Link>
              )}
            </div>

            {/* Carrito */}
            <div className="pl-1 border-l border-stone-300 dark:border-white/10 flex items-center">
              <Cart />
            </div>

            {/* Botón Menú Hamburguesa (Sólo Móviles / Tablets) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className={`p-2.5 rounded-full lg:hidden text-foreground/80 hover:text-[#2ec4a6] hover:bg-black/5 dark:hover:bg-white/[0.08] transition-colors ${FOCUS}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ================= MENÚ MÓVIL ================= */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`lg:hidden mt-2 p-4 rounded-2xl border backdrop-blur-2xl flex flex-col gap-4 shadow-2xl max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain ${isDark
                ? "bg-[#070b09]/95 border-white/[0.08]"
                : "bg-white/95 border-stone-200"
                }`}
            >
              {searchForm(true)}

              <nav aria-label="Principal móvil" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => {
                    const isActive = activeNav === link.path;
                    return (
                      <Link
                        key={link.path}
                        href={link.path}
                        aria-current={pathname === link.path ? "page" : undefined}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm font-sans transition-colors ${FOCUS} ${isActive
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

                {SERVICE_GROUPS.map((group) => (
                  <div key={group.title} className="pt-3 border-t border-stone-200 dark:border-white/10">
                    <p className="px-4 pb-1 text-[10px] font-sans font-medium tracking-[0.16em] uppercase text-foreground/50">
                      {group.title}
                    </p>
                    {group.links.map((link) => {
                      const isActive = matches(pathname, link.path);
                      return (
                        <Link
                          key={link.path}
                          href={link.path}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-4 py-2.5 rounded-xl transition-colors ${FOCUS} ${isActive
                            ? "bg-[#2ec4a6]/15"
                            : isDark
                              ? "hover:bg-white/[0.04]"
                              : "hover:bg-black/[0.04]"
                            }`}
                        >
                          <span className={`block text-sm font-sans ${isActive ? "text-[#2ec4a6] font-semibold" : isDark ? "text-stone-300" : "text-stone-700"}`}>
                            {link.label}
                          </span>
                          <span className="block mt-0.5 text-xs font-sans text-foreground/55">{link.description}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              <Link
                href="/quotes"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full text-center px-5 py-3.5 text-sm ${BRAND_BUTTON} ${FOCUS}`}
              >
                Cotizar para mi club
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}
