"use client";

import { Search, DollarSign, Image as ImageIcon, CreditCard, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PaymentList({ payments, selectedPayment, setSelectedPayment }: any) {
  return (
    <div className="md:col-span-5 lg:col-span-4 bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--background)]/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="Buscar ID de Pedido o Cliente..." 
            className="w-full pl-9 pr-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {payments.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-[var(--muted)] flex flex-col items-center">
              <DollarSign className="w-12 h-12 mb-3 opacity-20" />
              <p>No hay pagos pendientes de revisión.</p>
            </motion.div>
          ) : (
            payments.map((payment: any) => (
              <motion.button
                key={payment.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedPayment(payment.id)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  selectedPayment === payment.id 
                    ? "bg-primary/5 border-primary/30 shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-[var(--background)]"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold font-serif text-[var(--foreground)]">{payment.orderId}</span>
                  <span className="text-xs text-[var(--muted)]">{payment.date}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-[var(--muted)] mb-2">
                  <span>{payment.clientName}</span>
                  <span className="font-semibold text-[var(--foreground)]">{payment.amount}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {payment.method === "Manual" ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded text-[10px] font-bold uppercase tracking-wider">
                      <ImageIcon className="w-3 h-3" /> Verificación Manual
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold uppercase tracking-wider">
                      <CreditCard className="w-3 h-3" /> Wompi
                    </span>
                  )}

                  {payment.status === "pending" && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-amber-500">
                      <Clock className="w-3 h-3" /> En espera (72h)
                    </span>
                  )}
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
