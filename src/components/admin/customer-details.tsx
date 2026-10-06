"use client";

import { ClipboardList, Mail, Phone, MapPin, Calendar, Clock, Package } from "lucide-react";

export function CustomerDetails({ activeCustomer }: any) {
  if (!activeCustomer) {
    return (
      <div className="md:col-span-8 lg:col-span-9 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center text-[var(--muted)] p-8 text-center shadow-sm">
        <ClipboardList className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)]">Selecciona un cliente</p>
        <p className="text-sm">Revisa el historial de pedidos, su información de contacto y su relación con tu negocio.</p>
      </div>
    );
  }

  return (
    <div className="md:col-span-8 lg:col-span-9 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden relative">
      
      {/* Header Profile */}
      <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--background)]/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--border-color)] bg-primary/10 flex items-center justify-center text-3xl font-serif font-bold text-primary shrink-0 shadow-sm">
            {activeCustomer.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-sans font-semibold tracking-tight text-[var(--foreground)]">{activeCustomer.name}</h2>
            <p className="text-sm text-[var(--muted)]">Cliente desde: {activeCustomer.registeredAt} • ID: {activeCustomer.id}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <a href={`https://wa.me/${activeCustomer.phone.replace(/\s+/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors">
            <Phone className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--background)] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
              <Mail className="w-4 h-4" /> Correo Electrónico
            </div>
            <p className="text-[var(--foreground)] font-medium">{activeCustomer.email}</p>
          </div>
          <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--background)] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
              <MapPin className="w-4 h-4" /> Dirección de Envío Principal
            </div>
            <p className="text-[var(--foreground)] font-medium">{activeCustomer.address}</p>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> Historial de Pedidos ({activeCustomer.orderHistory.length})
          </h3>
          
          <div className="space-y-4">
            {activeCustomer.orderHistory.length === 0 ? (
              <div className="text-center p-6 text-[var(--muted)] text-sm border border-dashed border-[var(--border-color)] rounded-xl">
                Este cliente no tiene pedidos registrados.
              </div>
            ) : (
              activeCustomer.orderHistory.map((order: any, idx: number) => (
                <div key={idx} className="p-5 border border-[var(--border-color)] rounded-xl bg-[var(--background)]/50 hover:border-primary/30 transition-colors">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-[var(--border-color)] pb-3">
                    <div>
                      <h4 className="font-serif text-lg text-[var(--foreground)]">{order.id}</h4>
                      <div className="flex items-center gap-2 text-xs text-[var(--muted)] mt-1">
                        <Calendar className="w-3 h-3" /> {order.date} 
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-1">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Entregado' ? 'bg-green-500/10 text-green-600 dark:text-green-500' :
                        order.status === 'En Preparación' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500' :
                        'bg-blue-500/10 text-blue-600 dark:text-blue-500'
                      }`}>
                        {order.status}
                      </span>
                      <span className="font-bold text-[var(--foreground)]">{order.total}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-[var(--muted)]">Artículos:</p>
                    <ul className="list-disc list-inside text-sm text-[var(--foreground)] space-y-1 pl-1">
                      {order.items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
