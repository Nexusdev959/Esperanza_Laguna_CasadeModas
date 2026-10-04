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
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Nombre:</span> {order.user?.name || 'Cliente Anónimo'}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Club:</span> {order.user?.club || 'Sin club'}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Fecha:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-[var(--foreground)]"><span className="font-semibold">Estado:</span> {order.status}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Resumen Financiero</h3>
                  <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-[var(--muted)]">Total de la Orden</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">${Number(order.totalAmount).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-[var(--muted)]">Abonado hasta ahora</p>
                      <p className="text-sm font-bold text-green-500">${Number(order.paidAmount).toFixed(2)}</p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-[var(--border-color)] flex justify-between">
                      <p className="text-sm font-semibold text-[var(--foreground)]">Saldo Pendiente</p>
                      <p className="text-sm font-bold text-primary">${(Number(order.totalAmount) - Number(order.paidAmount)).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {order.payments && order.payments.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Historial de Pagos</h3>
                    <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border-color)] space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {order.payments.map((p: any) => (
                        <div key={p.id} className="flex justify-between items-center text-sm border-b border-[var(--border-color)] pb-2 last:border-0 last:pb-0">
                          <div>
                            <span className="font-medium text-[var(--foreground)]">{((p.amountInCents || 0) / 100).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
                            <div className="text-[var(--muted)] text-xs mt-0.5">{new Date(p.createdAt).toLocaleString('es-CO')} - {p.paymentMethod || 'Wompi'}</div>
                            <div className="text-[var(--muted)] text-[10px] uppercase">{p.reference}</div>
                          </div>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : p.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Columna Derecha: Componente de Pagos */}
              <div>
                <PaymentActions 
                  orderId={order.id}
                  clientName={order.user?.name || 'Cliente Anónimo'}
                  clientEmail={order.user?.email || "cliente@ejemplo.com"}
                  clientPhone={order.user?.phone || "3000000000"}
                  totalAmount={Number(order.totalAmount)}
                  paidAmount={Number(order.paidAmount)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
