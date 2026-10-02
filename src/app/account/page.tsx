"use client";

import { useState, useEffect } from "react";
import { LogOut, Package, MapPin, Heart, User, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { api } from "@/lib/api";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("historial");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, role: string, id: string} | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);

        // Fetch real orders
        try {
          const res = await api.get('/orders/me');
          setOrders(res.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
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

  const links = [
    { id: "historial", icon: Package, label: "Historial de Compras" },
    { id: "perfil", icon: User, label: "Perfil" },
    { id: "direcciones", icon: MapPin, label: "Mis Direcciones" }
  ];

  return (
    <>
      <main className="flex h-screen bg-[var(--background)] overflow-hidden pt-20">
        {/* Sidebar idéntico al del Admin (Sin bloque oscuro) */}
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

          <div className={`pt-10 pb-6 flex flex-col items-center border-b border-[var(--border-color)] transition-all ${isCollapsed ? 'px-2' : 'px-6'}`}>
            <div className={`relative rounded-full overflow-hidden border-2 border-secondary shadow-[0_0_15px_rgba(var(--secondary),0.3)] transition-all group ${isCollapsed ? 'w-10 h-10' : 'w-24 h-24 mb-4'}`}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col items-center text-center">
                <h3 className="text-[var(--foreground)] font-serif font-bold text-lg tracking-wide">{user?.name || 'Cargando...'}</h3>
                <span className="text-secondary text-xs tracking-widest uppercase font-medium mt-1">{user?.role === 'CUSTOMER' ? 'Cliente' : user?.role}</span>
              </div>
            )}
          </div>
          
          <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto overflow-x-hidden relative">
            {links.map((link) => {
              const isActive = activeTab === link.id;
              const Icon = link.icon;
              
              return (
                <button 
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`w-full flex items-center px-3 py-3 text-sm rounded-xl transition-colors relative group ${
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-[var(--muted)] hover:text-primary font-medium"
                  } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeClientTab"
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <Icon className="w-5 h-5 z-10 shrink-0" />
                  
                  {!isCollapsed && (
                    <span className="z-10 truncate">{link.label}</span>
                  )}
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--foreground)] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-md">
                      {link.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-[var(--border-color)]">
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
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12">
            
            {activeTab === "perfil" && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-serif mb-6 text-[var(--foreground)]">Personalización del Perfil</h2>
                <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--foreground)]">Nombre Completo</label>
                        <input type="text" defaultValue={user?.name || ''} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--foreground)]">Correo Electrónico</label>
                        <input type="email" defaultValue={user?.email || ''} disabled className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm opacity-60 cursor-not-allowed" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--foreground)]">Teléfono Móvil</label>
                        <input type="tel" defaultValue="+1 234 567 890" className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-[var(--foreground)]">Club Asociado</label>
                        <select className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                          <option>Club Conquistadores Orion</option>
                          <option>Aventureros Kids</option>
                          <option>Guías Mayores Alpha</option>
                          <option>Ninguno</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
                      <button type="button" className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
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
                        onClick={() => window.location.href = '/collections/all'}
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
                            <p className="font-medium text-[var(--foreground)] mb-1">{(order.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 text-xs rounded-full border border-yellow-200 dark:border-yellow-900 font-medium">{order.status === 'PENDING' ? 'En Preparación' : order.status}</span>
                          </div>
                        </div>
                        
                        {order.items?.map((item: any) => (
                          <div key={item.id} className="flex items-center space-x-4 pt-2">
                            <div className="w-16 h-20 bg-[var(--background)] rounded-lg overflow-hidden border border-[var(--border-color)]">
                               <img src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=200&q=80"} alt={item.product?.name || 'Producto'} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-[var(--foreground)]">{item.product?.name || 'Producto Desconocido'}</h4>
                              <p className="text-sm text-[var(--muted)]">Precio: {(item.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                              <p className="text-sm text-[var(--muted)]">Cant: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
                           <button onClick={() => window.location.href = `/track-order?ref=${order.id}`} className="text-sm border border-[var(--border-color)] px-4 py-2 rounded-xl text-[var(--foreground)] hover:bg-[var(--background)] transition-colors font-medium">
                             Rastrear Pedido
                           </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "direcciones" && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-serif mb-6 text-[var(--foreground)]">Mis Direcciones</h2>
                <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm text-center">
                  <MapPin className="w-10 h-10 mx-auto text-[var(--muted)] mb-3" />
                  <p className="text-[var(--muted)] text-sm mb-4">Aún no tienes direcciones guardadas.</p>
                  <button className="px-6 py-2 border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background)]">
                    Agregar Dirección
                  </button>
                </div>
              </div>
            )}

        </div>
      </main>
    </>
  );
}
