"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ShieldCheck, ChevronLeft, ChevronRight, LogOut, Clock, DollarSign, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { href: "/admin/orders/new", icon: ShoppingCart, label: "Nuevos Pedidos" },
    { href: "/admin/orders/preparation", icon: Clock, label: "En Preparación" },
    { href: "/admin/products", icon: Package, label: "Inventarios" },
    { href: "/admin/payments/pending", icon: DollarSign, label: "Pagos Pendientes" },
    { href: "/admin/workers", icon: Briefcase, label: "Trabajadores" },
    { href: "/admin/customers", icon: Users, label: "Clientes" },
  ];

  const checkIsActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href) && pathname !== "/admin";
  };

  return (
    <aside 
      className={`bg-transparent border-r border-[var(--border-color)] text-[var(--foreground)] flex flex-col relative transition-all duration-300 z-20 shrink-0 h-full ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Botón para contraer/expandir */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-primary text-white p-1.5 rounded-full shadow-md hover:scale-110 transition-transform z-30"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Perfil de Usuario */}
      <div className={`pt-10 pb-6 flex flex-col items-center border-b border-[var(--border-color)] transition-all ${isCollapsed ? 'px-2' : 'px-6'}`}>
        <div className={`relative rounded-full overflow-hidden border-2 border-secondary shadow-[0_0_15px_rgba(var(--secondary),0.3)] transition-all ${isCollapsed ? 'w-10 h-10' : 'w-24 h-24 mb-4'}`}>
          <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Admin Profile" className="w-full h-full object-cover" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col items-center text-center">
            <h3 className="text-[var(--foreground)] font-serif font-bold text-lg tracking-wide">Juan Pérez</h3>
            <span className="text-secondary text-xs tracking-widest uppercase font-medium mt-1">Administrador</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto overflow-x-hidden relative">
        {links.map((link) => {
          const isActive = checkIsActive(link.href, link.exact);
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex items-center px-3 py-3 text-sm rounded-xl transition-colors relative group ${
                isActive 
                  ? "text-primary font-medium" 
                  : "text-[var(--muted)] hover:text-primary font-medium"
              } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
            >
              {/* Animación fluida de isla activa */}
              {isActive && (
                <motion.div 
                  layoutId="activeAdminTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <Icon className="w-5 h-5 z-10 shrink-0" />
              
              {!isCollapsed && (
                <span className="z-10 truncate">{link.label}</span>
              )}
              
              {/* Tooltip cuando está colapsado */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md">
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-[var(--border-color)] space-y-2">
        <Link 
          href="/admin/settings" 
          className={`flex items-center px-3 py-3 text-sm rounded-xl transition-colors relative group ${
            pathname.startsWith("/admin/settings")
              ? "text-primary font-medium" 
              : "text-[var(--muted)] hover:text-primary font-medium"
          } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
        >
          {pathname.startsWith("/admin/settings") && (
            <motion.div 
              layoutId="activeAdminTab"
              className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <Settings className="w-5 h-5 z-10 shrink-0" />
          {!isCollapsed && <span className="z-10">Configuración</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md">
              Configuración
            </div>
          )}
        </Link>

        {/* Botón de Cerrar Sesión */}
        <button 
          onClick={() => {
            localStorage.removeItem('jwt_token');
            window.location.href = '/login';
          }}
          className={`w-full flex items-center px-3 py-3 text-sm rounded-xl transition-colors relative group text-red-500 hover:bg-red-500/10 font-medium ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
        >
          <LogOut className="w-5 h-5 z-10 shrink-0" />
          {!isCollapsed && <span className="z-10">Cerrar Sesión</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md">
              Cerrar Sesión
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
