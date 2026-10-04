"use client";

import { useState, useEffect } from "react";
import { LogOut, Package, MapPin, Heart, User, Camera, ChevronLeft, ChevronRight, Mailbox, CheckCircle, FileText, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

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

  useEffect(() => {
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
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
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
                window.location.replace('/');
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
                            <p className="font-medium text-[var(--foreground)] mb-1">{(parseFloat(order.totalAmount || '0')).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 text-xs rounded-full border border-yellow-200 dark:border-yellow-900 font-medium">{order.status === 'PENDING' ? 'En Preparación' : order.status}</span>
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
                              Estado actual: {payment.order.status === 'PENDING' ? 'En Preparación' : payment.order.status === 'PENDING_ADVANCE' ? 'Pago Inicial Pendiente' : payment.order.status === 'IN_CONFECTION' ? 'En Confección' : payment.order.status === 'READY_TO_SHIP' ? 'Listo para Envío' : payment.order.status}
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
