"use client";

import { useState, useEffect } from "react";
import { LogOut, Package, MapPin, Heart, User, Camera, ChevronLeft, ChevronRight, Mailbox, CheckCircle, FileText, CreditCard, Menu, X, Sun, Moon, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import { api } from "@/lib/api";
import { useNotification } from "@/components/ui/notification-provider";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("historial");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [pqrsCases, setPqrsCases] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingOrder, setUploadingOrder] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        try {
          const profileRes = await api.get('/auth/profile');
          setUser(profileRes.data);
        } catch (error) {
          console.error("Error fetching profile, using payload:", error);
          setUser(payload);
        }

        // Fetch real orders, addresses, and pqrs
        try {
          const [ordersRes, addrRes, pqrsRes] = await Promise.all([
            api.get('/orders/me'),
            api.get('/auth/addresses'),
            api.get('/pqrs/my')
          ]);
          setOrders(ordersRes.data);
          setAddresses(addrRes.data);
          setPqrsCases(pqrsRes.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }

      } catch (e) {
        console.error("Error validando token:", e);
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: any = {
      'OPEN': <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-xs font-medium">Abierto</span>,
      'IN_PROGRESS': <span className="px-2.5 py-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-full text-xs font-medium">En Progreso</span>,
      'RESOLVED': <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-medium">Resuelto</span>,
      'CLOSED': <span className="px-2.5 py-1 bg-gray-500/10 text-gray-600 border border-gray-500/20 rounded-full text-xs font-medium">Cerrado</span>,
    };
    return badges[status] || badges['OPEN'];
  };

  const getOrderStatusLabel = (status: string) => {
    const map: any = {
      'PENDING_ADVANCE': 'Pago Inicial Pendiente',
      'IN_PREPARATION': 'En Preparación',
      'IN_CONFECTION': 'En Confección',
      'QUALITY_CONTROL': 'Control de Calidad',
      'PENDING_FINAL_PAY': 'Pago Final Pendiente',
      'READY_TO_SHIP': 'Listo para Envío',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return map[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const types: any = {
      'PETITION': 'Petición',
      'COMPLAINT': 'Queja',
      'CLAIM': 'Reclamo',
      'SUGGESTION': 'Sugerencia'
    };
    return types[type] || type;
  };

  const links = [
    { id: "historial", icon: Package, label: "Historial de Compras" },
    { id: "pagos", icon: CreditCard, label: "Mis Pagos" },
    { id: "pqrs", icon: Mailbox, label: "Mis Casos PQRS" },
    { id: "perfil", icon: User, label: "Perfil" },
    { id: "direcciones", icon: MapPin, label: "Mis Direcciones" }
  ];

  const isDark = mounted ? theme === "dark" : true;

  return (
    <>
      {/* Botón de Menú Hamburguesa para Móviles (Posicionado debajo del Header principal que tiene h-20) */}
      {mounted && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="md:hidden fixed top-24 left-4 z-50 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] shadow-sm"
          aria-label="Alternar menú"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      )}

      {/* Overlay de fondo oscuro en móviles al abrir el menú */}
      {mounted && !isCollapsed && (
        <div
          onClick={() => setIsCollapsed(true)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
          style={{ top: '80px' }}
        />
      )}
      <main className="flex h-screen bg-[var(--background)] overflow-hidden pt-20">
        
        {/* Sidebar idéntico al del Admin (Mismo estilo textil y comportamiento en móvil) */}
        <aside 
          className={`fixed md:relative top-20 md:top-0 bottom-0 left-0 flex flex-col shrink-0 h-[calc(100vh-5rem)] md:h-full select-none z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isCollapsed ? "-translate-x-full md:translate-x-0 md:w-20 w-64" : "translate-x-0 w-64"
          } ${isDark
            ? "bg-[#060a08] text-[#f0f4f2] shadow-[4px_0_24px_rgba(0,0,0,0.8)] md:shadow-none"
            : "bg-[#fbfcfb] text-[#1b2622] shadow-[4px_0_24px_rgba(0,0,0,0.1)] md:shadow-none"
          }`}
        >
          {/* ================= TRAMA TEXTIL ARTESANAL (REACCIONA A CLARO/OSCURO) ================= */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
            <defs>
              <pattern id="sidebarClothWeaveClient" width="16" height="16" patternUnits="userSpaceOnUse">
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
            <rect width="100%" height="100%" fill="url(#sidebarClothWeaveClient)" />
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

          {/* Sombra de caída del dobladillo sobre el panel derecho */}
          <div
            className={`absolute top-0 right-0 bottom-0 w-5 translate-x-full pointer-events-none z-10 transition-opacity ${isDark
                ? "bg-gradient-to-r from-black/55 via-black/15 to-transparent"
                : "bg-gradient-to-r from-stone-900/15 via-stone-900/5 to-transparent"
              }`}
          />

          {/* Dobladillo con costura visible de arriba a abajo */}
          <div className="absolute top-0 right-0 bottom-0 w-[4px] pointer-events-none z-20 flex flex-col items-center">
            <div
              className={`w-[1px] h-full ${isDark
                  ? "bg-gradient-to-b from-[#2ec4a6]/30 via-[#d4af37]/45 to-[#2ec4a6]/20"
                  : "bg-gradient-to-b from-[#2ec4a6]/50 via-[#b38f39]/50 to-[#2ec4a6]/30"
                }`}
            />
            <div
              className={`absolute right-[3px] top-0 bottom-0 border-r border-dashed ${isDark
                  ? "border-[#d4af37]/35 [stroke-dasharray:4_4]"
                  : "border-[#96762c]/40 [stroke-dasharray:4_4]"
                }`}
            />
          </div>

          {/* Botón para contraer/expandir (Solo en escritorio) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex absolute -right-3.5 top-9 w-7 h-7 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all items-center justify-center z-40 group ${isDark
                ? "bg-[#0b1411] border border-[#d4af37]/70 text-[#f2f6f4] shadow-[0_4px_12px_rgba(0,0,0,0.7),_0_0_8px_rgba(46,196,166,0.3)]"
                : "bg-[#ffffff] border border-[#b38f39] text-[#1b2622] shadow-[0_4px_12px_rgba(0,0,0,0.12),_0_0_6px_rgba(46,196,166,0.25)]"
              }`}
          >
            <span
              className={`absolute inset-0 rounded-full border border-dashed pointer-events-none ${isDark ? "border-[#d4af37]/50 [stroke-dasharray:2_2]" : "border-[#b38f39]/60 [stroke-dasharray:2_2]"
                }`}
            />
            {isCollapsed ? <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isDark ? "text-[#2ec4a6]" : "text-[#187563]"}`} /> : <ChevronLeft className={`w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 ${isDark ? "text-[#2ec4a6]" : "text-[#187563]"}`} />}
          </button>

          <div className="relative z-10 w-full mt-4">
            <div className={`pt-6 pb-6 flex flex-col items-center border-b ${isDark ? 'border-white/[0.06]' : 'border-stone-200'} transition-all ${isCollapsed && window.innerWidth >= 768 ? 'px-2' : 'px-6'}`}>
              <div className={`relative rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all group ${isCollapsed && window.innerWidth >= 768 ? 'w-10 h-10' : 'w-20 h-20 mb-3'}`}>
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="w-4 h-4 text-white" />
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
              {(!isCollapsed || window.innerWidth < 768) && (
                <div className="flex flex-col items-center text-center">
                  <h3 className={`font-serif font-bold text-base tracking-wide ${isDark ? 'text-[#f2f6f4]' : 'text-[#0d2a23]'}`}>{user?.name || 'Cargando...'}</h3>
                  <span className={`text-[10px] tracking-widest uppercase font-medium mt-1 ${isDark ? 'text-[#2ec4a6]' : 'text-[#156e5c]'}`}>{user?.role === 'CUSTOMER' ? 'Cliente' : user?.role}</span>
                </div>
              )}
            </div>
          </div>
          
          <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden relative z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {links.map((link) => {
              const isActive = activeTab === link.id;
              const Icon = link.icon;
              
              return (
                <button 
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    if (window.innerWidth < 768) setIsCollapsed(true);
                  }}
                  className={`w-full flex items-center px-3 py-2.5 text-[13px] rounded-xl transition-all duration-200 relative group font-sans ${isActive
                      ? isDark ? "text-[#f2f6f4] font-medium" : "text-[#0d2a23] font-semibold"
                      : isDark
                        ? "text-[#7e8f89] hover:text-[#e0eee9] hover:bg-white/[0.03] font-normal"
                        : "text-[#5e6e68] hover:text-[#0d2a23] hover:bg-black/[0.03] font-medium"
                    } ${isCollapsed && window.innerWidth >= 768 ? 'justify-center' : 'space-x-3'}`}
                >
                  {/* Placa activa con efecto tela esmeralda */}
                  {isActive && (
                    <motion.div
                      layoutId="activeClientTab"
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
                  
                  <Icon className={`w-4 h-4 z-10 shrink-0 transition-colors ${isActive
                      ? isDark ? "text-[#2ec4a6]" : "text-[#156e5c]"
                      : isDark ? "text-[#7e8f89] group-hover:text-[#2ec4a6]" : "text-[#627770] group-hover:text-[#156e5c]"
                    }`} 
                  />
                  
                  {(!isCollapsed || window.innerWidth < 768) && (
                    <span className="z-10 truncate tracking-tight">{link.label}</span>
                  )}
                  
                  {/* Tooltip flotante en colapsado (solo desktop) */}
                  {isCollapsed && window.innerWidth >= 768 && (
                    <div
                      className={`absolute left-full ml-3 px-2.5 py-1 backdrop-blur-md text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl transition-opacity border ${isDark
                          ? "bg-[#0b1411]/95 border-[#2ec4a6]/30 text-[#f2f6f4]"
                          : "bg-[#ffffff]/95 border-[#2ec4a6]/30 text-[#1b2622]"
                        }`}
                    >
                      {link.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
          
          <div
            className={`p-3.5 border-t relative z-10 flex items-center transition-colors ${isDark
                ? "border-white/[0.06] bg-[#060a08]/80"
                : "border-stone-200 bg-[#fbfcfb]/80"
              } ${isCollapsed && window.innerWidth >= 768 ? "flex-col space-y-3" : "justify-around"}`}
          >
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

            <button 
              onClick={() => {
                localStorage.removeItem('jwt_token');
                window.location.replace('/');
              }}
              aria-label="Cerrar sesión"
              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors relative group"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </aside>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
            
            {activeTab === "perfil" && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-serif mb-6 text-[var(--foreground)]">Personalización del Perfil</h2>
                <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                  <form className="space-y-6" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    try {
                      const res = await api.put('/auth/profile', {
                        name: formData.get('name'),
                        phone: formData.get('phone'),
                        club: formData.get('club')
                      });
                      setUser(res.data);
                      showNotification('Perfil actualizado correctamente', 'success');
                    } catch (error) {
                      console.error(error);
                      showNotification('Error al actualizar el perfil', 'error');
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--foreground)]">Nombre Completo</label>
                        <input name="name" type="text" defaultValue={user?.name || ''} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--foreground)]">Correo Electrónico</label>
                        <input type="email" defaultValue={user?.email || ''} disabled className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm opacity-60 cursor-not-allowed" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--foreground)]">Teléfono Móvil</label>
                        <input name="phone" type="tel" defaultValue={user?.phone || ''} placeholder="+57 300 000 0000" className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--foreground)]">Club Asociado</label>
                        <select name="club" defaultValue={user?.club || ''} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                          <option value="">Ninguno</option>
                          <option value="Club Conquistadores Orion">Club Conquistadores Orion</option>
                          <option value="Aventureros Kids">Aventureros Kids</option>
                          <option value="Guías Mayores Alpha">Guías Mayores Alpha</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
                      <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "historial" && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-serif mb-6 text-[var(--foreground)]">Historial de Compras</h2>
                <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm text-center">
                      <p className="text-[var(--muted)] text-sm mb-4">No tienes compras registradas aún.</p>
                      <button 
                        onClick={() => window.location.href = '/catalogo'}
                        className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Explorar Productos
                      </button>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-4">
                          <div>
                            <p className="text-sm text-[var(--muted)] mb-1">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                            <p className="font-medium text-[var(--foreground)]">{new Date(order.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-[var(--foreground)] mb-1">{(parseFloat(order.totalAmount || '0')).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 text-xs rounded-full border border-yellow-200 dark:border-yellow-900 font-medium uppercase tracking-wide">{getOrderStatusLabel(order.status)}</span>
                          </div>
                        </div>

                        {(order.trackingNumber || order.shippingCarrier) && (
                          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3 mt-2">
                            <Package className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Información de Envío</p>
                              {order.shippingCarrier && <p className="text-xs text-blue-600 dark:text-blue-300 mt-1"><strong>Agencia/Transportadora:</strong> {order.shippingCarrier}</p>}
                              {order.trackingNumber && <p className="text-xs text-blue-600 dark:text-blue-300"><strong>Guía/Indicaciones:</strong> {order.trackingNumber}</p>}
                            </div>
                          </div>
                        )}
                        
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="flex items-center space-x-4 pt-2">
                            <div className="w-16 h-20 bg-[var(--background)] rounded-lg overflow-hidden border border-[var(--border-color)]">
                               <img src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=200&q=80"} alt={item.product?.name || 'Producto'} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-[var(--foreground)]">{item.product?.name || 'Producto Desconocido'}</h4>
                              <p className="text-sm text-[var(--muted)]">Precio: {(parseFloat(item.price || '0')).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                              <p className="text-sm text-[var(--muted)]">Cant: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap gap-2 justify-end">
                           <button onClick={() => window.location.href = `/track-order?ref=${order.id}`} className="text-sm border border-[var(--border-color)] px-4 py-2 rounded-xl text-[var(--foreground)] hover:bg-[var(--background)] transition-colors font-medium">
                             Rastrear Pedido
                           </button>
                           
                           {order.payments && order.payments.length > 0 && (
                             <div className="w-full mt-4 mb-2 bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)]">
                               <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">Historial de Pagos de este Pedido:</h5>
                               <div className="space-y-2">
                                 {order.payments.map((p: any) => (
                                   <div key={p.id} className="flex justify-between items-center text-sm">
                                     <div>
                                       <span className="font-medium text-[var(--foreground)]">{((Number(p.amountInCents) || 0) / 100).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                                       <span className="text-[var(--muted)] ml-2 text-xs">{new Date(p.createdAt).toLocaleDateString()} - {p.paymentMethod || 'Wompi'}</span>
                                     </div>
                                     <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : p.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
                                       {p.status}
                                     </span>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}

                           {order.status === 'PENDING_ADVANCE' || order.status === 'PENDING_FINAL_PAY' ? (
                             <>
                               <button onClick={() => window.location.href = `/checkout/${order.id}`} className="text-sm px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-xl transition-colors font-medium shadow-sm">
                                 Pagar con Wompi
                               </button>
                               <label className={`text-sm px-4 py-2 border border-primary/30 text-primary rounded-xl font-medium cursor-pointer transition-colors ${uploadingOrder === order.id ? 'opacity-70 pointer-events-none' : 'hover:bg-primary/10'}`}>
                                 {uploadingOrder === order.id ? 'Subiendo...' : 'Subir Comprobante'}
                               <input type="file" className="hidden" accept="image/*,.pdf" onChange={async (e) => {
                                 if (e.target.files && e.target.files[0]) {
                                   setUploadingOrder(order.id);
                                   const formData = new FormData();
                                   formData.append('proof', e.target.files[0]);
                                   formData.append('orderId', order.id);
                                   try {
                                     await api.post('/payments/wompi/proof', formData, {
                                       headers: { 'Content-Type': 'multipart/form-data' }
                                     });
                                     showNotification('Comprobante enviado. La validación tomará de 24 a 72 horas.', 'success');
                                   } catch (error) {
                                     console.error(error);
                                     showNotification('Error al enviar el comprobante.', 'error');
                                   } finally {
                                     setUploadingOrder(null);
                                   }
                                 }
                               }} />
                             </label>
                           </>
                           ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "pagos" && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-serif mb-6 text-[var(--foreground)]">Mis Pagos</h2>
                <div className="space-y-6">
                  {orders.flatMap(o => (o.payments || []).map((p: any) => ({ ...p, order: o }))).length === 0 ? (
                    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm text-center">
                      <CreditCard className="w-10 h-10 mx-auto text-[var(--muted)] mb-3" />
                      <p className="text-[var(--muted)] text-sm mb-4">No tienes pagos registrados aún.</p>
                    </div>
                  ) : (
                    orders
                      .flatMap(o => (o.payments || []).map((p: any) => ({ ...p, order: o })))
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((payment: any) => (
                        <div key={payment.id} className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-[var(--foreground)]">{((Number(payment.amountInCents) || 0) / 100).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${payment.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : payment.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                                {payment.status === 'APPROVED' ? 'Aprobado' : payment.status === 'PENDING' ? 'En Revisión' : 'Rechazado'}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--muted)]">Ref: {payment.reference} • {payment.paymentMethod || 'Wompi'}</p>
                            <p className="text-xs text-[var(--muted)] mt-1">{new Date(payment.createdAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                          </div>
                          
                          <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border-color)] text-sm min-w-[200px]">
                            <p className="text-xs font-bold text-[var(--muted)] uppercase mb-1">Relacionado a:</p>
                            <p className="font-medium text-[var(--foreground)]">Pedido #{payment.order.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-xs text-primary mt-0.5">
                              Estado actual: {getOrderStatusLabel(payment.order.status)}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "pqrs" && (
              <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif text-[var(--foreground)]">Mis Casos y Reclamos</h2>
                  <button onClick={() => window.location.href = '/contact'} className="px-4 py-2 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] rounded-xl text-sm font-medium hover:bg-[var(--background)] transition-colors">
                    Crear Nuevo Caso
                  </button>
                </div>
                
                <div className="space-y-6">
                  {pqrsCases.length === 0 ? (
                    <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm text-center">
                      <Mailbox className="w-10 h-10 mx-auto text-[var(--muted)] mb-3" />
                      <p className="text-[var(--muted)] text-sm mb-4">No tienes casos reportados.</p>
                    </div>
                  ) : (
                    pqrsCases.map(pqrs => (
                      <div key={pqrs.id} className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-[var(--foreground)]">Caso #{pqrs.caseNumber}</h3>
                              {getStatusBadge(pqrs.status)}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                              <span><strong>Tipo:</strong> {getTypeLabel(pqrs.type)}</span>
                              <span><strong>Fecha:</strong> {new Date(pqrs.createdAt).toLocaleDateString()}</span>
                              {pqrs.orderId && <span><strong>Pedido:</strong> #{pqrs.orderId.slice(0,8).toUpperCase()}</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          <div className="bg-[var(--background)] p-4 rounded-xl text-sm text-[var(--foreground)] leading-relaxed">
                            <span className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Tu Reporte:</span>
                            {pqrs.description}
                          </div>

                          {(pqrs.status === 'RESOLVED' || pqrs.status === 'CLOSED') && pqrs.replyText && (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl mt-4">
                              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Respuesta Oficial</span>
                              </div>
                              <p className="text-sm text-[var(--foreground)] leading-relaxed">{pqrs.replyText}</p>
                              
                              {pqrs.replyPdfUrl && (
                                <div className="mt-4 pt-4 border-t border-emerald-500/10">
                                  <a 
                                    href={pqrs.replyPdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                                  >
                                    <FileText className="w-4 h-4" /> Descargar PDF de Resolución
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "direcciones" && (
              <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif text-[var(--foreground)]">Mis Direcciones</h2>
                  <button onClick={() => setShowAddressForm(!showAddressForm)} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                    {showAddressForm ? 'Cancelar' : 'Agregar Dirección'}
                  </button>
                </div>

                {showAddressForm && (
                  <form className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm mb-6 space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    try {
                      const res = await api.post('/auth/addresses', {
                        name: formData.get('name'),
                        street: formData.get('street'),
                        city: formData.get('city'),
                        state: formData.get('state'),
                        zip: formData.get('zip'),
                        isDefault: formData.get('isDefault') === 'on'
                      });
                      setAddresses([res.data, ...addresses]);
                      setShowAddressForm(false);
                      showNotification('Dirección agregada correctamente', 'success');
                    } catch (error) {
                      console.error(error);
                      showNotification('Error al agregar dirección', 'error');
                    }
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-[var(--foreground)]">Nombre (Ej: Casa)</label>
                        <input name="name" required className="w-full mt-1 px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[var(--foreground)]">Dirección (Calle, Carrera)</label>
                        <input name="street" required className="w-full mt-1 px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[var(--foreground)]">Ciudad</label>
                        <input name="city" required className="w-full mt-1 px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[var(--foreground)]">Departamento / Estado</label>
                        <input name="state" required className="w-full mt-1 px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[var(--foreground)]">Código Postal (Opcional)</label>
                        <input name="zip" className="w-full mt-1 px-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm outline-none" />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input type="checkbox" name="isDefault" id="isDefault" className="rounded" />
                        <label htmlFor="isDefault" className="text-sm text-[var(--foreground)]">Establecer como principal</label>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium">Guardar Dirección</button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 && !showAddressForm ? (
                  <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm text-center">
                    <MapPin className="w-10 h-10 mx-auto text-[var(--muted)] mb-3" />
                    <p className="text-[var(--muted)] text-sm mb-4">Aún no tienes direcciones guardadas.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm relative">
                        {addr.isDefault && <span className="absolute top-4 right-4 bg-primary/10 text-primary text-xs px-2 py-1 rounded">Principal</span>}
                        <h3 className="font-medium text-[var(--foreground)] mb-1">{addr.name}</h3>
                        <p className="text-sm text-[var(--muted)]">{addr.street}</p>
                        <p className="text-sm text-[var(--muted)]">{addr.city}, {addr.state} {addr.zip}</p>
                        <button onClick={async () => {
                          if (confirm('¿Eliminar esta dirección?')) {
                            try {
                              await api.delete(`/auth/addresses/${addr.id}`);
                              setAddresses(addresses.filter(a => a.id !== addr.id));
                              showNotification('Dirección eliminada correctamente', 'success');
                            } catch (e) {
                              showNotification('Error al eliminar la dirección', 'error');
                            }
                          }
                        }} className="mt-4 text-xs text-red-500 hover:underline">Eliminar</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

        </div>
      </main>
    </>
  );
}
