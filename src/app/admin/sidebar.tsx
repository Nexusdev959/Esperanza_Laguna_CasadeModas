"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ShieldCheck, ChevronLeft, ChevronRight, LogOut, Clock, DollarSign, Briefcase, Camera, Sun, Moon, Mailbox } from "lucide-react";
import { useTheme } from "next-themes";
import { useNotification } from "@/components/ui/notification-provider";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<{name: string, role: string, avatar?: string} | null>(null);
  const { showNotification } = useNotification();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('jwt_token');
    if (token) {
      api.get('/auth/profile').then(res => {
        setUser(res.data);
      }).catch(err => console.error(err));
    }
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
        <div className={`relative rounded-full overflow-hidden border-2 border-secondary shadow-[0_0_15px_rgba(var(--secondary),0.3)] transition-all group ${isCollapsed ? 'w-10 h-10' : 'w-24 h-24 mb-4'}`}>
          <img src={user?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400"} alt="Admin Profile" className="w-full h-full object-cover" />
          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
            <Camera className="w-5 h-5 text-white" />
            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const formData = new FormData();
                formData.append('avatar', file);
                try {
                  const res = await api.put('/auth/profile', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  setUser(res.data);
                  showNotification('Foto de perfil actualizada correctamente', 'success');
                } catch (error) {
                  console.error('Error al actualizar foto:', error);
                  showNotification('Error al actualizar la foto de perfil', 'error');
                }
              }
            }} />
          </label>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col items-center text-center">
            <h3 className="text-[var(--foreground)] font-serif font-bold text-lg tracking-wide">{user ? user.name : "Cargando..."}</h3>
            <span className="text-secondary text-xs tracking-widest uppercase font-medium mt-1">{user ? user.role : "ADMINISTRADOR"}</span>
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
      
      <div className={`p-4 border-t border-[var(--border-color)] flex items-center ${isCollapsed ? 'flex-col space-y-4' : 'justify-around'}`}>
        <Link 
          href="/admin/settings" 
          className={`p-2.5 rounded-xl transition-colors relative group ${
            pathname.startsWith("/admin/settings")
              ? "text-primary bg-primary/10" 
              : "text-[var(--muted)] hover:text-primary hover:bg-[var(--surface)]"
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 px-2 py-1 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md">
            Configuración
          </div>
        </Link>

        {mounted && (
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 text-[var(--muted)] hover:text-primary hover:bg-[var(--surface)] rounded-xl transition-colors relative group"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
            <div className="absolute left-1/2 -translate-x-1/2 -top-10 px-2 py-1 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md">
              {theme === "dark" ? 'Modo Claro' : 'Modo Oscuro'}
            </div>
          </button>
        )}

        <button 
          onClick={() => {
            localStorage.removeItem('jwt_token');
            window.location.replace('/');
          }}
          className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors relative group"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-10 px-2 py-1 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md">
            Cerrar Sesión
          </div>
        </button>
      </div>
    </aside>
  );
}
