"use client";

import { CheckCircle, XCircle, MessageCircle, Phone, Package } from "lucide-react";

export function OrderDetails({ activeOrder, handleAccept }: any) {
  if (!activeOrder) {
    return (
      <div className="md:col-span-7 lg:col-span-8 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center text-[var(--muted)] p-8 text-center shadow-sm">
        <Package className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-serif text-[var(--foreground)]">Selecciona un pedido</p>
        <p className="text-sm">Revisa los detalles y acéptalo para enviarlo a preparación.</p>
      </div>
    );
  }

  return (
    <div className="md:col-span-7 lg:col-span-8 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col shadow-sm overflow-hidden relative">
      {/* Header Details */}
      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start">
        <div>
          <h2 className="text-xl font-serif text-[var(--foreground)]">Pedido {activeOrder.id}</h2>
          <p className="text-sm text-[var(--muted)]">{activeOrder.date}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--muted)] mb-1">Total del Pedido</p>
          <p className="text-2xl font-serif text-[var(--foreground)]">{activeOrder.total}</p>
        </div>
      </div>

      {/* Client Contact & Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Contact Card */}
        <div className="bg-[var(--background)] p-5 rounded-xl border border-[var(--border-color)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4">Información del Cliente</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-[var(--foreground)] font-medium mb-1">{activeOrder.clientName}</p>
              <p className="text-sm text-[var(--muted)]">{activeOrder.clientEmail}</p>
            </div>
            <div className="flex items-center gap-3 lg:justify-end">
              <a href={`https://wa.me/${activeOrder.clientPhone.replace(/\s+/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a href={`tel:${activeOrder.clientPhone}`} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                <Phone className="w-4 h-4" />
                Llamar
              </a>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4">Artículos (Solicitados)</h3>
          <div className="space-y-3">
            {activeOrder.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-3 border border-[var(--border-color)] rounded-lg bg-[var(--background)]/50">
                <div className="flex flex-col">
                  <span className="font-medium text-[var(--foreground)]">{item.name}</span>
                  {item.size && <span className="text-xs text-[var(--muted)]">Talla: {item.size}</span>}
                </div>
                <span className="text-sm font-bold bg-[var(--surface)] border border-[var(--border-color)] px-3 py-1 rounded-md">x{item.qty}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-[var(--border-color)] bg-[var(--background)] flex gap-4">
        <button 
          onClick={() => handleAccept(activeOrder.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-transform active:scale-[0.98]"
        >
          <CheckCircle className="w-5 h-5" />
          Aceptar y Enviar a Preparación
        </button>
        <button 
          onClick={() => handleAccept(activeOrder.id)}
          className="px-6 py-3 border border-red-200 text-red-600 dark:border-red-900/50 dark:text-red-400 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
