"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  DollarSign,
  Briefcase,
  Sun,
  Moon,
  Mailbox
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { UserProfileCard } from "@/components/ui/user-profile-card";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { href: "/admin/orders", icon: ShoppingCart, label: "Recepción de Pedidos" },
    { href: "/admin/products", icon: Package, label: "Inventarios" },
    { href: "/admin/payments", icon: DollarSign, label: "Pagos y Transacciones" },
    { href: "/admin/pqrs", icon: Mailbox, label: "Buzón PQRS" },
    { href: "/admin/workers", icon: Briefcase, label: "Trabajadores" },
    { href: "/admin/customers", icon: Users, label: "Clientes" },
  ];

  const checkIsActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && pathname !== "/admin";
  };

  const isDark = mounted ? theme === "dark" : true;

  return (
    <aside
      className={`relative flex flex-col shrink-0 h-full select-none z-30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCollapsed ? "w-20" : "w-64"
        } ${isDark
          ? "bg-[#060a08] text-[#f0f4f2]"
          : "bg-[#fbfcfb] text-[#1b2622]"
        }`}
    >
      {/* ================= TRAMA TEXTIL ARTESANAL (REACCIONA A CLARO/OSCURO) ================= */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
        <defs>
          <pattern
            id="sidebarClothWeave"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            {isDark ? (
              <>
                <path d="M0 8 L8 0 M8 16 L16 8 M0 0 L16 16" stroke="#d4af37" strokeWidth="0.8" opacity="0.05" />
                <circle cx="8" cy="8" r="0.8" fill="#2ec4a6" opacity="0.08" />
              </>
            ) : (
              <>
                <path d="M0 8 L8 0 M8 16 L16 8 M0 0 L16 16" stroke="#8c7335" strokeWidth="0.8" opacity="0.07" />
                <circle cx="8" cy="8" r="0.8" fill="#1b7a67" opacity="0.09" />
              </>
            )}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sidebarClothWeave)" />
      </svg>

      {/* Degradado volumétrico de caída de tela sobre la barra */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(ellipse 90% 45% at 50% 0%, rgba(46,196,166,0.12) 0%, transparent 65%), linear-gradient(90deg, rgba(6,10,8,0.95) 0%, rgba(9,15,13,0.98) 85%, rgba(4,7,6,1) 100%)"
            : "radial-gradient(ellipse 90% 45% at 50% 0%, rgba(46,196,166,0.15) 0%, transparent 70%), linear-gradient(90deg, #fbfcfb 0%, #f4f6f5 85%, #e9ecea 100%)",
        }}
      />

      {/* ================= DOBLEZ DE TELA / PLIEGUE LATERAL CON PESPUNTE ================= */}
      {/* Sombra de caída del dobladillo sobre el panel derecho */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-5 translate-x-full pointer-events-none z-10 transition-opacity ${isDark
            ? "bg-gradient-to-r from-black/55 via-black/15 to-transparent"
            : "bg-gradient-to-r from-stone-900/15 via-stone-900/5 to-transparent"
          }`}
      />

      {/* Dobladillo con costura visible de arriba a abajo */}
      <div className="absolute top-0 right-0 bottom-0 w-[4px] pointer-events-none z-20 flex flex-col items-center">
        {/* Lomo iluminado del pliegue */}
        <div
          className={`w-[1px] h-full ${isDark
              ? "bg-gradient-to-b from-[#2ec4a6]/30 via-[#d4af37]/45 to-[#2ec4a6]/20"
              : "bg-gradient-to-b from-[#2ec4a6]/50 via-[#b38f39]/50 to-[#2ec4a6]/30"
            }`}
        />
        {/* Pespunte de hilo de sastrería cosido verticalmente */}
        <div
          className={`absolute right-[3px] top-0 bottom-0 border-r border-dashed ${isDark
              ? "border-[#d4af37]/35 [stroke-dasharray:4_4]"
              : "border-[#96762c]/40 [stroke-dasharray:4_4]"
            }`}
        />
      </div>

      {/* ================= BOTÓN DE COLAPSAR (BOTÓN / CORCHETE DE COSTURA) ================= */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        className={`absolute -right-3.5 top-9 w-7 h-7 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-40 group ${isDark
            ? "bg-[#0b1411] border border-[#d4af37]/70 text-[#f2f6f4] shadow-[0_4px_12px_rgba(0,0,0,0.7),_0_0_8px_rgba(46,196,166,0.3)]"
            : "bg-[#ffffff] border border-[#b38f39] text-[#1b2622] shadow-[0_4px_12px_rgba(0,0,0,0.12),_0_0_6px_rgba(46,196,166,0.25)]"
          }`}
      >
        {/* Pespunte circular alrededor del botón */}
        <span
          className={`absolute inset-0 rounded-full border border-dashed pointer-events-none ${isDark ? "border-[#d4af37]/50 [stroke-dasharray:2_2]" : "border-[#b38f39]/60 [stroke-dasharray:2_2]"
            }`}
        />
        {isCollapsed ? (
          <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isDark ? "text-[#2ec4a6]" : "text-[#187563]"}`} />
        ) : (
          <ChevronLeft className={`w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 ${isDark ? "text-[#2ec4a6]" : "text-[#187563]"}`} />
        )}
      </button>

      {/* ================= PERFIL DE USUARIO UNIFICADO ================= */}
      <div className="relative z-10 w-full">
        <UserProfileCard isCollapsed={isCollapsed} />
      </div>

      {/* ================= NAVEGACIÓN TEXTIL ================= */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden relative z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => {
          const isActive = checkIsActive(link.href, link.exact);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-3 py-2.5 text-[13px] rounded-xl transition-all duration-200 relative group font-sans ${isActive
                  ? isDark ? "text-[#f2f6f4] font-medium" : "text-[#0d2a23] font-semibold"
                  : isDark
                    ? "text-[#7e8f89] hover:text-[#e0eee9] hover:bg-white/[0.03] font-normal"
                    : "text-[#5e6e68] hover:text-[#0d2a23] hover:bg-black/[0.03] font-medium"
                } ${isCollapsed ? "justify-center" : "space-x-3"}`}
            >
              {/* Placa activa con efecto tela esmeralda */}
              {isActive && (
                <motion.div
                  layoutId="activeAdminTab"
                  className={`absolute inset-0 rounded-xl ${isDark
                      ? "bg-gradient-to-r from-[#2ec4a6]/20 to-[#2ec4a6]/5 border border-[#2ec4a6]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
                      : "bg-gradient-to-r from-[#2ec4a6]/25 to-[#2ec4a6]/10 border border-[#2ec4a6]/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_2px_8px_rgba(46,196,166,0.15)]"
                    }`}
                  initial={false}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}

              {/* Puntada/Aguja lateral en el ítem activo */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#2ec4a6] rounded-r-full shadow-[0_0_8px_#2ec4a6]" />
              )}

              <Icon
                className={`w-4 h-4 z-10 shrink-0 transition-colors ${isActive
                    ? isDark ? "text-[#2ec4a6]" : "text-[#156e5c]"
                    : isDark ? "text-[#7e8f89] group-hover:text-[#2ec4a6]" : "text-[#627770] group-hover:text-[#156e5c]"
                  }`}
              />

              {!isCollapsed && (
                <span className="z-10 truncate tracking-tight">{link.label}</span>
              )}

              {/* Tooltip flotante en colapsado */}
              {isCollapsed && (
                <div
                  className={`absolute left-full ml-3 px-2.5 py-1 backdrop-blur-md text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl transition-opacity border ${isDark
                      ? "bg-[#0b1411]/95 border-[#2ec4a6]/30 text-[#f2f6f4]"
                      : "bg-[#ffffff]/95 border-[#2ec4a6]/30 text-[#1b2622]"
                    }`}
                >
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ================= BARRA INFERIOR / AJUSTES ================= */}
      <div
        className={`p-3.5 border-t relative z-10 flex items-center transition-colors ${isDark
            ? "border-white/[0.06] bg-[#060a08]/80"
            : "border-stone-200 bg-[#fbfcfb]/80"
          } ${isCollapsed ? "flex-col space-y-3" : "justify-around"}`}
      >
        {/* Ajustes */}
        <Link
          href="/admin/settings"
          aria-label="Configuración"
          className={`p-2 rounded-xl transition-colors relative group ${pathname.startsWith("/admin/settings")
              ? "text-[#2ec4a6] bg-[#2ec4a6]/10"
              : isDark ? "text-[#7e8f89] hover:text-[#f2f6f4] hover:bg-white/[0.04]" : "text-[#5e6e68] hover:text-[#1b2622] hover:bg-black/[0.04]"
            }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
        </Link>

        {/* Alternar Tema */}
        {mounted && (
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Cambiar tema visual"
            className={`p-2 rounded-xl transition-colors relative group ${isDark
                ? "text-[#7e8f89] hover:text-[#f2f6f4] hover:bg-white/[0.04]"
                : "text-[#5e6e68] hover:text-[#1b2622] hover:bg-black/[0.04]"
              }`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 shrink-0 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 shrink-0 text-emerald-800" />
            )}
          </button>
        )}

        {/* Salir */}
        <button
          onClick={() => {
            localStorage.removeItem("jwt_token");
            window.location.replace("/");
          }}
          aria-label="Cerrar sesión"
          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors relative group"
        >
          <LogOut className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </aside>
  );
}