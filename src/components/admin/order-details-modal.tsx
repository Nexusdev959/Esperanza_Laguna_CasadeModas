"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, PackageOpen } from "lucide-react";
import { PaymentActions } from "../payments/payment-actions";

export function OrderDetailsModal({
  isOpen,
  onClose,
  order
}: {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}) {
  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-[var(--background)]/50 shrink-0">
            <div>
              <h2 className="text-xl font-serif text-[var(--foreground)] flex items-center gap-2">
                <PackageOpen className="w-5 h-5 text-primary" /> Detalle de Pedido {order.id}
              </h2>
              <p className="text-sm text-[var(--muted)]">Información financiera y logística de la orden.</p>
            </div>
            <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-2 rounded-full hover:bg-black/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 custom-scrollbar flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna Izquierda: Detalles del Pedido */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Datos del Cliente</h3>
                  <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Nombre:</span> {order.customer}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Club:</span> {order.club}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Fecha:</span> {order.date}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Estado:</span> {order.status}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Resumen Financiero</h3>
                  <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-[var(--muted)]">Total de la Orden</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-[var(--muted)]">Abonado hasta ahora</p>
                      <p className="text-sm font-bold text-green-500">$0.00</p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-[var(--border-color)] flex justify-between">
                      <p className="text-sm font-semibold text-[var(--foreground)]">Saldo Pendiente</p>
                      <p className="text-sm font-bold text-primary">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Componente de Pagos */}
              <div>
                <PaymentActions 
                  orderId={order.id}
                  clientName={order.customer}
                  clientEmail="cliente@ejemplo.com"
                  clientPhone="3000000000"
                  totalAmount={order.total}
                  paidAmount={0}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
